
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

const SummaryCard = ({ title, value, icon, trend, color }: SummaryCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "green":
        return "bg-green-50 text-green-600 border-green-100";
      case "yellow":
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "purple":
        return "bg-purple-50 text-purple-600 border-purple-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <Card className="shadow-md border-t-4 border-t-blue-500">
      <CardContent className="p-4 flex items-center">
        <div className={cn("p-3 rounded-full mr-4", getColorClasses())}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-gray-500">{trend}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
