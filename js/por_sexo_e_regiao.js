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
    var values = []
    var data = JSON.parse(data)
    var regioes = ['norte','nordeste','sul','sudeste','centro_oeste']
    var x_axis = [
      {x:'1/2 SM', x_data: "ate_meio"},
      {x:'1/2 a 1 SM', x_data: "meio_a_um"},
      {x:'1 a 2 SM', x_data: 'um_a_dois'},
      {x:'2 a 3 SM', x_data: "dois_a_tres"},
      {x:'3 a 5 SM', x_data: "tres_a_cinco"},
      {x:"5 a 10 SM", x_data: "cinco_a_dez"},
      {x:"> 10 SM", x_data: "mais_dez"}
    ]

    regioes.forEach(r => {
      x_axis.forEach(x => {
        console.log(r, res)
        values.push(
          {x:x.x, y:res[r][x.x_data], c:r}
        )
      })
    })
    console.log(values)
    data.data.push({
      "name": "rendimento",
      values,
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