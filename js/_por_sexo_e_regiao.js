vega.scheme('cu', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']);
function load_data(){
  return new Promise(response => 
    $.getJSON('data/acesso_por_rendimento_sexo_regiao.json', function(res)  {
      response(res)
  }))
}

function load_regiao(regiao){
  console.log(regiao)
  regiao = regiao.id;

  $.getJSON('data/acesso_por_rendimento_sexo_regiao.json', function(res)  {
   vega.loader()
   .load('json/bar.json')
   .then(function(data) { 
    var data = JSON.parse(data)
    var values = []
    values = [
      {category: regiao.toUpperCase(), position:'Mulher', value: (res[regiao].mulheres / res.total[regiao] * 100).toFixed(2)},
      {category: regiao.toUpperCase(), position:'Homem', value: (res[regiao].homens / res.total[regiao] * 100).toFixed(2)}
      ]
    data.data.push({
      "name":"por_sexo",
      values
    })
    render_por_sexo(data);
  })
   .catch(e => console.log(e))
   vega.loader()
    .load('json/stacked.json')
    .then(function(data) {
      var values = []
      var data = JSON.parse(data)
      var x_axis = [
       {x:'Sem renda a 1/4 SM', x_data: 'sem_a_quarto'},
      {x:'1/4 a 1/2 SM', x_data: "mais_quarto_a_meio"},
      {x:'1/2 a 1 SM', x_data: "meio_a_um"},
      {x:'1 a 2 SM', x_data: 'um_a_dois'},
      {x:'2 a 3 SM', x_data: "dois_a_tres"},
      {x:'3 a 5 SM', x_data: "tres_a_cinco"},
      {x:"mais de 5 SM", x_data: "mais_cinco"}
    ]
    x_axis.forEach(x => {
      values.push(
        {x:regiao, y:res[regiao][x.x_data], c:x.x}
      )
    })
    
    data.data.push({
      "name": "rendimento",
      values,
    })

    data.data[0]['transform'] = [
      {
        "type": "stack",
        "groupby": ["x"],
        // "sort": {"field": "c"},
        "field": "y"
      }
    ]

    render_por_rendimento(data)
    })
  })
}


    
async function load_por_sexo(){
  res = await load_data()
  var a = vega.loader()
  .load('json/bar.json')
  .then(function(data) { 
    var data = JSON.parse(data)
    var values = []
    values = [{category: "Brasil", position:'Mulher', value: (res.total.mulheres / res.total.brasil * 100).toFixed(2)},
      {category: "Brasil", position:'Homem', value: (res.total.homens / res.total.brasil * 100).toFixed(2)},
      {category: "Norte", position:'Mulher', value: (res.norte.mulheres / res.total.norte * 100).toFixed(2)},
      {category: "Norte", position:'Homem', value: (res.norte.homens / res.total.norte * 100).toFixed(2)},
      {category: "Nordeste", position:'Mulher', value: (res.nordeste.mulheres / res.total.nordeste * 100).toFixed(2)},
      {category: "Nordeste", position:'Homem', value: (res.nordeste.homens / res.total.nordeste * 100).toFixed(2)},
      {category: "Sul", position:'Mulher', value: (res.sul.mulheres / res.total.sul * 100).toFixed(2)},
      {category: "Sul", position:'Homem', value: (res.sul.homens / res.total.sul * 100).toFixed(2)},
      {category: "Sudeste", position:'Mulher', value: (res.sudeste.mulheres / res.total.sudeste * 100).toFixed(2)},
      {category: "Sudeste", position:'Homem', value: (res.sudeste.homens / res.total.sudeste * 100).toFixed(2)},
      {category: "Centro-Oeste", position:'Mulher', value: (res.centro_oeste.mulheres / res.total.centro_oeste * 100).toFixed(2)},
      {category: "Centro-Oeste", position:'Homem', value: (res.centro_oeste.homens / res.total.centro_oeste * 100).toFixed(2)} ]
    data.data.push({
      "name":"por_sexo",
      values
    })
    render_por_sexo(data);
  })
   .catch(e => console.log(e))
   return a
}

async function load_por_rendimento(){

  const res = await load_data()

  var a = vega.loader()
  .load('json/stacked.json')
  .then(function(data) {
    var values = []
    var data = JSON.parse(data)
    var regioes = ['norte','nordeste','sul','sudeste','centro_oeste']
    var x_axis = [
       {x:'Sem renda a 1/4 SM', x_data: 'sem_a_quarto'},
      {x:'1/4 a 1/2 SM', x_data: "mais_quarto_a_meio"},
      {x:'1/2 a 1 SM', x_data: "meio_a_um"},
      {x:'1 a 2 SM', x_data: 'um_a_dois'},
      {x:'2 a 3 SM', x_data: "dois_a_tres"},
      {x:'3 a 5 SM', x_data: "tres_a_cinco"},
      {x:"mais de 5 SM", x_data: "mais_cinco"}
    ]

    regioes.forEach(r => {
      x_axis.forEach(x => {
        values.push(
          {x:r, y:res[r][x.x_data], c:x.x}
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
        // "sort": {"field": "y", "order": "descending"},
        "field": "y"
      }
    ]
    render_por_rendimento(data)
  }).catch(e => console.log(e))
  return a
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

function load_all(){
  load_por_sexo()
  load_por_rendimento()  
}

load_por_sexo()
load_por_rendimento()  