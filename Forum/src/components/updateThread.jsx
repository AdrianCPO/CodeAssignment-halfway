export const updateThread = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/threads");
    if (!response.ok) {
      throw new Error("Failed to fetch threads");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Returnera en tom array om något går fel
  }
};
