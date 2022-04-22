import { useState, useEffect } from 'react'
import cloneDeep from "lodash/cloneDeep"
import { v4 as uuidv4 } from 'uuid'

import useWindowSize from './hooks/useWindowSize';

import TrainChart from './components/TrainChart';
import MapChart from './components/MapChart';

import {
  createGridTrain,
  scanTrain,
  peopleToAdd,
  peopleToRemove
} from './logic/trainHandlers';
import {
  findIndexOfPerson,
  getClosestPoint,
  sampleFromProportions
} from './logic/helpers';
import * as C from './logic/constants'
import { stops } from './logic/data'

import './App.css';

function App() {
  const windowSize = useWindowSize()
  const [gridTrain, setGridTrain] = useState(createGridTrain(C.height, C.width, C.seatIdxs, C.doorIdxs))
  const [peopleBoarded, setPeopleBoarded] = useState([])
  const [peopleTotal, setPeopleTotal] = useState([])
  // specific charts
  const [genderStack, setGenderStack] = useState([])
  const [raceStack, setRaceStack] = useState([])
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
    
    switch (action) {
      case C.egress:
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
      case C.moveSeats:
        // go thru available Seats and if there is an occupied space, swap em
        console.log('available is', availableSeats)
        console.log('occupied is', occupiedSpaces)

        while (availableSeats.length && occupiedSpaces.length) {
          if (!occupiedSpaces.length) break

          var randSpaceIdx = Math.floor(occupiedSpaces.length * Math.random())
          // var randSeatIdx = Math.floor(availableSeats.length * Math.random())
          var closestSeat = getClosestPoint(occupiedSpaces[randSpaceIdx], availableSeats)
          var idxToRemove = findIndexOfPerson(availableSeats, { x: closestSeat.x, y: closestSeat.y })

          console.log(
            'closest seat to space',
            occupiedSpaces[randSpaceIdx],
            'is',
            closestSeat,
            'and the index to eventually remove is',
            idxToRemove,
            'and the distance moved is',
            Math.abs(occupiedSpaces[randSpaceIdx].x - closestSeat.x)
          )

          // this swaps the occupants space in gridTrain
          closestSeat.occupant = occupiedSpaces[randSpaceIdx].occupant

          //  arrays they are still in standing posn
          // update copy person, newly seated person, total person
          var boardedIdx = findIndexOfPerson(boardedCopy, occupiedSpaces[randSpaceIdx].occupant)
          var totalIdx = findIndexOfPerson(totalCopy, occupiedSpaces[randSpaceIdx].occupant)

          boardedCopy[boardedIdx].x = closestSeat.x
          boardedCopy[boardedIdx].y = closestSeat.y

          totalCopy[totalIdx].x = closestSeat.x
          totalCopy[totalIdx].y = closestSeat.y

          closestSeat.occupant.x = closestSeat.x
          closestSeat.occupant.y = closestSeat.y

          // set gridTrain space to null
          occupiedSpaces[randSpaceIdx].occupant = null
          // remove that occupied spaces and available seats
          occupiedSpaces.splice(randSpaceIdx, 1)
          availableSeats.splice(idxToRemove, 1)
        }

        setPeopleBoarded(boardedCopy)
        setPeopleTotal(totalCopy)
        setGridTrain(newGridTrain)
        
        break
      case C.board:
        // find how many people are to be added
        const toAdd = peopleToAdd(stops[currentStop], newGridTrain)

        // For each to be added, create a person, add them to peopleTotal, add them to seats if available, then to spaces if available
        for (var i = 0; i < toAdd; i++) {
          // create a person (other things to be added later)
          var newPerson = {
            id: uuidv4(),
            gender: Math.random() > 0.7 ? 'female' : 'male',
            race: sampleFromProportions(stops[currentStop][3]),
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

          boardedCopy.push(newPerson)
          totalCopy.push(newPerson)
        }

        setPeopleBoarded(boardedCopy)
        setPeopleTotal(totalCopy)
        setGridTrain(newGridTrain)

        // gender
        setGenderStack(genderStack.concat(
          {
            stop: currentStop,
            male: boardedCopy.reduce((a, n) => n.gender === 'male' ? a + 1 : a, 0),
            female: boardedCopy.reduce((a, n) => n.gender === 'female' ? a + 1 : a, 0)
          }
        ))

        // race
        setRaceStack(genderStack.concat({
          stop: currentStop,
          ...boardedCopy.reduce((acc, next) => {
            if (!acc[next.race]) {
              acc[next.race] = 1
            } else {
              acc[next.race] += 1
            }

            return acc
          }, {})
        }))

        break
      default:
        return
    }
  }, [action])

  return (
    <div id="app">
      <div id="map" className={'flex-column'}>
        {windowSize.height && <MapChart
          height={windowSize.height / 2}
          width={windowSize.width}
          currentStop={currentStop}
          action={action}
          people={peopleBoarded}
          genderStack={genderStack}
          raceStack={raceStack}
        />}
        <div style={{ display: 'flex' }}>
          {'current action: ' + action + ', stop #' + currentStop + ' - ' + stops[currentStop][0]}
          <button onClick={() => setAction('egress')}>set action egress</button>
          <button onClick={() => setAction('moveSeats')}>set action moveSeats</button>
          <button onClick={() => setAction('board')}>set action board</button>
          <button onClick={() => setCurrentStop(currentStop + 1)}>set stop +1</button>
        </div>
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
