import cheerio from 'cheerio';

export default function(arr, el, html) {
    const $ = cheerio.load(html);
    const noOfArtists = $(el).find('.artist').length;
    const artistStrings = [];
    const albums = [];

    arr.push({

    })
}