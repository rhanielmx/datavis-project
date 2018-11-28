var body = document.getElementsByTagName("body")[0]
var width = body.clientWidth, height = 480;

var elementPosition = $('#svgdiv').offset();

$('#svgdiv').css('width','100%').css('height','200');

var svg = d3.select("#svgdiv")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  console.log(height);
  
var setGroup = d3.scaleOrdinal()
  .domain([0, 4])
  .range(["Norte", "Nordeste", "Sudeste", "Sul", "Centro-Oeste"]);


function loadJSON(file, callback) {   

  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}


function getGroup(dataset, index){
  let my_group = dataset[index].group
  return my_group;
}

function correct_round(l, target) {
  var off = target - _.reduce(l, function(acc, x) { return acc + Math.round(x) }, 0);
  return _.chain(l).
          sortBy(function(x) { return Math.round(x) - x }).
          map(function(x, i) { return Math.round(x) + (off > i) - (i >= (l.length + off)) }).
          value();
}

function updateForces(groupOption){
    forceX = d3.forceX((d) => groups[groupOption][d.group].x);
    forceY = d3.forceY((d) => groups[groupOption][d.group].y);

    force = d3.forceSimulation(data)
              .velocityDecay(0.2)
              .force('x', forceX)
              .force('y', forceY)
              .force("collide", d3.forceCollide(5))
              .force("tick", ticked);
}

function ticked(alpha){
    node
     .attr('transform', (d) => { 
          return 'translate(' + (d.x) + ',' + (d.y) + ')';
      });
}

var xScale = d3.scaleLinear()
  .domain([0, 4])
  .range([350, width-350]);

var qtdAcessos;

var groupNames;

var qtdNodes, data, regions, new_data, node, force;


function loadClusters(file){
  loadJSON(file,function(response) {
    qtdAcessos = JSON.parse(response)[0];
    console.log(qtdAcessos)
 });

}

loadClusters('data/acessos_cluster.json')


setTimeout(function(){

let group = 'total';

acessScale = d3.scaleLinear()
                .domain([0,qtdAcessos.total.Todos])
                .range([0,100])

qtdNodes = generateNodes(group);
data = generateData(qtdNodes)


groups = {
    "total":{
        "Todos":{
          "x": xScale(2),
          "y": height / 2
        }
    },
    "region":{
        "Norte" : {
         "x" : xScale(1),
         "y": height / 3
        },
        "Nordeste": {
             "x" : xScale(1.3),
             "y": height / 1.5
        },
        "Sudeste": {
             "x" : xScale(2),
             "y": height / 2 - 150
        },
        "Sul": {
             "x" : xScale(2.8),
             "y": height / 1.5
        },
        "Centro-Oeste": {
             "x" : xScale(3),
             "y": height / 3
        }
    },
    "age":{
        "0-20":  {
           "x" : xScale(0),
           "y": height / 2
          },
        "20-40":  {
           "x" : xScale(1),
           "y": height / 2
          },
        "40-60":  {
           "x" : xScale(2),
           "y": height / 2
          },
        "60+":  {
           "x" : xScale(3),
           "y": height / 2
          }
    },  
    "sex":{
        "Homens": {
           "x" : xScale(1),
           "y": height / 2
          },
        "Mulheres":{
           "x" : xScale(3),
           "y": height / 2
          }
    }
};


var forceX = d3.forceX((d) => groups[group][d.group].x);
var forceY = d3.forceY((d) => groups[group][d.group].y);

node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", (d)=>'lightgray');

force = d3.forceSimulation(data)
    .velocityDecay(0.3)
    .force('x', forceX)
    .force('y', forceY)
    .force("collide", d3.forceCollide(6))
    .force("tick", ticked);    

nodes.forEach(function(d){
    
    svg.append("text")
            .attr("x", groups[group][d.group].x - 30)
            .attr("y", groups[group][d.group].y - 80)
            .style("font-family","Arial, Helvetica, sans-serif")
            .style("font-size","20px")
            .style('fill', 'lightgray')
            .style('text-weight', 'bold')
            .style('stroke-width', 2)
            .text(d.group);
    })


},2000);

