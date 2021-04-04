const width = 954;
const height = 800;
const barplot_width = 300;
const barplot_height = 150;
const radius = width / 2;
const colorin = "#660033";
const colorout = "#669900";
const colornone = "#ccc";

line = d3.lineRadial()
         .curve(d3.curveBundle.beta(0.85))
         .radius(d => d.y)
         .angle(d => d.x)

tree = d3.cluster()
         .size([2 * Math.PI, radius - 100])

const svg = d3.select("#graph")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", [-width / 2, -width / 2, width, width]);

let promises = [
    d3.json('../data/hierarchical_graph.json'),
    d3.json('../data/standard_graph.json')
]

Promise.all(promises).then(ready)


function ready(us) {
    hierarchical_data = us[0]
    all_retweets = us[1].links
    console.log(all_retweets)
    all_users = us[1].nodes

    orientationTypeScale = d3.scaleOrdinal()
                             .domain(["Esquerda", "Direita", "Centro"])
                             .range([colorLeft, colorRight, colorCenter])
    facts1 = crossfilter(all_users)
    ideologyDimension1 = facts1.dimension(d => d['Ideology'])
    nameDimension1 = facts1.dimension(d => d['username'])
    ideologyCount1 = ideologyDimension1.group()

    facts2 = crossfilter(all_users)
    ideologyDimension2 = facts2.dimension(d => d['Ideology'])
    nameDimension2 = facts2.dimension(d => d['username'])
    ideologyCount2 = ideologyDimension2.group()
        
    let barchart = new dc.BarChart("#bar3");
    barchart.width(barplot_width)
            .height(barplot_height)
            .dimension(ideologyDimension1)
            .x(orientationTypeScale)
            .xUnits(dc.units.ordinal)
            .group(ideologyCount1)
            .margins({top: 10, right: 20, bottom: 20, left: 30})
            .elasticY(true)
            .renderHorizontalGridLines(true)
            .colors(orientationTypeScale)
            .colorAccessor(d => d.key)

    let barchart2 = new dc.BarChart("#bar4");

    barchart2.width(barplot_width)
             .height(barplot_height)
             .dimension(ideologyDimension2)
             .x(orientationTypeScale)
             .xUnits(dc.units.ordinal)
             .group(ideologyCount2)
             .margins({top: 10, right: 20, bottom: 20, left: 30})
             .elasticY(true)
             .renderHorizontalGridLines(true)
             .colors(orientationTypeScale)
             .colorAccessor(d => d.key)

    y = d3.scaleLinear()
          .domain([0, 60])
          .range([barplot_height, 0]);

    hierarchical_data.forEach(function(d) {
        d.selected = false;
    })
    let data = hierarchy(hierarchical_data)
    
    const root = tree(bilink(d3.hierarchy(data)
                               .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));

    const node = svg.append("g")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .selectAll("g")
                    .data(root.leaves())
                    .join("g")
                    .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
                    .append("text")
                    .attr("dy", "0.31em")
                    .attr("x", d => d.x < Math.PI ? 6 : -6)
                    .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
                    .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)  
                    .text(d => d.data.name)
                    .attr('fill', d => orientationTypeScale(d.data['Ideology']))
                    .each(function(d) { d.text = this; })
                    .on("click", selection_fn)
                    .call(text => text.append("title").text(
                        d => `${d.data.name}
                        Retweeted by ${d.outgoing.length} users
                        Retweeted ${d.incoming.length} users`)
                    )


    const link = svg.append("g")
                    .attr("stroke", colornone)
                    .attr("fill", "none")
                    .selectAll("path")
                    .data(root.leaves().flatMap(leaf => leaf.outgoing))
                    .join("path")
                    .style("mix-blend-mode", "multiply")
                    .attr("d", ([i, o]) => line(i.path(o)))
                    .each(function(d) { d.path = this; });
    dc.renderAll();

    function selection_fn(d, event) {
        if (d.data.selected) {
            d.data.selected = false
            link.style("mix-blend-mode", "multiply");
            d3.select(this).attr("font-weight", null);
            d3.select(this).attr("fill", orientationTypeScale(d.data['Ideology']))
            d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
            d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
            d3.selectAll(d.incoming.map(([d]) => d.text)).attr("font-weight", null);
            d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("font-weight", null);
        }else {
            document.getElementById("barHeader3").innerHTML = `Ideologia de quem retuitou @${d.data.name}`
            document.getElementById("barHeader4").innerHTML = `Ideologia dos retuitados por @${d.data.name}`
            d.data.selected = true
            link.style("mix-blend-mode", null);
            d3.select(this).attr("font-weight", "bold");
            d3.select(this).attr("fill", "#000");
            d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
            d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
            d3.selectAll(d.incoming.map(([d]) => d.text)).attr("font-weight", "bold");
            d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("font-weight", "bold");
        }

        let retweeted_usernames = getRetweetedUsers(d.data.imports)
        let users_who_retweet = getWhoRetweetedUser(d.data['name'])
        console.log(retweeted_usernames)
        console.log(users_who_retweet)
        nameDimension1.filterFunction(function (d) {
            return retweeted_usernames.indexOf(d) > -1;
        })
        dc.redrawAll();

        nameDimension2.filterFunction(function (d) {
            return users_who_retweet.indexOf(d) > -1;
        })
        dc.redrawAll();
        //dc.renderAll();
    }

    function getRetweetedUsers(who_user_retweeted) {
        let usernames = []
        who_user_retweeted.forEach(function(u) {
            usernames.push(u.split('.')[2])
        })

        return usernames
    }

    function getWhoRetweetedUser(user) {
        let users_who_retweet = []
        all_retweets.forEach(function (link) {
            if (link['target'] == user){
                users_who_retweet.push(link['source'])
            }
        })

        return users_who_retweet
    }
}

function hierarchy(data, delimiter = ".") {
  let root;
  const map = new Map;
  data.forEach(function find(data) {
    const {name} = data;
    if (map.has(name)) return map.get(name);
    const i = name.lastIndexOf(delimiter);
    map.set(name, data);
    if (i >= 0) {
      find({name: name.substring(0, i), children: []}).children.push(data);
      data.name = name.substring(i + 1);
    } else {
      root = data;
    }
    return data;
  });
  return root;
}

function bilink(root) {
  const map = new Map(root.leaves().map(d => [id(d), d]));
  for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.imports.map(i => [d, map.get(i)]);
  for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
  return root;
}

function id(node) {
  return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
}
