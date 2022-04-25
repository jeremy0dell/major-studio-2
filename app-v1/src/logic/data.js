import * as C from './constants'
import { randomIntFromInterval, getClosestEl } from './helpers'

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
  },
  { // dekalb
    'Hispanic or Latino': 0.5452418357455627,
    'White alone': 0.2779356218872213,
    'Black or African American alone': 0.0391750509743624,
    'American Indian and Alaska Native alone': 0.001905271250459605,
    'Asian alone': 0.09593207875121168,
    'Native Hawaiian and Other Pacific Islander alone': 0.0006350904168198683,
    'Some Other Race alone': 0.010997091954407193,
    'Population of two or more races:': 0.02817795901995521
  },
  { // jefferson
    'Hispanic or Latino': 0.5111758566707253,
    'White alone': 0.3012263002261263,
    'Black or African American alone': 0.05053052704818229,
    'American Indian and Alaska Native alone': 0.0019568620629674726,
    'Asian alone': 0.0927117759610367,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005218298834579927,
    'Some Other Race alone': 0.011915115672290833,
    'Population of two or more races:': 0.029961732475213082
  },
  { // morgan
    'Hispanic or Latino': 0.47300254566566924,
    'White alone': 0.28855343664865346,
    'Black or African American alone': 0.1395650037961681,
    'American Indian and Alaska Native alone': 0.0016077888437318565,
    'Asian alone': 0.0519851726139967,
    'Native Hawaiian and Other Pacific Islander alone': 0.0009378768255102497,
    'Some Other Race alone': 0.008887499441739985,
    'Population of two or more races:': 0.03546067616453039
  },
  { // montrose
    'Hispanic or Latino': 0.44931317001589693,
    'White alone': 0.2200709248766967,
    'Black or African American alone': 0.1711979782333999,
    'American Indian and Alaska Native alone': 0.0013858883952227613,
    'Asian alone': 0.12436310275954836,
    'Native Hawaiian and Other Pacific Islander alone': 0.00044837565727795216,
    'Some Other Race alone': 0.007255533363225044,
    'Population of two or more races:': 0.02596502669873232
  },
  { // grand
    'Hispanic or Latino': 0.25756141034924523,
    'White alone': 0.5421378042666963,
    'Black or African American alone': 0.06489166156074194,
    'American Indian and Alaska Native alone': 0.0012811229321004847,
    'Asian alone': 0.08087784771347407,
    'Native Hawaiian and Other Pacific Islander alone': 0.0005570099704784716,
    'Some Other Race alone': 0.009747674483373252,
    'Population of two or more races:': 0.04294546872389016
  },
  { // graham
    'Hispanic or Latino': 0.19651741293532338,
    'White alone': 0.6278503316749585,
    'Black or African American alone': 0.028555140961857378,
    'American Indian and Alaska Native alone': 0.0012956053067993366,
    'Asian alone': 0.08981135986733002,
    'Native Hawaiian and Other Pacific Islander alone': 0.0006218905472636816,
    'Some Other Race alone': 0.008447346600331675,
    'Population of two or more races:': 0.046900912106135985
  },
  { // lorimer
    'Hispanic or Latino': 0.19385930481050198,
    'White alone': 0.6278948057045662,
    'Black or African American alone': 0.029046186052597147,
    'American Indian and Alaska Native alone': 0.0009158707313881983,
    'Asian alone': 0.0928082341140041,
    'Native Hawaiian and Other Pacific Islander alone': 0.00047974181167953245,
    'Some Other Race alone': 0.007021675607309521,
    'Population of two or more races:': 0.047974181167953246
  },
  { // bedford
    'Hispanic or Latino': 0.2411217510259918,
    'White alone': 0.5804103967168263,
    'Black or African American alone': 0.03127222982216142,
    'American Indian and Alaska Native alone': 0.0007113543091655267,
    'Asian alone': 0.09274965800273598,
    'Native Hawaiian and Other Pacific Islander alone': 0.00030095759233926127,
    'Some Other Race alone': 0.007633378932968536,
    'Population of two or more races:': 0.04580027359781122
  },
  { // 1av
    'Hispanic or Latino': 0.14154597638566963,
    'White alone': 0.6185150039668341,
    'Black or African American alone': 0.041581755674128466,
    'American Indian and Alaska Native alone': 0.0008867041052844453,
    'Asian alone': 0.14378607096744084,
    'Native Hawaiian and Other Pacific Islander alone': 0.0007155857691769208,
    'Some Other Race alone': 0.008182567708414355,
    'Population of two or more races:': 0.044786335423051195
  },
  { // 3av
    'Hispanic or Latino': 0.10085842989489192,
    'White alone': 0.6528883474516248,
    'Black or African American alone': 0.03807689038728504,
    'American Indian and Alaska Native alone': 0.0007082754908349151,
    'Asian alone': 0.15409241578604413,
    'Native Hawaiian and Other Pacific Islander alone': 0.000651613451568122,
    'Some Other Race alone': 0.007791030399184067,
    'Population of two or more races:': 0.044932997138567014
  },
  { // union sq
    'Hispanic or Latino': 0.07740982914996836,
    'White alone': 0.6757364831610772,
    'Black or African American alone': 0.03775574773254588,
    'American Indian and Alaska Native alone': 0.0004921605849680095,
    'Asian alone': 0.1479645644378823,
    'Native Hawaiian and Other Pacific Islander alone': 0.00035154327497714967,
    'Some Other Race alone': 0.008718273219433312,
    'Population of two or more races:': 0.05157139843914786
  },
  { // 6av
    'Hispanic or Latino': 0.0852637051585697,
    'White alone': 0.72243082433135,
    'Black or African American alone': 0.031800589220726705,
    'American Indian and Alaska Native alone': 0.0008087343307723412,
    'Asian alone': 0.0984922881404887,
    'Native Hawaiian and Other Pacific Islander alone': 0.0006643174859915661,
    'Some Other Race alone': 0.009762578707180405,
    'Population of two or more races:': 0.05077696262492057
  },
  { // 8av
    'Hispanic or Latino': 0.12707090788601724,
    'White alone': 0.6889220234150651,
    'Black or African American alone': 0.039374861939474266,
    'American Indian and Alaska Native alone': 0.0008283631544068919,
    'Asian alone': 0.09341175171195051,
    'Native Hawaiian and Other Pacific Islander alone': 0.0009111994698475812,
    'Some Other Race alone': 0.007924674177159266,
    'Population of two or more races:': 0.04155621824607908
  }
]

