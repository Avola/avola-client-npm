"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const oauth2 = require("simple-oauth2");
/**
 * Global namespace for Avola
 */
var Avola;
(function (Avola) {
    /**
     * Class of the client
     */
    class AvolaClient {
        constructor(baseUrl, clientId, clientSecret, tokenHost) {
            this.accessToken = "";
            this.baseUrl = baseUrl;
            this.credentials = {
                client: {
                    id: clientId,
                    secret: clientSecret
                },
                auth: {
                    tokenHost: tokenHost ? tokenHost : "https://free.auth.avo.la",
                    tokenPath: "/connect/token"
                }
            };
        }
        authenticate() {
            return __awaiter(this, void 0, void 0, function* () {
                const actoken = "access_token";
                if (!this.accessToken || !this.tokenProvider) {
                    // initialize the OAuth2 Library
                    const authclient = oauth2.create(this.credentials);
                    const tokenConfig = {
                        scope: "avola-api-client",
                    };
                    // get the access token object for the client
                    try {
                        const result = yield authclient.clientCredentials.getToken(tokenConfig);
                        this.tokenProvider = authclient.accessToken.create(result);
                        this.accessToken = this.tokenProvider.token[actoken];
                    }
                    catch (error) {
                        console.log("Access Token error", error.message);
                    }
                }
                else {
                    // check experation of token
                    if (this.tokenProvider.expired()) {
                        this.tokenProvider.refresh((error, result) => {
                            if (!error) {
                                this.accessToken = result.token[actoken];
                            }
                            else {
                                console.log("Access Token error", error.message);
                            }
                        });
                    }
                }
            });
        }
        /**
         * Will return the settings of the API. This describes certain endpoints
         */
        getSettings() {
            let url;
            url = this.baseUrl + "/api/settings";
            return new Promise(resolve => {
                request({
                    method: "GET",
                    headers: {},
                    uri: url
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
        /**
         * Will return you the list and details of all decision services and their versions without parameters
         * With decisionServiceId: will return you the versions and details of a specific decision service.
         * Not available for free accounts
         * @param decisionServiceId
         * @param version
         */
        getDecisionServices(decisionServiceId) {
            let url;
            if (decisionServiceId) {
                url = this.baseUrl + "/api/ApiExecution/decisions/" + decisionServiceId;
            }
            else {
                url = this.baseUrl + "/api/ApiExecution/decisions/list";
            }
            return new Promise(resolve => {
                this.authenticate().then(() => {
                    request({
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + this.accessToken
                        },
                        uri: url
                    }, function (error, response, body) {
                        // console.log("resp", response);
                        // parse body back to object
                        // json.stringify to parse back
                        console.log(response.statusCode);
                        if (response.statusCode === 200) {
                            let decisionservices = JSON.parse(body);
                            resolve(decisionservices);
                        }
                    });
                });
            });
        }
        /**
         * Will return you the details of a specific decision service version.
         * @param decisionServiceId
         * @param version
         */
        getDecisionServiceVersions(decisionServiceId, version) {
            let url;
            url = this.baseUrl + "/api/ApiExecution/decisions/" + decisionServiceId + "/" + version;
            return new Promise(resolve => {
                this.authenticate().then(() => {
                    request({
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + this.accessToken
                        },
                        uri: url
                    }, function (error, response, body) {
                        // parse body back to object
                        // json.stringify to parse back
                        if (response.statusCode === 200) {
                            let decisionserviceversions = JSON.parse(body);
                            resolve(decisionserviceversions);
                        }
                    });
                });
            });
        }
        /**
         * Execute a descision service version, this returns all conclusions, from all decisions in the decision service
         * @param decisionServiceId
         * @param version
         */
        executeDecisionServiceVersion(executionRequest) {
            let url;
            url = this.baseUrl + "/api/ApiExecution/execute";
            return new Promise(resolve => {
                this.authenticate().then(() => {
                    request({
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + this.accessToken
                        },
                        uri: url,
                        form: executionRequest
                    }, function (error, response, body) {
                        // parse body back to object
                        // json.stringify to parse back
                        if (response.statusCode === 200) {
                            let result = JSON.parse(body);
                            resolve(result);
                        }
                    });
                });
            });
        }
    }
    Avola.AvolaClient = AvolaClient;
    let Execution;
    (function (Execution) {
        class ApiExecutionRequest {
            constructor(decisionserviceid, versionnumber, reference, executionrequestdata, executionrequestmetadata) {
                this.decisionServiceId = decisionserviceid;
                this.versionNumber = versionnumber;
                this.reference = reference;
                this.executionRequestData = executionrequestdata;
                this.executionRequestMetaData = executionrequestmetadata;
            }
        }
        Execution.ApiExecutionRequest = ApiExecutionRequest;
        class ExecutionRequestData {
        }
        Execution.ExecutionRequestData = ExecutionRequestData;
        let ExecutionResult;
        (function (ExecutionResult) {
            ExecutionResult.ConclusionValueTypeEnum = {
                Success: 'Success',
                NoConclusion: 'NoConclusion',
                Error: 'Error'
            };
        })(ExecutionResult = Execution.ExecutionResult || (Execution.ExecutionResult = {}));
    })(Execution = Avola.Execution || (Avola.Execution = {}));
})(Avola = exports.Avola || (exports.Avola = {}));
