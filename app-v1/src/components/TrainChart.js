import { useEffect, useRef } from "react"
import * as d3 from 'd3'

import { enterFn, updateFn, exitFn } from "../logic/data"
import * as C from '../logic/constants'
import train from '../assets/images/grid.svg'

const TrainChart = ({ height, width, people }) => {
  const peopleRef = useRef(null)

  useEffect(() => {
    if (peopleRef.current) {
      const peopleSelection = d3.select(peopleRef.current)
        .selectAll('circle')
        .data(people, d => d.id)

      peopleSelection.join(
        enterFn,
        updateFn,
        exitFn
      )
    }
  }, [people])

  const margin = {
    top: 100,
    left: 400
  }

  const peopleCircs = people.map(person => <circle
    key={`${person.x},${person.y}`}
    cx={person.x * C.squareSize + margin.left + 15}
    cy={person.y * C.squareSize + margin.top + 15}
    fill="white"
    r={10}
  />)

  return (
    <svg height={height} width={width}>
      {/* <rect
        width={C.width * C.squareSize}
        height={C.height * C.squareSize}
        transform={`translate(${margin.left} ${margin.top})`}
        fill="lightgrey"
      /> */}

      <image
        href={train}
        // height={200}
        width={C.width * C.squareSize}
        height={C.height * C.squareSize}
        transform={`translate(${margin.left} ${margin.top})`}    
        ></image>
      <g
        id="circs"
        ref={peopleRef}
        transform={`translate(${margin.left} ${margin.top})`}
      />
    </svg>
  )
}

export default TrainChart