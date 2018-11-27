  let blues = d3.schemeBlues[9].slice(1,);
  
  let map = L.map('map').setView([-15.79621085,-47.88285245], 4);
  L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
  maxZoom: 18}).addTo(map);
  
  // control that shows state info on hover
  let info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (feat) {
            //console.log(feat);
      this._div.innerHTML = '<h5>Número de acessos</h5>' +  (feat ?
        '<b>' + feat.properties.name + '</b><br />' + homicidiosByName.get(feat.properties.name) + ' acessos'
        : 'Passe o mouse sobre um estado');
  };

  info.addTo(map);
  
  // get color depending on number of cases
  let quantize = d3.scaleQuantize()
    .domain([0, 10000])
    .range(blues);

  function style(feature) {
     return {
          weight: 1,
          opacity: 1,
          color: 'lightgray',
          dashArray: '3',
          fillOpacity: 0.7,
          fillColor: quantize(homicidiosByName.get(feature.properties.name))
        };
  }

  function highlightFeature(e) {
    let layer = e.target;
    console.log(e.target)

    layer.setStyle({
          weight: 2,
          color: '#AAA',
          dashArray: '',
          fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }

    info.update(layer.feature);
  }
  let geojson;

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
  }
  
  let homicidiosByName = d3.map();

  function setMapData(datafile){
    d3.csv(datafile).then(function(data){
        //format data
        data.forEach(function(d) {
            homicidiosByName.set(d.Estado,+d.Acessos);
            console.log(d.Estado)
        });
    
    //brasilData is defined in file br.js       
    geojson = L.geoJson(brasilData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    
    });
  }
  
  setMapData("data/acessos_brasil.csv")

  function updateMapData(datafile){
    geojson.eachLayer(function(layer) {
      map.removeLayer(layer)
    });

    setMapData(datafile)
  }

  $(document).ready(function() {
    $('fieldset.checkbox input[type="radio"]').on('change', function() {
        console.log('You selected: ' + $(this).val() );
        // do something with the value here - e.g. 
        updateMapData($(this).val())
    });
  });
  
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
      labels = [],
      n = blues.length,
      from, to;

    for (let i = 0; i < n; i++) {
      let c = blues[i];
      let fromto = quantize.invertExtent(c);
      labels.push(
        '<i style="background:' + blues[i] + '"></i> ' +
        d3.format("d")(fromto[0]) + (d3.format("d")(fromto[1]) ? '&ndash;' + d3.format("d")(fromto[1]) : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

    legend.addTo(map);