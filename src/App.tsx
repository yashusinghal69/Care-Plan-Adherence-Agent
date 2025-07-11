import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HealthcareSidebar } from "@/components/HealthcareSidebar";
import { PatientRegistration } from "@/components/PatientRegistration";
import { ScheduleManagement } from "@/components/ScheduleManagement";
import { AdherenceAnalytics } from "@/components/AdherenceAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner 
        theme="system"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
      />
      <BrowserRouter basename="/agents/patient-care-agent">
        <SidebarProvider>
          <div className="min-h-screen w-full bg-background">
            <div className="flex h-screen">
              <HealthcareSidebar />
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Global Header */}
                <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
                  <div className="flex items-center justify-between h-full px-6">
                    <SidebarTrigger className="p-2" />
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        Healthcare Care Adherence Tracker
                      </div>
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-muted/30">
                  <div className="p-6">
                    <Routes>
                      <Route path="/" element={<PatientRegistration />} />
                      <Route path="/schedule" element={<ScheduleManagement />} />
                      <Route path="/analytics" element={<AdherenceAnalytics />} />
                      <Route path="*" element={
                        <div className="space-y-6 animate-fade-slide-in">
                          <div className="medical-card p-8 text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
                            <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
                            <a href="/" className="btn-medical">Return to Patient Registration</a>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
