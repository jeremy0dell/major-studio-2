import { useState, useEffect } from 'react'
import cloneDeep from "lodash/cloneDeep"

import useWindowSize from './hooks/useWindowSize';

import TrainChart from './components/TrainChart';
import MapChart from './components/MapChart';

import {
  createGridTrain,
  scanTrain,
  peopleToAdd,
  peopleToRemove
} from './logic/trainHandlers';
import { findIndexOfPerson } from './logic/helpers';
import * as C from './logic/constants'
import { stops } from './logic/data'

import './App.css';

function App() {
  const windowSize = useWindowSize()
  const [gridTrain, setGridTrain] = useState(createGridTrain(C.height, C.width, C.seatIdxs, C.doorIdxs))
  const [peopleBoarded, setPeopleBoarded] = useState([])
  const [peopleTotal, setPeopleTotal] = useState([])
  const [currentStop, setCurrentStop] = useState(0)
  const [action, setAction] = useState('')

  useEffect(() => {
    const {
      newGridTrain,
      occupiedSeats,
      occupiedSpaces,
      occupiedAreas,
      availableSeats,
      availableSpaces
    } = scanTrain(gridTrain, C.height, C.width)

    let boardedCopy = cloneDeep(peopleBoarded)
    let totalCopy = cloneDeep(peopleTotal)

      // availableSpaces[2].occupant = {a:'b'}
      // console.log(newGridTrain, availableSpaces)
    
    switch (action) {
      case 'egress':
        // find how many people to be removed
        const toRemove = peopleToRemove(stops[currentStop], newGridTrain)
        console.log('removing this many:', toRemove, 'from', occupiedAreas)

        for (var i = 0; i < toRemove; i++) {
          var randIdx = Math.floor(occupiedAreas.length * Math.random())
          occupiedAreas[randIdx].occupant['exit'] = currentStop

          var boardedIdx = findIndexOfPerson(boardedCopy, occupiedAreas[randIdx].occupant)
          var totalIdx = findIndexOfPerson(totalCopy, occupiedAreas[randIdx].occupant)

          boardedCopy.splice(boardedIdx, 1)
          totalCopy[totalIdx].occupant = occupiedAreas[randIdx].occupant

          occupiedAreas[randIdx].occupant = null
          occupiedAreas.splice(randIdx, 1)
        }

        setPeopleBoarded(boardedCopy)
        setPeopleTotal(totalCopy)
        setGridTrain(newGridTrain)

        break
      case 'moveSeats':
        // go thru available Seats and if there is an occupied space, swap em
        console.log('available is', availableSeats)
        console.log('occupied is', occupiedSpaces)

        while (availableSeats.length && occupiedSpaces.length) {
          if (!occupiedSpaces.length) break

          var randSpaceIdx = Math.floor(occupiedSpaces.length * Math.random())
          var randSeatIdx = Math.floor(availableSeats.length * Math.random())
          // co

          // this swaps the occupants space in gridTrain
          availableSeats[randSeatIdx].occupant = occupiedSpaces[randSpaceIdx].occupant

          //  arrays they are still in standing posn
          // update copy person, newly seated person, total person
          var boardedIdx = findIndexOfPerson(boardedCopy, occupiedSpaces[randSpaceIdx].occupant)
          var totalIdx = findIndexOfPerson(totalCopy, occupiedSpaces[randSpaceIdx].occupant)

          boardedCopy[boardedIdx].x = availableSeats[randSeatIdx].x
          boardedCopy[boardedIdx].y = availableSeats[randSeatIdx].y

          totalCopy[totalIdx].x = availableSeats[randSeatIdx].x
          totalCopy[totalIdx].y = availableSeats[randSeatIdx].y

          availableSeats[randSeatIdx].occupant.x = availableSeats[randSeatIdx].x
          availableSeats[randSeatIdx].occupant.y = availableSeats[randSeatIdx].y

          // set gridTrain space to null
          occupiedSpaces[randSpaceIdx].occupant = null
          // remove that occupied spaces and available seats
          occupiedSpaces.splice(randSpaceIdx, 1)
          availableSeats.splice(randSeatIdx, 1)
        }

        setPeopleBoarded(boardedCopy)
        setPeopleTotal(totalCopy)
        setGridTrain(newGridTrain)
        
        break
      case 'board':
        // find how many people are to be added
        const toAdd = peopleToAdd(stops[currentStop], newGridTrain)
        // console.log('adding', toAdd)
        // For each to be added, create a person, add them to peopleTotal, add them to seats if available, then to spaces if available
        for (var i = 0; i < toAdd; i++) {
          // create a person (other things to be added later)
          var newPerson = { enter: currentStop, exit: null }
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

          boardedCopy.push(newPerson)
          totalCopy.push(newPerson)
        }

        setPeopleBoarded(boardedCopy)
        setPeopleTotal(totalCopy)
        setGridTrain(newGridTrain)

        break
      default:
        return
    }
  }, [action])

  return (
    <div id="app">
      <div id="map" className={'flex-column'}>
        <MapChart currentStop={currentStop} />
        {'current action: ' + action + ', stop #' + currentStop + ' ' + stops[currentStop]}
        <button onClick={() => setAction('egress')}>set action egress</button>
        <button onClick={() => setAction('moveSeats')}>set action moveSeats</button>
        <button onClick={() => setAction('board')}>set action board</button>
        <button onClick={() => setCurrentStop(currentStop + 1)}>set stop +1</button>
      </div>
      <div id="train">
        {windowSize.height && <TrainChart
          height={windowSize.height / 2}
          width={windowSize.width}
          people={peopleBoarded}
        />}
      </div>
    </div>
  );
}

export default App;
