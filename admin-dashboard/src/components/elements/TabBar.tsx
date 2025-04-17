import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useNavigate } from "react-router-dom";

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Tabs defaultValue="tasks" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tasks" onClick={() => navigate("/tasks")}>Tasks</TabsTrigger>
       
        <TabsTrigger value="analytics" onClick={() => navigate("/analytics")}>
          Analytics
        </TabsTrigger>
        <TabsTrigger value="live" onClick={() => navigate("/live-footage")}>Live Footage</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabBar;
