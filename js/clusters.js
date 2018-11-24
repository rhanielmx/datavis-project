var body = document.getElementsByTagName("body")[0]
var width = body.clientWidth, height = 200;

var elementPosition = $('#svgdiv').offset();

$(window).scroll(function(){
        if($(window).scrollTop() > elementPosition.top){
              $('#svgdiv').css('position','fixed').css('top','0');
        } else {
            $('#svgdiv').css('position','static');
        }    
});
$('#svgdiv').css('width','100%').css('height','200');


var svg = d3.select("#svgdiv")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  console.log(height)
  
var data = d3.range(100).map(function(d, i){
  return {
  group: Math.random()*2 > 1 ? "blue" : Math.random()*2 > 1 ? "green" : "red",
  id: i
  }
});

var xScale = d3.scaleLinear()
  .domain([0, 2])
  .range([300, width-300]);

var foci = {
    "blue" : {
         "x" : xScale(0),
         "y": height / 2
    },
    "green": {
         "x" : xScale(1),
         "y": height / 2
    },
    "red": {
         "x" : xScale(2),
         "y": height / 2
    }
};

var forceX = d3.forceX((d) => foci[d.group].x);
var forceY = d3.forceY((d) => foci[d.group].y);


var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", (d)=>d.group);


var force = d3.forceSimulation(data)
    .velocityDecay(0.3)
    .force('x', forceX)
    .force('y', forceY)
    .force("collide", d3.forceCollide(6));
    
force.nodes(data)
    .on('tick', function() {
         node
            .attr('transform', (d) => { 
                return 'translate(' + (d.x) + ',' + (d.y) + ')';
            });
        });
     

    var new_data = d3.range(100).map(function(d, i){
      return {
      group: Math.random()*2 > 1 ? "blue" : Math.random()*2 > 1 ? "green" : "red",
      id: i
      }
    });

    function getGroup(index){
      let my_group = new_data[index].group
      return my_group;

    }
d3.select("#btn").on("click", function(){

    data.forEach(function(d){
      d.group = getGroup(d.id)
    })

    node.transition().duration(500).attr("fill", (d)=>d.group);
    setTimeout(function(){
    force.nodes(data);
    force.alpha(0.8).restart();
    }, 1500)
})