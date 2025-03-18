import { Handler } from '@netlify/functions';
import { sendSuccess } from './utils/api';

const handler: Handler = async (event, context) => {
  return sendSuccess({ status: 'ok', message: 'Server is running' });
};

export { handler }; 