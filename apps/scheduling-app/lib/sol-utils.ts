import { IncomingHttpHeaders } from 'http';
import { z } from 'zod';

const HeadersSchema = z.object({
  'x-sol-api-url': z.string().nonempty('x-sol-api-url header is required'),
});

const EnvSchema = z.object({
  SOL_AUTH_URL: z.string().nonempty('SOL_AUTH_URL env variable is missing'),
  SOL_CLIENT_ID: z.string().nonempty('SOL_CLIENT_ID env variable is missing'),
  SOL_CLIENT_SECRET: z
    .string()
    .nonempty('SOL_CLIENT_SECRET env variable is missing'),
  SOL_RESOURCE: z.string().nonempty('SOL_RESOURCE env variable is missing'),
});

export const SettingsSchema = HeadersSchema.merge(EnvSchema);

export type SolEnvSettings = z.infer<typeof SettingsSchema>;

type GetSolEnvSettings = ({ headers }: { headers: IncomingHttpHeaders }) => {
  authUrl: string;
  clientId: string;
  clientSecret: string;
  resource: string;
  baseUrl: string;
};

export const getSolEnvSettings: GetSolEnvSettings = ({ headers }) => {
  const parsedHeaders = HeadersSchema.safeParse(headers);

  if (!parsedHeaders.success) {
    const errorMessages = parsedHeaders.error.errors
      .map((e) => e.message)
      .join(', ');
    console.error('Header validation failed:', {
      headers: Object.keys(headers),
      errors: parsedHeaders.error.errors,
    });
    throw new Error(`Header validation failed: ${errorMessages}`);
  }

  console.log('Environment variables check:', {
    SOL_AUTH_URL: process.env.SOL_AUTH_URL ? '✓ Set' : '✗ Missing',
    SOL_CLIENT_ID: process.env.SOL_CLIENT_ID ? '✓ Set' : '✗ Missing',
    SOL_CLIENT_SECRET: process.env.SOL_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
    SOL_RESOURCE: process.env.SOL_RESOURCE ? '✓ Set' : '✗ Missing',
  });

  const parsedEnv = EnvSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    const errorMessages = parsedEnv.error.errors
      .map((e) => e.message)
      .join(', ');
    console.error('Environment variable validation failed:', {
      errors: parsedEnv.error.errors,
      env: {
        SOL_AUTH_URL: process.env.SOL_AUTH_URL,
        SOL_CLIENT_ID: process.env.SOL_CLIENT_ID,
        SOL_CLIENT_SECRET: process.env.SOL_CLIENT_SECRET ? '[REDACTED]' : undefined,
        SOL_RESOURCE: process.env.SOL_RESOURCE,
      }
    });
    throw new Error(`Environment variable validation failed: ${errorMessages}`);
  }

  return {
    authUrl: parsedEnv.data.SOL_AUTH_URL,
    clientId: parsedEnv.data.SOL_CLIENT_ID,
    clientSecret: parsedEnv.data.SOL_CLIENT_SECRET,
    resource: parsedEnv.data.SOL_RESOURCE,
    baseUrl: parsedHeaders.data['x-sol-api-url'],
  };
};

export enum API_METHODS {
  GET_PROVIDER = 'GET_PROVIDER',
  GET_PROVIDERS = 'GET_PROVIDERS',
  GET_AVAILABILITY = 'GET_AVAILABILITY',
  BOOK_EVENT = 'BOOK_EVENT',
  GET_EVENT = 'GET_EVENT',
}

export const API_ROUTES: Record<API_METHODS, string> = {
  [API_METHODS.GET_PROVIDER]: '/api/provider/info',
  [API_METHODS.GET_PROVIDERS]: '/api/v2/provider',
  [API_METHODS.GET_AVAILABILITY]: '/api/event/list',
  [API_METHODS.BOOK_EVENT]: '/api/event/book',
  [API_METHODS.GET_EVENT]: '/api/event',
};

// Simple access token management for the standalone app
export async function getAccessToken(settings: {
  authUrl: string;
  clientId: string;
  clientSecret: string;
  resource: string;
}): Promise<string> {
  try {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: settings.clientId,
      client_secret: settings.clientSecret,
      resource: settings.resource,
    });

    console.log('OAuth Request:', {
      url: settings.authUrl,
      clientId: settings.clientId,
      resource: settings.resource,
      grantType: 'client_credentials',
      // Don't log the secret for security
    });

    const response = await fetch(settings.authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Auth failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        url: settings.authUrl,
        clientId: settings.clientId,
        resource: settings.resource,
      });
      throw new Error(`Auth failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();

    if (!data.access_token) {
      console.error('No access_token in response:', data);
      throw new Error('No access_token returned from OAuth endpoint');
    }

    console.log('OAuth Success:', {
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      scope: data.scope,
    });

    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}