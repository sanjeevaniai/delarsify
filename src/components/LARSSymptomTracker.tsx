import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Save, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SymptomEntry {
  id: string;
  user_id: string;
  date: string;
  flatus_incontinence: number;
  liquid_stool_incontinence: number;
  frequency: number;
  clustering: number;
  urgency: number;
  notes?: string;
  lars_score: number;
  created_at: string;
}

const symptomQuestions = [
  {
    key: 'flatus_incontinence',
    question: 'Do you experience flatus incontinence?',
    options: [
      { value: 0, label: 'No, never', points: 0 },
      { value: 1, label: 'Yes, less than once per week', points: 4 },
      { value: 2, label: 'Yes, at least once per week', points: 7 }
    ]
  },
  {
    key: 'liquid_stool_incontinence',
    question: 'Do you experience liquid stool incontinence?',
    options: [
      { value: 0, label: 'No, never', points: 0 },
      { value: 1, label: 'Yes, less than once per week', points: 3 },
      { value: 2, label: 'Yes, at least once per week', points: 11 }
    ]
  },
  {
    key: 'frequency',
    question: 'How often do you open your bowels?',
    options: [
      { value: 0, label: '1-3 times per day', points: 0 },
      { value: 1, label: '4-7 times per day', points: 2 },
      { value: 2, label: 'More than 7 times per day', points: 5 }
    ]
  },
  {
    key: 'clustering',
    question: 'Do you experience clustering (having to open your bowels within 1 hour of the last bowel opening)?',
    options: [
      { value: 0, label: 'No, never', points: 0 },
      { value: 1, label: 'Yes, less than once per week', points: 9 },
      { value: 2, label: 'Yes, at least once per week', points: 11 }
    ]
  },
  {
    key: 'urgency',
    question: 'Do you experience urgency (having to rush to the toilet for fear of bowel accidents)?',
    options: [
      { value: 0, label: 'No, never', points: 0 },
      { value: 1, label: 'Yes, less than once per week', points: 11 },
      { value: 2, label: 'Yes, at least once per week', points: 16 }
    ]
  }
];

const LARSSymptomTracker = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      // Load from localStorage until database is set up
      const savedEntries = localStorage.getItem('lars_symptoms');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const calculateScore = () => {
    return symptomQuestions.reduce((total, question) => {
      const selectedValue = symptoms[question.key] || 0;
      const selectedOption = question.options.find(opt => opt.value === selectedValue);
      return total + (selectedOption?.points || 0);
    }, 0);
  };

  const getScoreCategory = (score: number) => {
    if (score <= 20) return { category: 'No LARS', color: 'bg-green-500' };
    if (score <= 29) return { category: 'Minor LARS', color: 'bg-yellow-500' };
    return { category: 'Major LARS', color: 'bg-red-500' };
  };

  const getSymptomPattern = () => {
    const frequencyScore = symptoms.frequency || 0;
    const clusteringScore = symptoms.clustering || 0;
    const incontinenceScore = (symptoms.flatus_incontinence || 0) + (symptoms.liquid_stool_incontinence || 0);
    const urgencyScore = symptoms.urgency || 0;

    // Based on research: PC1LARS (frequency-dominant) vs PC2LARS (incontinence-dominant)
    if (frequencyScore + clusteringScore > incontinenceScore + urgencyScore) {
      return { pattern: 'Frequency-Dominant (PC1LARS)', description: 'Higher bowel frequency and clustering symptoms' };
    } else {
      return { pattern: 'Incontinence-Dominant (PC2LARS)', description: 'Higher incontinence and urgency symptoms' };
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        toast({
          title: "Error",
          description: "Please sign in to save your symptoms",
          variant: "destructive",
        });
        return;
      }

      const totalScore = calculateScore();
      
      // Create new entry for localStorage
      const newEntry: SymptomEntry = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: session.session.user.id,
        date: selectedDate.toISOString().split('T')[0],
        flatus_incontinence: symptoms.flatus_incontinence || 0,
        liquid_stool_incontinence: symptoms.liquid_stool_incontinence || 0,
        frequency: symptoms.frequency || 0,
        clustering: symptoms.clustering || 0,
        urgency: symptoms.urgency || 0,
        notes: notes,
        lars_score: totalScore,
        created_at: new Date().toISOString()
      };

      // Save to localStorage
      const existingEntries = JSON.parse(localStorage.getItem('lars_symptoms') || '[]');
      const updatedEntries = [newEntry, ...existingEntries];
      localStorage.setItem('lars_symptoms', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);

      toast({
        title: "Success",
        description: "Symptoms saved successfully",
      });

      // Reset form
      setSymptoms({});
      setNotes("");
    } catch (error) {
      console.error('Error saving symptoms:', error);
      toast({
        title: "Error",
        description: "Failed to save symptoms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentScore = calculateScore();
  const scoreInfo = getScoreCategory(currentScore);
  const patternInfo = getSymptomPattern();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Symptom Assessment</CardTitle>
            <CardDescription>
              Based on the validated LARS questionnaire (Emmertsen & Laurberg, 2012)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Selection */}
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Symptom Questions */}
            {symptomQuestions.map((question) => (
              <div key={question.key} className="space-y-3">
                <Label className="text-sm font-medium">{question.question}</Label>
                <RadioGroup
                  value={symptoms[question.key]?.toString() || ""}
                  onValueChange={(value) => setSymptoms(prev => ({
                    ...prev,
                    [question.key]: parseInt(value)
                  }))}
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value.toString()} />
                      <Label className="text-sm cursor-pointer flex-1">
                        {option.label}
                        <span className="text-muted-foreground ml-2">({option.points} pts)</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            {/* Notes */}
            <div>
              <Label>Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional observations about your symptoms..."
                className="min-h-[80px]"
              />
            </div>

            <Button onClick={handleSave} disabled={loading} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Entry"}
            </Button>
          </CardContent>
        </Card>

        {/* Current Score & Analysis */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div>
                  <div className="text-4xl font-bold text-primary">{currentScore}</div>
                  <div className="text-sm text-muted-foreground">/ 42 points</div>
                </div>
                <Badge className={`${scoreInfo.color} text-white`}>
                  {scoreInfo.category}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Symptom Pattern:</strong> {patternInfo.pattern}</p>
                  <p className="mt-1">{patternInfo.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entries.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No entries yet. Start tracking your symptoms!
                  </p>
                ) : (
                  entries.slice(0, 5).map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">
                          {format(new Date(entry.date), "MMM dd")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.lars_score <= 20 ? 'No LARS' : entry.lars_score <= 29 ? 'Minor LARS' : 'Major LARS'}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {entry.lars_score}/42
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LARSSymptomTracker;