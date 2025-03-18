import { HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';

// CORS headers for all responses
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

// Handler for OPTIONS requests (preflight CORS)
export const handleOptions = (): HandlerResponse => {
  return {
    statusCode: 204,
    headers,
    body: ''
  };
};

// Success response helper
export const sendSuccess = (data: any): HandlerResponse => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(data)
  };
};

// Error response helper
export const sendError = (statusCode: number, message: string): HandlerResponse => {
  return {
    statusCode,
    headers,
    body: JSON.stringify({ error: message })
  };
};

// Handler wrapper for try/catch and common logic
export const apiHandler = (handler: (event: HandlerEvent, context: HandlerContext) => Promise<HandlerResponse>) => {
  return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return handleOptions();
    }
    
    try {
      return await handler(event, context);
    } catch (error) {
      console.error('Function error:', error);
      return sendError(500, 'Internal Server Error');
    }
  };
}; 