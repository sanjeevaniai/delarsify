import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Apple, Droplets, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const DietaryRecommendations: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('fiber');

  const fiberRecommendations = {
    soluble: {
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      title: 'Soluble Fiber (Recommended)',
      description: 'Helps bulk stool and slow transit time',
      foods: [
        'Oats and oat bran',
        'Bananas (ripe)',
        'Apples (peeled)',
        'White rice',
        'Pasta',
        'Potatoes (without skin)',
        'Psyllium husk supplements'
      ]
    },
    insoluble: {
      icon: <XCircle className="h-4 w-4 text-red-600" />,
      title: 'Insoluble Fiber (Limit)',
      description: 'May increase urgency and frequency',
      foods: [
        'Whole grain breads',
        'Raw vegetables',
        'Nuts and seeds',
        'Corn',
        'Beans and legumes',
        'Vegetable skins',
        'Dried fruits'
      ]
    }
  };

  const hydrationTips = [
    'Drink 8-10 glasses of water daily',
    'Avoid excessive caffeine and alcohol',
    'Consider oral rehydration solutions if experiencing frequent bowel movements',
    'Monitor urine color - aim for pale yellow',
    'Spread fluid intake throughout the day'
  ];

  const timingStrategies = [
    'Eat smaller, more frequent meals',
    'Allow 2-3 hours between eating and important activities',
    'Consider fasting periods before social events',
    'Keep a food and symptom diary',
    'Plan bathroom access around meal times'
  ];

  const problematicFoods = [
    { name: 'Fatty/Fried Foods', reason: 'Can trigger dumping syndrome' },
    { name: 'Spicy Foods', reason: 'May increase urgency and frequency' },
    { name: 'Sugar Alcohols', reason: 'Can cause osmotic diarrhea' },
    { name: 'Dairy Products', reason: 'May worsen symptoms if lactose intolerant' },
    { name: 'Carbonated Drinks', reason: 'Can increase gas and bloating' },
    { name: 'Artificial Sweeteners', reason: 'May have laxative effects' }
  ];

  const beneficialFoods = [
    { name: 'White Rice', benefit: 'Easy to digest, binding effect' },
    { name: 'Bananas', benefit: 'Pectin helps firm stool' },
    { name: 'Toast/Crackers', benefit: 'Simple carbs, easy to digest' },
    { name: 'Lean Proteins', benefit: 'Well-tolerated, slower digestion' },
    { name: 'Cooked Vegetables', benefit: 'Easier to digest than raw' },
    { name: 'Probiotics', benefit: 'May help restore gut bacteria balance' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            Dietary Management for LARS
          </CardTitle>
          <CardDescription>
            Evidence-based dietary recommendations to help manage Low Anterior Resection Syndrome symptoms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fiber" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fiber">Fiber Management</TabsTrigger>
              <TabsTrigger value="hydration">Hydration</TabsTrigger>
              <TabsTrigger value="timing">Meal Timing</TabsTrigger>
              <TabsTrigger value="foods">Food Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="fiber" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {fiberRecommendations.soluble.icon}
                      {fiberRecommendations.soluble.title}
                    </CardTitle>
                    <CardDescription>
                      {fiberRecommendations.soluble.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {fiberRecommendations.soluble.foods.map((food, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-1">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {fiberRecommendations.insoluble.icon}
                      {fiberRecommendations.insoluble.title}
                    </CardTitle>
                    <CardDescription>
                      {fiberRecommendations.insoluble.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {fiberRecommendations.insoluble.foods.map((food, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hydration" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    Hydration Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {hydrationTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Meal Timing Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {timingStrategies.map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="foods" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      Beneficial Foods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {beneficialFoods.map((food, index) => (
                        <div key={index} className="border-l-2 border-green-200 pl-3">
                          <div className="font-medium text-sm">{food.name}</div>
                          <div className="text-xs text-muted-foreground">{food.benefit}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Foods to Limit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {problematicFoods.map((food, index) => (
                        <div key={index} className="border-l-2 border-red-200 pl-3">
                          <div className="font-medium text-sm">{food.name}</div>
                          <div className="text-xs text-muted-foreground">{food.reason}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> These are general guidelines. Always consult with your healthcare provider or a registered dietitian before making significant dietary changes, especially after colorectal surgery.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietaryRecommendations;