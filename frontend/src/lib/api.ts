/**
 * API client for communicating with the backend
 */

// Change from absolute URL to relative URL to work with Next.js rewrites
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = '';

/**
 * Makes a fetch request to the API
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  if (options.body) {
    console.log('Request body:', options.body);
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log(`Response status for ${endpoint}:`, response.status);

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorText = await response.text();
        console.error(`API error response for ${endpoint}:`, errorText);
        
        if (errorText) {
          try {
            const errorJson = JSON.parse(errorText);
            errorDetail = errorJson.error || errorJson.message || errorText;
          } catch (e) {
            errorDetail = errorText;
          }
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }

      throw new Error(errorDetail || `API error (${response.status}) for ${endpoint}`);
    }

    // Some endpoints might return 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * API methods for interacting with the backend
 */
export const api = {
  // Leads
  getLeads: () => fetchAPI('/api/leads'),
  getLeadById: (id: string) => fetchAPI(`/api/leads/${id}`),
  createLead: (data: any) => fetchAPI('/api/leads', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  updateLead: (id: string, data: any) => fetchAPI(`/api/leads/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  deleteLead: (id: string) => fetchAPI(`/api/leads/${id}`, { 
    method: 'DELETE' 
  }),

  // Companies
  getCompanies: () => fetchAPI('/api/companies'),
  getCompanyById: (id: string) => fetchAPI(`/api/companies/${id}`),
  createCompany: (data: any) => fetchAPI('/api/companies', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  updateCompany: (id: string, data: any) => fetchAPI(`/api/companies/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  deleteCompany: (id: string) => fetchAPI(`/api/companies/${id}`, { 
    method: 'DELETE' 
  }),

  // Interactions
  getInteractions: () => fetchAPI('/api/interactions'),
  getInteractionById: (id: string) => fetchAPI(`/api/interactions/${id}`),
  createInteraction: (data: any) => fetchAPI('/api/interactions', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  updateInteraction: (id: string, data: any) => fetchAPI(`/api/interactions/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  deleteInteraction: (id: string) => fetchAPI(`/api/interactions/${id}`, { 
    method: 'DELETE' 
  }),

  // Deals
  getDeals: () => fetchAPI('/api/deals'),
  getDealById: (id: string) => fetchAPI(`/api/deals/${id}`),
  createDeal: (data: any) => fetchAPI('/api/deals', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  updateDeal: (id: string, data: any) => fetchAPI(`/api/deals/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  deleteDeal: (id: string) => fetchAPI(`/api/deals/${id}`, { 
    method: 'DELETE' 
  }),

  // Tasks
  getTasks: () => fetchAPI('/api/tasks'),
  getTaskById: (id: string) => fetchAPI(`/api/tasks/${id}`),
  createTask: (data: any) => fetchAPI('/api/tasks', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  updateTask: (id: string, data: any) => fetchAPI(`/api/tasks/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  deleteTask: (id: string) => fetchAPI(`/api/tasks/${id}`, { 
    method: 'DELETE' 
  }),
};

export default api; 