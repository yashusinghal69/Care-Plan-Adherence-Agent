import { useState } from "react";
import {
  Calendar,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { createApiUrl } from "@/lib/api";

interface ScheduleItem {
  time: string;
  task: string;
}

interface ScheduleData {
  patient_id: string;
  name: string;
  daily_reminders: ScheduleItem[];
}

export function ScheduleManagement() {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || !patientName) {
      toast.error("Please enter both Patient ID and Patient Name");
      return;
    }

    setIsLoading(true);

    try {
      // Merge patient ID and name as specified
      const mergedInput = `${patientId} ${patientName}`;

      // API Call to generate schedule
      const response = await fetch(
        createApiUrl(`/api/scheduler-proxy`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_value: mergedInput,
            output_type: "text",
            input_type: "text",
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Parse the nested response structure
        const responseText =
          result.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text;

        if (responseText) {
          const parsedData = JSON.parse(responseText);
          setScheduleData(parsedData);

          toast.success(
            "📅 Tasks successfully scheduled for Google Calendar!",
            {
              description: `Schedule created for ${parsedData.name}`,
              duration: 4000,
            }
          );
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Failed to generate schedule");
      }
    } catch (error) {
      console.error("Schedule generation error:", error);
      toast.error("Failed to generate schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPatientId("");
    setPatientName("");
    setScheduleData(null);
  };

  return (
    <div className="space-y-6 animate-fade-slide-in">
      {/* Header */}
      <div className="medical-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Calendar className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Schedule Management Center
            </h1>
            <p className="text-muted-foreground">
              Generate and manage patient care schedules
            </p>
          </div>
        </div>
      </div>

      {/* Patient Lookup */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Patient Lookup
          </CardTitle>
          <CardDescription>
            Enter patient details to generate their care schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="medical-input"
                  placeholder="e.g., p_1001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="medical-input"
                  placeholder="e.g., Aarav Verma"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-medical flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Schedule...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Generate Schedule
                  </>
                )}
              </Button>

              {scheduleData && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="px-6"
                >
                  New Patient
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Schedule Results */}
      {scheduleData && (
        <Card className="medical-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              📅 Tasks Successfully Scheduled for {scheduleData.name}'s Google
              Calendar
            </CardTitle>
            <CardDescription>
              Daily care reminders have been created and synchronized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduleData.daily_reminders.map((reminder, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-medical"
                >
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {reminder.time}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {reminder.task}
                    </div>
                  </div>
                  <div className="p-2 bg-success/10 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Info */}
            <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 text-success mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Schedule Summary</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  • Patient ID:{" "}
                  <span className="font-mono text-foreground">
                    {scheduleData.patient_id}
                  </span>
                </p>
                <p>
                  • Total Reminders:{" "}
                  <span className="font-medium text-foreground">
                    {scheduleData.daily_reminders.length}
                  </span>
                </p>
                <p>
                  • Calendar Integration:{" "}
                  <span className="text-success font-medium">Active</span>
                </p>
                <p>
                  • Notification Status:{" "}
                  <span className="text-success font-medium">Enabled</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!scheduleData && (
        <Card className="medical-card border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg mx-auto w-fit">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">
                  How to Generate a Schedule
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>1. Enter the patient's ID (e.g., p_1001)</p>
                  <p>2. Enter the patient's full name</p>
                  <p>3. Click "Generate Schedule" to create their care plan</p>
                  <p>4. Review and confirm the generated schedule</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
