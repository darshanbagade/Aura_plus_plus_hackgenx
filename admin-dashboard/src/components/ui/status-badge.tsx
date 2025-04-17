
import React from "react";
import { cn } from "@/lib/utils";
import { Clock, Loader2, CheckCircle, UserCheck } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case "assigned":
        return {
          label: "Assigned",
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <UserCheck className="h-3 w-3 mr-1" />
        };
      case "in-progress":
        return {
          label: "In Progress",
          className: "bg-orange-100 text-orange-800 border-orange-200",
          icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        };
      case "completed":
        return {
          label: "Completed",
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      config.className,
      className
    )}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
