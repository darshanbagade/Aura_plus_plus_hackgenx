const BACKEND_URL = "http://localhost:5000/api"; // Base URL for the backend API

// Fetch tasks assigned to a specific crew member
export const fetchTasks = async (crewId: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/tasks?assignedTo=${crewId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Update the status of a specific task
export const updateTaskStatus = async (taskId: string, newStatus: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task status:", error);
    return null;
  }
};