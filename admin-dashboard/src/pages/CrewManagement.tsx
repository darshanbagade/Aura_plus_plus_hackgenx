import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Award,
  BarChart3,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { API_BASE_URL } from "../config/config";
import TabBar from "@/components/elements/TabBar";

// Define crew member type
interface CrewMember {
  id: string;
  name: string;
  role: string;
  status: string;
  tasksCompleted: number;
  rating: number;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar?: string;
  performance: {
    efficiency: number;
    reliability: number;
    teamwork: number;
  };
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

const CrewManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);
  const itemsPerPage = 8;

  // Mock crew data - in a real app, this would come from an API
  useEffect(() => {
    const fetchCrewMembers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        setTimeout(() => {
          const mockCrewMembers: CrewMember[] = [
            {
              id: "CREW-001",
              name: "John Smith",
              role: "cleaner",
              status: "active",
              tasksCompleted: 124,
              rating: 4.8,
              email: "john.smith@example.com",
              phone: "(555) 123-4567",
              location: "Building A",
              joinDate: "2022-01-15",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
              performance: {
                efficiency: 92,
                reliability: 95,
                teamwork: 88,
              },
              schedule: {
                monday: "9:00 AM - 5:00 PM",
                tuesday: "9:00 AM - 5:00 PM",
                wednesday: "9:00 AM - 5:00 PM",
                thursday: "9:00 AM - 5:00 PM",
                friday: "9:00 AM - 5:00 PM",
                saturday: "Off",
                sunday: "Off",
              },
            },
            {
              id: "CREW-002",
              name: "Maria Garcia",
              role: "supervisor",
              status: "active",
              tasksCompleted: 98,
              rating: 4.9,
              email: "maria.garcia@example.com",
              phone: "(555) 234-5678",
              location: "Building B",
              joinDate: "2021-11-03",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              performance: {
                efficiency: 94,
                reliability: 96,
                teamwork: 92,
              },
              schedule: {
                monday: "8:00 AM - 4:00 PM",
                tuesday: "8:00 AM - 4:00 PM",
                wednesday: "8:00 AM - 4:00 PM",
                thursday: "8:00 AM - 4:00 PM",
                friday: "8:00 AM - 4:00 PM",
                saturday: "Off",
                sunday: "Off",
              },
            },
            {
              id: "CREW-003",
              name: "Robert Johnson",
              role: "cleaner",
              status: "on-leave",
              tasksCompleted: 87,
              rating: 4.5,
              email: "robert.johnson@example.com",
              phone: "(555) 345-6789",
              location: "Building C",
              joinDate: "2022-03-22",
              avatar: "https://randomuser.me/api/portraits/men/3.jpg",
              performance: {
                efficiency: 85,
                reliability: 88,
                teamwork: 90,
              },
              schedule: {
                monday: "10:00 AM - 6:00 PM",
                tuesday: "10:00 AM - 6:00 PM",
                wednesday: "10:00 AM - 6:00 PM",
                thursday: "10:00 AM - 6:00 PM",
                friday: "10:00 AM - 6:00 PM",
                saturday: "Off",
                sunday: "Off",
              },
            },
            {
              id: "CREW-004",
              name: "Sarah Williams",
              role: "manager",
              status: "active",
              tasksCompleted: 156,
              rating: 4.9,
              email: "sarah.williams@example.com",
              phone: "(555) 456-7890",
              location: "All Buildings",
              joinDate: "2021-08-10",
              avatar: "https://randomuser.me/api/portraits/women/4.jpg",
              performance: {
                efficiency: 96,
                reliability: 98,
                teamwork: 95,
              },
              schedule: {
                monday: "8:00 AM - 5:00 PM",
                tuesday: "8:00 AM - 5:00 PM",
                wednesday: "8:00 AM - 5:00 PM",
                thursday: "8:00 AM - 5:00 PM",
                friday: "8:00 AM - 5:00 PM",
                saturday: "Off",
                sunday: "Off",
              },
            },
            {
              id: "CREW-005",
              name: "Michael Brown",
              role: "maintenance",
              status: "active",
              tasksCompleted: 112,
              rating: 4.7,
              email: "michael.brown@example.com",
              phone: "(555) 567-8901",
              location: "All Buildings",
              joinDate: "2021-12-05",
              avatar: "https://randomuser.me/api/portraits/men/5.jpg",
              performance: {
                efficiency: 90,
                reliability: 92,
                teamwork: 87,
              },
              schedule: {
                monday: "7:00 AM - 3:00 PM",
                tuesday: "7:00 AM - 3:00 PM",
                wednesday: "7:00 AM - 3:00 PM",
                thursday: "7:00 AM - 3:00 PM",
                friday: "7:00 AM - 3:00 PM",
                saturday: "Off",
                sunday: "Off",
              },
            },
            {
              id: "CREW-006",
              name: "Lisa Chen",
              role: "cleaner",
              status: "inactive",
              tasksCompleted: 45,
              rating: 4.2,
              email: "lisa.chen@example.com",
              phone: "(555) 678-9012",
              location: "Building A",
              joinDate: "2022-05-18",
              avatar: "https://randomuser.me/api/portraits/women/6.jpg",
              performance: {
                efficiency: 82,
                reliability: 85,
                teamwork: 80,
              },
              schedule: {
                monday: "11:00 AM - 7:00 PM",
                tuesday: "11:00 AM - 7:00 PM",
                wednesday: "11:00 AM - 7:00 PM",
                thursday: "11:00 AM - 7:00 PM",
                friday: "11:00 AM - 7:00 PM",
                saturday: "Off",
                sunday: "Off",
              },
            },
            {
              id: "CREW-007",
              name: "David Wilson",
              role: "cleaner",
              status: "active",
              tasksCompleted: 78,
              rating: 4.6,
              email: "david.wilson@example.com",
              phone: "(555) 789-0123",
              location: "Building B",
              joinDate: "2022-02-14",
              avatar: "https://randomuser.me/api/portraits/men/7.jpg",
              performance: {
                efficiency: 88,
                reliability: 90,
                teamwork: 92,
              },
              schedule: {
                monday: "9:00 AM - 5:00 PM",
                tuesday: "9:00 AM - 5:00 PM",
                wednesday: "9:00 AM - 5:00 PM",
                thursday: "9:00 AM - 5:00 PM",
                friday: "9:00 AM - 5:00 PM",
                saturday: "Off",
                sunday: "Off",
              },
            },
            {
              id: "CREW-008",
              name: "Emily Davis",
              role: "supervisor",
              status: "active",
              tasksCompleted: 103,
              rating: 4.8,
              email: "emily.davis@example.com",
              phone: "(555) 890-1234",
              location: "Building C",
              joinDate: "2021-10-25",
              avatar: "https://randomuser.me/api/portraits/women/8.jpg",
              performance: {
                efficiency: 93,
                reliability: 94,
                teamwork: 91,
              },
              schedule: {
                monday: "8:00 AM - 4:00 PM",
                tuesday: "8:00 AM - 4:00 PM",
                wednesday: "8:00 AM - 4:00 PM",
                thursday: "8:00 AM - 4:00 PM",
                friday: "8:00 AM - 4:00 PM",
                saturday: "Off",
                sunday: "Off",
              },
            },
          ];
          setCrewMembers(mockCrewMembers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching crew members:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setIsLoading(false);
      }
    };

    fetchCrewMembers();
  }, []);

  // Filter crew members based on search query and filters
  const filteredCrewMembers = crewMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && member.status === "active") ||
      (activeTab === "on-leave" && member.status === "on-leave") ||
      (activeTab === "inactive" && member.status === "inactive");

    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCrewMembers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCrewMembers = filteredCrewMembers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-purple-100 text-purple-800";
      case "supervisor":
        return "bg-blue-100 text-blue-800";
      case "cleaner":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // View member details
  const viewMemberDetails = (member: CrewMember) => {
    setSelectedMember(member);
  };

  return (
    <div className="p-6 space-y-6">
      <TabBar />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Crew Management
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" /> Add Crew Member
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All Crew</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="on-leave">On Leave</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-semibold text-gray-800">
                Crew Members
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by name or ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="cleaner">Cleaner</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading crew members...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Error: {error}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">ID</th>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Tasks Completed</th>
                        <th className="text-left py-3 px-4">Rating</th>
                        <th className="text-left py-3 px-4">Location</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCrewMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 font-medium">{member.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage
                                  src={member.avatar}
                                  alt={member.name}
                                />
                                <AvatarFallback>
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(
                                member.role
                              )}`}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(
                                member.status
                              )}`}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{member.tasksCompleted}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span>{member.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                              <span className="text-sm">{member.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => viewMemberDetails(member)}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredCrewMembers.length)} of{" "}
                    {filteredCrewMembers.length} crew members
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
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

        <TabsContent value="active" className="space-y-4">
          {/* Similar content as "all" tab but filtered for active crew */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-center items-center h-40 text-gray-500">
              Active Crew content (similar to All Crew but filtered)
            </div>
          </div>
        </TabsContent>

        <TabsContent value="on-leave" className="space-y-4">
          {/* Similar content as "all" tab but filtered for on-leave crew */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-center items-center h-40 text-gray-500">
              On Leave Crew content (similar to All Crew but filtered)
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {/* Similar content as "all" tab but filtered for inactive crew */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-center items-center h-40 text-gray-500">
              Inactive Crew content (similar to All Crew but filtered)
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Crew Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Crew</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crewMembers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                crewMembers.filter((member) => member.status === "active")
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {
                crewMembers.filter((member) => member.status === "on-leave")
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(
                crewMembers.reduce((sum, member) => sum + member.rating, 0) /
                crewMembers.length
              ).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crew Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                    />
                    <AvatarFallback>
                      {selectedMember.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {selectedMember.name}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(
                          selectedMember.role
                        )} mr-2`}
                      >
                        {selectedMember.role}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(
                          selectedMember.status
                        )}`}
                      >
                        {selectedMember.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMember(null)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedMember.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedMember.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedMember.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Joined: {formatDate(selectedMember.joinDate)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Efficiency</span>
                        <span className="text-sm font-medium">
                          {selectedMember.performance.efficiency}%
                        </span>
                      </div>
                      <Progress
                        value={selectedMember.performance.efficiency}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Reliability</span>
                        <span className="text-sm font-medium">
                          {selectedMember.performance.reliability}%
                        </span>
                      </div>
                      <Progress
                        value={selectedMember.performance.reliability}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Teamwork</span>
                        <span className="text-sm font-medium">
                          {selectedMember.performance.teamwork}%
                        </span>
                      </div>
                      <Progress
                        value={selectedMember.performance.teamwork}
                        className="h-2"
                      />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">
                          {selectedMember.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({selectedMember.tasksCompleted} tasks completed)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Work Schedule</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(selectedMember.schedule).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className="text-center p-2 border rounded-md"
                      >
                        <div className="font-medium capitalize">{day}</div>
                        <div className="text-sm text-gray-500">{hours}</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedMember(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewManagement;
