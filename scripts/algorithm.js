const stops = [
    {
        name: 'canarsie',
        egress: 0.2,
        fullness: 0.1
    },
    {
        name: '105',
        egress: 0.2,
        fullness: 0.5
    },
    {
        name: 'new lots',
        egress: 0.2,
        fullness: 1.0
    },
    {
        name: 'livonia',
        egress: 0.2,
        fullness: 0.3
    },
    {
        name: 'test1',
        egress: 0.9,
        fullness: 0.2
    },
    {
        name: 'test2',
        egress: 0.2,
        fullness: 0.1
    },
]

const max = 30 * 6;

// all people
let people = []

// current train
let train = []

// creates a person with a start and stop
const buildPerson = (start, stop) => ({ start, stop })

// loop thru stops, create people
for (var i = 0; i < stops.length; i++) {
    var stop = stops[i]

    // figure out how many people to grab
    var toExit = Math.max(Math.floor(stop.egress * train.length))

    // in case of fullness/egress mismatch
    var fullnessCheck = train.length - (stop.fullness * max)

    if (fullnessCheck > toExit) toExit = fullnessCheck

    console.log(train.length, 'exiting:', toExit, 'should be', train.length - (stop.fullness * max) )
    // remove ppl randomly
    var idxs = []
    for (var j = 0; j < toExit; j++) {
        var randomIdx = Math.floor(Math.random() * train.length)
        idxs.push(randomIdx)
        // ref to selected person
        var randomPerson = train[randomIdx]
        // console.log(randomPerson)
        // assign their stop
        randomPerson.stop = i
        // push them to storage
        people.push(randomPerson)
        // remove from train
        train.splice(randomIdx, 1)
    }
    console.log(idxs)
    idxs=[]
    console.log(train.length)

    // add people to train
    while (train.length < (stop.fullness * max)) {
        var person = buildPerson(i, null)

        train.push(person)
    }

    while (train.length < (stop.fullness * max)) {
        var person = buildPerson(i, null)

        train.push(person)
    }

    console.log('before ride:', train.length)
}

people = people.concat(train.map(p => ({...p, stop: 'stay'})))

console.log(people, people.length)