//
const rent = [
  2275,
  2275,
  2200,
  2200,
  2200,
  2200,
  3053,
  3053,
  3053,
  3053
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
  ["Sutter Av", 0.3233890215, 0.3],
  ["Atlantic Av", 0.3257756563, 0.3],
  ["BROADWAY JCT", 0.3579952267, 0.3],
  ["BUSHWICK AV", 0.3758949881, 0.3],
  ["WILSON AV", 0.4164677804, 0.3],
  ["HALSEY ST", 0.4427207637, 0.3],
  ["MYRTLE-WYCKOFF", 0.353699284, 0.3],
  ["DEKALB AV", 0.6420047733, 0.3],
  ["JEFFERSON ST", 0.6992840095, 0.3],
  ["MORGAN AV", 0.7267303103, 0.3],
  ["MONTROSE AV", 0.7840095465, 0.3],
  ["GRAND ST", 0.8257756563, 0.3],
  ["GRAHAM AV", 0.8245823389, 0.3],
  ["LORIMER ST", 0.8544152745, 0.3],
  ["BEDFORD AV", 0.968973747, 0.4],
  ["1 AV", 0.9701670644, 0.3],
  ["3 AV", 0.9677804296, 0.4],
  ["14 ST-UNION SQ", 1, 0.6],
  ["6 AV", 0.9128878282, 0.6],
  ["8 AV", 0.838902148, 0.8],
].map((stop, i) => {
  stop[3] = racial[i]
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
  // testing on end
  .on("end", () => console.log('I am called'))

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

  
  


  