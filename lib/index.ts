import * as request from "request"
import * as promise from "promise"
import { rejects } from "assert";

/**
 * Class of the client
 */
export class AvolaClient {
    /**
     * The apiKey retrieved from the myaccount page in Avola Decision
     */
    private apiKey: string;
    /**
     * The base Url of the Avola Decision api we want to use
     */
    private baseUrl: string;

    constructor(baseUrl: string, apikey?: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apikey ? apikey : "";
    }

    getSettings(): Promise<Settings> {

        return new Promise(resolve => {
            request(
                {
                    method: "GET",
                    headers: {
                        "ApiKey": this.apiKey
                    },
                    uri: this.baseUrl + "/api/settingss"
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
}

/**
 * Settings class for our API
 */
export class Settings {
    /**
     * The subdomain of the organisation of the api
     */
    public organisation: string;
    /**
     * The environment of the API this can be: App, Test or Prod
     */
    public environment: string;
    /**
     * The apitype can be Full or Execution
     */
    public apitype: string;
    /**
     * The authority is the url of the identityserver instance that sign tokens for authentication in our Api
     */
    public authority: string;
    /**
     * The tokenendpoint is the url where you can request tokens with your client/secret
     */
    public tokenendpoint: string;

    constructor(organisation: string, environment: string, apitype: string, authority: string, tokenendpoint: string) {
        this.organisation = organisation;
        this.environment = environment;
        this.apitype = apitype;
        this.authority = authority;
        this.tokenendpoint = tokenendpoint;
    }
}