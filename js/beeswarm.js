
var svg_beeswarm = d3.select("#svgbeeswarm")
  .append("svg")
  .attr("width", 960)
  .attr("height", 200);

var margin = {top: 40, right: 40, bottom: 40, left: 40},
    beeswarm_width = svg_beeswarm.attr("width") - margin.left - margin.right,
    beeswarm_height = svg_beeswarm.attr("height") - margin.top - margin.bottom;

var formatValue = d3.format(",d");

var x = d3.scaleLog()
    .rangeRound([0, beeswarm_width]);

var g = svg_beeswarm.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var fillColor = d3.scaleOrdinal()
  .domain(["Norte","Nordeste","Centro-Oeste","Sul","Sudeste"])
  .range(["#009933","#0066cc","#ffff00","#ff3300","#ff9900"]);

d3.csv("data/acessos_beeswarm.csv", type).then(function(data) {

  x.domain(d3.extent(data, function(d) { return 1000*d.value; }));

  var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) { return x(1000*d.value); }).strength(1))
      .force("y", d3.forceY(beeswarm_height / 2))
      .force("collide", d3.forceCollide(4))
      .stop();

  for (var i = 0; i < 120; ++i) simulation.tick();

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + beeswarm_height + ")")
      .call(d3.axisBottom(x).ticks(20, ".0s"));

  var cell = g.append("g")
      .attr("class", "cells")
    .selectAll("g").data(d3.voronoi()
        .extent([[-margin.left, -margin.top], [beeswarm_width + margin.right, beeswarm_height + margin.top]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
      .polygons(data)).enter().append("g");

  cell.append("circle")
      .attr("r", 3)
      .attr("cx", function(d) { return d.data.x; })
      .attr("cy", function(d) { return d.data.y; })
      .attr("data-legend",function(d) { return d.data.region})
      .style("fill",function(d) { return fillColor(d.data.region); });


  var legend = svg_beeswarm.selectAll(".legend")
      .data(fillColor.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(18,"+ i*15+")"; });

  legend.append("rect")
      .attr("x", 18)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", d=>fillColor(d));

  legend.append("text")
      .attr("x",32)
      .attr("y", 3)
      .attr("dy", ".5em")
      .style("text-anchor", "begin")
      .text(function(d) { return d;});


  cell.append("path")
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

  cell.append("title")
      .text(function(d) { return "Estado: "+d.data.id + "\n" + "Acessos: " + formatValue(1000*d.data.value); });

    return data;
});

function type(d) {
  if (!d.value) return;
  d.value = +d.value;
  return d;
}
