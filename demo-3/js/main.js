// Main JavaScript File
"use strict";

// Set domain and range for the scale
var domain = [0, 10000];
var height = 500;
var width = 600;
var topRange = [100, width - 100];
var bottomRange = [0, width];
var middleRange = [width / 2 - 20, width / 2 + 20];
var colorRange = ['red', 'blue'];
var padding = {
    left: 50,
    bottom: 50,
    right: 50,
    top: 50
};


// Convert to Hex: from http://jsfiddle.net/Mottie/xcqpF/1/light/
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}


// You'll have to wait for you page to load to assign events to the elements created in your index.html file
$(function() {
    // Select SVG for manipulation
    var svg = d3.select('#my-svg')
        .attr('height', height + padding.top + padding.bottom)
        .attr('width', width + padding.left + padding.right);

    var g = svg.append('g')
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")"); // shift from left and top

    // Declare a scale for displaying the domain
    var topScale = d3.scaleLinear()
        .domain(domain)
        .range(topRange);

    // Declare a scale the shows the range (you won't typically do this)
    var middleScale = d3.scaleLinear()
        .domain(domain)
        .range(middleRange);

    // Declare a scale showing the "function" in between domain and range
    var bottomScale = d3.scaleLinear()
        .domain(domain)
        .range(bottomRange);

    // Declare a scale to show the color
    var colorScale = d3.scaleLinear()
        .domain(domain)
        .range(colorRange);

    // Create an axis for the domain
    var topAxis = d3.axisTop()
        .scale(topScale)
        .tickFormat(d3.format('.2s')); // 2 significant digits

    // Append rangeAxis to svg
    var topAxisLabel = g.append("g")
        .attr("class", "x axis")
        .call(topAxis);

    // Create an axis for the function
    var middleAxis = d3.axisTop()
        .scale(middleScale)
        .ticks(0) // no ticks
        .tickFormat(""); // don't display these values

    // Append the center axis
    var middleAxisLabel = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height / 2) + ")")
        .call(middleAxis)


    // Create an axis for the function
    var bottomAxis = d3.axisBottom()
        .scale(bottomScale)
        .tickFormat(function(d) {
            // return bottomScale(d) + 'px'
            return rgb2hex(colorScale(d));
        }); // Show as pixels

    // Change bottom axis text
    // 

    // Append the center axis
    var bottomAxisLabel = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(bottomAxis)

    bottomAxisLabel.selectAll('text')
        .style('fill', function(d) {
            // console.log(rgb2hex(colorScale(d)));
            return rgb2hex(colorScale(d));
        });

    // Add text
    var scaleText = g.append('text')
        .text('scale(')
        .attr('x', width / 2 - 22)
        .attr('y', height / 2)
        .attr('class', 'mid-label')
        .style('text-anchor', 'end');


    var closeScale = g.append('text')
        .text(')')
        .attr('x', width / 2 + 22)
        .attr('y', height / 2)
        .attr('class', 'mid-label')
        .style('text-anchor', 'start');

    // Add labels
    var topLabel = svg.append('text')
        .text('Data Space (domain)')
        .attr('x', padding.left + width / 2)
        .attr('y', 15)
        .attr('class', 'axis-label');

    var bottomLabel = svg.append('text')
        .text('Visual Space (range)')
        .attr('x', padding.left + width / 2)
        .attr('y', height + padding.top + padding.bottom - 5)
        .attr('class', 'axis-label');

    // Line interpolater
    var line = d3.line().curve(d3.curveCardinal);

    // Path drawing function for displaying line
    var path = function(d) {
        // Calculate position to accomodate the use of 3 scales
        var lineData = [];

        // Top position
        lineData.push([topScale(d), 0]);

        // Middle position
        lineData.push([middleScale(d), height / 2]);

        // Bottom position
        lineData.push([bottomScale(d), height]);

        // Return ther interpolation of the data
        return line(lineData);
    }
    // Bind data
    var draw = function(data) {
        var paths = g.selectAll('.path')
            .data(data);

        paths.enter()
            .append("path")
            .attr('d', function(d) {
                return path(d);
            })
            .attr('class', 'path')
            .style('fill', 'none')
            .style("opacity", 0.4)
            .style("stroke", '#d3d3d3');

        // Remove paths
        paths.exit().remove()

    }
    draw(d3.range(domain[0], domain[1] + 1000, 1000));

});