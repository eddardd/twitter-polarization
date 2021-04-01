const width = 650;
const height = 480;
const barplot_width = 600;
const barplot_height = 150;
const bolsonaroColor = "#39bd60"
const haddadColor = "#c43737"

const svg = d3.select("#map").append("svg")
              .attr("width", width)
              .attr("height", height);

scaleBolsonaro = d3.scaleQuantize()
                   .domain([0, 1])
                   .range(d3.schemeGreens[9]);


scaleHaddad = d3.scaleQuantize()
                .domain([0, 1])
                .range(d3.schemeReds[9]);


let promises = [
    d3.csv('../data/Eleicoes2018SegundoTurno.csv').then(function(data) {
        data.forEach(function(d) {
            d.totalVotos = +d.totalVotos;
            d.percentHaddad = +d.percentHaddad;
            d.percentBolsonaro = +d.percentBolsonaro;
            d.numeroCandidatoMaisVotado = +d.numeroCandidatoMaisVotado;
        })
        
        return data
      }),
    d3.csv('../data/ResultadoUFEleicoes2018.csv').then(function(data) {
        data.forEach(function(d) {
            d.percentHaddad = +d.percentHaddad;
            d.percentBolsonaro = +d.percentBolsonaro;
            d.numeroCandidatoMaisVotado = +d.numeroCandidatoMaisVotado;
        })
        
        return data
      }),
    d3.json('../data/brazil_geo.js')
]

Promise.all(promises).then(ready)

function ready(us){
    let resultadoMunicipio = us[0]
    let resultadoUF = us[1]
    let geometryUF = us[2]

    let listUFs = []
    resultadoUF.forEach(function (d) {
        listUFs.push(d["uf"])
    })

    let listMunicipios = []
    resultadoMunicipio.forEach(function (d) {
        listMunicipios.push(d["name"])
    })

    // Mappings for constructing the election map
    mappingUF_MaisVotado = new Map()
    resultadoUF.forEach(function(d) {
        let nameCorrected = d.uf.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
        mappingUF_MaisVotado.set(nameCorrected, +d.numeroCandidatoMaisVotado)
    })

    mappingUF_VotosBolsonaro = new Map()
    resultadoUF.forEach(function(d) {
        let nameCorrected = d.uf.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
        mappingUF_VotosBolsonaro.set(nameCorrected, +d.percentBolsonaro)
    })

    mappingUF_VotosHaddad = new Map()
    resultadoUF.forEach(function(d) {
        let nameCorrected = d.uf.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
        mappingUF_VotosHaddad.set(nameCorrected, +d.percentHaddad)
    })

    let mapInstance = L.map('map').setView([-14.3739305,-63.2576349], 4.25)
    L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
                attribution:  `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,
 Map tiles by &copy; <a href="https://carto.com/attribution">CARTO</a>`,
                maxZoom: 18
                }).addTo(mapInstance)

    geoj = L.geoJson(geometryUF, {style: style, onEachFeature: onEachFeature}).addTo(mapInstance)

    // Crossfilter
    // Facts and dimensions about UFs
    facts = crossfilter(resultadoUF)
    ufDimension = facts.dimension(d => d['uf'])
    votosBolsonaroCount = ufDimension.group().reduceSum(function (d) {return d["percentBolsonaro"]})
    votosHaddadCount = ufDimension.group().reduceSum(function (d) {return d["percentHaddad"]})
    ufScale = d3.scaleOrdinal()
                .domain(listUFs)
    maisVotadoScale = d3.scaleOrdinal()
                        .domain([13, 17])
                        .range([haddadColor, bolsonaroColor])

    // dc.js barchart
    let barchart = new dc.BarChart("#bar1");
    barchart.width(barplot_width)
            .height(barplot_height)
            .dimension(ufDimension)
            .x(ufScale)
            .xUnits(dc.units.ordinal)
            .group(votosHaddadCount)
            .stack(votosBolsonaroCount)
            .margins({top: 10, right: 20, bottom: 20, left: 30})
            .elasticY(true)
            .renderHorizontalGridLines(true)
            .on("pretransition", function(chart) {
                chart.selectAll("g.stack rect.bar").style('fill', function (d) {
                    if (d.layer == 0) {
                        return haddadColor
                    }else {
                        return bolsonaroColor
                    }
                })
            });

    // Facts and dimensions about municípios
    let aux_resultadoMunicipio = []
    resultadoMunicipio.forEach(function(d) {
        aux_resultadoMunicipio.push({
            "nome": d.uf + "," + d.nome,
            "totalVotos": d.totalVotos,
            "percentHaddad": d.percentHaddad,
            "percentBolsonaro": d.percentBolsonaro
        })
    })
    facts2 = crossfilter(aux_resultadoMunicipio)
    municipioDimension = facts2.dimension(d => d['nome'])
    numeroVotosDimension = facts2.dimension(d => d['totalVotos'])
    console.log(numeroVotosDimension.top(5))
    let initialFilter = []
    numeroVotosDimension.top(5).forEach(function(d) {
        initialFilter.push(d.nome)
    })

    municipioVotosHaddad = municipioDimension.group().reduceSum(function(d) {return d.percentHaddad})
    municipioVotosBolsonaro = municipioDimension.group().reduceSum(function(d) {return d.percentBolsonaro})
    municipioScale = d3.scaleOrdinal().domain(initialFilter)
    municipioDimension.filterFunction(function(d) {
        return initialFilter.indexOf(d) > -1;
    })

    // dc.js barchart
    let barchart2 = new dc.BarChart("#bar2");
    barchart2.width(barplot_width)
             .height(barplot_height)
             .gap(100)
             .dimension(municipioDimension)
             .x(municipioScale)
             .xUnits(dc.units.ordinal)
             .group(municipioVotosHaddad)
             .stack(municipioVotosBolsonaro)
             .margins({top: 10, right: 20, bottom: 20, left: 30})
             .elasticY(true)
             .renderHorizontalGridLines(true)
             .on("pretransition", function(chart) {
                 chart.selectAll("g.stack rect.bar").style('fill', function (d) {
                     if (d.layer == 0) {
                         return haddadColor
                     }else {
                         return bolsonaroColor
                     }
                 })
             });
    
    dc.renderAll()
}


function highlightFeature(e) {
    let layer = e.target;
    console.log(e)
    //console.log(e.target)

    layer.setStyle({
                weight: 2,
                color: '#AAA',
                dashArray: '',
                fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    // info.update(layer.feature);
}


function resetHighlight(e) {
    geoj.resetStyle(e.target);
    // info.update();
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

function style(feature) {
    let uf = feature.properties.sigla.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    let color = "#E8E8E8"
    if (mappingUF_MaisVotado.get(uf) == 17)
      color = scaleBolsonaro(mappingUF_VotosBolsonaro.get(uf))
    else if (mappingUF_MaisVotado.get(uf) == 13)
      color = scaleHaddad(mappingUF_VotosHaddad.get(uf))
        return {
                   weight: 1,
                   opacity: 1,
                   color: 'white',
                   dashArray: '3',
                   fillOpacity: 0.6,
                   fillColor: color
               };
   }

// Workaround since dc + crossfilter does not support capping
// https://stackoverflow.com/questions/23953019/dc-js-group-top5-not-working-in-chart
function getTops(source_group) {
    return {
        all: function () {
            return source_group.top(5);
        }
    };
}
