import { useState, useEffect, useRef } from 'react'
import cloneDeep from "lodash/cloneDeep"
import * as d3 from 'd3'

import useWindowSize from './hooks/useWindowSize';

import TrainChart from './components/TrainChart';
import MapChart from './components/MapChart';
import Map from './components/Map';

import {
  createGridTrain,
  scanTrain,
  handleEgress,
  handleMoveSeats,
  handleBoard
} from './logic/trainHandlers';
import * as C from './logic/constants'
import { stops } from './logic/data'

import transit from './assets/images/transit.png'

import './App.css';

function App() {

  // sizing
  const windowSize = useWindowSize()
  const mapRef = useRef(null)
  const trainRef = useRef(null)
  // train state
  const [gridTrain, setGridTrain] = useState(createGridTrain(C.height, C.width, C.seatIdxs, C.doorIdxs))
  const [peopleBoarded, setPeopleBoarded] = useState([])
  const [peopleTotal, setPeopleTotal] = useState([])
  // orchestration
  const [isMoving, setIsMoving] = useState(false)
  // specific charts
  const [genderStack, setGenderStack] = useState([])
  const [raceStack, setRaceStack] = useState([])
  const [currentStop, setCurrentStop] = useState(0)
  const [action, setAction] = useState('')

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
            acc[next.race] += 1
            return acc
          }, cloneDeep(C.emptyRaces))
        }))

        break
      default:
        return
    }
  }, [action])

  const updateState = (boardedCopy, totalCopy, newGridTrain) => {
    setPeopleBoarded(boardedCopy)
    setPeopleTotal(totalCopy)
    setGridTrain(newGridTrain)
  }

  const introduceTrain = () => {
    const map = d3.select('#map')
    const train = d3.select('#train')

    map.transition().duration(1500)
      .style('height', '50vh')

    train.transition().duration(1500)
      .style('height', '50vh')
  }

  const moveFirstStep = () => {
    setIsMoving(true)
    setAction(C.board)

    setTimeout(() => {
      setCurrentStop(currentStop + 1)
      setIsMoving(false)
    }, 2000)
  }

  const moveMiddleSteps = () => {
    setIsMoving(true)
    setAction(C.egress)
    setTimeout(() => setAction(C.moveSeats), 2500)
    setTimeout(() => setAction(C.board), 4500)
    setTimeout(() => {
      setCurrentStop(currentStop + 1)
      setIsMoving(false)
    }, 6500)
  }

  const stepHandlers = [
    introduceTrain,
    moveFirstStep,
    moveMiddleSteps
  ]

  return (
    <div id="app">
      <div
        id="map"
        style={{ height: '100vh' }}
      // className={'flex-column'}
      >
        <div style={{ fontFamily: "'Helvetica'", height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 100 }}>
            Transit Meditations
          </h1>
          <h2 style={{ fontSize: 60 }}>
            Or How I Learned To Stop Scrolling And Love The Bomb
          </h2>
        </div>
        <div style={{ fontFamily: "'Helvetica'", height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img style={{ height: '100%' }} src={transit} />
        </div>
        <div style={{ fontFamily: "'Helvetica'", height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {windowSize.height && <Map
            height={'100%'}
            width={windowSize.width}
          />}
        </div>
        {windowSize.height && <MapChart
          innerRef={mapRef}
          height={'100%'}
          width={windowSize.width}
          currentStop={currentStop}
          action={action}
          people={peopleBoarded}
          genderStack={genderStack}
          raceStack={raceStack}
          stepHandlers={stepHandlers}
          isMoving={isMoving}
        />}
        {/* <div style={{ display: 'flex' }}>
          {'current action: ' + action + ', stop #' + currentStop + ' - ' + stops[currentStop][0]}
          <button onClick={() => setAction('egress')}>set action egress</button>
          <button onClick={() => setAction('moveSeats')}>set action moveSeats</button>
          <button onClick={() => setAction('board')}>set action board</button>
          <button onClick={() => setCurrentStop(currentStop + 1)}>set stop +1</button>
          <button onClick={introduceTrain}>introduceTrain</button>
        </div> */}
      </div>
      <div id="train" style={{ height: '0vh' }}>
        {windowSize.height && <TrainChart
          innerRef={trainRef}
          height={'100%'}
          width={windowSize.width}
          people={peopleBoarded}
        />}
      </div>
    </div>
  );
}

export default App;
