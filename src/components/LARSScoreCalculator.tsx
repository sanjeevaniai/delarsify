import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LARSQuestions {
  flatusIncontinence: string;
  liquidIncontinence: string;
  frequency: string;
  clustering: string;
  urgency: string;
}

const LARSScoreCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<LARSQuestions>({
    flatusIncontinence: '',
    liquidIncontinence: '',
    frequency: '',
    clustering: '',
    urgency: ''
  });
  
  const [score, setScore] = useState<number | null>(null);

  const questions = [
    {
      id: 'flatusIncontinence',
      question: 'Do you ever have incontinence for flatus (gas)?',
      options: [
        { value: '0', label: 'No, never', score: 0 },
        { value: '7', label: 'Yes, less than once per week', score: 7 },
        { value: '9', label: 'Yes, at least once per week', score: 9 },
        { value: '11', label: 'Yes, at least once per day', score: 11 }
      ]
    },
    {
      id: 'liquidIncontinence',
      question: 'Do you ever have incontinence for liquid stool?',
      options: [
        { value: '0', label: 'No, never', score: 0 },
        { value: '8', label: 'Yes, less than once per week', score: 8 },
        { value: '11', label: 'Yes, at least once per week', score: 11 },
        { value: '13', label: 'Yes, at least once per day', score: 13 }
      ]
    },
    {
      id: 'frequency',
      question: 'How often do you open your bowels?',
      options: [
        { value: '0', label: 'More than 7 times per day (24h)', score: 0 },
        { value: '5', label: '4-7 times per day', score: 5 },
        { value: '0', label: '1-3 times per day', score: 0 },
        { value: '0', label: 'Less than once per day', score: 0 }
      ]
    },
    {
      id: 'clustering',
      question: 'Do you ever have to open your bowels again within one hour of the last bowel opening?',
      options: [
        { value: '0', label: 'No, never', score: 0 },
        { value: '8', label: 'Yes, less than once per week', score: 8 },
        { value: '10', label: 'Yes, at least once per week', score: 10 },
        { value: '11', label: 'Yes, at least once per day', score: 11 }
      ]
    },
    {
      id: 'urgency',
      question: 'Do you ever have such a strong urge to open your bowels that you have to rush to the toilet?',
      options: [
        { value: '0', label: 'No, never', score: 0 },
        { value: '9', label: 'Yes, less than once per week', score: 9 },
        { value: '11', label: 'Yes, at least once per week', score: 11 },
        { value: '16', label: 'Yes, at least once per day', score: 16 }
      ]
    }
  ];

  const calculateScore = () => {
    let totalScore = 0;
    Object.entries(answers).forEach(([key, value]) => {
      if (value) {
        totalScore += parseInt(value);
      }
    });
    setScore(totalScore);
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 20) {
      return { severity: 'No LARS', color: 'text-green-600', description: 'No Low Anterior Resection Syndrome' };
    } else if (score <= 29) {
      return { severity: 'Minor LARS', color: 'text-yellow-600', description: 'Minor symptoms that may affect quality of life' };
    } else {
      return { severity: 'Major LARS', color: 'text-red-600', description: 'Major symptoms significantly affecting quality of life' };
    }
  };

  const isComplete = Object.values(answers).every(answer => answer !== '');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          LARS Score Calculator
        </CardTitle>
        <CardDescription>
          Calculate your Low Anterior Resection Syndrome score based on validated questionnaire
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <Label className="text-sm font-medium">
              {index + 1}. {question.question}
            </Label>
            <RadioGroup
              value={answers[question.id as keyof LARSQuestions]}
              onValueChange={(value) => 
                setAnswers(prev => ({ ...prev, [question.id]: value }))
              }
            >
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <Button 
          onClick={calculateScore} 
          disabled={!isComplete}
          className="w-full"
        >
          Calculate LARS Score
        </Button>

        {score !== null && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="text-lg font-semibold">
                  Your LARS Score: <span className={getScoreInterpretation(score).color}>{score}</span>
                </div>
                <div>
                  <span className={`font-medium ${getScoreInterpretation(score).color}`}>
                    {getScoreInterpretation(score).severity}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getScoreInterpretation(score).description}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default LARSScoreCalculator;