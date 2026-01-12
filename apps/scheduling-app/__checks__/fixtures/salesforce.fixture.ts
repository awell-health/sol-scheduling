import { test as base } from '@playwright/test';

/**
 * Salesforce OAuth token response
 */
interface SalesforceToken {
  accessToken: string;
  instanceUrl: string;
  tokenType: string;
  issuedAt: string;
}

/**
 * Lead data structure for inspecting Salesforce leads
 */
interface SalesforceLeadData {
  Id: string;
  Phone?: string;
  State?: string;
  FirstName?: string;
  LastName?: string;
  LeadSource?: string;
  Status?: string;
  IsConverted?: boolean;
  /** Custom fields */
  Insurance_Company_Name__c?: string;
  Medication__c?: boolean;
  Therapy__c?: boolean;
  Contact_Consent__c?: boolean;
  Contact_Consent_Timestamp__c?: string;
  Appointment_Booked__c?: boolean;
  Appointment_Provider_Id__c?: string;
  Appointment_Time__c?: string;
  UTM_Source__c?: string;
  UTM_Medium__c?: string;
  UTM_Campaign__c?: string;
  /** Allow any additional fields */
  [key: string]: unknown;
}

/**
 * Salesforce client configuration from environment
 */
interface SalesforceConfig {
  subdomain: string;
  clientId: string;
  clientSecret: string;
  apiVersion: string;
}

/**
 * Salesforce test client for Checkly tests
 * Handles OAuth authentication and provides methods to interact with Salesforce
 */
export class SalesforceTestClient {
  private config: SalesforceConfig;
  private token: SalesforceToken | null = null;

  constructor(config: SalesforceConfig) {
    this.config = config;
  }

  private get authUrl(): string {
    return `https://${this.config.subdomain}.my.salesforce.com/services/oauth2/token`;
  }

  /**
   * Get an OAuth access token using client credentials flow
   */
  async getToken(): Promise<SalesforceToken> {
    if (this.token) {
      return this.token;
    }

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

    const data = await response.json();
    this.token = {
      accessToken: data.access_token,
      instanceUrl: data.instance_url,
      tokenType: data.token_type,
      issuedAt: data.issued_at,
    };

    return this.token;
  }

  /**
   * Make an authenticated request to Salesforce API
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown
  ): Promise<T> {
    const token = await this.getToken();
    const url = `${token.instanceUrl}/services/data/${this.config.apiVersion}${path}`;

    const init: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, init);

    // Handle 204 No Content (common for PATCH/DELETE)
    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Salesforce API error: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Get a lead by ID
   */
  async getLead(leadId: string): Promise<SalesforceLeadData> {
    return this.request<SalesforceLeadData>('GET', `/sobjects/Lead/${leadId}`);
  }

  /**
   * Query leads using SOQL
   */
  async queryLeads(soql: string): Promise<{ records: SalesforceLeadData[] }> {
    const encoded = encodeURIComponent(soql);
    return this.request<{ records: SalesforceLeadData[] }>('GET', `/query?q=${encoded}`);
  }

  /**
   * Find a lead by phone number
   */
  async findLeadByPhone(phone: string): Promise<SalesforceLeadData | null> {
    const soql = `SELECT Id, Phone, FirstName, LastName, Status, IsConverted, Insurance_Company_Name__c, Medication__c, Therapy__c, Contact_Consent__c FROM Lead WHERE Phone = '${phone}' LIMIT 1`;
    const result = await this.queryLeads(soql);
    return result.records[0] ?? null;
  }

  /**
   * Delete a lead by ID
   */
  async deleteLead(leadId: string): Promise<void> {
    await this.request<void>('DELETE', `/sobjects/Lead/${leadId}`);
  }

  /**
   * Update a lead by ID
   */
  async updateLead(leadId: string, data: Partial<SalesforceLeadData>): Promise<void> {
    await this.request<void>('PATCH', `/sobjects/Lead/${leadId}`, data);
  }

  /**
   * Create a new lead
   */
  async createLead(data: Partial<SalesforceLeadData>): Promise<{ id: string; success: boolean }> {
    const leadData = {
      Company: '[Test Lead]',
      LastName: '[Test]',
      ...data,
    };
    return this.request<{ id: string; success: boolean }>('POST', '/sobjects/Lead/', leadData);
  }
}

/**
 * Salesforce fixture options
 */
interface SalesforceFixtureOptions {
  /** Custom config override - use env vars by default */
  config?: Partial<SalesforceConfig>;
}

/**
 * Create a Salesforce fixture for Playwright/Checkly tests
 */
export function createSalesforceFixture(options: SalesforceFixtureOptions = {}) {
  return base.extend<{ salesforce: SalesforceTestClient }>({
    salesforce: async ({}, use) => {
      const config: SalesforceConfig = {
        subdomain: options.config?.subdomain ?? process.env.SALESFORCE_SUBDOMAIN ?? '',
        clientId: options.config?.clientId ?? process.env.SALESFORCE_CLIENT_ID ?? '',
        clientSecret: options.config?.clientSecret ?? process.env.SALESFORCE_CLIENT_SECRET ?? '',
        apiVersion: options.config?.apiVersion ?? process.env.SALESFORCE_API_VERSION ?? 'v61.0',
      };

      // Validate required config
      if (!config.subdomain || !config.clientId || !config.clientSecret) {
        throw new Error(
          'Salesforce config missing. Set SALESFORCE_SUBDOMAIN, SALESFORCE_CLIENT_ID, and SALESFORCE_CLIENT_SECRET environment variables.'
        );
      }

      const client = new SalesforceTestClient(config);
      
      // Pre-authenticate to validate credentials
      await client.getToken();
      
      await use(client);
    },
  });
}

/**
 * Default Salesforce test fixture using environment variables
 * 
 * @example
 * ```ts
 * import { salesforceTest } from './fixtures/salesforce.fixture';
 * 
 * salesforceTest('can fetch a lead', async ({ salesforce }) => {
 *   const lead = await salesforce.getLead('00Q123456789ABC');
 *   expect(lead.Phone).toBe('+12125551234');
 * });
 * ```
 */
export const salesforceTest = createSalesforceFixture();

/**
 * Helper to clean up test leads after tests
 */
export async function cleanupTestLead(
  salesforce: SalesforceTestClient,
  leadId: string
): Promise<void> {
  try {
    await salesforce.deleteLead(leadId);
  } catch (error) {
    // Ignore errors if lead doesn't exist or was already deleted
    console.log(`[cleanup] Could not delete lead ${leadId}:`, error);
  }
}

export type { SalesforceLeadData, SalesforceToken, SalesforceConfig };
