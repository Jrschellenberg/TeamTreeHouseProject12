//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

import AlgorithmUtils from '../src/utilities/algorithmUtils';

const validTest = {
  points:["49.8561519,-97.16069069999998"],
  startpoint:"49.8088807,-97.2297858",
  endpoint:"49.8088807,-97.2297858"
};

const longerTest = {
  points:["49.8561519,-97.16069069999998","49.932471,-97.06972489999998","50.08294370000001,-97.2263077"],
  startpoint:"49.8088807,-97.2297858",
  endpoint:"49.8088807,-97.2297858"
};

const biggerTest = {
  points:["49.8561519,-97.16069069999998","49.932471,-97.06972489999998","49.8289535,-97.20393790000003","50.0875625,-97.21965089999998","49.81160809999999,-97.1895045","49.87942019999999,-97.1650315","49.8522527,-97.15120200000001","49.8558043,-97.15962819999999"],
  startpoint:"49.8088807,-97.2297858",
  endpoint:"49.8088807,-97.2297858"
};

describe('Traveling Salesman Problem!', () => {
  it('should valid shortest path for a short list', (done) => {
    AlgorithmUtils.queryDistances(validTest).then((data) => {
      const {distances, origins, destinations } = data;
      const distanceDictoinary = AlgorithmUtils.calculateDistancesArray(distances, origins, destinations);
      AlgorithmUtils.findShortestPath(validTest, distanceDictoinary);
      done();
    }).catch((err) => {
      console.log("error occured, ", err);
    });
  });
  
  it('should return true', (done) => {
    AlgorithmUtils.queryDistances(longerTest).then((data) => {
      const {distances, origins, destinations } = data;
      const distanceDictoinary = AlgorithmUtils.calculateDistancesArray(distances, origins, destinations);
      
      AlgorithmUtils.findShortestPath(longerTest, distanceDictoinary);
      
      done();
    }).catch((err) => {
      console.log("error occured, ", err);
    });
  });
  
  it('should valid shortest path for a longer list', (done) => {
    AlgorithmUtils.queryDistances(biggerTest).then((data) => {
      const {distances, origins, destinations } = data;
      const distanceDictoinary = AlgorithmUtils.calculateDistancesArray(distances, origins, destinations);
      AlgorithmUtils.findShortestPath(biggerTest, distanceDictoinary);
      done();
    }).catch((err) => {
      console.log("error occured, ", err);
    });
  });
  
  
});



// describe('test Tsp Algorithm', () => {
//   it('should just work', () => {
//     const vertexA = new GraphVertex('A');
//     const vertexB = new GraphVertex('B');
//     const vertexC = new GraphVertex('C');
//     const vertexD = new GraphVertex('D');
//  
//     const edgeAB = new GraphEdge(vertexA, vertexB, 1);
//     const edgeBD = new GraphEdge(vertexB, vertexD, 1);
//     const edgeDC = new GraphEdge(vertexD, vertexC, 1);
//     const edgeCA = new GraphEdge(vertexC, vertexA, 1);
//  
//     const edgeBA = new GraphEdge(vertexB, vertexA, 5);
//     const edgeDB = new GraphEdge(vertexD, vertexB, 8);
//     const edgeCD = new GraphEdge(vertexC, vertexD, 7);
//     const edgeAC = new GraphEdge(vertexA, vertexC, 4);
//     const edgeAD = new GraphEdge(vertexA, vertexD, 2);
//     const edgeDA = new GraphEdge(vertexD, vertexA, 3);
//     const edgeBC = new GraphEdge(vertexB, vertexC, 3);
//     const edgeCB = new GraphEdge(vertexC, vertexB, 9);
//  
//     const graph = new Graph(true);
//     graph
//       .addEdge(edgeAB)
//       .addEdge(edgeBD)
//       .addEdge(edgeDC)
//       .addEdge(edgeCA)
//       .addEdge(edgeBA)
//       .addEdge(edgeDB)
//       .addEdge(edgeCD)
//       .addEdge(edgeAC)
//       .addEdge(edgeAD)
//       .addEdge(edgeDA)
//       .addEdge(edgeBC)
//       .addEdge(edgeCB);
//  
//     const salesmanPath = AlgorithmUtils.bfTravellingSalesman(graph);
//    
//     console.log(salesmanPath);
//    
//   })
//  
// });