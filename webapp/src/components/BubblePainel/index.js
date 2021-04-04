import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import deputadosData from '../../assets/deputadosData.json';

import { GraphSection } from './styles';

function BubblePainel() {
  const [radiosValue, setRadiosValue] = useState(0);
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

  console.log('y');
  console.log(y('PT'));

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

  useEffect(() => {
    const svg = d3
      .select('#bubble')
      .attr('viewBox', [
        0,
        0,
        width,
        noSplitHeight + margin.top + margin.bottom,
      ]);

    const wrapper = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    wrapper.append('g').call(xAxis);
    const yAxisContainer = wrapper
      .append('g')
      .attr('transform', `translate(-10,10)`);

    console.log(r('22263'));
    const circles = wrapper
      .append('g')
      .attr('className', 'circles')
      .selectAll('circle')
      .data(deputadosData)
      .join('circle')
      .attr('r', (d) => r(d.votos))
      .attr('fill', (d) => color(d.ideologia))
      .attr('x', (d) => Math.floor(Math.random() * 100));

    force.on('tick', () => {
      circles
        .transition()
        .ease(d3.easeLinear)
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
    });

    console.log(force);
    return Object.assign(svg.node(), {
      update(split) {
        y.domain(split ? partidos : ['Todos']);
      },
    });
  }, []);

  function update(split) {}

  function handleChange() {
    setRadiosValue(1);
  }

  return (
    <>
      <label>
        <input type={'radio'} name={'split'} /> Todos
      </label>
      <label>
        <input type={'radio'} name={'split'} /> Por Partido
      </label>
      <svg id="bubble"></svg>
    </>
  );
}

export default BubblePainel;
