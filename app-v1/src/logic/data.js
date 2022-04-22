import * as C from './constants'
import { getRandEl, randomIntFromInterval, getClosestEl } from './helpers'

// racial data
const racial = [
  { // canarsie
    'Hispanic or Latino': 0.13639855151980687,
    'White alone': 0.04060133874684516,
    'Black or African American alone': 0.7396027652803687,
    'American Indian and Alaska Native alone': 0.0013168001755733568,
    'Asian alone': 0.01580160210688028,
    'Native Hawaiian and Other Pacific Islander alone': 0,
    'Some Other Race alone': 0.012948535059804674,
    'Population of two or more races:': 0.05333040711072095
  },
  { // east 105
    'Hispanic or Latino': 0.18849773440223075,
    'White alone': 0.02098292087835483,
    'Black or African American alone': 0.7201115371209481,
    'American Indian and Alaska Native alone': 0.0025792959219240155,
    'Asian alone': 0.008086441268734751,
    'Native Hawaiian and Other Pacific Islander alone': 0.0001394214011850819,
    'Some Other Race alone': 0.010596026490066225,
    'Population of two or more races:': 0.04900662251655629
  },
  { // new lots
    'Hispanic or Latino': 0.16718832763519045,
    'White alone': 0.013916309529542061,
    'Black or African American alone': 0.7378051716665864,
    'American Indian and Alaska Native alone': 0.0022150527278855876,
    'Asian alone': 0.009534357393942313,
    'Native Hawaiian and Other Pacific Islander alone': 0.0004333798815428324,
    'Some Other Race alone': 0.009004670872056628,
    'Population of two or more races:': 0.05990273029325372
  },
  { // livonia
    'Hispanic or Latino': 0.28773963441818995,
    'White alone': 0.014266607222469906,
    'Black or African American alone': 0.6355773517610344,
    'American Indian and Alaska Native alone': 0.0026749888542131075,
    'Asian alone': 0.009451627284886313,
    'Native Hawaiian and Other Pacific Islander alone': 0.00022291573785109228,
    'Some Other Race alone': 0.007311636201515827,
    'Population of two or more races:': 0.0427552385198395
  },
  { // sutter
    'Hispanic or Latino': 0.3448730629739532,
    'White alone': 0.022043238660449344,
    'Black or African American alone': 0.5774103904667703,
    'American Indian and Alaska Native alone': 0.003626772172766238,
    'Asian alone': 0.011257124016767933,
    'Native Hawaiian and Other Pacific Islander alone': 0.0006594131223211342,
    'Some Other Race alone': 0.006970938721680561,
    'Population of two or more races:': 0.03315905986529132
  },
  { // atlantic
    'Hispanic or Latino': 0.35586739168566917,
    'White alone': 0.06079635151727767,
    'Black or African American alone': 0.5085774425539379,
    'American Indian and Alaska Native alone': 0.0030871776881248904,
    'Asian alone': 0.02343448517803894,
    'Native Hawaiian and Other Pacific Islander alone': 0.0008419575513067883,
    'Some Other Race alone': 0.008419575513067884,
    'Population of two or more races:': 0.03897561831257674
  },
  { // broadway
    'Hispanic or Latino': 0.44970074215944456,
    'White alone': 0.06904476897294709,
    'Black or African American alone': 0.39310509935360305,
    'American Indian and Alaska Native alone': 0.0028728752693320567,
    'Asian alone': 0.03404357194158487,
    'Native Hawaiian and Other Pacific Islander alone': 0.00033516878142207326,
    'Some Other Race alone': 0.011347857313861624,
    'Population of two or more races:': 0.039549916207804646
  },
  { // bushwick
    'Hispanic or Latino': 0.35221785875233375,
    'White alone': 0.12167643082469581,
    'Black or African American alone': 0.43224103521534796,
    'American Indian and Alaska Native alone': 0.0030258160046352928,
    'Asian alone': 0.03676044550312239,
    'Native Hawaiian and Other Pacific Islander alone': 0.00038627438357046286,
    'Some Other Race alone': 0.010815682739972961,
    'Population of two or more races:': 0.04287645657632138
  },
  { // wilson
    'Hispanic or Latino': 0.4802892465593655,
    'White alone': 0.1840914392348962,
    'Black or African American alone': 0.24413342663867507,
    'American Indian and Alaska Native alone': 0.0024259388850011664,
    'Asian alone': 0.039328201539538137,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005131793795194775,
    'Some Other Race alone': 0.011243293678563098,
    'Population of two or more races:': 0.03797527408444133
  },
  { // halsey
    'Hispanic or Latino': 0.5773148342205642,
    'White alone': 0.18543823615710273,
    'Black or African American alone': 0.12189294546673932,
    'American Indian and Alaska Native alone': 0.0012994089784968772,
    'Asian alone': 0.0696231713962359,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005868298612566542,
    'Some Other Race alone': 0.012365343505050929,
    'Population of two or more races:': 0.03147923041455338
  },
  { // myrtle-wyckoff
    'Hispanic or Latino': 0.5973314746589664,
    'White alone': 0.1970526735039331,
    'Black or African American alone': 0.07182448803478376,
    'American Indian and Alaska Native alone': 0.001593149457333466,
    'Asian alone': 0.09409538982375784,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005642404328056026,
    'Some Other Race alone': 0.011284808656112052,
    'Population of two or more races:': 0.02625377543230774
  }
]
// stops
// [0] is name, [1] is fullness, [2] is egress, [3] is racial data
export const stops = [
  ["Canarsie-Rockaway Pkwy", 0.214797136, 0.5],
  // ["CANARSIE-ROCKAW",	0.814797136, 0.5], // for testing eats
  ["E 105 St", 0.1873508353, 0.3],
  // ["EAST 105 ST",	0.8873508353, 0.5], // for testing egress and stuff
  ["New Lots Av", 0.2410501193, 0.3],
  ["Livonia Av", 0.285202864, 0.3],
  ["Sutter Av", 0.3233890215, 0.5],
  ["Atlantic Av", 0.3257756563, 0.5],
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
].map((stop, i) => {
  stop[3] = racial[i] ? racial[i] : racial[10]
  return stop
})

