(async () => {
    const fs = require('fs')
    const file = process.argv[2]
    console.log('hello file:', file)

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    const removeFromKey = (json, toRemove) => JSON.parse(JSON.stringify(json).replaceAll(toRemove, ''))
    const valueToNum = (jsonArr) => jsonArr.map(obj => {
        var newObj = {}
        var entries = Object.entries(obj)

        for (var i = 0; i < entries.length; i++) {
            newObj[entries[i][0]] = (!entries[i][0].includes('Label') && typeof entries[i][1] === 'string') ?
                Number(entries[i][1].replaceAll(',', '')) : 
                entries[i][1]
        }

        return newObj
    })
    const isKeyNum = (entry) => {
        return isNaN(Number(entry[0])) ? false : true
    }

    const data = require(file)
    const mapped = data.map(
        (d) => {
            var entries = Object.entries(d)

            var filtered = entries.filter(d => d[0] === 'Label (Grouping)' || d[0].includes('!!Households!!'))
            // commas
            filtered = filtered.map((e, i) => {
                if (i === 0) return e
                // console.log(e)
                if (typeof e[1] === 'string' && e[1].includes(',')) e[1] = Number(e[1].replaceAll(',', ''))
                return e
            })
            // console.log(filtered)
            // percents
            filtered = filtered.map((e, i) => {
                if (i === 0) return e
                if (typeof e[1] === 'string' && e[1].includes('%')) e[1] = Number(e[1].replaceAll('%', '') / 100)
                return e
            })
            return Object.fromEntries(filtered)
        }
    ).slice(0, 11)

    // console.log(mapped)

    var sorted = removeFromKey(mapped, ', Kings County, New York!!Households!!Estimate')
    sorted = removeFromKey(sorted, ', Queens County, New York!!Households!!Estimate')
    sorted = removeFromKey(sorted, ', New York County, New York!!Households!!Estimate')
    sorted = removeFromKey(sorted, 'Census Tract ')
    // sorted = valueToNum(sorted)

    console.log(sorted)

    // // summing the data
    var totals = sorted[0]
    var total = Object.values(totals).reduce((acc, next) => isNaN(Number(next)) ? acc : acc + next, 0)
    
    console.log(total, totals)

    var reshapes = {}

    var totalsTest = {}

    // /**
    //  * SHAPE
    //  * 1 - Less than $10,000
    //  * 2 - $10,000 to $14,999
    //  * 3 - $15,000 to $24,999
    //  * 4 - $25,000 to $34,999
    //  * 5 - $35,000 to $49,999
    //  * 6 - $50,000 to $74,999
    //  * 7 - $75,000 to $99,999
    //  * 8 - $100,000 to $149,999
    //  * 9 - $150,000 to $199,999
    //  * 10 - $200,000 or more
    //  */
    var indexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    var tracts = Object.entries(totals).filter(e => isKeyNum(e) === true).map(n => n[0])

    for (var i = 0; i < indexes.length; i++) {
        var obj = sorted[indexes[i]]

        for (var j = 0; j < tracts.length; j++) {
            // console.log(obj, tracts[j])
            if (!reshapes[tracts[j]]) {
                console.log('asdf',totals[tracts[j]], obj[tracts[j]])
                reshapes[tracts[j]] = {
                    [obj['Label (Grouping)']]: obj[tracts[j]] * totals[tracts[j]]
                }
            } else {
                reshapes[tracts[j]][obj['Label (Grouping)']] = obj[tracts[j]] * totals[tracts[j]]
            }
        }
    }

    console.log(reshapes)

    var sums = Object.values(reshapes).reduce((acc, next) => {
        var entries = Object.entries(next)

        console.log(entries)

        for (var i = 0; i < entries.length; i++) {
            console.log(entries[i][0], entries[i][1])
            if (!acc[entries[i][0]]) {
                acc[entries[i][0]] = entries[i][1]
            } else {
                acc[entries[i][0]] += entries[i][1]
            }
        }

        return acc
    }, {})

    console.log(sums)

    // var sums = Object.values(reshapes).reduce((acc, next) => {
    //     var entries = Object.entries(next)
    //     for (var i = 0; i < entries.length; i++) {
    //         if (!acc[entries[i][0]]) {
    //             acc[entries[i][0]] = entries[i][1]
    //         } else {
    //             acc[entries[i][0]] += entries[i][1]
    //         }
    //     }

    //     return acc
    // }, {})

    var proportions = Object.entries(sums).reduce((acc, next) => ({ ...acc, [next[0]]: next[1] / total }) , {})

    console.log(sums, proportions)

    // console.log(
    //     sorted,
    // )


    // var filtered = data.map(el => ({...el, cleanImage: el.image ? cleanWords(el.image) : null, cleanTitle: el.title ? cleanWords(el.title) : null }))

    // try {
    //     // fs.writeFileSync('../final/modified/posters_clean.json', JSON.stringify(filtered))
    //     //file written successfully
    // } catch (err) {
    //     console.error(err)
    // }
    // console.log(JSON.stringify(filtered.map(el => ({ title: el.title, Image: el.Image }))))
})()