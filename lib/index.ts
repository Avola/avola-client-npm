import * as request from "request";
import * as promise from "promise";
import * as oauth2 from "simple-oauth2";

/**
 * Global namespace for Avola
 */
export namespace Avola {
    /**
     * Class of the client
     */
    export class AvolaClient {
        /**
         * The apiKey retrieved from the myaccount page in Avola Decision
         */
        private credentials: oauth2.ModuleOptions;
        /**
         * The base Url of the Avola Decision api we want to use
         */
        private baseUrl: string;

        private tokenProvider?: oauth2.AccessToken;
        private accessToken: string = "";

        constructor(baseUrl: string, clientId: string, clientSecret: string, tokenHost?: string) {
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

        private async authenticate() {
            const actoken = "access_token";

            if (!this.accessToken || !this.tokenProvider) {
                // initialize the OAuth2 Library
                const authclient = oauth2.create(this.credentials);
                const tokenConfig = {
                    scope: "avola-api-client", // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
                };

                // get the access token object for the client
                try {
                    const result = await authclient.clientCredentials.getToken(tokenConfig);
                    this.tokenProvider = authclient.accessToken.create(result);
                    this.accessToken = this.tokenProvider.token[actoken];
                } catch (error) {
                    console.log("Access Token error", error.message);
                }
            } else {
                // check experation of token
                if (this.tokenProvider.expired()) {
                    this.tokenProvider.refresh((error: any, result: oauth2.AccessToken) => {
                        if (!error) {
                            this.accessToken = result.token[actoken];
                        } else {
                            console.log("Access Token error", error.message);
                        }
                    })
                }
            }
        }

        /**
         * Will return the settings of the API. This describes certain endpoints
         */
        getSettings(): Promise<Settings> {
            let url: string;
            url = this.baseUrl + "/api/settings";

            return new Promise(resolve => {
                request(
                    {
                        method: "GET",
                        headers: {},
                        uri: url
                    }
                    , function (error, response, body) {
                        // parse body back to object
                        // json.stringify to parse back
                        if (response.statusCode === 200) {
                            let settings: Settings = JSON.parse(body);
                            resolve(settings);
                        }
                    }
                );
            });
        }

        /**
         * Will return you the list and details of all decision services and their versions without parameters
         * With decisionServiceId: will return you the versions and details of a specific decision service.
         * Not available for free accounts
         * @param decisionServiceId 
         * @param version 
         */
        getDecisionServices(decisionServiceId?: number): Promise<Array<Execution.DecisionServiceDescription>> {
            let url: string;
            if (decisionServiceId) {
                url = this.baseUrl + "/api/ApiExecution/decisions/" + decisionServiceId;
            } else {
                url = this.baseUrl + "/api/ApiExecution/decisions/list";
            }

            return new Promise(resolve => {
                this.authenticate().then(() => {
                    request(
                        {
                            method: "GET",
                            headers: {
                                "Authorization": "Bearer " + this.accessToken
                            },
                            uri: url
                        }
                        , function (error, response, body) {
                            // console.log("resp", response);
                            // parse body back to object
                            // json.stringify to parse back
                            console.log(response.statusCode);
                            if (response.statusCode === 200) {
                                let decisionservices: Array<Execution.DecisionServiceDescription> = JSON.parse(body);
                                resolve(decisionservices);
                            }
                        }
                    );
                })
            });
        }

        /**
         * Will return you the details of a specific decision service version.
         * @param decisionServiceId 
         * @param version 
         */
        getDecisionServiceVersions(decisionServiceId: number, version: number):
            Promise<Array<Execution.DecisionServiceVersionDescription>> {
            let url: string;
            url = this.baseUrl + "/api/ApiExecution/decisions/" + decisionServiceId + "/" + version;

            return new Promise(resolve => {
                this.authenticate().then(() => {
                    request(
                        {
                            method: "GET",
                            headers: {
                                "Authorization": "Bearer " + this.accessToken
                            },
                            uri: url
                        }
                        , function (error, response, body) {
                            // parse body back to object
                            // json.stringify to parse back
                            if (response.statusCode === 200) {
                                let decisionserviceversions: Array<Execution.DecisionServiceVersionDescription> = JSON.parse(body);
                                resolve(decisionserviceversions);
                            }
                        }
                    );
                })
            });
        }

        /**
         * Execute a descision service version, this returns all conclusions, from all decisions in the decision service
         * @param decisionServiceId 
         * @param version 
         */
        executeDecisionServiceVersion(executionRequest: Execution.ApiExecutionRequest): Promise<Execution.ExecutionResult> {
            let url: string;
            url = this.baseUrl + "/api/ApiExecution/execute";

            return new Promise(resolve => {
                this.authenticate().then(() => {
                    request(
                        {
                            method: "POST",
                            headers: {
                                "Authorization": "Bearer " + this.accessToken
                            },
                            uri: url,
                            form: executionRequest
                        }
                        , function (error, response, body) {
                            // parse body back to object
                            // json.stringify to parse back
                            if (response.statusCode === 200) {
                                let result: Execution.ExecutionResult = JSON.parse(body);
                                resolve(result);
                            }
                        }
                    );
                });
            });
        }
    }

