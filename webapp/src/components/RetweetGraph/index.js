import React, { useEffect } from 'react';
import * as d3 from 'd3';
import useAxios from 'axios-hooks';
import { withTranslation } from 'react-i18next';
import Zoom from 'react-reveal/Zoom';

import { Svg, H1, GraphSection } from './style';

function RetweetGraph() {
  const [{ data, loading, error }, refetch] = useAxios(
    'https://gist.githubusercontent.com/dhannyell/b405174707a39252af5cc8981aec3aee/raw/be0c5c0fcfc790c50ba82b74cfcfe017d8b2d41a/standard_graph@1.json',
  );

  useEffect(() => {
    if (loading === false) {
      const width = 960;
      const height = 1000;

      const svg = d3
        .select('#area')
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

      const nodes = data.nodes;
      const links = data.links;

      function forceSimulation(nodes, links) {
        return d3
          .forceSimulation(nodes)
          .force(
            'link',
            d3
              .forceLink(links)
              .id((d) => d.username)
              .distance(50),
          )
          .force('charge', d3.forceManyBody().strength(-50).distanceMax(270))
          .force('center', d3.forceCenter());
      }

      const circleScale = d3
        .scaleSqrt()
        .domain(d3.extent(nodes, (d) => d.degree))
        .range([2, 20]);

      const link = svg
        .append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link');

      function drag(simulation) {
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
        return d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended);
      }

      const simulation = forceSimulation(nodes, links).on('tick', ticked);

      const orientationTypeScale = d3
        .scaleOrdinal()
        .domain(['Esquerda', 'Direita', 'Centro'])
        .range(['#941c1c', '#1a219c', '#9c8e19']);

      const node = svg
        .append('g')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', (d) => circleScale(d.degree))
        .call(drag(simulation))
        .attr('fill', (d) => orientationTypeScale(d['Orientação']));

      node
        .append('title')
        .text(
          (d) =>
            'Username: ' +
            d.username +
            '\n' +
            'Times Retweeted: ' +
            d.degree +
            '\n' +
            'Political Orientation: ' +
            d['Orientação'],
        );

      // Defina a função ticked
      function ticked() {
        // Reposicionando arestas
        link.attr('x1', (d) => d.source.x);
        link.attr('y1', (d) => d.source.y);
        link.attr('x2', (d) => d.target.x);
        link.attr('y2', (d) => d.target.y);

        // Reposicionando nós
        node.attr('cx', (d) => d.x);
        node.attr('cy', (d) => d.y);
      }
    }
  }, [loading]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <Zoom>
      <GraphSection>
        <H1>Grafo de Retweets - Política Brasileira</H1>
        <div className="barChart">
          <Svg id="area"></Svg>
        </div>
      </GraphSection>
    </Zoom>
  );
}

export default withTranslation()(RetweetGraph);
