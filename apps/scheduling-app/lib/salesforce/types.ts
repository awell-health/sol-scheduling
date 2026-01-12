import { z } from 'zod';

// Salesforce API configuration
export const SalesforceConfigSchema = z.object({
  subdomain: z.string().min(1),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  apiVersion: z.string().default('v61.0'),
});

export type SalesforceConfig = z.infer<typeof SalesforceConfigSchema>;

// OAuth token response
export const OAuthTokenResponseSchema = z.object({
  access_token: z.string(),
  instance_url: z.string(),
  token_type: z.string(),
  issued_at: z.string(),
});

export type OAuthTokenResponse = z.infer<typeof OAuthTokenResponseSchema>;

// Create record response
export const CreateRecordResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
  errors: z.array(z.unknown()),
});

export type CreateRecordResponse = z.infer<typeof CreateRecordResponseSchema>;

// Lead data for creation
export interface LeadCreateData {
  Phone: string;
  FirstName?: string;
  LastName?: string;
  Company?: string;
  State?: string;
  LeadSource?: string;
  Description?: string;
  // Custom fields can be added here
  [key: string]: unknown;
}

// Lead data for updates
export interface LeadUpdateData {
  Insurance_Company_Name__c?: string;
  Appointment_Booked__c?: boolean;
  Appointment_Provider_Id__c?: string;
  Appointment_Time__c?: string;
  Service_Type__c?: string;
  UTM_Source__c?: string;
  UTM_Medium__c?: string;
  UTM_Campaign__c?: string;
  // Service type boolean fields
  Medication__c?: boolean;
  Therapy__c?: boolean;
  // Contact consent fields
  Contact_Consent__c?: boolean;
  Contact_Consent_Timestamp__c?: string;
  // Allow any custom field
  [key: string]: unknown;
}

