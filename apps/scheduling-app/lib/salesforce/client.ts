import {
  type SalesforceConfig,
  SalesforceConfigSchema,
  OAuthTokenResponseSchema,
  CreateRecordResponseSchema,
  type CreateRecordResponse,
  type LeadCreateData,
  type LeadUpdateData,
} from './types';

// In-memory token cache (in production, use Redis or similar)
let tokenCache: {
  accessToken: string;
  instanceUrl: string;
  expiresAt: number;
} | null = null;

export class SalesforceClient {
  private config: SalesforceConfig;

  constructor(config: Partial<SalesforceConfig>) {
    this.config = SalesforceConfigSchema.parse({
      subdomain: config.subdomain ?? process.env.SALESFORCE_SUBDOMAIN,
      clientId: config.clientId ?? process.env.SALESFORCE_CLIENT_ID,
      clientSecret: config.clientSecret ?? process.env.SALESFORCE_CLIENT_SECRET,
      apiVersion: config.apiVersion ?? process.env.SALESFORCE_API_VERSION ?? 'v61.0',
    });
  }

  private get authUrl(): string {
    return `https://${this.config.subdomain}.my.salesforce.com/services/oauth2/token`;
  }

  private get apiUrl(): string {
    return `https://${this.config.subdomain}.my.salesforce.com`;
  }

  private async getAccessToken(): Promise<{ accessToken: string; instanceUrl: string }> {
    // Check cache
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
      return {
        accessToken: tokenCache.accessToken,
        instanceUrl: tokenCache.instanceUrl,
      };
    }

    // Request new token using client credentials flow
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    const response = await fetch(this.authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Salesforce OAuth failed: ${response.status} ${text}`);
    }

    const data = OAuthTokenResponseSchema.parse(await response.json());

    // Cache for 1 hour (tokens typically last 2 hours)
    tokenCache = {
      accessToken: data.access_token,
      instanceUrl: data.instance_url,
      expiresAt: Date.now() + 60 * 60 * 1000,
    };

    return {
      accessToken: data.access_token,
      instanceUrl: data.instance_url,
    };
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH',
    path: string,
    body?: unknown,
    additionalHeaders?: Record<string, string>
  ): Promise<T> {
    const { accessToken, instanceUrl } = await this.getAccessToken();
    const url = `${instanceUrl}/services/data/${this.config.apiVersion}${path}`;

    const init: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...additionalHeaders,
      },
    };

    if (body) {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);

    // PATCH requests return 204 No Content on success
    if (method === 'PATCH' && response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Salesforce API error: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Create a new Lead in Salesforce
   */
  async createLead(data: LeadCreateData): Promise<CreateRecordResponse> {
    // Ensure required fields have defaults
    const leadData = {
      Company: '[Not Provided]', // Required field in Salesforce
      LastName: '[Unknown]', // Required field in Salesforce
      ...data,
    };

    const response = await this.request<unknown>(
      'POST',
      '/sobjects/Lead/',
      leadData,
      {
        'Sforce-Duplicate-Rule-Header': 'allowSave=true',
      }
    );

    return CreateRecordResponseSchema.parse(response);
  }

  /**
   * Update an existing Lead in Salesforce
   */
  async updateLead(leadId: string, data: LeadUpdateData): Promise<void> {
    await this.request<void>('PATCH', `/sobjects/Lead/${leadId}`, data);
  }

  /**
   * Get a Lead by ID
   */
  async getLead(leadId: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('GET', `/sobjects/Lead/${leadId}`);
  }
}

// Singleton instance
let clientInstance: SalesforceClient | null = null;

export function getSalesforceClient(): SalesforceClient {
  if (!clientInstance) {
    clientInstance = new SalesforceClient({});
  }
  return clientInstance;
}

