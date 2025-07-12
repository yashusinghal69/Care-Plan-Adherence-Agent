// Helper function to make API calls that work both locally and on Vercel
export const apiCall = async (endpoint: string, options: RequestInit) => {
  // Use relative paths that work both in development and production
  const url = `/api/${endpoint}`;

  console.log(`Making API call to: ${url}`);
  console.log("Current location:", window.location.href);

  try {
    const response = await fetch(url, options);
    console.log(`API response status: ${response.status}`);
    return response;
  } catch (error) {
    console.error(`API call failed for ${url}:`, error);
    throw error;
  }
};
