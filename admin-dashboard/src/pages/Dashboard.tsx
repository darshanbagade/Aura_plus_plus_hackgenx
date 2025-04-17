import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import TaskTable from "@/components/tasks/TaskTable";
import { API_BASE_URL } from "../config/config";
import TabBar from "@/components/elements/TabBar";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 8;

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on search query, task type, and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      taskTypeFilter === "all" || task.type === taskTypeFilter;
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  // Handlers for pagination
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Facility Management Dashboard
      </h1>

      <TabBar />

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsContent value="tasks" className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-semibold text-gray-800">All Tasks</h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search task or location..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={taskTypeFilter}
                    onValueChange={setTaskTypeFilter}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Task Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="garbage">Garbage</SelectItem>
                        <SelectItem value="spill">Spill</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center text-gray-500">Loading tasks...</div>
            ) : error ? (
              <div className="text-center text-red-500">Error: {error}</div>
            ) : (
              <>
                <TaskTable tasks={currentTasks} />

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredTasks.length)} of{" "}
                    {filteredTasks.length} tasks
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-sm">
                      Page {currentPage} of {totalPages || 1}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Other Tabs (Crew Management, Analytics, Live Footage) remain unchanged */}
      </Tabs>
    </div>
  );
};

export default Dashboard;
