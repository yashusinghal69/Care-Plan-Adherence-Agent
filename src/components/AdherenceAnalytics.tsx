import { useState } from "react";
import {
  ChartBar,
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Users,
  Shield,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

interface AdherenceData {
  adherence_rate: string;
  non_adherence_flag: boolean;
  follow_up_needed: boolean;
}

export function AdherenceAnalytics() {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adherenceData, setAdherenceData] = useState<AdherenceData | null>(
    null
  );

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

      // API Call to adherence analytics endpoint
      const result = await apiCall('adherence-proxy', {
        body: JSON.stringify({
          input_value: mergedInput,
          output_type: "text",
          input_type: "text",
        }),
      });

      console.log("Adherence response:", result);

      // Parse the response text field
      const responseText =
        result.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text;

      if (responseText) {
        const parsedData = JSON.parse(responseText);
        setAdherenceData(parsedData);

        // Show appropriate toast based on adherence rate
        const rate =
          parseInt(parsedData.adherence_rate.replace("%", "")) || 0;

        if (rate < 50) {
          toast.error("Critical: Patient requires immediate attention", {
            description: "Medical team has been notified via Slack",
            duration: 5000,
          });
        } else if (rate >= 50 && rate < 80) {
          toast.warning("Warning: Patient adherence needs improvement", {
            description: "Consider additional support measures",
            duration: 4000,
          });
        } else {
          toast.success("Excellent: Patient showing great adherence", {
            description: "Treatment plan is being followed correctly",
            duration: 4000,
          });
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Adherence analytics error:", error);
      toast.error("Failed to fetch adherence data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPatientId("");
    setPatientName("");
    setAdherenceData(null);
  };

  const getAdherenceRate = () => {
    if (!adherenceData) return 0;
    return parseInt(adherenceData.adherence_rate.replace("%", "")) || 0;
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 80) return "text-success";
    if (rate >= 60) return "text-warning";
    return "text-destructive";
  };

  const adherenceRate = getAdherenceRate();

  return (
    <div className="space-y-6 animate-fade-slide-in">
      {/* Header */}
      <div className="medical-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-success/10 rounded-lg">
            <ChartBar className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Adherence Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor patient compliance and generate actionable insights
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">1,247</div>
                <div className="text-xs text-muted-foreground">
                  Active Patients
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">87%</div>
                <div className="text-xs text-muted-foreground">
                  Overall Adherence
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">23</div>
                <div className="text-xs text-muted-foreground">
                  Alerts Today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Shield className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-xs text-muted-foreground">
                  System Uptime
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Analytics Lookup */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Patient Adherence Analysis
          </CardTitle>
          <CardDescription>
            Enter patient details to analyze their treatment adherence
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
                    Analyzing Adherence...
                  </>
                ) : (
                  <>
                    <ChartBar className="h-4 w-4 mr-2" />
                    Analyze Adherence
                  </>
                )}
              </Button>

              {adherenceData && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="px-6"
                >
                  New Analysis
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Adherence Results */}
      {adherenceData && (
        <div className="space-y-4 animate-scale-in">
          {/* Alert Based on Adherence Rate */}
          {adherenceRate < 50 ? (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                <strong>🚨 CRITICAL:</strong> Patient {patientName} has very low
                adherence ({adherenceData.adherence_rate}). Medical team has
                been notified via Slack.
              </AlertDescription>
            </Alert>
          ) : adherenceRate < 80 ? (
            <Alert className="border-warning/50 bg-warning/5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning">
                <strong>⚠️ WARNING:</strong> Patient {patientName} has moderate
                adherence ({adherenceData.adherence_rate}). Consider additional
                support measures.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-success/50 bg-success/5">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                <strong>✅ EXCELLENT:</strong> Patient {patientName} is
                following most of their scheduled tasks (
                {adherenceData.adherence_rate}).
              </AlertDescription>
            </Alert>
          )}

          {/* Detailed Analytics */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Detailed Adherence Report
              </CardTitle>
              <CardDescription>
                Comprehensive analysis for {patientName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Adherence Rate Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Adherence Rate
                  </span>
                  <span
                    className={`text-2xl font-bold ${getAdherenceColor(
                      adherenceRate
                    )}`}
                  >
                    {adherenceData.adherence_rate}
                  </span>
                </div>
                <Progress value={adherenceRate} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor (0-59%)</span>
                  <span>Fair (60-79%)</span>
                  <span>Excellent (80-100%)</span>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        adherenceData.non_adherence_flag
                          ? "bg-destructive"
                          : "bg-success"
                      }`}
                    ></div>
                    <span className="font-medium text-foreground">
                      Adherence Status
                    </span>
                  </div>
                  <div
                    className={`text-sm ${
                      adherenceData.non_adherence_flag
                        ? "text-destructive"
                        : "text-success"
                    }`}
                  >
                    {adherenceData.non_adherence_flag
                      ? "Non-Adherent"
                      : "Adherent"}
                  </div>
                </div>

                <div className="p-4 bg-muted/30 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        adherenceData.follow_up_needed
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    ></div>
                    <span className="font-medium text-foreground">
                      Follow-up Required
                    </span>
                  </div>
                  <div
                    className={`text-sm ${
                      adherenceData.follow_up_needed
                        ? "text-warning"
                        : "text-success"
                    }`}
                  >
                    {adherenceData.follow_up_needed
                      ? "Yes - Immediate"
                      : "No - On Track"}
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <h4 className="font-medium text-foreground mb-3">
                  Recommended Actions
                </h4>
                <div className="space-y-2 text-sm">
                  {adherenceRate < 50 ? (
                    <>
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Schedule immediate consultation</span>
                      </div>
                      <div className="flex items-center gap-2 text-destructive">
                        <Activity className="h-3 w-3" />
                        <span>Review medication schedule urgently</span>
                      </div>
                      <div className="flex items-center gap-2 text-destructive">
                        <Users className="h-3 w-3" />
                        <span>Alert medical team via Slack</span>
                      </div>
                    </>
                  ) : adherenceRate < 80 ? (
                    <>
                      <div className="flex items-center gap-2 text-warning">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Monitor patient more closely</span>
                      </div>
                      <div className="flex items-center gap-2 text-warning">
                        <Activity className="h-3 w-3" />
                        <span>Review treatment barriers</span>
                      </div>
                      <div className="flex items-center gap-2 text-accent">
                        <Users className="h-3 w-3" />
                        <span>Increase patient support</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="h-3 w-3" />
                        <span>Continue current treatment plan</span>
                      </div>
                      <div className="flex items-center gap-2 text-accent">
                        <TrendingUp className="h-3 w-3" />
                        <span>Monitor progress regularly</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <Activity className="h-3 w-3" />
                        <span>Maintain positive reinforcement</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      {!adherenceData && (
        <Card className="medical-card border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg mx-auto w-fit">
                <ChartBar className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">
                  How to Analyze Patient Adherence
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>1. Enter the patient's ID (e.g., p_1001)</p>
                  <p>2. Enter the patient's full name</p>
                  <p>3. Click "Analyze Adherence" to get compliance insights</p>
                  <p>4. Review the generated report and recommendations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
