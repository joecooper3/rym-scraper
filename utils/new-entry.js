import cheerio from 'cheerio';

export default function(arr, el, html) {
    const $ = cheerio.load(html);
    arr.push({
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
}