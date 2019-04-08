import axios from 'axios';
import cheerio from 'cheerio';
import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';

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
    
    const rymLink = 'https://rateyourmusic.com/collection/JoeCooper/recent/';
    // const rymLink = 'http://127.0.0.1:5501/sample.html';
    
    const grabTheHtml = async () => {
        const { data: html } = await axios.get(rymLink);
        const $ = cheerio.load(html);
        
        const totalPages = $(".navspan .navlinknum").last().text();
        const newEntryArr = [];

        for (i = 0; i <= 5; i++) {
            
        }
        
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
        db.defaults({ entries: [] }).write();
        newEntryArr.forEach((inp) => { 
            db.get('entries')
            .push(inp)
            .write()
    });
    console.log(`Added ${newEntryArr.length} entries.`);
    console.log(`Total DB entries: ${db.get('entries').size().value()}`);
    console.log(`TOTAL PAGES: ${totalPages}`)
}

// console.log(data);
// console.log(idArr);
// console.log(ratingsArr);
grabTheHtml();
