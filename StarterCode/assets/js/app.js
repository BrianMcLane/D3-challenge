var svgSize = {
    width: 500, 
    height: 400
}

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgSize.width)
    .attr("height", svgSize.height)
    .attr("style", "border: 1px solid black")

var margin = {
    top: 20,
    bottom: 50,
    left: 50,
    right: 20
}

var chartSize = {
    width: svgSize.width - margin.left - margin.right,
    height: svgSize.height - margin.top - margin.bottom
}

var frame = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)

// frame.append("text").text("Hi")

d3.csv("assets/data/data.csv").then(data => {
    console.log(data)
    // smakes, age
    data.forEach(state => {
        state.smokes = +state.smokes;
        state.age = +state.age;
    });

    var xvals = data.map(state => state.age)
    var yvals = data.map(state => state.smokes)

    var xScale = d3.scaleLinear()
                    .domain([.9 * d3.min(xvals), d3.max(xvals)])
                    .range([0, chartSize.width])

    var yScale = d3.scaleLinear()
                    .domain([.9 * d3.min(yvals), d3.max(yvals)])
                    .range([chartSize.height, 0])

    var bottomAxis = d3.axisBottom(xScale)
    var leftAxis = d3.axisLeft(yScale)

    frame.append("g").attr("id", "xAxis").attr("transform", `translate(0, ${chartSize.height})`).call(bottomAxis)
    frame.append("g").attr("id", "yAxis").call(leftAxis)

    var chartData = frame.append("g").attr("id", "chartData")

    var toolTip = d3.tip()
                    .attr("class", "tooltip")
                    .offset([80, 60])
                    .html(function(d) {
                        return `${d.state}`;
                    })

    var radius = 10

    chartData.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", radius)
            .attr("cx", d => xScale(d.age))
            .attr("cy", d => yScale(d.smokes))
            .attr("stroke", "black")
            .attr("fill", "blue")
            .attr("opacity", ".5")
            .on('mouseover', function(data) {
                toolTip.show(data, this);
            });

    chartData.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("dx", d => xScale(d.age))
            .attr("dy", d => yScale(d.smokes))
            .text(d => d.abbr)

    chartData.append("text")
            .attr("dx", chartSize.width / 2)
            .attr("dy", svgSize.height - 30) 
            .text("Age")

    chartData.append("text")
            .attr("dx", -chartSize.height / 2)
            .attr("dy", -30)
            .attr("transform", "rotate(-90)")
            .text("Smokes")

})