import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, ArrowRight, CheckCircle, User, Heart, Stethoscope, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IntakeData {
  // Personal Info
  country: string;
  age: number | '';
  gender: string;

  // Medical History
  colorectal_cancer_stage: string;
  diagnosis_date: Date | null;
  primary_tumor_location: string;

  // Treatment History
  underwent_surgery: boolean;
  surgery_type: string;
  surgery_date: Date | null;
  anastomosis_height_cm: number | '';

  underwent_chemotherapy: boolean;
  chemo_regimen: string;
  chemo_start_date: Date | null;
  chemo_end_date: Date | null;

  underwent_radiation: boolean;
  radiation_type: string;
  radiation_start_date: Date | null;
  radiation_end_date: Date | null;

  // Stoma Information
  has_stoma: boolean;
  stoma_type: string;
  stoma_temporary: boolean;
  stoma_creation_date: Date | null;
  stoma_reversal_date: Date | null;

  // Current Symptoms
  primary_symptoms: string[];
  symptom_severity: number | '';
  quality_of_life_score: number | '';

  // Lifestyle
  diet_restrictions: string[];
  current_medications: string[];
  exercise_frequency: string;
  support_system_rating: number | '';
}

const IntakeForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<IntakeData>({
    country: '',
    age: '',
    gender: '',
    colorectal_cancer_stage: '',
    diagnosis_date: null,
    primary_tumor_location: '',
    underwent_surgery: false,
    surgery_type: '',
    surgery_date: null,
    anastomosis_height_cm: '',
    underwent_chemotherapy: false,
    chemo_regimen: '',
    chemo_start_date: null,
    chemo_end_date: null,
    underwent_radiation: false,
    radiation_type: '',
    radiation_start_date: null,
    radiation_end_date: null,
    has_stoma: false,
    stoma_type: '',
    stoma_temporary: false,
    stoma_creation_date: null,
    stoma_reversal_date: null,
    primary_symptoms: [],
    symptom_severity: '',
    quality_of_life_score: '',
    diet_restrictions: [],
    current_medications: [],
    exercise_frequency: '',
    support_system_rating: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);

      // Check if intake is already completed
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('intake_completed')
        .eq('user_id', session.user.id)
        .single();

      if (profile?.intake_completed) {
        navigate('/lars-manager');
      }
    };
    checkAuth();
  }, [navigate]);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const symptoms = [
    'Frequent bowel movements', 'Incontinence (gas)', 'Incontinence (liquid stool)',
    'Incontinence (solid stool)', 'Clustering (multiple BMs within 1 hour)',
    'Urgency', 'Cramping', 'Bloating', 'Incomplete evacuation',
    'Dietary restrictions affecting social life', 'Sleep disruption'
  ];

  const dietRestrictions = [
    'Low fiber diet', 'Gluten-free', 'Dairy-free', 'Low FODMAP',
    'Avoiding spicy foods', 'Avoiding fatty foods', 'Small frequent meals',
    'Liquid supplements', 'Other'
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      primary_symptoms: checked
        ? [...prev.primary_symptoms, symptom]
        : prev.primary_symptoms.filter(s => s !== symptom)
    }));
  };

  const handleDietRestrictionChange = (restriction: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      diet_restrictions: checked
        ? [...prev.diet_restrictions, restriction]
        : prev.diet_restrictions.filter(r => r !== restriction)
    }));
  };

  const handleMedicationAdd = (medication: string) => {
    if (medication.trim() && !formData.current_medications.includes(medication.trim())) {
      setFormData(prev => ({
        ...prev,
        current_medications: [...prev.current_medications, medication.trim()]
      }));
    }
  };

  const handleMedicationRemove = (medication: string) => {
    setFormData(prev => ({
      ...prev,
      current_medications: prev.current_medications.filter(m => m !== medication)
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Clean the data before sending to database
      const cleanedData = {
        country: formData.country,
        age: formData.age === '' ? null : formData.age,
        gender: formData.gender,
        colorectal_cancer_stage: formData.colorectal_cancer_stage,
        diagnosis_date: formData.diagnosis_date ? formData.diagnosis_date.toISOString().split('T')[0] : null,
        primary_tumor_location: formData.primary_tumor_location,
        underwent_surgery: formData.underwent_surgery,
        surgery_type: formData.surgery_type,
        surgery_date: formData.surgery_date ? formData.surgery_date.toISOString().split('T')[0] : null,
        anastomosis_height_cm: formData.anastomosis_height_cm === '' ? null : formData.anastomosis_height_cm,
        underwent_chemotherapy: formData.underwent_chemotherapy,
        chemo_regimen: formData.chemo_regimen,
        chemo_start_date: formData.chemo_start_date ? formData.chemo_start_date.toISOString().split('T')[0] : null,
        chemo_end_date: formData.chemo_end_date ? formData.chemo_end_date.toISOString().split('T')[0] : null,
        underwent_radiation: formData.underwent_radiation,
        radiation_type: formData.radiation_type,
        radiation_start_date: formData.radiation_start_date ? formData.radiation_start_date.toISOString().split('T')[0] : null,
        radiation_end_date: formData.radiation_end_date ? formData.radiation_end_date.toISOString().split('T')[0] : null,
        has_stoma: formData.has_stoma,
        stoma_type: formData.stoma_type,
        stoma_temporary: formData.stoma_temporary,
        stoma_creation_date: formData.stoma_creation_date ? formData.stoma_creation_date.toISOString().split('T')[0] : null,
        stoma_reversal_date: formData.stoma_reversal_date ? formData.stoma_reversal_date.toISOString().split('T')[0] : null,
        primary_symptoms: formData.primary_symptoms,
        symptom_severity: formData.symptom_severity === '' ? null : formData.symptom_severity,
        quality_of_life_score: formData.quality_of_life_score === '' ? null : formData.quality_of_life_score,
        diet_restrictions: formData.diet_restrictions,
        current_medications: formData.current_medications,
        exercise_frequency: formData.exercise_frequency,
        support_system_rating: formData.support_system_rating === '' ? null : formData.support_system_rating,
        intake_completed: true,
        intake_completed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(cleanedData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Intake Complete!",
        description: "Thank you for completing your intake. SIA is now generating personalized recommendations...",
      });

      navigate('/lars-manager');
    } catch (error) {
      console.error('Error saving intake:', error);
      toast({
        title: "Error",
        description: "Failed to save intake data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/lars-manager')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Medical Intake Assessment
              </CardTitle>
              <CardDescription>
                Help us understand your condition and provide personalized recommendations
              </CardDescription>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Form Steps */}
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Enter your country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : '' }))}
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                <div>
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                      <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 2: Medical History */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Medical History</h3>
                </div>

                <div>
                  <Label>Colorectal Cancer Stage</Label>
                  <Select
                    value={formData.colorectal_cancer_stage}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, colorectal_cancer_stage: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stage-0">Stage 0 (In situ)</SelectItem>
                      <SelectItem value="stage-1">Stage I</SelectItem>
                      <SelectItem value="stage-2">Stage II</SelectItem>
                      <SelectItem value="stage-3">Stage III</SelectItem>
                      <SelectItem value="stage-4">Stage IV</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Diagnosis Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.diagnosis_date ? format(formData.diagnosis_date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.diagnosis_date || undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, diagnosis_date: date || null }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Primary Tumor Location</Label>
                  <Select
                    value={formData.primary_tumor_location}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, primary_tumor_location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectum">Rectum</SelectItem>
                      <SelectItem value="sigmoid">Sigmoid colon</SelectItem>
                      <SelectItem value="left-colon">Left colon</SelectItem>
                      <SelectItem value="transverse">Transverse colon</SelectItem>
                      <SelectItem value="right-colon">Right colon</SelectItem>
                      <SelectItem value="cecum">Cecum</SelectItem>
                      <SelectItem value="multiple">Multiple locations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Treatment History */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold">Treatment History</h3>
                </div>

                {/* Surgery */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="surgery"
                      checked={formData.underwent_surgery}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, underwent_surgery: checked as boolean }))}
                    />
                    <Label htmlFor="surgery" className="font-medium">I underwent surgery</Label>
                  </div>

                  {formData.underwent_surgery && (
                    <div className="space-y-4 ml-6">
                      <div>
                        <Label>Surgery Type</Label>
                        <Select
                          value={formData.surgery_type}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, surgery_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select surgery type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lar">Low Anterior Resection (LAR)</SelectItem>
                            <SelectItem value="apr">Abdominoperineal Resection (APR)</SelectItem>
                            <SelectItem value="hartmann">Hartmann's Procedure</SelectItem>
                            <SelectItem value="ileostomy">Ileostomy Creation</SelectItem>
                            <SelectItem value="colostomy">Colostomy Creation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Surgery Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.surgery_date ? format(formData.surgery_date, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.surgery_date || undefined}
                              onSelect={(date) => setFormData(prev => ({ ...prev, surgery_date: date || null }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="anastomosis">Anastomosis Height (cm from anal verge)</Label>
                        <Input
                          id="anastomosis"
                          type="number"
                          value={formData.anastomosis_height_cm}
                          onChange={(e) => setFormData(prev => ({ ...prev, anastomosis_height_cm: e.target.value ? parseInt(e.target.value) : '' }))}
                          placeholder="e.g., 5"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chemotherapy */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="chemo"
                      checked={formData.underwent_chemotherapy}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, underwent_chemotherapy: checked as boolean }))}
                    />
                    <Label htmlFor="chemo" className="font-medium">I underwent chemotherapy</Label>
                  </div>

                  {formData.underwent_chemotherapy && (
                    <div className="space-y-4 ml-6">
                      <div>
                        <Label htmlFor="chemo-regimen">Chemotherapy Regimen</Label>
                        <Input
                          id="chemo-regimen"
                          value={formData.chemo_regimen}
                          onChange={(e) => setFormData(prev => ({ ...prev, chemo_regimen: e.target.value }))}
                          placeholder="e.g., FOLFOX, CAPOX"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Radiation */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="radiation"
                      checked={formData.underwent_radiation}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, underwent_radiation: checked as boolean }))}
                    />
                    <Label htmlFor="radiation" className="font-medium">I underwent radiation therapy</Label>
                  </div>

                  {formData.underwent_radiation && (
                    <div className="space-y-4 ml-6">
                      <div>
                        <Label>Radiation Type</Label>
                        <Select
                          value={formData.radiation_type}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, radiation_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="neoadjuvant">Neoadjuvant (before surgery)</SelectItem>
                            <SelectItem value="adjuvant">Adjuvant (after surgery)</SelectItem>
                            <SelectItem value="palliative">Palliative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Stoma & Current Symptoms */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Stoma & Current Symptoms</h3>
                </div>

                {/* Stoma Information */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="stoma"
                      checked={formData.has_stoma}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_stoma: checked as boolean }))}
                    />
                    <Label htmlFor="stoma" className="font-medium">I have/had a stoma</Label>
                  </div>

                  {formData.has_stoma && (
                    <div className="space-y-4 ml-6">
                      <div>
                        <Label>Stoma Type</Label>
                        <Select
                          value={formData.stoma_type}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, stoma_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ileostomy">Ileostomy</SelectItem>
                            <SelectItem value="colostomy">Colostomy</SelectItem>
                            <SelectItem value="urostomy">Urostomy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="temporary"
                          checked={formData.stoma_temporary}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stoma_temporary: checked as boolean }))}
                        />
                        <Label htmlFor="temporary">This was/is a temporary stoma</Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Symptoms */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Current Symptoms (select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {symptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={formData.primary_symptoms.includes(symptom)}
                          onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                        />
                        <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="symptom-severity">Overall Symptom Severity (1-10)</Label>
                    <Input
                      id="symptom-severity"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.symptom_severity}
                      onChange={(e) => setFormData(prev => ({ ...prev, symptom_severity: e.target.value ? parseInt(e.target.value) : '' }))}
                      placeholder="1 = mild, 10 = severe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qol-score">Quality of Life Score (1-10)</Label>
                    <Input
                      id="qol-score"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.quality_of_life_score}
                      onChange={(e) => setFormData(prev => ({ ...prev, quality_of_life_score: e.target.value ? parseInt(e.target.value) : '' }))}
                      placeholder="1 = poor, 10 = excellent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Lifestyle Factors */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Lifestyle & Final Details</h3>
                </div>

                {/* Diet Restrictions */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Current Diet Restrictions/Modifications</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dietRestrictions.map((restriction) => (
                      <div key={restriction} className="flex items-center space-x-2">
                        <Checkbox
                          id={restriction}
                          checked={formData.diet_restrictions.includes(restriction)}
                          onCheckedChange={(checked) => handleDietRestrictionChange(restriction, checked as boolean)}
                        />
                        <Label htmlFor={restriction} className="text-sm">{restriction}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Current Medications</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter medication name"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleMedicationAdd(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleMedicationAdd(input.value);
                          input.value = '';
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.current_medications.map((med, index) => (
                        <div key={index} className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {med}
                          <button
                            type="button"
                            onClick={() => handleMedicationRemove(med)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Exercise Frequency</Label>
                    <Select
                      value={formData.exercise_frequency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, exercise_frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No regular exercise</SelectItem>
                        <SelectItem value="1-2-times">1-2 times per week</SelectItem>
                        <SelectItem value="3-4-times">3-4 times per week</SelectItem>
                        <SelectItem value="5-plus-times">5+ times per week</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="support-rating">Support System Rating (1-5)</Label>
                    <Input
                      id="support-rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.support_system_rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, support_system_rating: e.target.value ? parseInt(e.target.value) : '' }))}
                      placeholder="1 = poor, 5 = excellent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={nextStep}
                disabled={loading}
              >
                {currentStep === totalSteps ? (
                  loading ? 'Completing...' : 'Complete Intake'
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntakeForm;