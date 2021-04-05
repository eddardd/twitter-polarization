const bubble_width = 500;
const bubble_height = 500;
const noSplitHeight = 500;
const splitHeight = 2000;
const bubble_margin = ({top: 30, right: 30, left: 100, bottom: 30})

const svg3 = d3.select("#bubblechart")
               .append("svg")
               .attr("width", bubble_width)
               .attr("height", bubble_height)
               .attr('viewBox',[0,0,width, noSplitHeight + bubble_margin.top + bubble_margin.bottom]);

const wrapper = svg.append('g')
                   .attr('transform', `translate(${bubble_margin.left}, ${bubble_margin.top})`);

const bubble_color = d3.scaleOrdinal()
                       .domain(["Esquerda", "Centro", "Direita"])
                       .range([colorLeft, colorCenter, colorRight])

let bubble_promises = [
    d3.csv('./data/deputados.csv').then(function(data) {
        data.forEach(function(d){
            return {
                nome: d.Nome,
                partido: d.Partido
            }
        })
        return data;
    }),
    d3.csv('./data/IdeologiaPartidos.csv').then(function(data) {
        data.forEach(function(d) {
            return {
                partido: d.Partido,
                ideologia: d.ideologia
            }
        })
        return data;
    }),
    d3.csv('./data/deputados_votos.csv').then(function(data) {
        data.forEach(function(d) {
            return {
                nome: d.Nome,
                partido: d.Partido,
                estado: d.Estado,
                votosRecebidos: d.votos_totalizados,
                votosTotais: d.total_de_votos,
                ideologia: d.Ideologia
              }
        })
        return data;
      }),
      d3.csv('./data/percent_estado.csv')
]

Promise.all(bubble_promises).then(ready)

function ready(us) {
    let deputadosData = us[0]
    let ideologiaPartidos = us[1]
    let votosData = us[2]
    let percentData = us[3]

    let groupData = deputadosData.map(d => {
        let partidoDeputado = ''
        let votosNumber = 0;
        let estadoDeputado = ''
        const result = ideologiaPartidos.find(element => element.partido === d.partido)
        const votos = votosData.find(function(element) {
            return element.Nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === d.nome
        })
        if(typeof(votos) !== 'undefined'){
          votosNumber = votos.votosRecebidos
          partidoDeputado = votos.partido
          estadoDeputado = votos.estado
        }
        return {nome: d.nome, partido: d.partido, estado: estadoDeputado, ideologia: result.ideologia, votos: votosNumber, partido: partidoDeputado}
      })
    let groupEstado = d3.group(groupData, d => d.estado)
    let groupPartido = d3.group(groupData, d => d.partido)

    let r = d3.scaleSqrt()
              .domain(d3.extent(groupData, d => d.votos))
              .range([3, 8])

    let y = d3.scaleBand()
              .domain(['Todos'])
              .range([noSplitHeight, 0])
    let x = d3.scalePoint().domain(['Esquerda', 'Centro', 'Direita']).padding(0.1).range([30, 850]).round(true)
    let xAxis = g => g
            .call(d3.axisTop(x)
                    .tickFormat(d => d))
            .call(g => g.select('.domain').remove())
            .call(g => g.append('text')
                .attr('x', 1000)
                .attr('y', 300)
                .attr('font-weight', 'bold')
                .attr('fill', 'currentColor')
                .attr('text-anchor', 'end'))

    let yAxis = g => g
        .call(d3.axisLeft(y).ticks(8))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').remove())
        .attr('y', 1000)

    force = d3.forceSimulation(groupData)
              .force('charge', d3.forceManyBody().strength(0))
              .force('x', d3.forceX().x(d => {
              switch(d.ideologia){
                    case 'Esquerda':
                    return Math.floor(Math.random() * (350 - 50 + 1)) + 50
                    break;
                    case 'Centro':
                    return Math.floor(Math.random() * (550 - 380 + 1)) + 380
                    break;
                    case 'Direita':
                    return Math.floor(Math.random() * (860 - 580 + 1)) + 580
                    break;
                 }}))
              .force('y', d3.forceY(d => y(d.partido)))
              .force('collision', d3.forceCollide().radius(d => r(d.votos) + 1))

    wrapper.append('g')
           .call(xAxis)
    
    let yAxisContainer = wrapper.append('g')
                                .attr('transform', `translate(-10,10)`);

    let circles = wrapper.append('g')
                         .attr('className', 'circles')
                         .selectAll('circle')
                         .data(groupData)
                         .join('circle')
                         .attr('r', d => r(d.votos)) 
                         .attr('fill', d => bubble_color(d.ideologia))
                         .attr('x', d => Math.floor(Math.random() * 100))
                         .attr('y', d => y(d.partido))
                         .call(text => text.append('title').text(d => d.nome + '\nIdeologia: '  + d.ideologia + '\nPartido: ' + d.partido + '\nEstado: ' + d.estado))
    
    force.on('tick', () => {
    circles
        .transition()
        .ease(d3.easeLinear)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    })

    invalidation.then(() => force.stop());
    return Object.assign(svg.node(), {
      update(split) {
        let height = split ? splitHeight : noSplitHeight;
        let partidos = [...groupPartido.keys()].sort()
        
        const t = d3.transition().duration(750);
        svg.transition(t).attr('viewBox', [0, 0, bubble_width, bubble_height]);
        
        y.domain(split ? partidos : ['Todos']);
        y.range(split ? [splitHeight - margin.top - margin.bottom, 0] : [noSplitHeight - margin.top - margin.bottom, 0]);
        
        yAxisContainer.call(yAxis, y, split ? partidos : ['Todos'])
                      .call(g => g.select('.domain').remove())
                      .call(g => g.selectAll('.tick line').remove());
        
        
        force.force('y', split ? d3.forceY(d => y(d.partido) + 45) :
                                 d3.forceY((noSplitHeight - margin.top - margin.bottom) / 2));
        
        force.alpha(1).restart();
        
        console.log(height)
      }
    })
}