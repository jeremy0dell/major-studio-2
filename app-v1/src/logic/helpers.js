export const findIndexOfPerson = (arr, occupant) => arr
  .findIndex(person => (
    person.x === occupant.x &&
    person.y === occupant.y
  ))

export const getRandEl = arr => arr[Math.floor(arr.length * Math.random())]
export const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

export const getClosestEl = (el, arr) => arr
  .reduce((prev, curr) => (Math.abs(curr - el) < Math.abs(prev - el) ? curr : prev))

export const getClosestPoint = (point, arr) => arr
  .reduce((prev, curr) => (Math.abs(distance(curr, point)) < Math.abs(distance(prev, point)) ? curr : prev))

// found: https://stackoverflow.com/a/53672813
var arrayShuffle = function(array) {
  for ( var i = 0, length = array.length, swap = 0, temp = ''; i < length; i++ ) {
      swap        = Math.floor(Math.random() * (i + 1));
      temp        = array[swap];
      array[swap] = array[i];
      array[i]    = temp;
  }
  return array;
};
// uses shape: percentageChance(['hi', 'test', 'bye'], [80, 15, 5])
var percentageChance = function(values, chances) {
  for ( var i = 0, pool = []; i < chances.length; i++ ) {
      for ( var i2 = 0; i2 < chances[i]; i2++ ) {
        pool.push(i);
      }
  }
  return values[arrayShuffle(pool)['0']];
};

export const sampleFromProportions = propObj => {
  const entries = Object.entries(propObj)

  return percentageChance(
    entries.map(entry => entry[0]),
    entries.map(entry => entry[1] * 100)
  )
}