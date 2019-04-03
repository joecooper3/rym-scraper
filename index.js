import axios from 'axios';
import cheerio from 'cheerio';
import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';

const jsonFile = require('./db.json');
const data = jsonFile.entries;

const idArr = data.reduce(
    (acc, val) => {
        console.log(acc.ratingId);
        return val;
    },
    []
);

const adapter = new FileSync('db.json')
const db = low(adapter)

// const rymLink = 'https://rateyourmusic.com/collection/JoeCooper/recent/4';
const rymLink = 'http://127.0.0.1:5501/sample.html';

const grabTheHtml = async () => { 
    const { data: html } = await axios.get(rymLink);
    const $ = cheerio.load(html);

    const masterArr = [];
    const totalPages = $(".navspan .navlinknum").last().text();

    $('.mbgen').find('tr:not(:first-child)').each((i, el) => {

        masterArr.push({
            ratingId: parseInt($(el).find('.or_q_rating_date_s').find('span').text().split("[Rating")[1].split("]")[0]),
            rymId: parseInt($(el).find('.album').attr('title').split("[Album")[1].split("]")[0]),
            artist: $(el).find('.artist').text(),
            album: $(el).find('.album').text(),
            year: parseInt($(el).find('.smallgray').text().slice(1,5)),
            genres: 
                $(el).find('.smallgray').text().slice(6) ?
                $(el).find('.smallgray').text().slice(6).split(", ") :
                [],
            rating: 
                $(el).find('.or_q_rating_date_s').find('img').attr('alt') ? 
                parseInt($(el).find('.or_q_rating_date_s').find('img').attr('src').split('img/images/')[1].split('m.png')[0]) : 
                '',
            dateAdded: {
                month: $(el).find('.date_element_month').text(),
                day: $(el).find('.date_element_day').text(),
                year: $(el).find('.date_element_year').text()
            }
        });
    });
    db.defaults({ entries: [] }).write();
    masterArr.forEach((inp) => { 
        db.get('entries')
        .push(inp)
        .write()
    });
    console.log(masterArr);
    console.log(`Total DB entries: ${db.get('entries').size().value()}`);
    console.log(`TOTAL PAGES: ${totalPages}`)
}

// console.log(data);
console.log(idArr);
// grabTheHtml();
