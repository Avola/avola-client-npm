/**
 * Global namespace for Avola
 */
export declare namespace Avola {
    /**
     * Class of the client
     */
    class AvolaClient {
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
        getDecisionServices(decisionServiceId?: number): Promise<Array<Execution.DecisionServiceDescription>>;
        /**
         * Will return you the details of a specific decision service version.
         * @param decisionServiceId
         * @param version
         */
        getDecisionServiceVersions(decisionServiceId: number, version: number): Promise<Array<Execution.DecisionServiceVersionDescription>>;
        /**
         * Execute a descision service version, this returns all conclusions, from all decisions in the decision service
         * @param executionRequest
         */
        executeDecisionServiceVersion(executionRequest: Execution.ApiExecutionRequest): Promise<Execution.ExecutionResult>;
        /**
         * Execute a decision table. This function is only available if you are using a Free api client.
         * @param executionRequest
         */
        executeDecisionFree(freerequest: Execution.FreeExecutionRequest): Promise<Execution.ExecutionResult>;
    }
    /**
     * Settings class for our API
     */
    interface Settings {
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
    namespace Execution {
        /**
         * Object that describes properties about a decision service
         */
        interface DecisionServiceDescription {
            decisionServiceId?: number;
            name?: string;
            versions?: Array<DecisionServiceVersionDescription>;
        }
        /**
         * Object that describes properties about a decision service version
         */
        interface DecisionServiceVersionDescription {
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
        /**
         * Describes the versioned businessdata
         */
        interface DecisionServiceVersionBusinessData {
            businessDataId?: number;
            version?: number;
            name?: string;
            type?: string;
            question?: string;
            properties?: Array<BusinessDataProperty>;
        }
        interface BusinessDataProperty {
            name?: string;
            value?: string;
        }
        /**
         * Describes the versioned pair
         */
        interface DecisionServiceVersionPairData {
            pairId?: number;
            valueForTrue?: string;
            valueForFalse?: string;
        }
        /**
         * Describes a versioned list with versioned list items
         */
        interface DecisionServiceVersionListData {
            listId?: number;
            items?: Array<DecisionServiceVersionListDataItem>;
        }
        interface DecisionServiceVersionListDataItem {
            id?: number;
            order?: number;
            value?: string;
            name?: string;
        }
        /**
         * This class is the execution request that the Avola Decision Api needs to execute a decision service version
         * decisionServiceId: the id of the service version
         * versionNumber: what version of the decision service
         * reference: optional string reference, you can use this tas a reference to group or find back execution results
         */
        class ApiExecutionRequest {
            decisionServiceId?: number;
            versionNumber?: number;
            reference?: string;
            executionRequestData?: Array<ExecutionRequestData>;
            executionRequestMetaData?: Array<ExecutionRequestData>;
            constructor(decisionserviceid?: number, versionnumber?: number, reference?: string, executionrequestdata?: Array<ExecutionRequestData>, executionrequestmetadata?: Array<ExecutionRequestData>);
        }
        /**
         * Key value pair of the request data
         * The key represents the id of the businessdata
         * The value is the input value for execution
         */
        class ExecutionRequestData {
            key?: number;
            value?: string;
            constructor(key?: number, value?: string);
        }
        /**
         * Describes the result of an execution
         * reference: the same reference as with the request
         * finalConclusionBusinessDataIds: this is the businessdata id of the final conclusion (use this to quickly find the top conclusion)
         * hitConclusions: array of all the conclusions that were hit
         */
        interface ExecutionResult {
            decisionTableId?: number;
            decisionServiceId?: number;
            reference?: string;
            finalConclusionBusinessDataIds?: Array<number>;
            conclusionValueType?: ExecutionResult.ConclusionValueTypeEnum;
            hitConclusions?: Array<HitConclusion>;
            errors?: Array<ErrorMessage>;
        }
        namespace ExecutionResult {
            type ConclusionValueTypeEnum = 'Success' | 'NoConclusion' | 'Error';
            const ConclusionValueTypeEnum: {
                Success: ConclusionValueTypeEnum;
                NoConclusion: ConclusionValueTypeEnum;
                Error: ConclusionValueTypeEnum;
            };
        }
        interface ErrorMessage {
            message?: string;
            code?: string;
            values?: Array<string>;
        }
        interface HitConclusion {
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
        class FreeExecutionRequest extends ApiExecutionRequest {
            decisionTableId: number;
            constructor(tableId: number);
        }
    }
}
