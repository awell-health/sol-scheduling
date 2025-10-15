import { NextRequest, NextResponse } from 'next/server';
import { getSolEnvSettings, API_ROUTES, API_METHODS, getAccessToken } from '../../../../../lib/sol-utils';
import { omit } from 'lodash';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = new Date().valueOf();
  const logMessage = 'SOL: Getting provider';
  const { id } = await params;

  try {
    const settings = getSolEnvSettings({ headers: Object.fromEntries(req.headers.entries()) });
    const accessToken = await getAccessToken(omit(settings, 'baseUrl'));

    const url = `${settings.baseUrl}${
      API_ROUTES[API_METHODS.GET_PROVIDER]
    }?providerId=${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const responseBody = await response.json();
      console.error(`${logMessage}: failed`, {
        providerId: id,
        responseBody,
        errorCode: response.status,
        responseText: response.statusText,
        url,
        performance: new Date().valueOf() - startTime,
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
      providerId: id,
      responseBody: jsonRes,
      url,
      performance: new Date().valueOf() - startTime,
    });

    return NextResponse.json(jsonRes);
  } catch (error) {
    const errMessage = 'Internal Server Error';
    console.error(`${logMessage}: failed - ${errMessage}`, {
      providerId: id,
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