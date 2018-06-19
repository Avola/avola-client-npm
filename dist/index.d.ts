/**
 * Class of the client
 */
export declare class AvolaClient {
    /**
     * The credentials include: clientId, clientSecret and optional tokenHost
     * If no other host is specified the free verson tokenHost is used
     */
    private credentials;
    /**
     * The base Url of the Avola Decision api we want to use ex https://free.api.avo.la
     */
    private baseUrl;
    /**
     * A tokenProvider is the instance of identityserver that is running
     * This defaults to the free version of Avola Decision
     */
    private tokenProvider?;
    /**
     * accesToken contains your bearer token to autenticate with Avola Api
     */
    private accessToken;
    constructor(baseUrl: string, clientId: string, clientSecret: string, tokenHost?: string);
    private authenticate;
    /**
     * Will return the settings of the API. This describes certain endpoints
     */
    getSettings(): Promise<Settings>;
    /**
     * Will return you the list and details of all decision services and their versions without parameters
     * With decisionServiceId: will return you the versions and details of a specific decision service.
     * Not available for free accounts
     * @param decisionServiceId
     * @param version
     */
    getDecisionServices(decisionServiceId?: number): Promise<Array<DecisionServiceDescription>>;
    /**
     * Will return you the details of a specific decision service version.
     * @param decisionServiceId
     * @param version
     */
    getDecisionServiceVersion(decisionServiceId: number, version: number): Promise<DecisionServiceVersionDescription>;
    /**
     * Execute a descision service version, this returns all conclusions, from all decisions in the decision service
     * @param executionRequest
     */
    executeDecisionServiceVersion(executionRequest: ApiExecutionRequest): Promise<ExecutionResult>;
    /**
     * Execute a decision table. This function is only available if you are using a Free api client.
     * @param executionRequest
     */
    executeDecisionFree(freerequest: FreeExecutionRequest): Promise<ExecutionResult>;
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
export declare class ApiExecutionRequest {
    DecisionServiceId?: number;
    VersionNumber?: number;
    Reference?: string;
    ExecutionRequestData?: Array<ExecutionRequestData>;
    ExecutionRequestMetaData?: Array<ExecutionRequestData>;
    constructor(decisionserviceid?: number, versionnumber?: number, reference?: string, executionrequestdata?: Array<ExecutionRequestData>, executionrequestmetadata?: Array<ExecutionRequestData>);
}
/**
 * Key value pair of the request data
 * The key represents the id of the businessdata
 * The value is the input value for execution
 */
export declare class ExecutionRequestData {
    Key?: number;
    Value?: string;
    constructor(key?: number, value?: string);
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
export declare namespace ExecutionResult {
    type ConclusionValueTypeEnum = 'Success' | 'NoConclusion' | 'Error';
    const ConclusionValueTypeEnum: {
        Success: ConclusionValueTypeEnum;
        NoConclusion: ConclusionValueTypeEnum;
        Error: ConclusionValueTypeEnum;
    };
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
export declare class FreeExecutionRequest extends ApiExecutionRequest {
    DecisionTableId: number;
    constructor(tableId: number);
}
