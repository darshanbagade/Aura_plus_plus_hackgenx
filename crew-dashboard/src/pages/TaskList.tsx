import { useState, useEffect } from "react";
import { TaskCard, Task } from "@/components/TaskCard";
import { fetchTasks, updateTaskStatus } from "@/api/taskApi"; // Import the API functions

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const crewId = "kyxbxjRJKmxazJHkCz5A"; 
    setLoading(true);
    fetchTasks(crewId)
      .then((data) => setTasks(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, newStatus: Task["status"]) => {
    try {
      const updatedTask = await updateTaskStatus(id, newStatus); // Call the API
      if (updatedTask) {
        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === id ? { ...task, status: updatedTask.status } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Today's Tasks</h1>
        <p className="text-sm text-slate-600">
          {tasks.filter((t) => t.status === "completed").length} of {tasks.length} tasks completed
        </p>
      </header>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange} // Pass the status change handler
          />
        ))}
      </div>
    </div>
  );
}