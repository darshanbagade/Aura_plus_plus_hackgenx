import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Trash2, Droplets } from "lucide-react";

export type Task = {
  id: string;
  type: "garbage" | "spill";
  location: string;
  time: string;
  status: "pending" | "in_progress" | "completed";
};

type TaskCardProps = {
  task: Task;
  onStatusChange: (id: string, status: Task["status"]) => void;
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  console.log("Task Status:", task.status); // Debugging

  return (
    <Card className="p-4 space-y-4">
      {/* Task Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {task.type === "garbage" ? (
            <Trash2 className="h-5 w-5 text-slate-600" />
          ) : (
            <Droplets className="h-5 w-5 text-slate-600" />
          )}
          <span className="font-medium text-slate-900 capitalize">{task.type}</span>
        </div>
        <Badge className={getStatusColor(task.status)}>
          {task.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Task Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-4 w-4" />
          <span>{task.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-4 w-4" />
          <span>{task.time}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {task.status !== "completed" && (
        <>
          
              <button
              className="w-full p-[10px] bg-green-400 text-black border-none rounded-xl"
                onClick={() => onStatusChange(task.id, "in_progress")}
              >
                Start Task
              </button>
          <div className="flex gap-2 pt-2">
            {task.status === "pending"}
            {task.status === "in_progress" && (
              <button
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#10b981", // Green
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  console.log(`Complete Task button clicked for task ID: ${task.id}`);
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(() => {
                      onStatusChange(task.id, "completed");
                    });
                  } else {
                    onStatusChange(task.id, "completed");
                  }
                }}
              >
                Complete Task
              </button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}