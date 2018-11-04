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

describe('Utilities - Traveling Salesman Problem!', () => {
  it('should valid shortest path for a short list', (done) => {
    AlgorithmUtils.queryDistances(validTest).then((data) => {
      const {distances, origins, destinations } = data;
      const distanceDictoinary = AlgorithmUtils.calculateDistancesArray(distances, origins, destinations);
      const salesmanPath = AlgorithmUtils.findShortestPath(validTest, distanceDictoinary);
      expect(salesmanPath).to.deep.equal([ '49.8088807,-97.2297858', '49.8561519,-97.16069069999998' ]);
      
      done();
    }).catch((err) => {
      console.log("error occured, ", err);
    });
  });
  
  it('should work for medium sized path', (done) => {
    AlgorithmUtils.queryDistances(longerTest).then((data) => {
      const {distances, origins, destinations } = data;
      const distanceDictoinary = AlgorithmUtils.calculateDistancesArray(distances, origins, destinations);
      const salesmanPath = AlgorithmUtils.findShortestPath(longerTest, distanceDictoinary);
      
      expect(salesmanPath).to.deep.equal([ '49.8088807,-97.2297858',
        '49.8561519,-97.16069069999998',
        '49.932471,-97.06972489999998',
        '50.08294370000001,-97.2263077' ]);
      console.log(salesmanPath);
      
      done();
    }).catch((err) => {
      console.log("error occured, ", err);
    });
  });
  
  it('should valid shortest path for a longer list', (done) => {
    AlgorithmUtils.queryDistances(biggerTest).then((data) => {
      const {distances, origins, destinations } = data;
      const distanceDictoinary = AlgorithmUtils.calculateDistancesArray(distances, origins, destinations);
      const salesmanPath = AlgorithmUtils.findShortestPath(biggerTest, distanceDictoinary);
      expect(salesmanPath).to.deep.equal([ '49.8088807,-97.2297858',
        '49.8561519,-97.16069069999998',
        '49.932471,-97.06972489999998',
        '49.8289535,-97.20393790000003',
        '50.0875625,-97.21965089999998',
        '49.81160809999999,-97.1895045',
        '49.87942019999999,-97.1650315',
        '49.8522527,-97.15120200000001',
        '49.8558043,-97.15962819999999' ]
      );
      done();
    }).catch((err) => {
      console.log("error occured, ", err);
    });
  });
});

describe('Utilities - computeAlgorithm', () => {
  
  
  it('should properly return an array of endpoints to travel', (done) => {
    AlgorithmUtils.computeAlgorithm(longerTest).then((algoResponse) => {
      const response = algoResponse;
      console.log("algo Response is", algoResponse);
      expect(response).to.deep.equal([ '49.8088807,-97.2297858',
        '49.8561519,-97.16069069999998',
        '49.932471,-97.06972489999998',
        '50.08294370000001,-97.2263077',
        '49.8088807,-97.2297858' ]
      );
  
      done();
      }).catch((err) => {
      console.log("error occured, ", err);
    });
  });
});
