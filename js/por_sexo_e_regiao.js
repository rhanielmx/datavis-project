function load_data(){
  return new Promise(response => 
    $.getJSON('data/acesso_por_rendimento_sexo_regiao.json', function(res)  {
      response(res)
  }))
}

function load_nordeste(){
  $.getJSON('data/acesso_por_rendimento_sexo_regiao.json', function(res)  {
   vega.loader()
   .load('json/bar.json')
   .then(function(data) { 
    var data = JSON.parse(data)
    var values = []
    values = [
      {category: "Nordeste", position:0, value: (res.nordeste.mulheres / res.total.nordeste * 100).toFixed(2)},
      {category: "Nordeste", position:1, value: (res.nordeste.homens / res.total.nordeste * 100).toFixed(2)}
      ]
    data.data.push({
      "name":"por_sexo",
      values
    })
    console.log(data)
    render_por_sexo(data);
  })
   .catch(e => console.log(e))
  })
}

async function load_por_sexo(){
  res = await load_data()
  vega.loader()
  .load('json/bar.json')
  .then(function(data) { 
    var data = JSON.parse(data)
    var values = []
    values = [{category: "Brasil", position:0, value: (res.total.mulheres / res.total.brasil * 100).toFixed(2)},
      {category: "Brasil", position:1, value: (res.total.homens / res.total.brasil * 100).toFixed(2)},
      {category: "Norte", position:0, value: (res.norte.mulheres / res.total.norte * 100).toFixed(2)},
      {category: "Norte", position:1, value: (res.norte.homens / res.total.norte * 100).toFixed(2)},
      {category: "Nordeste", position:0, value: (res.nordeste.mulheres / res.total.nordeste * 100).toFixed(2)},
      {category: "Nordeste", position:1, value: (res.nordeste.homens / res.total.nordeste * 100).toFixed(2)},
      {category: "Sul", position:0, value: (res.sul.mulheres / res.total.sul * 100).toFixed(2)},
      {category: "Sul", position:1, value: (res.sul.homens / res.total.sul * 100).toFixed(2)},
      {category: "Sudeste", position:0, value: (res.sudeste.mulheres / res.total.sudeste * 100).toFixed(2)},
      {category: "Sudeste", position:1, value: (res.sudeste.homens / res.total.sudeste * 100).toFixed(2)},
      {category: "Centro-Oeste", position:0, value: (res.centro_oeste.mulheres / res.total.centro_oeste * 100).toFixed(2)},
      {category: "Centro-Oeste", position:1, value: (res.centro_oeste.homens / res.total.centro_oeste * 100).toFixed(2)}
      ]
    data.data.push({
      "name":"por_sexo",
      values
    })
    console.log(data)
    render_por_sexo(data);
  })
   .catch(e => console.log(e))
}

async function load_por_rendimento(){
  const res = await load_data()
  console.log(res)
  vega.loader()
  .load('json/stacked.json')
  .then(function(data) { 
    var data = JSON.parse(data)
    var regioes = ['norte','nordeste','sul','sudeste','centro-oeste']
    var x_axis = [
      {x:'1/2 SM', x_data: "ate_meio"},
      {x:'1/2 a 1 SM', x_data: ""},
      {x:'2 a 3 SM', x_data: ""},
      {x:'3 a 5 SM', x_data: ""},
      {x:"5 a 10 SM", x_data: ""},
      {x:"> 10 SM", x_data: ""}
    ]

    regioes.forEach(r => {
      x_axis.forEach(x => {
        values.push(
          {x, y:res[r].}
        )
      })
    })
    var values = []

    data.data.push({
      "name": "rendimento",
      "values": [
        {"x": "1/2 SM", "y": 28, "c":"Norte"},
        {"x": "1/2 à 1 SM", "y": 43, "c":"Norte"},
        {"x": "2 à 3 SM", "y": 81, "c":"Norte"},
        {"x": "3 à 5 SM", "y": 19, "c":"Norte"},
        {"x": "5 Á 10 SM", "y": 52, "c":"Norte"},
        {"x": "> 10 SM", "y": 24, "c":"Norte"},
        {"x": "1/2 SM", "y": 28, "c":1},
        {"x": "1/2 à 1 SM", "y": 43, "c":1},
        {"x": "2 à 3 SM", "y": 81, "c":1},
        {"x": "3 à 5 SM", "y": 19, "c":1},
        {"x": "5 Á 10 SM", "y": 52, "c":1},
        {"x": "> 10 SM", "y": 24, "c":1},
      ],
    })

    data.data[0]['transform'] = [
      {
        "type": "stack",
        "groupby": ["x"],
        "sort": {"field": "c"},
        "field": "y"
      }
    ]
    console.log(data)
    render_por_rendimento(data)
  }).catch(e => console.log(e))
}

function render_por_sexo(spec) {
  var view = new vega.View(vega.parse(spec))
    .renderer('canvas')  // set renderer (canvas or svg)
    .initialize('#sexo_regiao') // initialize view within parent DOM container
    // .hover()             // enable hover encode set processing
    .run()
}

function render_por_rendimento(spec){
  var view = new vega.View(vega.parse(spec))
    .renderer('canvas')  // set renderer (canvas or svg)
    .initialize('#rendimento_regiao') // initialize view within parent DOM container
    // .hover()             // enable hover encode set processing
    .run() 
}

load_por_sexo()
load_por_rendimento()