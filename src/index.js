let nodes = [];
let edges = [];

fetch('./data/indexer.json')
  .then(response => response.json())
  .then( vertex => {
    nodes = createNodes( vertex );
  })
  .catch(error => console.error(error));

fetch('./data/adjacency.json')
  .then( res => res.json() )
  .then( edges => {
    edges = createEdges(edges)
    renderGraph( nodes, edges)
  })
  .catch( error => console.log(error))


function createNodes( data ){

  for ( const key in data  ){
    nodes.push({ id: key, label: data[key] })
  }

  return nodes
}


function createEdges( data ){

  for ( const [ vFrom, targets ] of Object.entries(data.data) ){
    for ( const target of targets ){
      edges.push({ source : vFrom , target })
    }
  }

  return edges
}

function renderGraph( nodes, edges ){
  const context = d3.select("svg");
  const width = +context.attr("width");
  const height = +context.attr("height");

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(edges).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));


  const link = context.append("g")
    .selectAll("line")
    .data(edges)
    .join("line");

  const node = context.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 15)
    .call(drag(simulation));

  const label = context.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .text(d => d.id)
    .attr("dy", 4)
    .attr("x", 20);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

}

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
