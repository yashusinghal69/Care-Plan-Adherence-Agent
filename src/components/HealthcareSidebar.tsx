import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  UserPlus, 
  Calendar, 
  ChartBar, 
  Moon, 
  Sun, 
  Stethoscope,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

const navigationItems = [
  {
    title: "Patient Registration",
    url: "/",
    icon: UserPlus,
    description: "Register new patients & care plans",
    color: "text-primary"
  },
  {
    title: "Schedule Management",
    url: "/schedule",
    icon: Calendar,
    description: "Manage patient schedules",
    color: "text-accent"
  },
  {
    title: "Adherence Analytics",
    url: "/analytics",
    icon: ChartBar,
    description: "Track compliance & insights",
    color: "text-success"
  },
];

export function HealthcareSidebar() {
  const { state } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="p-2 bg-primary rounded-lg">
            <Stethoscope className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-slide-in">
              <h1 className="text-lg font-bold text-sidebar-foreground">
                HealthTracker
              </h1>
              <p className="text-sm text-sidebar-foreground/70">Care Adherence Pro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={`text-sidebar-foreground/70 uppercase text-xs font-semibold tracking-wider px-4 py-2 ${collapsed ? "sr-only" : ""}`}>
            Healthcare Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-3">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={collapsed ? item.title : undefined}
                    className={collapsed ? "h-12 w-12 p-0 justify-center" : "h-14 rounded-lg transition-all duration-300"}
                  >
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-4 w-full rounded-lg transition-colors ${
                            collapsed ? "p-3 justify-center" : "p-3"
                          } ${
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className={collapsed ? "h-5 w-5" : "h-5 w-5 shrink-0"} />
                        {!collapsed && (
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm text-sidebar-foreground">{item.title}</div>
                            <div className="text-xs text-sidebar-foreground/70 mt-1">{item.description}</div>
                          </div>
                        )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats Section */}
        {!collapsed && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs font-semibold tracking-wider px-4 py-2">System Status</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="bg-sidebar-accent border border-sidebar-border p-3 mx-3 rounded-lg">
                <div className="flex items-center gap-2 text-success">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">All Systems Active</span>
                </div>
                <div className="flex items-center gap-2 text-sidebar-foreground/70 mt-1">
                  <Shield className="h-3 w-3" />
                  <span className="text-xs">HIPAA Compliant</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer with Theme Toggle */}
      <SidebarFooter className="border-t border-sidebar-border">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-center'} px-4 py-3`}>
          <Button
            variant="outline"
            size={collapsed ? "icon" : "sm"}
            onClick={toggleTheme}
            className={`rounded-lg transition-all duration-300 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              collapsed ? "h-10 w-10" : "h-10 w-full"
            }`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" />
                {!collapsed && <span className="ml-2">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                {!collapsed && <span className="ml-2">Dark Mode</span>}
              </>
            )}
          </Button>
        </div>
        
        {!collapsed && (
          <div className="mt-2 text-xs text-sidebar-foreground/50 text-center animate-fade-slide-in">
            Healthcare SaaS v2.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}