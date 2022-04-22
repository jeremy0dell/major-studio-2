import { useState, useEffect } from 'react'
import cloneDeep from "lodash/cloneDeep"

import useWindowSize from './hooks/useWindowSize';

import TrainChart from './components/TrainChart';
import MapChart from './components/MapChart';

import {
  createGridTrain,
  scanTrain,
  handleEgress,
  handleMoveSeats,
  handleBoard
} from './logic/trainHandlers';
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

  const updateState = (boardedCopy, totalCopy, newGridTrain) => {
    setPeopleBoarded(boardedCopy)
    setPeopleTotal(totalCopy)
    setGridTrain(newGridTrain)
  }

  useEffect(() => {
    const {
      newGridTrain,
      occupiedSpaces,
      occupiedAreas,
      availableSeats,
      availableSpaces
    } = scanTrain(gridTrain, C.height, C.width)

    let boardedCopy = cloneDeep(peopleBoarded)
    let totalCopy = cloneDeep(peopleTotal)
    
    switch (action) {
      case C.egress:
        var { boarded, total, train } = handleEgress(
          newGridTrain,
          boardedCopy,
          totalCopy,
          occupiedAreas,
          stops,
          currentStop
        )

        updateState(boarded, total, train)
        break
      case C.moveSeats:
        var { boarded, total, train } = handleMoveSeats(
          newGridTrain,
          totalCopy,
          boardedCopy,
          availableSeats,
          occupiedSpaces
        )

        updateState(boarded, total, train)
        break
      case C.board:
        var { boarded, total, train } = handleBoard(
          newGridTrain,
          totalCopy,
          boardedCopy,
          availableSeats,
          availableSpaces,
          stops,
          currentStop
        )

        updateState(boarded, total, train)

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
