
(async () => {
    const fs = require('fs')

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    const data = require('../data/l-train.json')

    const sorted = data
        // .filter(d => d.date == '2021-09-14' && d.daytime_routes.includes('L'))
        // .sort((a, b) => { return Number(a.gtfs_longitude) - Number(b.gtfs_longitude) })
    // .sort((a, b) => { return (a.exits / a.entries) - (b.exits / b.entries) })
    console.log(
        sorted.reduce((a, n) =>  a + n.entries, 0),
        sorted.reduce((a, n) =>  a + n.exits, 0),
        
        // sorted.reduce((acc, next) => {
        //     return acc + Number(next.entries)
        // }, 0),
        // sorted.reduce((acc, next) => {
        //     return acc + Number(next.exits)
        // }, 0),
        // .map(d => d.stop_name)
            // .filter(d => d['date'] == ('2021-03-01'))
            // .filter(d => d['daytime_routes'].includes('A'))
    )


    // var filtered = data.map(el => ({...el, cleanImage: el.image ? cleanWords(el.image) : null, cleanTitle: el.title ? cleanWords(el.title) : null }))

    // try {
    //     // fs.writeFileSync('../final/modified/posters_clean.json', JSON.stringify(filtered))
    //     //file written successfully
    // } catch (err) {
    //     console.error(err)
    // }
    // console.log(JSON.stringify(filtered.map(el => ({ title: el.title, Image: el.Image }))))
})()