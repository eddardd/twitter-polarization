import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import deputadosData from '../../assets/deputadosData.json';

import { GraphSection, Container } from './styles';

function BubblePainel() {
  const [radiusValue, setRadiosValue] = useState(3);
  const [heightValue, setHeightValue] = useState(500);

  const width = 1200;
  const noSplitHeight = 500;
  const splitHeight = 2000;
  const margin = { top: 30, right: 30, left: 100, bottom: 30 };

  const color = d3
    .scaleOrdinal()
    .domain(['Esquerda', 'Centro', 'Direita'])
    .range(['#E58597', '#A2ADD6', '#47B58D']);

  const x = d3
    .scalePoint()
    .domain(['Esquerda', 'Centro', 'Direita'])
    .padding(0.1)
    .range([30, 850])
    .round(true);

  const y = d3.scaleBand().domain(['Todos']).range([noSplitHeight, 0]);

  const yAxis = (g) =>
    g
      .call(d3.axisLeft(y).ticks(8))
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').remove())
      .attr('y', 1000);

  const xAxis = (g) =>
    g
      .call(d3.axisTop(x).tickFormat((d) => d))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', 1000)
          .attr('y', 300)
          .attr('font-weight', 'bold')
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'end'),
      );

  const r = d3
    .scaleSqrt()
    .domain(d3.extent(deputadosData, (d) => d.votos))
    .range([3, 3]);

  const force = d3
    .forceSimulation(deputadosData)
    .force('charge', d3.forceManyBody().strength(0))
    .force(
      'x',
      d3.forceX().x((d) => {
        switch (d.ideologia) {
          case 'Esquerda':
            return Math.floor(Math.random() * (350 - 50 + 1)) + 50;
            break;
          case 'Centro':
            return Math.floor(Math.random() * (550 - 380 + 1)) + 380;
            break;
          case 'Direita':
            return Math.floor(Math.random() * (860 - 580 + 1)) + 580;
            break;
        }
      }),
    )
    .force(
      'collision',
      d3.forceCollide().radius((d) => r(d.votos) + 1),
    )
    .force(
      'y',
      d3.forceY((d) => y(d.partido)),
    );

  const svg = d3
    .select('#bubble')
    .attr('viewBox', [0, 0, width, noSplitHeight + margin.top + margin.bottom]);

  const wrapper = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  wrapper.append('g').call(xAxis);

  const yAxisContainer = wrapper
    .append('g')
    .attr('transform', `translate(-10,10)`);

  console.log(r('22263'));

  console.log(svg.nodes());

  useEffect(() => {
    if (radiusValue !== 3) {
      let height = radiusValue ? splitHeight : noSplitHeight;
      let partidos = [...deputadosData.keys()].sort();

      setHeightValue(height);
      console.log(height);

      yAxisContainer
        .call(yAxis, y, radiusValue ? partidos : ['Todos'])
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick line').remove());

      y.domain(radiusValue ? partidos : ['Todos']);
      y.range(
        radiusValue
          ? [splitHeight - margin.top - margin.bottom, 0]
          : [noSplitHeight - margin.top - margin.bottom, 0],
      );
      yAxisContainer
        .call(yAxis, y, radiusValue ? partidos : ['Todos'])
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick line').remove());

      force.force(
        'y',
        radiusValue
          ? d3.forceY((d) => y(d.partido) + 45)
          : d3.forceY((noSplitHeight - margin.top - margin.bottom) / 2),
      );

      force.alpha(1).restart();
    }
  }, [radiusValue]);

  function handleChange(e) {
    setRadiosValue(false);
    const split = false;
    return Object.assign(svg.node(), {
      update(split) {
        console.log(svg);
      },
    });
  }

  function handleChange1(e) {
    setRadiosValue(true);
  }

  return (
    <>
      <Container></Container>
    </>
  );
}

export default BubblePainel;
