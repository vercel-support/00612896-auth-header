import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get all headers from the request
  const headers = request.headers;

  // Check specifically for Authorization header
  const authHeader = headers.get('authorization');
  const authorizationHeaderReceived = !!authHeader;

  // Parse authentication if present
  let authentication = null;
  if (authHeader) {
    // Basic parsing - in real scenario this might decode JWT
    if (authHeader.startsWith('Bearer ')) {
      authentication = {
        type: 'Bearer',
        token: authHeader.substring(7),
        length: authHeader.substring(7).length,
      };
    } else {
      authentication = {
        type: 'Other',
        value: authHeader,
      };
    }
  }

  // Create comprehensive debug response
  const debugResponse = {
    authorizationHeaderReceived,
    authentication,
    message: 'This is a debug response from the server.',

    // Additional debug info that might be helpful
    allHeaders: Object.fromEntries(headers.entries()),
    requestDetails: {
      method: request.method,
      url: request.url,
      authHeader,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(debugResponse, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Add CORS headers in case that's relevant to testing
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
