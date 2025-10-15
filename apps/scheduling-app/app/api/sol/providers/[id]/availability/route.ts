import { NextRequest, NextResponse } from 'next/server';
import { getSolEnvSettings, API_ROUTES, API_METHODS, getAccessToken } from '../../../../../../lib/sol-utils';
import { omit, isEmpty } from 'lodash';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = new Date().valueOf();
  const logMessage = 'SOL: Getting availability';
  const { id } = await params;

  try {
    const settings = getSolEnvSettings({ headers: Object.fromEntries(req.headers.entries()) });
    const accessToken = await getAccessToken(omit(settings, 'baseUrl'));

    const url = `${settings.baseUrl}${API_ROUTES[API_METHODS.GET_AVAILABILITY]}`;

    const requestBody = {
      providerId: [id],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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

    // Log a sample of the data to see the structure
    if (jsonRes.data?.[id] && Array.isArray(jsonRes.data[id]) && jsonRes.data[id].length > 0) {
      console.log('Sample availability slot:', JSON.stringify(jsonRes.data[id][0], null, 2));
    }

    if (isEmpty(jsonRes.data?.[id])) {
      console.warn(`${logMessage}: failed - no data returned`, {
        providerId: id,
        requestBody,
        responseBody: jsonRes,
        responseText: response.statusText,
        errorCode: response.status,
        url,
        performance: new Date().valueOf() - startTime,
      });
      return NextResponse.json({ data: [] }, { status: 404 });
    }

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
      error,
      providerId: id,
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