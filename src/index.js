import { pageRankMethod } from "./resources/pageRankMethod.js";
import { powerIterationMethod } from "./resources/powerIterationMethod.js";

function createAdjacencyMatrix(adjList, directed = false) {
  const n = adjList.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (const j of adjList[i]) {
      matrix[i][j] = 1;
      if (!directed) {
        matrix[j][i] = 1;
      }
    }
  }

  return matrix;
}

let nodesDataset = null;
let edgesDataset = null;

let nodes = []
let edges = []

let PRMethod = []
let PIMethod = []


const initialVector = Array(96).fill().map(() => [1]);

fetch('./data/indexer.json')
  .then(response => response.json())
  .then(vertex => {
    return fetch('./data/adjacency.json')
    .then(res => res.json())
    .then(adjacency => {
      edges = createEdges(adjacency);
      
      PRMethod = pageRankMethod( Array(96).fill(1/96), createAdjacencyMatrix(adjacency.data, true), 5, 0.85 )
      PIMethod = powerIterationMethod(initialVector, createAdjacencyMatrix(adjacency.data, false), 5)  


      nodes = createNodes(vertex);

      nodes.forEach( node => {
        console.log(`${node.label}\t ${PIMethod[node.id]}\t ${PRMethod[node.id]}`);
      });

      updateDisplay();
      renderGraph(nodes, edges);

    });
  })


function getTop10(rank) {
  const indices = rank.map((_, idx) => idx);
  indices.sort((a, b) => rank[b] - rank[a]);
  return indices;
}

function createNodes(data) {
  return Object.entries(data).map(([key, label]) => ({
    id: parseInt(key),
    label: label,
    title: `Conexiones: ${data[parseInt(key)].length}\nRank: ${PIMethod[parseInt(key)]}`
  }));
}

function updateDisplay() {
  const top10PR = getTop10(PRMethod);

  const list = document.getElementById("ranking-list");
  top10PR.forEach((index) => {
    const li = document.createElement("li");
    li.innerHTML = `${top10PR.indexOf(index)+1}. ${nodes[index].label} <span>${PRMethod[index].toFixed(4)}<span>`;
    list.appendChild(li);
  });
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

  nodesDataset = new vis.DataSet(nodes);
  edgesDataset = new vis.DataSet(edges);

  const data = {
    nodes: nodesDataset,
    edges: edgesDataset
  };


  const network = new vis.Network(container, { nodes, edges }, {
    physics: {
      enabled: true,
      stabilization: {
        iterations: 400,
        fit: true
      },

      barnesHut: {
        gravitationalConstant: -30000,
        springLength: 95,
      }
    },

    layout: {
      improvedLayout: true
    },

    nodes: {
      shape: 'box',
      borderWidth: 1,

      color: {
        background: '#A5DDFC',
        border: '#D5EFFF',
        highlight: {
          background: '#759BE3',
          border: '#759BE3',
        }
      },

      font: {
        color: '#222222',
        size: 12,
        vadjust: 0,
        multi: 'html'
      }
    },

    edges: {
      color: {
        color: 'rgba(150,150,150,0.4)', 
        highlight: '#475F99',            
        inherit: false
      },
      width: 1,
      selectionWidth: 2
    }

  });

  network.once('stabilizationIterationsDone', () => {
    network.setOptions({ physics: false });
    document.getElementById('loader').style.display = 'none';
    window.network = network;
  });

}

const searchInput = document.getElementById('search-txtarea');
  searchInput.addEventListener('keydown', function(e) {

      if (e.key === 'Enter') {
          const searchValue = searchInput.value.trim().toLowerCase();
          if (!searchValue) return;

          const list = document.getElementById("ranking-list");
          const items = list.getElementsByTagName("li");

          for (let li of items) {
              const labelText = li.textContent.split('.')[1]?.split(' ')[1]?.toLowerCase() || '';
              if (labelText.includes(searchValue) || searchValue === "") {
                  li.style.display = "";
              } else {
                  li.style.display = "none";
              }
          }
          const results = nodes.filter(n =>
              n.label.toLowerCase().includes(searchValue)
          );

          if (results.length > 0) {
              const nodeId = results[0].id;
              if (network) {
                  network.selectNodes([nodeId]);
                  window.network.focus(nodeId, { scale: 1.5, animation: true });
              }
              console.log('Resultados encontrados:', results);
          } else {
              alert('No se encontró ningún estudiante con ese nombre.');
          }
      }
  });