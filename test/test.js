'use strict';
var expect = require('chai').expect;
var AvolaClient = require('../dist/index.js').AvolaClient;

describe('settings api test', () => {
    it('should return settings', () => {
        var client = new AvolaClient("https://free.api.avo.la");

        client.getSettings().then((settings) => {
            console.log("settingssss", settings);
            expect(settings.organisation).to.not.be.null;
        });
    });
});