/**
 * enter, update, and exit functions for .join method in TrainChart
 * of shape:
 * data => data
 *   .modifyMethod(...) // append, animate, etc.
 */

// enter
export const enterFn = enter => enter
  .append('circle')
    // .attr('cx', () => getRandEl(C.doorIdxs) * C.squareSize)
    .attr('cx', d => getClosestEl(d.x, C.doorIdxs) * C.squareSize)
    .attr('cy', C.height * C.squareSize + C.squareSize)
    .attr('r', C.squareSize / 3)
    .attr('fill', d => d.gender === 'male' ? 'red' : 'blue')
    .attr('opacity', 0)
  .transition()
  .duration(250)
    .attr('opacity', 1)
  .transition()
  .duration(() => randomIntFromInterval(600, 800))
  .delay(() => Math.random() * 400)
    .attr('cy', (C.height * C.squareSize) / 2)
  .transition()
  .duration(() => randomIntFromInterval(600, 800))
  .delay(() => Math.random() * 550)
    .attr('cx', d => (d.x * C.squareSize) + C.squareSize / 2)
    .attr('cy', d => (d.y * C.squareSize) + C.squareSize / 2)

// exit
export const exitFn = exit => exit
    // .attr('fill', 'red')
  .transition()
  .duration(600)
  .delay(() => Math.random() * 650)
    .attr('cx', d => getClosestEl(d.x, C.doorIdxs) * C.squareSize)
    .attr('cy', (C.height * C.squareSize) / 2)
  .transition()
  .duration(600)
  .delay(() => Math.random() * 650)
    .attr('cy', C.height * C.squareSize + C.squareSize)
  .transition()
  .duration(500)
    .attr('opacity', 0)
  .remove()

// update (the nightmare)
export const updateFn = update => update
    // .attr('fill', 'black')
  .transition()
  .duration(() => randomIntFromInterval(600, 800))
  .delay(() => Math.random() * 400)
    .attr('cx', d => (d.x * C.squareSize) + C.squareSize / 2)
    .attr('cy', d => (d.y * C.squareSize) + C.squareSize / 2)

  
  


  