'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('ping function test', () => {
    it('should return pong', () => {
        var result = index.ping();
        expect(result).to.equal('pong');
    });
});