
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LayoutDashboard, LogOut } from "lucide-react";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    navigate("/login");
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div 
        className={cn(
          "bg-white shadow-md transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 border-b border-gray-200">
          {!collapsed && (
            <h2 className="text-xl font-bold text-blue-600">Facility AI</h2>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <span className="text-xl font-bold text-blue-600">F</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 py-6">
          <nav className="px-2 space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={20} />}
              title="Dashboard"
              active={isActive("/dashboard")}
              collapsed={collapsed}
              onClick={() => navigate("/dashboard")}
            />
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm rounded-md",
              "text-gray-700 hover:bg-gray-100"
            )}
          >
            <LogOut size={20} className="mr-2" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
        
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 text-sm text-gray-500 rounded-md hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm py-2 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Facility Cleanliness Manager
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              M
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-700">Manager</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, title, active, collapsed, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md",
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <div className={cn(collapsed ? "mr-0" : "mr-3")}>{icon}</div>
      {!collapsed && <span>{title}</span>}
    </button>
  );
};

export default DashboardLayout;
