import * as C from './constants'
import { getRandEl } from './helpers'

// stops
// [0] is name, [1] is fullness, [2] is egress
export const stops = [
  ["CANARSIE-ROCKAW", 0.214797136, 0.5],
  // ["CANARSIE-ROCKAW",	0.814797136, 0.5], // for testing eats
  ["EAST 105 ST", 0.1873508353, 0.5],
  // ["EAST 105 ST",	0.8873508353, 0.5], // for testing egress and stuff
  ["NEW LOTS", 0.2410501193, 0.5],
  ["LIVONIA AV", 0.285202864, 0.5],
  ["SUTTER AV", 0.3233890215, 0.5],
  ["ATLANTIC AV", 0.3257756563, 0.5],
  ["BROADWAY JCT", 0.3579952267, 0.5],
  ["BUSHWICK AV", 0.3758949881, 0.5],
  ["WILSON AV", 0.4164677804, 0.5],
  ["HALSEY ST", 0.4427207637, 0.5],
  ["MYRTLE-WYCKOFF", 0.553699284, 0.5],
  ["DEKALB AV", 0.6420047733, 0.5],
  ["JEFFERSON ST", 0.6992840095, 0.5],
  ["MORGAN AV", 0.7267303103, 0.5],
  ["MONTROSE AV", 0.7840095465, 0.5],
  ["GRAND ST", 0.8257756563, 0.5],
  ["GRAHAM AV", 0.8245823389, 0.5],
  ["LORIMER ST", 0.8544152745, 0.5],
  ["BEDFORD AV", 0.968973747, 0.5],
  ["1 AV", 0.9701670644, 0.5],
  ["3 AV", 0.9677804296, 0.5],
  ["14 ST-UNION SQ", 1, 0.5],
  ["6 AV", 0.9128878282, 0.5],
  ["8 AV", 0.838902148, 0.5],
]

/**
 * enter, update, and exit functions for .join method in TrainChart
 * of shape:
 * data => data
 *   .modifyMethod(...) // append, animate, etc.
 */

// enter
export const enterFn = enter => enter
  .append('circle')
    .attr('cx', () => getRandEl(C.doorIdxs) * C.squareSize)
    .attr('cy', C.height * C.squareSize + C.squareSize)
    .attr('r', C.squareSize / 3)
    .attr('fill', 'green')
    .attr('opacity', 0)
  .transition()
  .duration(1000)
    .attr('opacity', 1)
  .transition()
  .duration(1000)
  .delay(() => Math.random() * 750)
    .attr('cy', (C.height * C.squareSize) / 2)
  .transition()
  .duration(1000)
  .delay(() => Math.random() * 750)
    .attr('cx', d => (d.x * C.squareSize) + C.squareSize / 2)
    .attr('cy', d => (d.y * C.squareSize) + C.squareSize / 2)

// exit
export const exitFn = exit => exit
    .attr('fill', 'red')
  .transition()
  .duration(1000)
  .delay(() => Math.random() * 750)
    .attr('cx', () => getRandEl(C.doorIdxs) * C.squareSize)
    .attr('cy', (C.height * C.squareSize) / 2)
  .transition()
  .duration(1000)
  .delay(() => Math.random() * 750)
    .attr('cy', C.height * C.squareSize + C.squareSize)
  .transition()
  .duration(1000)
    .attr('opacity', 0)
  .remove()

// update (the nightmare)
export const updateFn = update => update
    .attr('fill', 'black')
  .transition()
  .duration(1000)
  .delay(() => Math.random() * 750)
    .attr('cx', d => (d.x * C.squareSize) + C.squareSize / 2)
    .attr('cy', d => (d.y * C.squareSize) + C.squareSize / 2)

  
  


  