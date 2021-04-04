const map_width = 500;
const map_height = 500;
const stacked_barplot_width = 700;
const stacked_barplot_height = 250;
const colorLeft = "#ef3b2c"
const colorRight = "#4292c6"
const colorCenter = "#fc9f30"

const svg2 = d3.select("#map")
               .append("svg")
               .attr("width", map_width)
               .attr("height", map_height);

scaleBolsonaro = d3.scaleQuantize()
                   .domain([0, 1])
                   .range(d3.schemeBlues[9]);


scaleHaddad = d3.scaleQuantize()
                .domain([0, 1])
                .range(d3.schemeReds[9]);

const nomeToSigla = {
    'Acre': 'AC',
    'Alagoas': 'AL',
    'Amapá': 'AP',
    'Amazonas': 'AM',
    'Bahia': 'BA',
    'Ceará': 'CE',
    'Distrito Federal': 'DF',
    'Espírito Santo': 'ES',
    'Goiás': 'GO',
    'Maranhão': 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    'Pará': 'PA',
    'Paraíba': 'PB',
    'Paraná': 'PR',
    'Pernambuco': 'PE',
    'Piauí': 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    'Rondônia': 'RO',
    'Roraima': 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    'Sergipe': 'SE',
    'Tocantins': 'TO'
}


let map_promises = [
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

Promise.all(map_promises).then(ready)

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

    let mapInstance = L.map('map').setView([-15,-57], 4)
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
                        .range([colorLeft, colorRight])

    // dc.js barchart
    let barchart = new dc.BarChart("#bar3");
    barchart.width(stacked_barplot_width)
            .height(stacked_barplot_height)
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
                        return colorLeft
                    }else {
                        return colorRight
                    }
                })
            });

    // Facts and dimensions about municípios
    aux_resultadoMunicipio = []
    resultadoMunicipio.forEach(function(d, i) {
        aux_resultadoMunicipio.push({
            "index": i,
            "uf": d.uf,
            "nome": d.uf + "," + d.nome,
            "totalVotos": d.totalVotos,
            "percentHaddad": d.percentHaddad,
            "percentBolsonaro": d.percentBolsonaro
        })
    })
    tmp_facts = crossfilter(aux_resultadoMunicipio)
    allMunicipioDimension = tmp_facts.dimension(d => d['nome'])
    numeroVotosDimension = tmp_facts.dimension(d => d['totalVotos'])
    let initialData = []
    numeroVotosDimension.top(5).forEach(function(d, i) {
        initialData.push({
            "index": i,
            "nome": d.nome,
            "totalVotos": d.totalVotos,
            "percentHaddad": d.percentHaddad,
            "percentBolsonaro": d.percentBolsonaro
        })
    })

    facts2 = crossfilter(initialData)
    municipioDimension = facts2.dimension(d => d['nome'])
    municipioVotosHaddad = municipioDimension.group().reduceSum(function(d) {return d.percentHaddad})
    municipioVotosBolsonaro = municipioDimension.group().reduceSum(function(d) {return d.percentBolsonaro})
    municipioScale = d3.scaleOrdinal().domain(municipioDimension)

    // dc.js barchart
    let barchart2 = new dc.BarChart("#bar4");
    barchart2.width(stacked_barplot_width)
             .height(stacked_barplot_height)
             .gap(50)
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
                         return colorLeft
                     } else {
                         return colorRight
                     }
                 })
             });
             
    
    dc.renderAll()
}


function highlightFeature(e) {
    let layer = e.target;
    let overState = nomeToSigla[layer.feature.properties.name]
    document.getElementById("barHeader2").innerHTML = `5 Municípios com mais votos: ${layer.feature.properties.name}`

    let allMunicipios_fromState = []
    aux_resultadoMunicipio.forEach(function(d) {
        if (d.uf.toUpperCase() == overState) {
            allMunicipios_fromState.push({
                "uf": d.uf.toUpperCase(),
                "nome": d.nome,
                "totalVotos": d.totalVotos,
                "percentHaddad": d.percentHaddad,
                "percentBolsonaro": d.percentBolsonaro            
            })
        }
    })

    localFacts = crossfilter(allMunicipios_fromState)
    localDim = localFacts.dimension(d => d['totalVotos'])

    let initialData = []
    localDim.top(5).forEach(function(d, i) {
        initialData.push({
            "index": i,
            "nome": d.nome,
            "totalVotos": d.totalVotos,
            "percentHaddad": d.percentHaddad,
            "percentBolsonaro": d.percentBolsonaro
        })
    })

    facts2 = crossfilter(initialData)
    municipioDimension = facts2.dimension(d => d['nome'])
    municipioVotosHaddad = municipioDimension.group().reduceSum(function(d) {return d.percentHaddad})
    municipioVotosBolsonaro = municipioDimension.group().reduceSum(function(d) {return d.percentBolsonaro})
    municipioScale = d3.scaleOrdinal().domain(municipioDimension)
    let barchart2 = new dc.BarChart("#bar4");
    barchart2.width(stacked_barplot_width)
             .height(stacked_barplot_height)
             .gap(50)
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
                         return colorLeft
                     } else {
                         return colorRight
                     }
                 })
             });
    dc.renderAll();

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


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature
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

function padronizeString(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
}