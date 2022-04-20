export const findIndexOfPerson = (arr, occupant) => arr
  .findIndex(person => (
    person.x == occupant.x &&
    person.y == occupant.y
  ))

export const getRandEl = arr => arr[Math.floor(arr.length * Math.random())]