    /**
     * Settings class for our API
     */
    export interface Settings {
        /**
         * The subdomain of the organisation of the api
         */
        organisation?: string;
        /**
         * The environment of the API this can be: App, Test or Prod
         */
        environment?: string;
        /**
         * The apitype can be Full or Execution
         */
        apiType?: string;
        /**
         * The authority is the url of the identityserver instance that sign tokens for authentication in our Api
         */
        authority?: string;
        /**
         * The tokenendpoint is the url where you can request tokens with your client/secret
         */
        tokenEndpoint?: string;
    }

    export namespace Execution {
        /**
         * Object that describes properties about a decision service
         */
        export interface DecisionServiceDescription {
            decisionServiceId?: number;
            name?: string;
            versions?: Array<DecisionServiceVersionDescription>;
        }

        /**
         * Object that describes properties about a decision service version
         */
        export interface DecisionServiceVersionDescription {
            decisionServiceId?: number;
            name?: string;
            decisionName?: string;
            decisionServiceVersionId?: number;
            versionNumber?: number;
            inputData?: Array<DecisionServiceVersionBusinessData>;
            outputData?: Array<DecisionServiceVersionBusinessData>;
            traceData?: Array<DecisionServiceVersionBusinessData>;
            metaData?: Array<DecisionServiceVersionBusinessData>;
            pairData?: Array<DecisionServiceVersionPairData>;
            listData?: Array<DecisionServiceVersionListData>;
        }

        export interface DecisionServiceVersionBusinessData {
            businessDataId?: number;
            version?: number;
            name?: string;
            type?: string;
            question?: string;
            properties?: Array<BusinessDataProperty>;
        }

        export interface BusinessDataProperty {
            name?: string;
            value?: string;
        }

        export interface DecisionServiceVersionPairData {
            pairId?: number;
            valueForTrue?: string;
            valueForFalse?: string;
        }

        export interface DecisionServiceVersionListData {
            listId?: number;
            items?: Array<DecisionServiceVersionListDataItem>;
        }

        export interface DecisionServiceVersionListDataItem {
            id?: number;
            order?: number;
            value?: string;
            name?: string;
        }

        export class ApiExecutionRequest {
            public decisionServiceId?: number;
            public versionNumber?: number;
            public reference?: string;
            public executionRequestData?: Array<ExecutionRequestData>;
            public executionRequestMetaData?: Array<ExecutionRequestData>;

            constructor(decisionserviceid?: number, versionnumber?: number, reference?: string,
                executionrequestdata?: Array<ExecutionRequestData>, executionrequestmetadata?: Array<ExecutionRequestData>) {
                this.decisionServiceId = decisionserviceid;
                this.versionNumber = versionnumber;
                this.reference = reference;
                this.executionRequestData = executionrequestdata;
                this.executionRequestMetaData = executionrequestmetadata;
            }
        }

        export class ExecutionRequestData {
            key?: number;
            value?: string;
        }

        export interface ExecutionResult {
            decisionTableId?: number;
            decisionServiceId?: number;
            reference?: string;
            finalConclusionBusinessDataIds?: Array<number>;
            conclusionValueType?: ExecutionResult.ConclusionValueTypeEnum;
            hitConclusions?: Array<HitConclusion>;
            errors?: Array<ErrorMessage>;
        }

        export namespace ExecutionResult {
            export type ConclusionValueTypeEnum = 'Success' | 'NoConclusion' | 'Error';
            export const ConclusionValueTypeEnum = {
                Success: 'Success' as ConclusionValueTypeEnum,
                NoConclusion: 'NoConclusion' as ConclusionValueTypeEnum,
                Error: 'Error' as ConclusionValueTypeEnum
            }
        }

        export interface ErrorMessage {
            message?: string;
            code?: string;
            values?: Array<string>;
        }

        export interface HitConclusion {
            conclusionName?: string;
            conclusionId?: number;
            decisionTableName?: string;
            decisionTableId?: number;
            businessDataId?: number;
            rowId?: number;
            rowExpression?: string;
            value?: string;
            rowOrder?: number;
        }
    }
}