import axios from 'axios';
import cheerio from 'cheerio';
import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';

import newArtist from './utils/new-artist';
import newEntry from './utils/new-entry';

const adapter = new FileSync('db.json');
const db = low(adapter);

const jsonFile = require('./db.json');
const fileFilled = Object.keys(jsonFile).length;
const data = fileFilled ? jsonFile.entries : null;

const ratingsArr = data ? data.reduce(
    (acc, val) => {
        acc.push({id: val.ratingId, rating: val.rating});
        return acc;
    },
    []
    ) : [];
    const idArr = ratingsArr.map(item => item.id);
    
    // const rymLink = 'https://rateyourmusic.com/collection/JoeCooper/recent/';
    const rymLink = 'http://127.0.0.1:5501/sample.html';
    
    const grabTheHtml = async () => {
        const { data: htmlFirst } = await axios.get(rymLink);
        const $first = cheerio.load(htmlFirst);
        
        const totalPages = $first(".navspan .navlinknum").last().text();
        const newEntryArr = [];
        
        const entryQuery = async (i, n) => {
            let html;
            if (i === 1) {
                const rawHtml = await axios.get(rymLink);
                html = rawHtml.data;
                console.log('hit the first one');
            } else {
                const rawHtml = await axios.get(`${rymLink}`);
                html = rawHtml.data;
                console.log(`hitting ${rymLink}${i}`);
            }
            const $ = cheerio.load(html);
            console.log('cheerio');
            $('.mbgen').find('tr:not(:first-child)').each((i, el) => {
                const currentId = parseInt($(el).find('.or_q_rating_date_s').find('span').text().split("[Rating")[1].split("]")[0]);
                const currentRating = $(el).find('.or_q_rating_date_s').find('img').attr('alt') ? 
                parseInt($(el).find('.or_q_rating_date_s').find('img').attr('src').split('img/images/')[1].split('m.png')[0]) : 
                '';
                if (idArr.includes(currentId)) {
                    const currentEntry = data.filter(item => item.ratingId === currentId)[0];
                    const { artist, album, ratingId } = currentEntry;
                    const rating = currentEntry.rating ? currentEntry.rating : 'no rating';
                    if (currentEntry.rating !== currentRating) {
                        console.log(`Changing ${artist} - ${album} from ${rating} to ${currentRating}`);
                        db.get('entries')
                        .find({ratingId: ratingId})
                        .assign({rating: currentRating})
                        .write();
                    }
                    
                } else {
                    newEntry(newEntryArr, el, html);
                }
            });
            if (i < n) {
                setTimeout(() => entryQuery(i+1, n), 7000);
            } else {
                db.defaults({ entries: [] }).write();
                newEntryArr.forEach((inp) => { 
                    db.get('entries')
                    .push(inp)
                    .write()
                });
                console.log(`Added ${newEntryArr.length} entries.`);
                console.log(`Total DB entries: ${db.get('entries').size().value()}`);
            }
        }
        entryQuery(1, 2);
        
}

// console.log(data);
// console.log(idArr);
// console.log(ratingsArr);
grabTheHtml();
