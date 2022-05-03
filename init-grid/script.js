(async () => {
    const incButton = document.getElementById('inc')
    const moveButton = document.getElementById('move')
    const coordsButton = document.getElementById('coords')
    const placeholder = document.getElementById('placeholder')
    const grid = document.getElementById('app')

    // ALGORITHM START
    const stops = [
        {
            name: 'canarsie',
            egress: 0.2,
            fullness: 0.2
        },
        {
            name: '105',
            egress: 0.2,
            fullness: 0.5
        },
        {
            name: 'new lots',
            egress: 0.2,
            fullness: 1.0
        },
        {
            name: 'livonia',
            egress: 0.5,
            fullness: 0.6
        },
        {
            name: 'test1',
            egress: 0.9,
            fullness: 0.2
        },
        {
            name: 'test2',
            egress: 0.2,
            fullness: 0.1
        },
    ]

    var stop = 0;
    
    const max = 30 * 6;
    
    // all people
    let people = []
    
    // current train
    let train = []


    // constants
    const height = 6
    const width = 30

    const squareSize = 46

    const seatIdxs = [0,1, 4,5,6,7,8,9, 12,13,14,15,16,17, 20,21,22,23,24,25, 28,29]
    const doorIdxs = [2,3, 10,11, 18,19, 26,27]

    // temp state
    var availableSeats = []
    var availableSpaces = []

    var occupiedSeats = []
    var occupiedSpaces = []
    // wait.. we don't care what kind of space a person is occupying if they are leaving
    // i guess area is now the agnostic term for any single grid area
    var occupiedAreas = []
    var occupantCoords = []

    var allPeople = []

    var stopIdx = 0
    var currentStop = stops[stopIdx]

    // helpers
    // returns train occupancy
    function getOccupancy(train) {
        var total = 0

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var space = train[i][j]

                if (space.occupant !== null) total++
            }
        }

        return total
    }
    // fills seat/space availability arrays
    function getAvailableSeats(seatsArr, spacesArr, train) {
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var space = train[i][j]

                if (space.occupant === null) {
                    if (space.isSeat) {
                        seatsArr.push(space)
                    } else {
                        spacesArr.push(space)
                    }
                }
            }
        }
    }
    // fills seat/space occupied arrays
    function getOccupiedAreas(areasArr, train) {
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var area = train[i][j]

                if (area.occupant !== null) {
                    // maybe later
                    // if (area.isSeat) {
                    //     seatsArr.push(area)
                    // } else {
                    //     spacesArr.push(area)
                    // }
                    areasArr.push(area)
                }
            }
        }
    }
    // fills seat/space occupied arrays
    function getOccupiedCoords(coordsArr, train) {
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var area = train[i][j]

                if (area.occupant !== null) {
                    // maybe later
                    // if (area.isSeat) {
                    //     seatsArr.push(area)
                    // } else {
                    //     spacesArr.push(area)
                    // }
                    coordsArr.push({area, y: i, x: j})
                }
            }
        }
    }    // fills train randomly
    function fillTrain(seatsArr, spacesArr, peopleArr, amountToAdd) {
        //temp array for testing
        for (var i = 0; i < amountToAdd; i++) {
            var newRider = { start: stopIdx, stop: 'test' }
    
            if (seatsArr.length) {
                var randIdx = Math.floor(seatsArr.length * Math.random())
                seatsArr[randIdx].occupant = newRider
                //for testing start
                peopleArr.push({...seatsArr[randIdx].occupant, x: seatsArr[randIdx].x, y: seatsArr[randIdx].y })
                //for testing end
                seatsArr.splice(randIdx, 1)
            } else {
                var randIdx = Math.floor(spacesArr.length * Math.random())
                spacesArr[randIdx].occupant = newRider
                //for testing start
                peopleArr.push({...spacesArr[randIdx].occupant, x: spacesArr[randIdx].x, y: spacesArr[randIdx].y })
                //for testing end
                spacesArr.splice(randIdx, 1)    
            }
        }

        console.log('adding these people', peopleArr)
    }
    // removes people from train - part of egress process
    function removeFromTrain(areasArr, peopleArr, amountToRemove) {
        // temp array for testing
        var temp = []
        for (var i = 0; i < amountToRemove; i++) {    
            var randIdx = Math.floor(areasArr.length * Math.random())
            //for testing start
            temp.push({...areasArr[randIdx].occupant, x: areasArr[randIdx].x, y: areasArr[randIdx].y })
            //for testing end
            areasArr[randIdx].occupant = null
            areasArr.splice(randIdx, 1)
        }

        console.log('removed these people', temp)

        console.log('before', peopleArr)
        temp.forEach((person) => peopleArr.splice(
            peopleArr.findIndex((p) => p.x == person.x && p.y == person.y),
            1
        ))
        console.log('after', peopleArr)
    }

    const desiredOccupancy = (stop) => stop.fullness * max
    const peopleToAdd = (stop, train) => Math.floor(desiredOccupancy(stop) - getOccupancy(train))
    const peopleToRemove = (stop, train) => Math.floor(stop.egress * getOccupancy(train))

    let gridTrain = new Array(height).fill('').map(d => [])
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var space = {  isSeat: false, isDoor: false, occupant: null, x: j, y: i }

            if ((i == 0 || i == height - 1) && seatIdxs.includes(j)) {
                space.isSeat = true
            } else if ((i == 0 || i == height - 1) && doorIdxs.includes(j)) {
                space.isDoor = true
            }

            gridTrain[i][j] = space
        }
    }

    function moveStop() {
        console.log('current stop', currentStop)
        console.log('current occupancy', getOccupancy(gridTrain))
        console.log('train:', gridTrain)
        console.log('starting egress')
        // reset temp state
        // handle egress
        occupiedAreas = []
        getOccupiedAreas(occupiedAreas, gridTrain)
        removeFromTrain(occupiedAreas, allPeople, peopleToRemove(currentStop, gridTrain))

        console.log('start exit animation with data', allPeople)
        var selection = svg.selectAll('circle')
            .data(allPeople, d => `${stop},${d.x},${d.y}`)
            .join(
                enter => enter
                .append('circle')
                    .attr('cx', d => (0))
                    .attr('cy', d => (0))
                    .attr('r', 10)
                    .attr('fill', 'orange')
                    .transition()
                    .duration(500)
                    .delay((d, i) => i * 50)
                    .attr('cx', d => (d.x * squareSize) + (squareSize / 2))
                    .attr('cy', d => (d.y * squareSize) + (squareSize / 2)),

                update => update
                    .transition()
                    .attr('cx', d => (d.x * squareSize) + (squareSize / 2))
                    .attr('cy', d => (d.y * squareSize) + (squareSize / 2))
                    .attr('fill', 'green'),

                exit => exit
                    .transition()
                    .duration(1000)
                    .attr('cx', 1500)
                    .attr('cy', 500)
                    .attr('fill', 'blue')
                    .transition()
                    .duration(1000)
                    .attr('opacity', 0)
                    .remove()
            )
        console.log('starting influx')
        // reset temp state
        // handle influx


        setTimeout(() => {
            availableSeats = []
            availableSpaces = []
            getAvailableSeats(availableSeats, availableSpaces, gridTrain)
            fillTrain(availableSeats, availableSpaces, allPeople, peopleToAdd(currentStop, gridTrain))
    
            console.log('start enter animation with data', allPeople)
            svg.selectAll('circle')
            .data(allPeople, d => `${stop},${d.x},${d.y}`)
            .join(
                enter => enter
                .append('circle')
                    .attr('cx', d => (0))
                    .attr('cy', d => (0))
                    .attr('r', 10)
                    .attr('fill', 'orange')
                    .transition()
                    .duration(500)
                    .delay((d, i) => i * 100)
                    .attr('cx', d => (d.x * squareSize) + (squareSize / 2))
                    .attr('cy', d => (d.y * squareSize) + (squareSize / 2)),

                update => update
                    .transition()
                    .attr('cx', d => (d.x * squareSize) + (squareSize / 2))
                    .attr('cy', d => (d.y * squareSize) + (squareSize / 2))
                    .attr('fill', 'green'),

                exit => exit
                    .transition()
                    .duration(1000)
                    .attr('cx', 1500)
                    .attr('cy', 500)
                    .attr('fill', 'blue')
                    .attr('opacity', 0)
                    .remove()
                    
            )

            stopIdx++
            currentStop = stops[stopIdx]
            console.log('next stop is', currentStop)
    
        }, 2000)

        console.log('allPeople', allPeople)

        // var selection = svg.selectAll('circle')
        //     .data(allPeople, d => `${stop},${d.x},${d.y}`)
        //     .join(
        //         enter => enter
        //         .append('circle')
        //             .attr('cx', d => (0))
        //             .attr('cy', d => (0))
        //             .attr('r', 10)
        //             .attr('fill', 'orange')
        //             .transition()
        //             .duration(500)
        //             .delay((d, i) => i * 100)
        //             .attr('cx', d => (d.x * squareSize) + (squareSize / 2))
        //             .attr('cy', d => (d.y * squareSize) + (squareSize / 2)),

        //         update => update
        //             .transition()
        //             .attr('cx', d => (d.x * squareSize) + (squareSize / 2))
        //             .attr('cy', d => (d.y * squareSize) + (squareSize / 2))
        //             .attr('fill', 'green'),

        //         exit => exit
        //             .transition()
        //             .attr('cx', 1500)
        //             .attr('cy', 500)
        //             .attr('fill', 'blue')
        //     )

        // console.log(selection)

    }


    var guy = [{x: 1, y: 1, rotate: 0}]

    const updateGuy = () => {
        guy[0].x = Math.floor(Math.random() * 30)
        guy[0].y = Math.floor(Math.random() * 6)
    }

    function handleCoords() {
        var selection = svg.append('g').selectAll('image')
            .data(guy)
            .join(
                enter => enter
                .append('image')
                    .attr('href', './icon.svg')
                    .attr('x', d => (d.x * squareSize))
                    .attr('y', d => (d.y * squareSize)),
                update => update
                    .transition()
                    .attr('x', d => (d.x * squareSize))
                    .attr('y', d => (d.y * squareSize))
            )
        console.log(selection)
        console.log(guy)

        for (var i = 1; i < 10; i++) {
            setTimeout(() => {
                updateGuy()
                d3.select('g').selectAll('image')
                    .data(guy)
                    .join(
                        enter => enter
                        .append('image')
                            .attr('x', d => (d.x * squareSize))
                            .attr('y', d => (d.y * squareSize)),
                        update => update
                            .transition()
                            .attr('x', d => (d.x * squareSize))
                            .attr('y', d => (d.y * squareSize))
                    )
            }, i * 1000);    
        }
    }

    moveButton.addEventListener('click', () => moveStop())
    coordsButton.addEventListener('click', () => handleCoords())




    /**
     * THIS STUFF IS FOR d3
     * 
     * 
     */

    console.log(d3)

    const container = d3.select('#chart')

    const svg = container.append('svg')
        .attr('height', 600)
        .attr('width', 2000)

    svg.append('image')
        .attr('href', './grid.svg')
        .attr('x', 0)
        .attr('y', 0)

    // const units = svg.selectAll('circle')
    //     .data(occupantCoords)
    //     .enter()
    //     .append('circle')
    //         .attr('cx', d => d.x - squareSize / 2)
    //         .attr('cy', d => d.y - squareSize / 2)
    //         .attr('r', squareSize / 3)
    //     .update()
    //     .append('circle')
    //         .attr('cx', d => d.x - squareSize / 2)
    //         .attr('cy', d => d.y - squareSize / 2)
    //         .attr('r', squareSize / 3)

    // console.log(units, occupantCoords)

    // setTimeout(() => console.log(units, occupantCoords), 4000)










    /**
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * older code
     * ignore
     * or just dont touch 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
    //  */
    // const getRand = (n) => Math.floor(n - 1 * Math.random())
    // // creates a person with a start and stop
    // const buildPerson = (start, stop) => ({ start, stop })
    
    // // loop thru stops, create people
    // // REPLACING LOOP WITH A FUNC
    // // for (var i = 0; i < stops.length; i++) {
    // function iterateStop (i) {
    //     var stop = stops[i]
    
    //     // figure out how many people to grab
    //     var toExit = Math.max(Math.floor(stop.egress * train.length))
    
    //     // in case of fullness/egress mismatch
    //     var fullnessCheck = train.length - (stop.fullness * max)
    
    //     if (fullnessCheck > toExit) toExit = fullnessCheck
    
    //     console.log(train.length, 'exiting:', toExit, 'should be', train.length - (stop.fullness * max) )
    //     // remove ppl randomly
    //     var idxs = []
    //     for (var j = 0; j < toExit; j++) {
    //         var randomIdx = Math.floor(Math.random() * train.length)
    //         idxs.push(randomIdx)
    //         // ref to selected person
    //         var randomPerson = train[randomIdx]
    //         // console.log(randomPerson)
    //         // assign their stop
    //         randomPerson.stop = i
    //         // push them to storage
    //         people.push(randomPerson)
    //         // remove from train
    //         train.splice(randomIdx, 1)
    //     }
    //     console.log(idxs)
    //     idxs=[]
    //     console.log(train.length)
    
    //     // add people to train
    //     while (train.length < (stop.fullness * max)) {
    //         var person = buildPerson(i, null)
    
    //         train.push(person)
    //     }
    
    //     while (train.length < (stop.fullness * max)) {
    //         var person = buildPerson(i, null)
    
    //         train.push(person)
    //     }
    
    //     console.log('before ride:', train.length)
    // }
    // function getRandomColor() {
    //     var letters = '0123456789ABCDEF';
    //     var color = '#';
    //     for (var i = 0; i < 6; i++) {
    //       color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return color;
    //   }

    // //         <div style="grid-column: 3; grid-row: 3; background-color: red;"></div>
    // incButton.addEventListener('click', () => {
    //     grid.innerHTML = '';
    //     placeholder.innerText = stops[stop].name
    //     iterateStop(stop)
    //     stop++
    //     // people = people.concat(train.map(p => ({...p, stop: 'stay'})))

    //     for (var i = 0; i < train.length; i++) {
    //         // console.log(Math.floor(30 * Math.random()))
    //         // console.log(getRand(30))
    //         // 
    //         grid.innerHTML += (`<div style="grid-column: ${Math.ceil(30 * Math.random())}; grid-row: ${Math.ceil(6 * Math.random())}; background-color: ${getRandomColor()};"></div>`)
    //     }

    //     console.log(train, people, people.length)

    // })

})()