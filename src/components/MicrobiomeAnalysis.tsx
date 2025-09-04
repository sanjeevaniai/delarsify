import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  Microscope,
  BarChart3,
  Target
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Based on the research findings from the Scientific Reports paper
const microbiomeMarkers = [
  {
    name: "Butyricicoccus",
    category: "Beneficial",
    description: "Butyrate-producing bacteria crucial for gut health",
    optimalRange: "5-15%",
    currentValue: 8.2,
    status: "normal",
    impact: "Decreased levels correlate with higher LARS scores",
    recommendations: ["Increase fiber intake", "Consider butyrate supplements", "Fermented foods"]
  },
  {
    name: "Lactobacillus",
    category: "Probiotic",
    description: "Lactic acid-producing bacteria",
    optimalRange: "2-8%",
    currentValue: 3.1,
    status: "low",
    impact: "Negatively correlated with frequency-dominant LARS (PC1LARS)",
    recommendations: ["Probiotic supplementation", "Yogurt and kefir", "Prebiotic foods"]
  },
  {
    name: "Bifidobacterium",
    category: "Probiotic",
    description: "Essential for intestinal barrier function",
    optimalRange: "3-10%",
    currentValue: 2.8,
    status: "low",
    impact: "Reduced in frequency-dominant LARS patterns",
    recommendations: ["Bifidogenic foods", "Targeted probiotics", "Galacto-oligosaccharides"]
  },
  {
    name: "Subdoligranulum",
    category: "Beneficial",
    description: "Short-chain fatty acid producer",
    optimalRange: "1-5%",
    currentValue: 2.1,
    status: "normal",
    impact: "Negative correlation with PC1LARS symptoms",
    recommendations: ["Resistant starch", "Whole grains", "Legumes"]
  },
  {
    name: "Flavonifractor",
    category: "Potentially Harmful",
    description: "Associated with inflammation",
    optimalRange: "0-2%",
    currentValue: 3.2,
    status: "high",
    impact: "Positive correlation with PC1LARS, negative with PC2LARS",
    recommendations: ["Anti-inflammatory diet", "Reduce processed foods", "Omega-3 supplements"]
  }
];

const enterotypes = [
  {
    name: "Prevotellaceae",
    percentage: 35,
    description: "Associated with plant-rich diets",
    status: "dominant",
    clinicalImplication: "Lower in severe frequency-dominant LARS"
  },
  {
    name: "Bacteroidaceae",
    percentage: 45,
    description: "Associated with Western diets",
    status: "elevated",
    clinicalImplication: "Higher in severe frequency-dominant LARS"
  },
  {
    name: "Ruminococcaceae",
    percentage: 20,
    description: "Fiber-degrading bacteria",
    status: "normal",
    clinicalImplication: "Important for gut barrier function"
  }
];

const diversityMetrics = [
  {
    name: "Shannon Index",
    value: 2.8,
    optimal: "3.5-4.5",
    status: "low",
    description: "Measures species diversity"
  },
  {
    name: "Chao1 Richness",
    value: 145,
    optimal: "200-400",
    status: "low",
    description: "Number of different species"
  },
  {
    name: "Simpson Index",
    value: 0.73,
    optimal: "0.8-0.95",
    status: "moderate",
    description: "Evenness of species distribution"
  }
];

const MicrobiomeAnalysis = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [analysisData, setAnalysisData] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-600";
      case "low": return "text-yellow-600";
      case "high": return "text-red-600";
      case "moderate": return "text-primary";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "low": return <TrendingDown className="w-4 h-4 text-yellow-500" />;
      case "high": return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "moderate": return <Info className="w-4 h-4 text-primary" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const calculateOverallScore = () => {
    const normalCount = microbiomeMarkers.filter(m => m.status === "normal").length;
    return Math.round((normalCount / microbiomeMarkers.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <Alert>
        <Microscope className="w-4 h-4" />
        <AlertDescription>
          Microbiome analysis based on 16S rRNA sequencing research from Scientific Reports (2023).
          This analysis identifies gut bacteria patterns associated with LARS symptoms.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bacteria">Key Bacteria</TabsTrigger>
          <TabsTrigger value="diversity">Diversity</TabsTrigger>
          <TabsTrigger value="enterotypes">Enterotypes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Microbiome Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Microbiome Health Score
                </CardTitle>
                <CardDescription>
                  Based on LARS-associated bacterial markers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    {calculateOverallScore()}%
                  </div>
                  <Progress value={calculateOverallScore()} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    {calculateOverallScore() >= 70 ? "Good" :
                      calculateOverallScore() >= 50 ? "Fair" : "Needs Improvement"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LARS Pattern Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  LARS Pattern Prediction
                </CardTitle>
                <CardDescription>
                  Based on microbiome composition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Frequency-Dominant Risk</span>
                    <Badge variant="outline" className="text-yellow-600">
                      Moderate
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Incontinence-Dominant Risk</span>
                    <Badge variant="outline" className="text-green-600">
                      Low
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-4">
                    Pattern prediction based on PC1LARS/PC2LARS research findings
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">🦠 Increase Probiotics</h4>
                  <p className="text-xs text-muted-foreground">
                    Low Lactobacillus and Bifidobacterium levels detected
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">🌾 Boost Fiber Intake</h4>
                  <p className="text-xs text-muted-foreground">
                    Support butyrate-producing bacteria like Butyricicoccus
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">🍃 Anti-inflammatory Diet</h4>
                  <p className="text-xs text-muted-foreground">
                    Reduce Flavonifractor levels through dietary changes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bacteria" className="space-y-4">
          {microbiomeMarkers.map((marker, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      {getStatusIcon(marker.status)}
                      <span className="ml-2">{marker.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {marker.category}
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {marker.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getStatusColor(marker.status)}`}>
                      {marker.currentValue}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Optimal: {marker.optimalRange}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Clinical Impact:</strong> {marker.impact}
                  </div>
                  <div className="text-sm">
                    <strong>Recommendations:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {marker.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="diversity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {diversityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Optimal: {metric.optimal}
                    </div>
                    {getStatusIcon(metric.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Diversity Analysis</CardTitle>
              <CardDescription>
                Research shows frequency-dominant LARS patients have decreased gut microbiome diversity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  Your microbiome diversity appears reduced, which correlates with frequency-dominant LARS symptoms.
                  Focus on increasing dietary variety and prebiotic foods to improve diversity.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enterotypes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gut Enterotype Analysis</CardTitle>
              <CardDescription>
                Distribution of dominant bacterial families in your gut microbiome
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enterotypes.map((enterotype, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{enterotype.name}</span>
                      <span className="text-sm">{enterotype.percentage}%</span>
                    </div>
                    <Progress value={enterotype.percentage} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      {enterotype.description} - {enterotype.clinicalImplication}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Research Finding:</strong> Severe frequency-dominant LARS patients show lower Prevotellaceae
              and higher Bacteroidaceae enterotypes. Your pattern suggests a moderate risk profile.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MicrobiomeAnalysis;