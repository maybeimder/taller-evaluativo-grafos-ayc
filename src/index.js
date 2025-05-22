let nodes = [];
let edges = [];

fetch('./data/indexer.json')
  .then(response => response.json())
  .then(vertex => {
    nodes = createNodes(vertex);

    return fetch('./data/adjacency.json');
  })
  .then(res => res.json())
  .then(adjacency => {
    edges = createEdges(adjacency);
    renderGraph(nodes, edges);
  })
  .catch(error => console.error(error));


function createNodes(data) {
  return Object.entries(data).map(([key, label]) => ({
    id: parseInt(key),
    label: `\n\t${label}\t\n\n`
  }));
}

function createEdges(data) {
  const edgeSet = new Set();
  const result = [];

  data.data.forEach((targets, from) => {
    targets.forEach(to => {
      const key = from < to ? `${from}-${to}` : `${to}-${from}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        result.push({ from: parseInt(from), to });
      }
    });
  });

  return result;
}


function renderGraph(nodes, edges) {
  const container = document.getElementById("graph-container");

  const network = new vis.Network(container, { nodes, edges }, {
    physics: {
      enabled: true,
      stabilization: {
        iterations: 400,
        fit: true
      },
      barnesHut: {
        gravitationalConstant: -30000,
        springLength: 95
      }
    },
    layout: {
      improvedLayout: true
    },

    nodes: {
      shape: 'ellipse',
      borderWidth: 1,
      borderRadius: 6,

      color: {
        background: '#A5DDFC',
        border: '#D5EFFF',
        highlight: {
          background: '#759BE3',
          border: '#759BE3'
        }
      },

      font: {
        color: '#222222',
        size: 16,
        vadjust: 0,
        multi: 'html'
      }
    },

    edges: {
      color: {
        color: 'rgba(150,150,150,0.2)', 
        highlight: '#333333',            
        inherit: false
      },
      width: 1,
      selectionWidth: 2
    }

  });

  // Detener física tras acomodarse
  network.once('stabilizationIterationsDone', () => {
    network.setOptions({ physics: false });
  });

}
