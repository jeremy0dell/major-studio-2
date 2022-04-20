import { height, width, maxOccupancy } from './constants'
import cloneDeep from "lodash/cloneDeep"
// helpers
function getOccupancy(train, height, width) {
    var total = 0

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var space = train[i][j]

            if (space.occupant !== null) total++
        }
    }

    return total
}
const desiredOccupancy = (stop, max) => stop[1] * max
export const peopleToAdd = (stop, train) => Math.floor(desiredOccupancy(stop, maxOccupancy) - getOccupancy(train, height, width))
export const peopleToRemove = (stop, train) => Math.floor(stop[2] * getOccupancy(train, height, width))

export const createGridTrain = (height, width, seatIdxs, doorIdxs) =>  {
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

    return gridTrain
}

export function getOccupation(train, height, width) {
    const occupiedSeats = []
    const occupiedSpaces = []
    const occupiedAreas = []

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var area = train[i][j]

            if (area.occupant !== null) {
                // maybe later
                if (area.isSeat) {
                    occupiedSeats.push(area)
                } else {
                    occupiedSpaces.push(area)
                }
                occupiedAreas.push(area)
            }
        }
    }

    return { occupiedSeats, occupiedSpaces, occupiedAreas }
}

function getAvailableSeats(train, height, width) {
    let availableSeats = []
    let availableSpaces = []

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var space = train[i][j]

            if (space.occupant === null) {
                if (space.isSeat) {
                    availableSeats.push(space)
                } else {
                    availableSpaces.push(space)
                }
            }
        }
    }

    return { availableSeats, availableSpaces }
}

export function scanTrain(train, height, width) {
    const newGridTrain = cloneDeep(train)
    const { availableSeats, availableSpaces } = getAvailableSeats(newGridTrain, height, width)
    const { occupiedSeats, occupiedSpaces, occupiedAreas } = getOccupation(newGridTrain, height, width)

    return {
        newGridTrain,
        availableSeats,
        availableSpaces,
        occupiedSeats,
        occupiedSpaces,
        occupiedAreas
    }
}


/*
    FUNCTIONS/HELPERS TO FILL THE TRAIN

*/

// takes curr train
// returns {availableSeats, spacesArr}

// fills train randomly
// takes curr train, peopleBoarded, amountToAdd
// export function fillTrain(seatsArr, spacesArr, peopleArr, amountToAdd) {
//     //temp array for testing
//     for (var i = 0; i < amountToAdd; i++) {
//         var newRider = { start: stopIdx, stop: 'test' }

//         if (seatsArr.length) {
//             var randIdx = Math.floor(seatsArr.length * Math.random())
//             seatsArr[randIdx].occupant = newRider
//             //for testing start
//             peopleArr.push({...seatsArr[randIdx].occupant, x: seatsArr[randIdx].x, y: seatsArr[randIdx].y })
//             //for testing end
//             seatsArr.splice(randIdx, 1)
//         } else {
//             var randIdx = Math.floor(spacesArr.length * Math.random())
//             spacesArr[randIdx].occupant = newRider
//             //for testing start
//             peopleArr.push({...spacesArr[randIdx].occupant, x: spacesArr[randIdx].x, y: spacesArr[randIdx].y })
//             //for testing end
//             spacesArr.splice(randIdx, 1)    
//         }
//     }

//     console.log('adding these people', peopleArr)
// }