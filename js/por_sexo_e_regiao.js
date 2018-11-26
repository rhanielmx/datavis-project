function load_por_sexo(){
  $.getJSON('data/acesso_por_rendimento_sexo_regiao.json', function(res)  {
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
  })
}




function render_por_sexo(spec) {
  var view = new vega.View(vega.parse(spec))
    .renderer('canvas')  // set renderer (canvas or svg)
    .initialize('#sexo_regiao') // initialize view within parent DOM container
    // .hover()             // enable hover encode set processing
    .run()
}

load_por_sexo()