import { NextRequest, NextResponse } from 'next/server';
import { getSolEnvSettings, API_ROUTES, API_METHODS, getAccessToken } from '../../../../lib/sol-utils';
import { omit } from 'lodash';

export async function POST(req: NextRequest) {
  const startTime = new Date().valueOf();
  const logMessage = 'SOL: Booking appointment';

  try {
    const body = await req.json();
    const { input, logContext } = body;

    const settings = getSolEnvSettings({ headers: Object.fromEntries(req.headers.entries()) });
    const accessToken = await getAccessToken(omit(settings, 'baseUrl'));

    console.log(`${logMessage}: parsing body`, {
      requestBody: input,
      context: logContext,
    });

    // Basic validation - ensure required fields exist
    if (!input?.eventId || !input?.providerId) {
      return NextResponse.json(
        { error: { message: 'Missing required fields: eventId, providerId' } },
        { status: 400 }
      );
    }

    const url = `${settings.baseUrl}${API_ROUTES[API_METHODS.BOOK_EVENT]}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const responseBody = await response.json();
      console.error(`${logMessage}: failed`, {
        requestBody: input,
        responseBody,
        errorCode: response.status,
        responseText: response.statusText,
        url,
        performance: new Date().valueOf() - startTime,
        context: logContext,
      });

      return NextResponse.json(
        {
          error: `Request failed with status ${response.status}`,
          errorCode: String(response.status),
        },
        { status: response.status }
      );
    }

    const jsonRes = await response.json();

    console.log(`${logMessage}: success`, {
      requestBody: input,
      responseBody: jsonRes,
      url,
      performance: new Date().valueOf() - startTime,
      context: logContext,
    });

    return NextResponse.json(jsonRes);
  } catch (error) {
    const errMessage = 'Internal Server Error';
    console.error(`${logMessage}: failed - ${errMessage}`, {
      error,
    });

    return NextResponse.json(
      {
        error: errMessage,
        errorCode: '500',
      },
      { status: 500 }
    );
  }
}