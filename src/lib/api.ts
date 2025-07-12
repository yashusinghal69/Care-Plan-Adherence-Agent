// API utility for handling base path and requests
const API_BASE_PATH = '/agents/patient-care-agent/api';

// Get the correct API URL based on environment
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Always use the full path since we're deploying to Vercel with base path
  return `${API_BASE_PATH}/${cleanEndpoint}`;
};

// Wrapper function for API calls with proper error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    console.log(`Making API call to: ${url}`);
    const response = await fetch(url, defaultOptions);
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    return result;
  } catch (error) {
    console.error(`API call error for ${url}:`, error);
    throw error;
  }
};
