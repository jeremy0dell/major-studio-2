import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { omit } from 'lodash'
import { stops } from '../logic/data'
import * as C from '../logic/constants'

const stripMapColor = (curr, i) => {
  if (curr === i) {
    return "#ffa812"
  } else if (curr > i) {
    return "#a75c00"
  } else {
    return "#231f20"
  }
}

// shape example
// {stop: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400}
const genderStack = (people) => {

}

const raceKeys = [
  'Hispanic or Latino',
  'White alone',
  'Black or African American alone',
  'American Indian and Alaska Native alone',
  'Asian alone',
  'Native Hawaiian and Other Pacific Islander alone',
  'Some Other Race alone',
  'Population of two or more races:',
]

const MapChart = ({ height, width, currentStop, action, people, genderStack, raceStack }) => {
  const circlesRef = useRef(null)

  useEffect(() => {
    if (action === C.board) {
      console.log(Object.keys(raceStack[0]).slice(1))

      const stacked = d3.stack()
        .keys(raceKeys)

      const series = stacked(raceStack)
      console.log('ppl is now', series)

      // color palette = one color per subgroup
      var color = d3.scaleOrdinal()
        .domain([0, 1])
        .range(['#e41a1c','#377eb8','#4daf4a'])

      // console.log('hello', d3.max(series, layer => d3.max(layer, sequence => sequence[1])))
      var y = d3.scaleLinear()
        .domain([0, 180])
        .range([ dimensions.barHeight, 0 ]);

      if (circlesRef.current) {
        const selection = d3.select(circlesRef.current)
          .selectAll('g')
          .data(series)
          .join('g')
          .attr('fill', (d, i) => d3.schemeCategory10[i])
          .selectAll('rect').data(d => d)
          .join(
            enter => enter.append('rect')
              .attr('x', (d, i, a) => {
                console.log(d, i, a)
                return (dimensions.width / stops.length) * (i + 1) - 40 + dimensions.paddingSides * 1.5
              })
              
              .attr('width', 30)
              //transition stuff
              .attr('height', 0)
              .attr('y', (d, i) => {
                // console.log(d, i)
                return 0
              })
              .transition()
              .duration(1000)
              .delay(2000)
              .attr('height', d => y(d[0]) - y(d[1]))
              .attr('y', (d, i) => {
                // console.log(d, i)
                return y(d[1]) - dimensions.barHeight
              }),

              update => update,
              exit => exit

            
            // 'rect'
          )
          // .attr('fill', (d, i) => color(i))
          

        // console.log(selection)

      }
    }
  }, [people])
  const dimensions = {
    height: 40,
    width: width * 0.8,
    paddingSides: 15,
    barHeight: 40*6
  }

  console.log(dimensions)

  const margins = {
    top: dimensions.height * 6,
    left: width * 0.1
  }

  const stopCircs = stops.map((stop, i) =>
    <React.Fragment key={stop[0]}>
      <circle
        r={10}
        cx={(dimensions.width / stops.length) * (i + 1) - 30 + dimensions.paddingSides * 2}
        cy={dimensions.height / 2}
        fill={stripMapColor(currentStop, i)}
      />
      <text
        fill="white"
        fontSize="20px"
        fontFamily="Helvetica"
        transform={`translate(${((dimensions.width / stops.length) * (i + 1) - 30)+ dimensions.paddingSides*1.5},${dimensions.height + 15}) rotate(45)`}
      >
        {stop[0]}
      </text>
    </React.Fragment>


  )

  return (
    <svg height={height} width={width}>
      <g transform={`translate(${margins.left},${margins.top})`} ref={circlesRef}>
        <rect
          width={dimensions.width + dimensions.paddingSides * 4}
          height={dimensions.height}
          rx={20}
          ry={20}
          fill="#a8a9ac"
        />
        {stopCircs}
      </g>
    </svg>
  )
}

export default MapChart