let obj = {};

fetch('../resources/filled-graph.json')
  .then(response => response.json())
  .then(data => {
    obj = data;
    console.log(JSON.stringify(obj, null, 2));
    
  })
  .catch(error => console.error(error));

