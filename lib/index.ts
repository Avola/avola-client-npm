import * as request from "request";
import * as promise from "promise";
import * as oauth2 from "simple-oauth2";

/**
 * Class of the client
 */
export class AvolaClient {
    /**
     * The credentials include: clientId, clientSecret and optional tokenHost
     * If no other host is specified the free verson tokenHost is used 
     */
    private credentials: oauth2.ModuleOptions;
    /**
     * The base Url of the Avola Decision api we want to use ex https://free.api.avo.la
     */
    private baseUrl: string;
    /**
     * A tokenProvider is the instance of identityserver that is running
     * This defaults to the free version of Avola Decision
     */
    private tokenProvider?: oauth2.AccessToken;
    /**
     * accesToken contains your bearer token to autenticate with Avola Api
     */
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
                });
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
    getDecisionServices(decisionServiceId?: number): Promise<Array<DecisionServiceDescription>> {
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
                        // parse body back to object
                        console.log(response.statusCode);
                        if (response.statusCode === 200) {
                            let decisionservices: Array<DecisionServiceDescription> = JSON.parse(body);
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
    getDecisionServiceVersion(decisionServiceId: number, version: number):
        Promise<DecisionServiceVersionDescription> {
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
                        if (response.statusCode === 200) {
                            let decisionserviceversions: DecisionServiceVersionDescription = JSON.parse(body);
                            resolve(decisionserviceversions);
                        }
                    }
                );
            })
        });
    }

    /**
     * Execute a descision service version, this returns all conclusions, from all decisions in the decision service
     * @param executionRequest
     */
    executeDecisionServiceVersion(executionRequest: ApiExecutionRequest): Promise<ExecutionResult> {
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
                        if (response.statusCode === 200) {
                            let result: ExecutionResult = JSON.parse(body);
                            resolve(result);
                        }
                    }
                );
            });
        });
    }

    /**
     * Execute a decision table. This function is only available if you are using a Free api client.
     * @param executionRequest 
     */
    executeDecisionFree(freerequest: FreeExecutionRequest): Promise<ExecutionResult> {
        let url: string;
        url = this.baseUrl + "/api/FreeExecution/executedecisiontable";

        return new Promise(resolve => {
            this.authenticate().then(() => {
                request(
                    {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + this.accessToken
                        },
                        uri: url,
                        form: freerequest
                    }
                    , function (error, response, body) {
                        // parse body back to object
                        if (response.statusCode === 200) {
                            let result: ExecutionResult = JSON.parse(body);
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
    Organisation?: string;
    /**
     * The environment of the API this can be: App, Test or Prod
     */
    Environment?: string;
    /**
     * The apitype can be Full or Execution
     */
    ApiType?: string;
    /**
     * The authority is the url of the identityserver instance that sign tokens for authentication in our Api
     */
    Authority?: string;
    /**
     * The tokenendpoint is the url where you can request tokens with your client/secret
     */
    TokenEndpoint?: string;
}
/**
 * Object that describes properties about a decision service
 */
export interface DecisionServiceDescription {
    DecisionServiceId?: number;
    Name?: string;
    Versions?: Array<DecisionServiceVersionDescription>;
}

/**
 * Object that describes properties about a decision service version
 */
export interface DecisionServiceVersionDescription {
    DecisionServiceId?: number;
    Name?: string;
    DecisionName?: string;
    DecisionServiceVersionId?: number;
    VersionNumber?: number;
    InputData?: Array<DecisionServiceVersionBusinessData>;
    OutputData?: Array<DecisionServiceVersionBusinessData>;
    TraceData?: Array<DecisionServiceVersionBusinessData>;
    MetaData?: Array<DecisionServiceVersionBusinessData>;
    PairData?: Array<DecisionServiceVersionPairData>;
    ListData?: Array<DecisionServiceVersionListData>;
}

/**
 * Describes the versioned businessdata
 */
export interface DecisionServiceVersionBusinessData {
    BusinessDataId?: number;
    Version?: number;
    Name?: string;
    Type?: string;
    Question?: string;
    Properties?: Array<BusinessDataProperty>;
}

export interface BusinessDataProperty {
    Name?: string;
    Value?: string;
}

/**
 * Describes the versioned pair
 */
export interface DecisionServiceVersionPairData {
    PairId?: number;
    ValueForTrue?: string;
    ValueForFalse?: string;
}

/**
 * Describes a versioned list with versioned list items
 */
export interface DecisionServiceVersionListData {
    ListId?: number;
    Items?: Array<DecisionServiceVersionListDataItem>;
}

export interface DecisionServiceVersionListDataItem {
    Id?: number;
    Order?: number;
    Value?: string;
    Name?: string;
}

/**
 * This class is the execution request that the Avola Decision Api needs to execute a decision service version
 * decisionServiceId: the id of the service version
 * versionNumber: what version of the decision service
 * reference: optional string reference, you can use this tas a reference to group or find back execution results
 */
export class ApiExecutionRequest {
    public DecisionServiceId?: number;
    public VersionNumber?: number;
    public Reference?: string;
    public ExecutionRequestData?: Array<ExecutionRequestData>;
    public ExecutionRequestMetaData?: Array<ExecutionRequestData>;

    constructor(decisionserviceid?: number, versionnumber?: number, reference?: string,
        executionrequestdata?: Array<ExecutionRequestData>, executionrequestmetadata?: Array<ExecutionRequestData>) {
        this.DecisionServiceId = decisionserviceid;
        this.VersionNumber = versionnumber;
        this.Reference = reference;
        this.ExecutionRequestData = executionrequestdata;
        this.ExecutionRequestMetaData = executionrequestmetadata;
    }
}

/**
 * Key value pair of the request data
 * The key represents the id of the businessdata
 * The value is the input value for execution
 */
export class ExecutionRequestData {
    Key?: number;
    Value?: string;

    constructor(key?: number, value?: string) {
        this.Key = key;
        this.Value = value;
    }
}

/**
 * Describes the result of an execution
 * reference: the same reference as with the request
 * finalConclusionBusinessDataIds: this is the businessdata id of the final conclusion (use this to quickly find the top conclusion)
 * hitConclusions: array of all the conclusions that were hit
 */
export interface ExecutionResult {
    DecisionTableId?: number;
    DecisionServiceId?: number;
    Reference?: string;
    FinalConclusionBusinessDataIds?: Array<number>;
    ConclusionValueType?: ExecutionResult.ConclusionValueTypeEnum;
    HitConclusions?: Array<HitConclusion>;
    Errors?: Array<ErrorMessage>;
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
    Message?: string;
    Code?: string;
    Values?: Array<string>;
}

export interface HitConclusion {
    ConclusionName?: string;
    ConclusionId?: number;
    DecisionTableName?: string;
    DecisionTableId?: number;
    BusinessDataId?: number;
    RowId?: number;
    RowExpression?: string;
    Value?: string;
    RowOrder?: number;
}

export class FreeExecutionRequest extends ApiExecutionRequest {
    DecisionTableId: number;

    constructor(tableId: number) {
        super();
        this.DecisionTableId = tableId;
    }
}