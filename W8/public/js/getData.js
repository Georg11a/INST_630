// getData.js
// A utility function to fetch data from API endpoints

/**
 * Fetches data from the specified URL and returns it as JSON
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<object>} - The fetched data as a JSON object
 */
async function getData(url) {
  try {
    // Fetch data from the URL
    const response = await fetch(url);
    console.log('Fetching data from server:', response);
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    console.log('Successfully parsed data:', data);
    
    // Return the data for use in the application
    return data;
  } catch (error) {
    // Log and re-throw any errors for handling in the calling code
    console.error('Error in getData:', error);
    throw error;
  }
}

// Export the function for use in other modules
export default getData;