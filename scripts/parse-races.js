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
    console.log(data)
    var sorted = removeFromKey(data, ', Kings County, New York')
    sorted = removeFromKey(sorted, ', Queens County, New York')
    sorted = removeFromKey(sorted, ', New York County, New York')
    sorted = removeFromKey(sorted, 'Census Tract ')
    sorted = valueToNum(sorted)

    // summing the data
    var totals = sorted[0]
    var total = Object.values(totals).reduce((acc, next) => isNaN(Number(next)) ? acc : acc + next, 0)

    var reshapes = {}

    var totalsTest = {}

    /**
     * SHAPE
     * 1 - hispanic
     * 4 - white alone
     * 5 - black alone
     * 6 - native alone
     * 7 - asian alone
     * 8 - hawaiian native alone
     * 9 - other race alone
     * 10 - 2 or more races
     */
    var indexes = [1, 4, 5, 6, 7, 8, 9, 10]
    var tracts = Object.entries(totals).filter(e => isKeyNum(e) === true).map(n => n[0])

    for (var i = 0; i < indexes.length; i++) {
        var obj = sorted[indexes[i]]

        for (var j = 0; j < tracts.length; j++) {
            console.log(obj, tracts[j])
            if (!reshapes[tracts[j]]) {
                reshapes[tracts[j]] = {
                    [obj['Label (Grouping)']]: obj[tracts[j]]
                }
            } else {
                reshapes[tracts[j]][obj['Label (Grouping)']] = obj[tracts[j]]
            }
        }
    }

    console.log(reshapes)

    var sums = Object.values(reshapes).reduce((acc, next) => {
        var entries = Object.entries(next)
        for (var i = 0; i < entries.length; i++) {
            if (!acc[entries[i][0]]) {
                acc[entries[i][0]] = entries[i][1]
            } else {
                acc[entries[i][0]] += entries[i][1]
            }
        }

        return acc
    }, {})

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