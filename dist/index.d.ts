/**
 * Class of the client
 */
export declare class AvolaClient {
    /**
     * The apiKey retrieved from the myaccount page in Avola Decision
     */
    private apiKey;
    /**
     * The base Url of the Avola Decision api we want to use
     */
    private baseUrl;
    constructor(baseUrl: string, apikey?: string);
    getSettings(): Promise<Settings>;
}
/**
 * Settings class for our API
 */
export declare class Settings {
    /**
     * The subdomain of the organisation of the api
     */
    organisation: string;
    /**
     * The environment of the API this can be: App, Test or Prod
     */
    environment: string;
    /**
     * The apitype can be Full or Execution
     */
    apitype: string;
    /**
     * The authority is the url of the identityserver instance that sign tokens for authentication in our Api
     */
    authority: string;
    /**
     * The tokenendpoint is the url where you can request tokens with your client/secret
     */
    tokenendpoint: string;
    constructor(organisation: string, environment: string, apitype: string, authority: string, tokenendpoint: string);
}
