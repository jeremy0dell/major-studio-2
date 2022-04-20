import React from 'react'
import { stops } from '../logic/data'

const stripMapColor = (curr, i) => {
  if (curr === i) {
    return "#ffa812"
  } else if (curr > i) {
    return "#a75c00"
  } else {
    return "black"
  }
}

const MapChart = ({currentStop}) => {
  const dimensions = {
    height: 100,
    width: 1800
  }

  const stopCircs = stops.map((stop, i) => 
    <React.Fragment key={stop[0]}>
      <circle
        r={20}
        cx={(dimensions.width / stops.length) * (i + 1) - 30}
        cy={dimensions.height / 2}
        fill={stripMapColor(currentStop, i)}
      />
      <text
        // x={(dimensions.width / stops.length) * (i + 1) - 30}
        // y={dimensions.height + (i * 20)}
        fill="white"
        fontSize="28px"
        transform={`translate(${((dimensions.width / stops.length) * (i + 1) - 30)},${dimensions.height}) rotate(45)`}
        // transform={`rotate(45)`}
      >
        {stop[0]}
      </text>
    </React.Fragment>
  

  )

  return (
    <svg viewBox={`0 0 ${dimensions.width * 2} ${dimensions.height * 4}`}>
      <rect
        width={dimensions.width}
        height={dimensions.height}
        rx={50}
        ry={50}
        fill="grey"
      />
      { stopCircs }
    </svg>
  )
}

export default MapChart