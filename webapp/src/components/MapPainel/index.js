import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import crossfilter from 'crossfilter2';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as dc from 'dc';
import { GraphSection, FlexContainer, SpanHighlight } from './styles';

import { Fade } from 'react-reveal';

import geo from '../../assets/brazil_geo.json';

function MapPainel() {
  const [resultadoMunicipio, setResultadoMunicipio] = useState([]);
  const [resultadoUF, setResultadoUF] = useState([]);
  const [geometryUF, setGeometryUF] = useState([]);

  const [mappingUFMaisVotado, setMappingUFMaisVotado] = useState(false);
  const [mappingUFVotosBolsonaro, setMappingUFVotosBolsonaro] = useState(false);
  const [mappingUFVotosHaddad, setMappingUFVotosHaddad] = useState(false);

  const [layerName, setLayerName] = useState('');
  const [auxResultadoMunicipio, setAuxResultadoMunicipio] = useState(false);

  const scaleBolsonaro = d3
    .scaleQuantize()
    .domain([0, 1])
    .range(d3.schemeBlues[9]);

  const scaleHaddad = d3.scaleQuantize().domain([0, 1]).range(d3.schemeReds[9]);

  const bolsonaroColor = '#4292c6';
  const haddadColor = '#ef3b2c';

  const nomeToSigla = {
    Acre: 'AC',
    Alagoas: 'AL',
    Amapá: 'AP',
    Amazonas: 'AM',
    Bahia: 'BA',
    Ceará: 'CE',
    'Distrito Federal': 'DF',
    'Espírito Santo': 'ES',
    Goiás: 'GO',
    Maranhão: 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    Pará: 'PA',
    Paraíba: 'PB',
    Paraná: 'PR',
    Pernambuco: 'PE',
    Piauí: 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    Rondônia: 'RO',
    Roraima: 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    Sergipe: 'SE',
    Tocantins: 'TO',
  };

  useEffect(() => {
    d3.csv('/twitter-polarization/data/Eleicoes2018SegundoTurno.csv').then(
      (data) => {
        data.forEach((d) => {
          d.totalVotos = +d.totalVotos;
          d.percentHaddad = +d.percentHaddad;
          d.percentBolsonaro = +d.percentBolsonaro;
          d.numeroCandidatoMaisVotado = +d.numeroCandidatoMaisVotado;
        });

        setResultadoMunicipio(data);
      },
    );

    d3.csv('/twitter-polarization/data/ResultadoUFEleicoes2018.csv').then(
      (data) => {
        data.forEach(function (d) {
          d.percentHaddad = +d.percentHaddad;
          d.percentBolsonaro = +d.percentBolsonaro;
          d.numeroCandidatoMaisVotado = +d.numeroCandidatoMaisVotado;
        });

        setResultadoUF(data);
      },
    );

    d3.json('/twitter-polarization/data/brazil_geo.json').then((data) => {
      setGeometryUF(data);
    });
  }, []);

  useEffect(() => {
    if (
      resultadoMunicipio.length === 5570 &&
      resultadoUF.length === 28 &&
      geometryUF
    ) {
      let listUFs = [];
      resultadoUF.forEach(function (d) {
        listUFs.push(d['uf']);
      });

      let listMunicipios = [];
      resultadoMunicipio.forEach(function (d) {
        listMunicipios.push(d['name']);
      });

      // Mappings for constructing the election map
      const mappingUF_MaisVotado = new Map();
      resultadoUF.forEach(function (d) {
        let nameCorrected = d.uf
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
        mappingUF_MaisVotado.set(nameCorrected, +d.numeroCandidatoMaisVotado);
      });

      setMappingUFMaisVotado(mappingUF_MaisVotado);

      const mappingUF_VotosBolsonaro = new Map();
      resultadoUF.forEach(function (d) {
        let nameCorrected = d.uf
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
        mappingUF_VotosBolsonaro.set(nameCorrected, +d.percentBolsonaro);
      });

      setMappingUFVotosBolsonaro(mappingUF_VotosBolsonaro);

      const mappingUF_VotosHaddad = new Map();
      resultadoUF.forEach(function (d) {
        let nameCorrected = d.uf
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
        mappingUF_VotosHaddad.set(nameCorrected, +d.percentHaddad);
      });

      setMappingUFVotosHaddad(mappingUF_VotosHaddad);

      const facts = crossfilter(resultadoUF);
      const ufDimension = facts.dimension((d) => d['uf']);
      const votosBolsonaroCount = ufDimension.group().reduceSum(function (d) {
        return d['percentBolsonaro'];
      });

      const votosHaddadCount = ufDimension.group().reduceSum(function (d) {
        return d['percentHaddad'];
      });
      const ufScale = d3.scaleOrdinal().domain(listUFs);
      const maisVotadoScale = d3
        .scaleOrdinal()
        .domain([13, 17])
        .range([haddadColor, bolsonaroColor]);

      let barchart = new dc.BarChart('#bar1');
      barchart
        .dimension(ufDimension)
        .x(ufScale)
        .xUnits(dc.units.ordinal)
        .group(votosHaddadCount)
        .stack(votosBolsonaroCount)
        .margins({ top: 10, right: 20, bottom: 20, left: 30 })
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .on('pretransition', function (chart) {
          chart.selectAll('g.stack rect.bar').style('fill', function (d) {
            if (d.layer == 0) {
              return haddadColor;
            } else {
              return bolsonaroColor;
            }
          });
        });

      const aux_resultadoMunicipio = [];
      resultadoMunicipio.forEach(function (d, i) {
        aux_resultadoMunicipio.push({
          index: i,
          uf: d.uf,
          nome: d.uf + ',' + d.nome,
          totalVotos: d.totalVotos,
          percentHaddad: d.percentHaddad,
          percentBolsonaro: d.percentBolsonaro,
        });
      });

      setAuxResultadoMunicipio(aux_resultadoMunicipio);

      const tmp_facts = crossfilter(aux_resultadoMunicipio);
      const allMunicipioDimension = tmp_facts.dimension((d) => d['nome']);
      const numeroVotosDimension = tmp_facts.dimension((d) => d['totalVotos']);

      let initialData = [];
      numeroVotosDimension.top(5).forEach(function (d, i) {
        initialData.push({
          index: i,
          nome: d.nome,
          totalVotos: d.totalVotos,
          percentHaddad: d.percentHaddad,
          percentBolsonaro: d.percentBolsonaro,
        });
      });

      const facts2 = crossfilter(initialData);
      const municipioDimension = facts2.dimension((d) => d['nome']);
      const municipioVotosHaddad = municipioDimension
        .group()
        .reduceSum(function (d) {
          return d.percentHaddad;
        });
      const municipioVotosBolsonaro = municipioDimension
        .group()
        .reduceSum(function (d) {
          return d.percentBolsonaro;
        });
      const municipioScale = d3.scaleOrdinal().domain(municipioDimension);

      let barchart2 = new dc.BarChart('#bar2');
      barchart2
        .gap(50)
        .dimension(municipioDimension)
        .x(municipioScale)
        .xUnits(dc.units.ordinal)
        .group(municipioVotosHaddad)
        .stack(municipioVotosBolsonaro)
        .margins({ top: 10, right: 20, bottom: 20, left: 30 })
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .on('pretransition', function (chart) {
          chart.selectAll('g.stack rect.bar').style('fill', function (d) {
            if (d.layer == 0) {
              return haddadColor;
            } else {
              return bolsonaroColor;
            }
          });
        });

      dc.renderAll();
    }
  }, [resultadoMunicipio, resultadoUF, geometryUF]);

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  }

  function highlightFeature(e) {
    let layer = e.target;
    let overState = nomeToSigla[layer.feature.properties.name];
    setLayerName(layer.feature.properties.name);

    let allMunicipios_fromState = [];
    auxResultadoMunicipio.forEach(function (d) {
      if (d.uf.toUpperCase() == overState) {
        allMunicipios_fromState.push({
          uf: d.uf.toUpperCase(),
          nome: d.nome,
          totalVotos: d.totalVotos,
          percentHaddad: d.percentHaddad,
          percentBolsonaro: d.percentBolsonaro,
        });
      }
    });

    const localFacts = crossfilter(allMunicipios_fromState);
    const localDim = localFacts.dimension((d) => d['totalVotos']);

    let initialData = [];
    localDim.top(5).forEach(function (d, i) {
      initialData.push({
        index: i,
        nome: d.nome,
        totalVotos: d.totalVotos,
        percentHaddad: d.percentHaddad,
        percentBolsonaro: d.percentBolsonaro,
      });
    });

    const facts2 = crossfilter(initialData);
    const municipioDimension = facts2.dimension((d) => d['nome']);
    const municipioVotosHaddad = municipioDimension
      .group()
      .reduceSum(function (d) {
        return d.percentHaddad;
      });
    const municipioVotosBolsonaro = municipioDimension
      .group()
      .reduceSum(function (d) {
        return d.percentBolsonaro;
      });
    const municipioScale = d3.scaleOrdinal().domain(municipioDimension);
    let barchart2 = new dc.BarChart('#bar2');
    barchart2
      .gap(50)
      .dimension(municipioDimension)
      .x(municipioScale)
      .xUnits(dc.units.ordinal)
      .group(municipioVotosHaddad)
      .stack(municipioVotosBolsonaro)
      .margins({ top: 10, right: 20, bottom: 20, left: 30 })
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .on('pretransition', function (chart) {
        chart.selectAll('g.stack rect.bar').style('fill', function (d) {
          if (d.layer == 0) {
            return haddadColor;
          } else {
            return bolsonaroColor;
          }
        });
      });
    dc.renderAll();

    layer.setStyle({
      weight: 2,
      color: '#AAA',
      dashArray: '',
      fillOpacity: 0.7,
    });
  }

  function resetHighlight(e) {
    var layer = e.target;
    layer.setStyle({ color: '#fff' });
  }

  function UnitsBar() {
    return d3.scaleOrdinal().domain(listUFs);
  }

  return (
    <>
      <Fade>
        <GraphSection>
          <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
            “A função do (visualizador de dados) é lembrar à sociedade aquilo
            que ela quer esquecer”, adaptado de Peter Burke
          </p>
          <h4 style={{ textAlign: 'center' }}>
            Polarização na Política Brasileira: 2018 - 2021
          </h4>
          <p>
            O presente trabalho busca explorar através de visualização de dados
            como os agentes políticos têm se polarizado no espectro político
            direita-esquerda. Para tanto, exploramos três eixos temáticos,
          </p>
          <ul>
            <li>1. Análise das eleições de 2018</li>
            <li>
              2. Análise das bancadas da câmara dos deputados, por partido e
              ideologia
            </li>
            <li>
              3. Análise do comportamento de agentes políticos nas redes sociais
            </li>
          </ul>

          <h2 style={{ textAlign: 'center' }}>
            Eleições Presidenciais de 2018
          </h2>
          <p>
            Nesta seção, analisamos a votação ocorrida no segundo turno das
            eleições presidenciais de 2018. Os dados foram obtidos à partir de
            <a href="#ref"> [1]</a>, por município, e foram agrupados por estado
            da federação, incluindo votos no exterior (sigla "zz"). O cenário
            político de 2018 foi bastante turbulento, e diversos fatores
            convergiram para a polarização política que culminou na eleição do
            atual presidente Jair Bolsonaro (sem partido). Entre estes,
            ressaltamos os seguintes,
          </p>

          <ul>
            <li>
              1. Atuação de um susposto Gabinete do Ódio para a{' '}
              <SpanHighlight>disseminação de fake news</SpanHighlight> em favor
              do então candidato Jair Bolsonaro <a href="#ref"> [2]</a>,{' '}
              <a href="#ref"> [3]</a>
            </li>
            <li>
              2. Um{' '}
              <SpanHighlight>
                cansaço generalizado de boa parte da população brasileira
              </SpanHighlight>
              com a proposta política, e com a ideologia representada pelo
              Partido dos Trabalhadores (PT) <a href="#ref"> [4]</a>.
            </li>
          </ul>
          <p>
            Os fatores apresentados na lista anterior culminaram num país
            dividido (como mostrado no mapa abaixo). De um lado, as regiões
            norte, centro-oeste, sul e sudeste aderiram, em sua maioria, ao
            programa de governo apresentado por Jair Bolsonaro, enquanto o
            nordeste permaneceu em sua totalidade com o candidato pelo PT,
            Fernando Haddad. Em contra-partida à argumentos xenófobos, que visam
            mostrar um nordeste dependente do assistencialismo herdado pelos
            governos Lula e Dilma (2002 à 2016), o nordeste tem se mostrado um
            "Cinturão de Esquerda"
            <a href="#ref"> [5]</a>. Isso é, sobretudo, refletido pela eleição
            de governantes de orientação de esquerda na história recente. Para
            citar alguns: Cid Gomes (PDT-CE), Camilo Santana (PT-CE), Flávio
            Dino (PCdoB - MA) e Rui Costa (PT-BA).
          </p>
          <FlexContainer>
            <div className="left">
              <MapContainer
                className="markercluster-map"
                center={[-14.4107911, -48.9010266]}
                zoom={4}
                zoomControl={false}
                minZoom={4}
                maxZoom={4}
              >
                {mappingUFMaisVotado && (
                  <GeoJSON
                    data={geo.features}
                    style={(feature) => {
                      let color = '#E8E8E8';
                      let uf = feature.properties.sigla
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toUpperCase();

                      if (mappingUFMaisVotado.get(uf) == 17)
                        color = scaleBolsonaro(mappingUFVotosBolsonaro.get(uf));
                      else if (mappingUFMaisVotado.get(uf) == 13)
                        color = scaleHaddad(mappingUFVotosHaddad.get(uf));
                      return {
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.6,
                        fillColor: color,
                      };
                    }}
                    onEachFeature={onEachFeature}
                  />
                )}
                <TileLayer
                  url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,
 Map tiles by &copy; <a href="https://carto.com/attribution">CARTO</a>'
                  maxZoom={18}
                />
              </MapContainer>
            </div>
            <div className="right">
              <div id="bar1">
                <h2 id="barHeader1">Percentual de votos por Estado</h2>
              </div>
              <h2>{layerName}</h2> <div id="bar2"></div>
            </div>
          </FlexContainer>
        </GraphSection>
      </Fade>
    </>
  );
}

export default MapPainel;
