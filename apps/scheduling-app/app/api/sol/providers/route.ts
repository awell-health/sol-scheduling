import { NextRequest, NextResponse } from 'next/server';
import { getSolEnvSettings, API_ROUTES, API_METHODS, getAccessToken } from '../../../../lib/sol-utils';
import { omit, isEmpty, isNil } from 'lodash';

export async function POST(req: NextRequest) {
  const startTime = new Date().valueOf();
  const logMessage = 'SOL: Getting providers';

  try {
    const body = await req.json();
    const { input, logContext } = body;

    const settings = getSolEnvSettings({ headers: Object.fromEntries(req.headers.entries()) });
    const accessToken = await getAccessToken(omit(settings, 'baseUrl'));

    // Remove nil and empty values from input
    const modifiedInput = Object.fromEntries(
      Object.entries(input || {}).filter(
        ([_, value]) => !isNil(value) && !isEmpty(value)
      )
    );

    console.log(`${logMessage}: parsing body`, {
      requestBody: input,
      modifiedInput,
      context: logContext,
    });

    const url = `${settings.baseUrl}${API_ROUTES[API_METHODS.GET_PROVIDERS]}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedInput),
    });

    if (!response.ok) {
      const responseBody = await response.json();
      console.error(`${logMessage}: failed`, {
        requestBody: input,
        validatedRequestBody: modifiedInput,
        responseText: response.statusText,
        responseBody,
        errorCode: response.status,
        url,
        performance: new Date().valueOf() - startTime,
        context: logContext,
      });

      return NextResponse.json(
        {
          error: `Request failed with status ${response.status}`,
          data: `${JSON.stringify(responseBody)}`,
          errorCode: String(response.status),
        },
        { status: response.status }
      );
    }

    const jsonRes = await response.json();

    if (isEmpty(jsonRes.data)) {
      console.warn(`${logMessage}: failed - no data returned`, {
        requestBody: modifiedInput,
        responseBody: jsonRes,
        responseText: response.statusText,
        errorCode: response.status,
        url,
        performance: new Date().valueOf() - startTime,
        context: logContext,
      });
      return NextResponse.json({ data: [] }, { status: 404 });
    }

    console.log(`${logMessage}: success`, {
      requestBody: modifiedInput,
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