// console.log(d3)

(async () => {
    var data = {"children": [
        {"children": [
          {"stat": 1},
          {"stat": 1},
          {"stat": 1}
        ]},
        {"children": [
          {"stat": 1},
          {"stat": 1},
          {"stat": 2},
          {"stat": 3}
        ]},
        {"children": [
          {"stat": 1},
          {"stat": 1},
          {"stat": 1},
          {"stat": 1},
          {"stat": 2},
          {"stat": 2},
          {"stat": 2},
          {"stat": 4},
          {"stat": 4},
          {"stat": 8}
        ]},
    ]};

var root = d3.hierarchy(data)
.sum(d => d.hasOwnProperty("stat") ? d.stat : 0)
.sort((a,b) => b.value - a.value);

var partition = d3.pack()
.size([250,250]);

partition(root);

d3.select("#demo1 g")
.selectAll('circle.node')
.data(root.descendants())
.enter()
.append('circle')
.classed('node', true)
.attr('cx', d => d.x)
.attr('cy', d => d.y)
.attr('r', d => d.r);
    // const data = await d3.csv('../data/cases-by-day-nychealth.csv', d => ({
    //     ...d,
    //     date_of_interest: new Date(d.date_of_interest),
    //     CASE_COUNT_7DAY_AVG: +d.CASE_COUNT_7DAY_AVG
    // }))

    // console.log(data)
    // const days = data.length
    // const height = 400
    // const width = 800


    // const minAvg = d3.min(data.map(d => d.CASE_COUNT_7DAY_AVG))
    // const maxAvg = d3.max(data.map(d => d.CASE_COUNT_7DAY_AVG))

    // const minDate = d3.min(data.map(d => new Date(d.date_of_interest)))
    // const maxDate = d3.max(data.map(d => new Date(d.date_of_interest)))
    
    // const xScale = d3.scaleLinear()
    //     .domain([0, days])
    //     .range([0, width])

    // const yScale = d3.scaleLinear()
    //     .domain([minAvg, maxAvg])
    //     .range([height, 0])

    // const line = d3.line()
    //     .x((d, i)=> xScale(i))
    //     .y(d => yScale(d.CASE_COUNT_7DAY_AVG));

    // console.log(line(data))

    // console.log(days,minAvg,maxAvg, minDate, maxDate)


    // const svg = d3.select('body').append('svg')
    //     .attr('height', height)
    //     .attr('width', width)

    // svg.append('path')
    //         .attr('d', line(data))

})()