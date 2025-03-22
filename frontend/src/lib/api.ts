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
  
  console.log('Fetching from:', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred while fetching the data.');
    }

    return response.json();
  } catch (error) {
    console.error('API fetch error:', error);
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