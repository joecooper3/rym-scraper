import cheerio from 'cheerio';

export default function(arr, el, html) {
    const $ = cheerio.load(html);
    const noOfArtists = $(el).find('.artist').length;
    const artist = [];
    const artistId = [];

    for (let i = 0; i < noOfArtists; i++) {
        artist.push($(el).find('.artist').slice(0).eq(i).text());
        artistId.push(parseInt($(el).find('.artist').attr('title').split("[Artist")[1].split("]")[0]));
    }

    const turnMonthToNum = (inp) => {
        return new Date(Date.parse(inp +" 1, 2019")).getMonth();
    }

    const dateAdded = new Date(
        parseInt($(el).find('.date_element_year').text()),
        turnMonthToNum($(el).find('.date_element_month').text()),
        parseInt($(el).find('.date_element_day').text())
    );
    
    arr.push({
        ratingId: parseInt($(el).find('.or_q_rating_date_s').find('span').text().split("[Rating")[1].split("]")[0]),
        rymId: parseInt($(el).find('.album').attr('title').split("[Album")[1].split("]")[0]),
        artist,
        artistId,
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
        dateAdded
    });
}