function generateNodes(groupOption){

  groupNames = Object.keys(qtdAcessos[groupOption]);

  numOfGroups = Object.keys(qtdAcessos[groupOption]).length


  nodes = d3.range(numOfGroups).map(function(d, i){
    return {
      group: groupNames[i],
      qtd: acessScale(qtdAcessos[groupOption][groupNames[i]])
    }
  });

  let ranks = nodes;

  let pcts = [];

  nodes.forEach(function(d){
    pcts.push(d.qtd)
  });

  corrected_pcts = correct_round(pcts, 100)

  nodes.forEach(function(d, i){
    d.qtd = corrected_pcts[i]
  });

  return nodes;
}

function generateData(nodes){
  let dataset = []

  let i = 0, change_counter = 0, group_counter = 0;

  while (i < 100) {
      if(i == nodes[group_counter].qtd+change_counter){
        change_counter=i

        group_counter+=1
      }
      example={"group": nodes[group_counter].group}
      dataset.push(example)
      i++;
    }
  return dataset;
}




d3.select("#totalBtn").on("click", function(){
    svg.selectAll('text').remove();

    option='total'
    new_nodes = generateNodes(option)
    new_data = generateData(new_nodes)     

    data.forEach(function(d, i){
      d.group = getGroup(new_data, i)
    })

    updateForces(option);

    nodes.forEach(function(d){
    
    svg.append("text")
            .attr("x", groups[option][d.group].x - 30)
            .attr("y", groups[option][d.group].y - 80)
            .style("font-family","Arial, Helvetica, sans-serif")
            .style("font-size","20px")
            .style('fill', 'lightgray')
            .style('text-weight', 'bold')
            .style('stroke-width', 2)
            .text(d.group);
    })

    node.transition().duration(500).attr("fill", (d)=>'lightgray');
    force.nodes(data);
    force.alpha(0.8).restart();
})

d3.select("#regionBtn").on("click", function(){
    svg.selectAll('text').remove();

    option='region'
    new_nodes = generateNodes(option)
    new_data = generateData(new_nodes)     

    data.forEach(function(d, i){
      d.group = getGroup(new_data, i)
    })

    updateForces(option);

    nodes.forEach(function(d){    
      svg.append("text")
          .attr("x", groups[option][d.group].x - 30)
          .attr('y', groups[option][d.group].y - 50)
          .style("font-family","Arial, Helvetica, sans-serif")
          .style("font-size","20px")
          .style('fill', 'lightgray')
          .style('text-weight', 'bold')
          .style('stroke-width', 2)
          .text(d.group);
    })

    node.transition().duration(500).attr("fill", (d)=>'lightgray');
    force.nodes(data);
    force.alpha(0.8).restart();
})

d3.select("#ageBtn").on("click", function(){
    svg.selectAll('text').remove();

    option='age'
    new_nodes = generateNodes(option)
    new_data = generateData(new_nodes)     

    data.forEach(function(d, i){
      d.group = getGroup(new_data, i)
    })

    updateForces(option)

    nodes.forEach(function(d){    
      svg.append("text")
          .attr("x", groups[option][d.group].x - 20)
          .attr('y', groups[option][d.group].y - 50)
          .style("font-family","Arial, Helvetica, sans-serif")
          .style("font-size","20px")
          .style('fill', 'lightgray')
          .style('text-weight', 'bold')
          .style('stroke-width', 2)
          .text(d.group);
    })

    node.transition().duration(500).attr("fill", (d)=>'lightgray');
    force.nodes(data);
    force.alpha(0.8).restart();
})

d3.select("#sexBtn").on("click", function(){

    svg.selectAll('text').remove();

    option = 'sex'
    new_nodes = generateNodes(option)
    new_data = generateData(new_nodes)     

    data.forEach(function(d, i){
      d.group = getGroup(new_data, i)
    })

    updateForces(option)

    nodes.forEach(function(d){    
      svg.append("text")
          .attr("x", groups[option][d.group].x - 35)
          .attr('y', groups[option][d.group].y - 60)
          .style("font-family","Arial, Helvetica, sans-serif")
          .style("font-size","20px")
          .style('fill', 'lightgray')
          .style('text-weight', 'bold')
          .style('stroke-width', 2)
          .text(d.group);
    })

    node.transition().duration(500).attr("fill", (d)=>'lightgray');
    force.nodes(data);
    force.alpha(0.8).restart();
})

