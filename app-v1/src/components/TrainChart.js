import { useEffect, useRef } from "react"
import * as d3 from 'd3'

import { enterFn, updateFn, exitFn, transitionColors } from "../logic/data"
import * as C from '../logic/constants'
import train from '../assets/images/grid.svg'
import { bind_trailing_args } from "../logic/helpers"

const TrainChart = ({ height, width, people, currentMapChart }) => {
  const peopleRef = useRef(null)

  useEffect(() => {
    if (peopleRef.current) {
      const peopleSelection = d3.select(peopleRef.current)
        .selectAll('circle')
        .data(people, d => d.id)

      peopleSelection.join(
        bind_trailing_args(enterFn, currentMapChart),
        updateFn,
        exitFn
      )
    }
  }, [people])

  useEffect(() => {
    if (peopleRef.current) {
      const peopleSelection = d3.select(peopleRef.current)
        .selectAll('circle')
        .data(people, d => d.id)

        transitionColors(peopleSelection, currentMapChart)
    }
  }, [currentMapChart])

  const margin = {
    top: 100,
    left:( width / 2) - ((C.width * C.squareSize) / 2)
  }

  return (
    <svg height={height} width={width}>
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