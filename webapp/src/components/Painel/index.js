import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import crossfilter from 'crossfilter2';
import useAxios from 'axios-hooks';
import * as dc from 'dc';
import { ChartContext, BarChart } from 'react-dc-js';

import { Container, GraphSection, Svg } from './styles';

function Painel() {
  const [{ response, loading, error }, refetch] = useAxios(
    'https://gist.githubusercontent.com/dhannyell/f4453995758ea516ed637fd00b9da2f4/raw/2feb69a9dc9b3c1c4166c1ed41c2b4b2f6134c0a/hierarchical_graph.json',
  );

  const [
    { response: response2, loading: loading2, error2 },
    refetch2,
  ] = useAxios(
    'https://gist.githubusercontent.com/dhannyell/b405174707a39252af5cc8981aec3aee/raw/78945dda256ca9afbbef38c91aeb7a8f2e113035/standard_graph@1.json',
  );

  const [allRetweets, setAllRetweets] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [facts1, setFacts1] = useState([]);
  const [ideologyDimension1, setIdeologyDimension1] = useState([]);
  const [ideologyCount1, setIdeologyCount1] = useState([]);

  const [facts2, setFacts2] = useState([]);
  const [ideologyDimension2, setIdeologyDimension2] = useState([]);
  const [ideologyCount2, setIdeologyCount2] = useState([]);

  const [selectedName, setSelectedName] = useState('');

  const width = 954;
  const height = 800;
  const barplot_width = 300;
  const barplot_height = 150;
  const radius = width / 2;
  const colorin = '#00f';
  const colorout = '#f00';
  const colornone = '#ccc';

  const orientationTypeScale = d3
    .scaleOrdinal()
    .domain(['Esquerda', 'Direita', 'Centro'])
    .range(['#941c1c', '#1a219c', '#9c8e19']);

  function id(node) {
    return `${node.parent ? id(node.parent) + '.' : ''}${node.data.name}`;
  }

  function bilink(root) {
    const map = new Map(root.leaves().map((d) => [id(d), d]));
    for (const d of root.leaves())
      (d.incoming = []),
        (d.outgoing = d.data.imports.map((i) => [d, map.get(i)]));
    for (const d of root.leaves())
      for (const o of d.outgoing) o[1].incoming.push(o);
    return root;
  }

  function hierarchy(data, delimiter = '.') {
    let root;
    console.log(data);
    const map = new Map();
    data.forEach(function find(data) {
      const { name } = data;
      if (map.has(name)) return map.get(name);
      const i = name.lastIndexOf(delimiter);
      map.set(name, data);
      if (i >= 0) {
        find({ name: name.substring(0, i), children: [] }).children.push(data);
        data.name = name.substring(i + 1);
      } else {
        root = data;
      }
      return data;
    });
    return root;
  }

  useEffect(() => {
    if (loading2 === false) {
      const all_retweets = response2.data.links;
      setAllRetweets(all_retweets);

      const all_users = response2.data.nodes;
      setAllUsers(all_users);

      let facts1 = crossfilter(all_users);
      setFacts1(facts1);

      let ideologyDimension1 = facts1.dimension((d) => d['Ideology']);
      setIdeologyDimension1(ideologyDimension1);

      let nameDimension1 = facts1.dimension((d) => d['username']);
      //setNameDimension1(nameDimension1);
      let ideologyCount1 = ideologyDimension1.group();
      setIdeologyCount1(ideologyCount1);

      let facts2 = crossfilter(all_users);
      setFacts2(facts2);
      let ideologyDimension2 = facts2.dimension((d) => d['Ideology']);
      setIdeologyDimension2(ideologyDimension2);
      let nameDimension2 = facts2.dimension((d) => d['username']);
      //setNameDimension2(nameDimension2);
      let ideologyCount2 = ideologyDimension2.group();
      setIdeologyCount2(ideologyCount2);
    }
  }, [loading2]);

  useEffect(() => {
    if (allRetweets.length > 0 && loading === false) {
      console.log(response2);
      const colorin = '#00f';
      const colornone = '#ccc';
      const colorout = '#f00';
      const orientationTypeScale = d3
        .scaleOrdinal()
        .domain(['Esquerda', 'Direita', 'Centro'])
        .range(['#941c1c', '#1a219c', '#9c8e19']);

      const data = hierarchy(response.data);

      const line = d3
        .lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius((d) => d.y)
        .angle((d) => d.x);

      const tree = d3.cluster().size([2 * Math.PI, radius - 100]);

      const root = tree(
        bilink(
          d3
            .hierarchy(data)
            .sort(
              (a, b) =>
                d3.ascending(a.height, b.height) ||
                d3.ascending(a.data.name, b.data.name),
            ),
        ),
      );

      let nameDimension1 = facts1.dimension((d) => d['username']);
      let nameDimension2 = facts2.dimension((d) => d['username']);

      const svg = d3
        .select('#hierarchical')
        .attr('viewBox', [-width / 2, -width / 2, width, width]);

      let y = d3.scaleLinear().domain([0, 60]).range([barplot_height, 0]);
      const node = svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr(
          'transform',
          (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`,
        )
        .append('text')
        .attr('dy', '0.31em')
        .attr('x', (d) => (d.x < Math.PI ? 6 : -6))
        .attr('text-anchor', (d) => (d.x < Math.PI ? 'start' : 'end'))
        .attr('transform', (d) => (d.x >= Math.PI ? 'rotate(180)' : null))
        .text((d) => d.data.name)
        .attr('fill', (d) => orientationTypeScale(d.data['Ideology']))
        .each(function (d) {
          d.text = this;
        })
        .on('click', selection_fn)
        .call((text) =>
          text.append('title').text(
            (d) => `${d.data.name}
                        Retweeted by ${d.outgoing.length} users
                        Retweeted ${d.incoming.length} users`,
          ),
        );

      const link = svg
        .append('g')
        .attr('stroke', colornone)
        .attr('fill', 'none')
        .selectAll('path')
        .data(root.leaves().flatMap((leaf) => leaf.outgoing))
        .join('path')
        .style('mix-blend-mode', 'multiply')
        .attr('d', ([i, o]) => line(i.path(o)))
        .each(function (d) {
          d.path = this;
        });

      function getRetweetedUsers(who_user_retweeted) {
        let usernames = [];
        who_user_retweeted.forEach(function (u) {
          usernames.push(u.split('.')[2]);
        });

        return usernames;
      }

      function getWhoRetweetedUser(user) {
        let users_who_retweet = [];
        allRetweets.forEach(function (link) {
          if (link['target'] == user) {
            users_who_retweet.push(link['source']);
          }
        });

        return users_who_retweet;
      }

      function selection_fn(d, event) {
        if (d.data.selected) {
          d.data.selected = false;
          link.style('mix-blend-mode', 'multiply');
          d3.select(this).attr('font-weight', null);
          d3.select(this).attr(
            'fill',
            orientationTypeScale(d.data['Ideology']),
          );
          d3.selectAll(d.incoming.map((d) => d.path)).attr('stroke', null);
          d3.selectAll(d.outgoing.map((d) => d.path)).attr('stroke', null);
          d3.selectAll(d.incoming.map(([d]) => d.text)).attr(
            'font-weight',
            null,
          );
          d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr(
            'font-weight',
            null,
          );
        } else {
          setSelectedName(d.data.name);
          d.data.selected = true;
          link.style('mix-blend-mode', null);
          d3.select(this).attr('font-weight', 'bold');
          d3.select(this).attr('fill', '#000');
          d3.selectAll(d.incoming.map((d) => d.path))
            .attr('stroke', colorin)
            .raise();
          d3.selectAll(d.outgoing.map((d) => d.path))
            .attr('stroke', colorout)
            .raise();
          d3.selectAll(d.incoming.map(([d]) => d.text)).attr(
            'font-weight',
            'bold',
          );
          d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr(
            'font-weight',
            'bold',
          );
        }

        let retweeted_usernames = getRetweetedUsers(d.data.imports);
        let users_who_retweet = getWhoRetweetedUser(d.data['name']);
        console.log(retweeted_usernames);
        console.log(users_who_retweet);

        nameDimension1.filterFunction(function (d) {
          return retweeted_usernames.indexOf(d) > -1;
        });

        nameDimension2.filterFunction(function (d) {
          return users_who_retweet.indexOf(d) > -1;
        });
        dc.renderAll();
      }
    }
  }, [allRetweets, loading]);

  if (loading || loading2) {
    return <h1>Loading Data...</h1>;
  }
  if (error) return <p>Error!</p>;

  function importImage() {
    const image = '../../assets/images/_pinheira.jpg';
    return image;
  }

  return (
    <>
      {allRetweets.length > 100 ? (
        <GraphSection>
          <Container>
            <div className="left">
              <Svg id="hierarchical"></Svg>
            </div>
            <div className="right">
              <div className="userInfo">
                <p>Ideologia de quem retuitou @{selectedName}</p>
                <img src={`/images/${selectedName}.jpg`} alt={selectedName} />
              </div>
              <div className="charts">
                <BarChart
                  dimension={ideologyDimension1}
                  group={ideologyCount1}
                  x={orientationTypeScale}
                  xUnits={dc.units.ordinal}
                  elasticY={true}
                  margins={{ top: 10, right: 20, bottom: 20, left: 30 }}
                  renderHorizontalGridLines={true}
                  colorAccessor={(d) => d.key}
                />
                <div className="userInfo">
                  <p>Ideologia dos retuitados por @{selectedName}</p>
                </div>
                <BarChart
                  dimension={ideologyDimension2}
                  group={ideologyCount2}
                  x={orientationTypeScale}
                  xUnits={dc.units.ordinal}
                  elasticY={true}
                  margin={{ top: 10, right: 20, bottom: 20, left: 30 }}
                  renderHorizontalGridLines={true}
                  colorAccessor={(d) => d.key}
                />
              </div>
            </div>
          </Container>
        </GraphSection>
      ) : (
        <h1>Loading Data...</h1>
      )}
    </>
  );
}

export default Painel;
