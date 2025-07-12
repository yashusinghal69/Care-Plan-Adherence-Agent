import { useState } from "react";
import {
  UserPlus,
  Plus,
  X,
  Clock,
  Pill,
  Activity,
  CheckCircle,
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

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface Exercise {
  type: string;
  duration: string;
  timing: string;
}

interface PatientData {
  patient_id: string;
  name: string;
  age: number;
  care_plan: {
    medications: string[];
    exercises: string[];
  };
}

export function PatientRegistration() {
  const [patientId, setPatientId] = useState(
    `p_${Math.floor(Math.random() * 9000) + 1000}`
  );
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", frequency: "" },
  ]);
  const [exercises, setExercises] = useState<Exercise[]>([
    { type: "", duration: "", timing: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addMedication = () => {
    if (medications.length < 3) {
      setMedications([...medications, { name: "", dosage: "", frequency: "" }]);
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const updated = medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setMedications(updated);
  };

  const addExercise = () => {
    if (exercises.length < 3) {
      setExercises([...exercises, { type: "", duration: "", timing: "" }]);
    }
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (
    index: number,
    field: keyof Exercise,
    value: string
  ) => {
    const updated = exercises.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    setExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !age) {
      toast.error("Please fill in all required patient information");
      return;
    }

    setIsLoading(true);

    try {
      // Format data according to API specification
      const formattedMedications = medications
        .filter((med) => med.name && med.dosage && med.frequency)
        .map((med) => `${med.name} ${med.dosage} - ${med.frequency}`);

      const formattedExercises = exercises
        .filter((ex) => ex.type && ex.duration && ex.timing)
        .map((ex) => `${ex.type} - ${ex.duration} in ${ex.timing}`);

      const patientData: PatientData = {
        patient_id: patientId,
        name: name,
        age: parseInt(age),
        care_plan: {
          medications: formattedMedications,
          exercises: formattedExercises,
        },
      };

      const response = await fetch(
        `/api/registration-proxy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_value: JSON.stringify(patientData),
            output_type: "chat",
            input_type: "text",
          }),
        }
      );

      console.log('Registration response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Registration result:', result);
        toast.success(
          "Patient registered successfully! Care plan has been created.",
          {
            description: `Patient ID: ${patientId}`,
            duration: 4000,
          }
        );

        // Reset form
        setPatientId(`p_${Math.floor(Math.random() * 9000) + 1000}`);
        setName("");
        setAge("");
        setMedications([{ name: "", dosage: "", frequency: "" }]);
        setExercises([{ type: "", duration: "", timing: "" }]);
      } else {
        const errorText = await response.text();
        console.error('Registration error response:', errorText);
        throw new Error(`Failed to register patient: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register patient. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-slide-in">
      {/* Header */}
      <div className="medical-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Patient Registration Hub
            </h1>
            <p className="text-muted-foreground">
              Register new patients and create comprehensive care plans
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Patient Information
            </CardTitle>
            <CardDescription>
              Basic patient details and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="medical-input"
                  placeholder="p_1001"
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="medical-input"
                  placeholder="Enter patient's full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="medical-input"
                  placeholder="Enter age"
                  required
                  min="1"
                  max="120"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medication Management */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-accent" />
              Medication Management
            </CardTitle>
            <CardDescription>
              Define medication schedule and dosages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {medications.map((medication, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg bg-muted/30 animate-scale-in"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label>Medication Name</Label>
                    <Input
                      value={medication.name}
                      onChange={(e) =>
                        updateMedication(index, "name", e.target.value)
                      }
                      className="medical-input"
                      placeholder="e.g., Atorvastatin"
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) =>
                        updateMedication(index, "dosage", e.target.value)
                      }
                      className="medical-input"
                      placeholder="e.g., 10mg"
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input
                      value={medication.frequency}
                      onChange={(e) =>
                        updateMedication(index, "frequency", e.target.value)
                      }
                      className="medical-input"
                      placeholder="e.g., once/day in evening"
                    />
                  </div>
                  <div className="flex items-end">
                    {medications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        className="w-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addMedication}
              disabled={medications.length >= 3}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication {medications.length >= 3 && "(Max 3)"}
            </Button>
          </CardContent>
        </Card>

        {/* Exercise Protocol */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-success" />
              Exercise Protocol
            </CardTitle>
            <CardDescription>
              Define exercise routines and schedules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg bg-muted/30 animate-scale-in"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label>Exercise Type</Label>
                    <Input
                      value={exercise.type}
                      onChange={(e) =>
                        updateExercise(index, "type", e.target.value)
                      }
                      className="medical-input"
                      placeholder="e.g., Jogging"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={exercise.duration}
                      onChange={(e) =>
                        updateExercise(index, "duration", e.target.value)
                      }
                      className="medical-input"
                      placeholder="e.g., 20 mins"
                    />
                  </div>
                  <div>
                    <Label>Timing</Label>
                    <Input
                      value={exercise.timing}
                      onChange={(e) =>
                        updateExercise(index, "timing", e.target.value)
                      }
                      className="medical-input"
                      placeholder="e.g., morning"
                    />
                  </div>
                  <div className="flex items-end">
                    {exercises.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeExercise(index)}
                        className="w-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addExercise}
              disabled={exercises.length >= 3}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise {exercises.length >= 3 && "(Max 3)"}
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="btn-medical px-8 py-3 text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registering Patient...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Register Patient
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
