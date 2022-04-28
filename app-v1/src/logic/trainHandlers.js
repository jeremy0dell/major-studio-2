import { height, width, maxOccupancy } from './constants'
import { findIndexOfPerson, getClosestPoint, sampleFromProportions } from './helpers'
import cloneDeep from "lodash/cloneDeep"
import { v4 as uuidv4 } from 'uuid'

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

export const createGridTrain = (height, width, seatIdxs, doorIdxs) => {
  let gridTrain = new Array(height).fill('').map(d => [])
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var space = { isSeat: false, isDoor: false, occupant: null, x: j, y: i }

      if ((i === 0 || i === height - 1) && seatIdxs.includes(j)) {
        space.isSeat = true
      } else if ((i === 0 || i === height - 1) && doorIdxs.includes(j)) {
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
  const { occupiedSpaces, occupiedAreas } = getOccupation(newGridTrain, height, width)

  return {
    newGridTrain,
    availableSeats,
    availableSpaces,
    occupiedSpaces,
    occupiedAreas
  }
}


export const handleEgress = (train, boarded, total, occupiedAreas, stops, currentStop) => {
  const toRemove = peopleToRemove(stops[currentStop], train)
  console.log('removing this many:', toRemove, 'from', occupiedAreas)

  for (var i = 0; i < toRemove; i++) {
    var randIdx = Math.floor(occupiedAreas.length * Math.random())
    occupiedAreas[randIdx].occupant['exit'] = currentStop

    var boardedIdx = findIndexOfPerson(boarded, occupiedAreas[randIdx].occupant)
    var totalIdx = findIndexOfPerson(total, occupiedAreas[randIdx].occupant)

    boarded.splice(boardedIdx, 1)
    total[totalIdx].occupant = occupiedAreas[randIdx].occupant

    occupiedAreas[randIdx].occupant = null
    occupiedAreas.splice(randIdx, 1)
  }

  return { boarded, total, train }
}

export const handleMoveSeats = (train, total, boarded, availableSeats, occupiedSpaces) => {
  while (availableSeats.length && occupiedSpaces.length) {
    if (!occupiedSpaces.length) break

    var randSpaceIdx = Math.floor(occupiedSpaces.length * Math.random())
    // var randSeatIdx = Math.floor(availableSeats.length * Math.random())
    var closestSeat = getClosestPoint(occupiedSpaces[randSpaceIdx], availableSeats)
    var idxToRemove = findIndexOfPerson(availableSeats, { x: closestSeat.x, y: closestSeat.y })

    // this swaps the occupants space in gridTrain
    closestSeat.occupant = occupiedSpaces[randSpaceIdx].occupant

    //  arrays they are still in standing posn
    // update copy person, newly seated person, total person
    var boardedIdx = findIndexOfPerson(boarded, occupiedSpaces[randSpaceIdx].occupant)
    var totalIdx = findIndexOfPerson(total, occupiedSpaces[randSpaceIdx].occupant)

    boarded[boardedIdx].x = closestSeat.x
    boarded[boardedIdx].y = closestSeat.y

    total[totalIdx].x = closestSeat.x
    total[totalIdx].y = closestSeat.y

    closestSeat.occupant.x = closestSeat.x
    closestSeat.occupant.y = closestSeat.y

    // set gridTrain space to null
    occupiedSpaces[randSpaceIdx].occupant = null
    // remove that occupied spaces and available seats
    occupiedSpaces.splice(randSpaceIdx, 1)
    availableSeats.splice(idxToRemove, 1)
  }

  return { boarded, total, train }
}

export const handleBoard = (train, total, boarded, availableSeats, availableSpaces, stops, currentStop) => {
  const toAdd = peopleToAdd(stops[currentStop], train)

  // For each to be added, create a person, add them to peopleTotal, add them to seats if available, then to spaces if available
  for (var i = 0; i < toAdd; i++) {
    // create a person (other things to be added later)
    var newPerson = {
      id: uuidv4(),
      gender: Math.random() > 0.5001 ? 'female' : 'male',
      race: sampleFromProportions(stops[currentStop][3]),
      income: sampleFromProportions(stops[currentStop][4]),
      enter: currentStop,
      exit: null
    }
    // console.log('this person has race:', sampleFromProportions(stops[currentStop][3]))
    // if stuff
    if (availableSeats.length) {
      var randIdx = Math.floor(availableSeats.length * Math.random())
      availableSeats[randIdx].occupant = newPerson
      newPerson.x = availableSeats[randIdx].x
      newPerson.y = availableSeats[randIdx].y
      availableSeats.splice(randIdx, 1)
    } else {
      var randIdx = Math.floor(availableSpaces.length * Math.random())
      availableSpaces[randIdx].occupant = newPerson
      newPerson.x = availableSpaces[randIdx].x
      newPerson.y = availableSpaces[randIdx].y
      availableSpaces.splice(randIdx, 1)
    }

    boarded.push(newPerson)
    total.push(newPerson)
  }

  return { boarded, total, train }
}