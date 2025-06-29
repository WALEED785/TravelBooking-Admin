export const fetchData = async (endpoint) => {
  // Simulate API call
  return new Promise((resolve) =>
    setTimeout(() => resolve({ message: `Fetched data from ${endpoint}` }), 500)
  );
};
