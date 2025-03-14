export const apiRequest = async (
  url,
  options = {},
  errorMessage = "API-request failed"
) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errText = `${errorMessage} (HTTP ${response.status} ${response.statusText})`;
      throw new Error(errText);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    }
    return null;
  } catch (error) {
    // Om felet är 404, undvik att logga det i konsolen
    if (!error.message.includes("HTTP 404")) {
      console.error(errorMessage, error);
    }
    throw error;
  }
};
