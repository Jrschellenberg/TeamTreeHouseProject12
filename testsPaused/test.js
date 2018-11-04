'use strict';

process.env.NODE_ENV = 'test';

import { expect } from 'chai'

describe('Initial Test!', function () {
	it('should pass', function () {
		expect('string').to.be.a('string')
	});
});