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
}


describe('POST ALGORITHMIA', () => {
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
});