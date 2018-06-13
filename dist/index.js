"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
/**
 * Class of the client
 */
class AvolaClient {
    constructor(baseUrl, apikey) {
        this.baseUrl = baseUrl;
        this.apiKey = apikey ? apikey : "";
    }
    getSettings() {
        return new Promise(resolve => {
            request({
                method: "GET",
                headers: {
                    "ApiKey": this.apiKey
                },
                uri: this.baseUrl + "/api/settingss"
            }, function (error, response, body) {
                // parse body back to object
                // json.stringify to parse back
                if (response.statusCode === 200) {
                    let settings = JSON.parse(body);
                    resolve(settings);
                }
            });
        });
    }
}
exports.AvolaClient = AvolaClient;
/**
 * Settings class for our API
 */
class Settings {
    constructor(organisation, environment, apitype, authority, tokenendpoint) {
        this.organisation = organisation;
        this.environment = environment;
        this.apitype = apitype;
        this.authority = authority;
        this.tokenendpoint = tokenendpoint;
    }
}
exports.Settings = Settings;
