import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Brain,
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Info,
    Calculator,
    BarChart3,
    ArrowLeft,
    Shield
} from 'lucide-react';
import RoleGuard from '@/components/RoleGuard';

interface RiskFactors {
    age: number;
    gender: string;
    bmi: number;
    tumorLocation: string;
    anastomosisHeight: number;
    neoadjuvantTherapy: boolean;
    adjuvantTherapy: boolean;
    stomaCreation: boolean;
    previousAbdominalSurgery: boolean;
    diabetes: boolean;
    smoking: boolean;
}

interface PredictionResult {
    overallRisk: 'Low' | 'Moderate' | 'High';
    riskScore: number;
    confidence: number;
    recommendations: string[];
    riskFactors: {
        factor: string;
        impact: 'Low' | 'Medium' | 'High';
        description: string;
    }[];
}

const LLP = () => {
    const [riskFactors, setRiskFactors] = useState<RiskFactors>({
        age: 65,
        gender: 'male',
        bmi: 25,
        tumorLocation: 'rectum',
        anastomosisHeight: 5,
        neoadjuvantTherapy: false,
        adjuvantTherapy: false,
        stomaCreation: false,
        previousAbdominalSurgery: false,
        diabetes: false,
        smoking: false
    });

    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const navigate = useNavigate();

    const calculateRisk = async () => {
        setIsCalculating(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock risk calculation algorithm
        let riskScore = 0;
        const riskFactorDetails: { factor: string; impact: 'Low' | 'Medium' | 'High'; description: string }[] = [];

        // Age factor
        if (riskFactors.age > 70) {
            riskScore += 15;
            riskFactorDetails.push({
                factor: 'Age > 70',
                impact: 'High',
                description: 'Older age increases LARS risk'
            });
        } else if (riskFactors.age > 60) {
            riskScore += 8;
            riskFactorDetails.push({
                factor: 'Age 60-70',
                impact: 'Medium',
                description: 'Moderate age-related risk'
            });
        }

        // Gender factor
        if (riskFactors.gender === 'female') {
            riskScore += 10;
            riskFactorDetails.push({
                factor: 'Female gender',
                impact: 'High',
                description: 'Women have higher LARS risk'
            });
        }

        // BMI factor
        if (riskFactors.bmi > 30) {
            riskScore += 12;
            riskFactorDetails.push({
                factor: 'Obesity (BMI > 30)',
                impact: 'High',
                description: 'Obesity increases surgical complexity'
            });
        } else if (riskFactors.bmi > 25) {
            riskScore += 5;
            riskFactorDetails.push({
                factor: 'Overweight (BMI 25-30)',
                impact: 'Medium',
                description: 'Moderate weight-related risk'
            });
        }

        // Tumor location
        if (riskFactors.tumorLocation === 'low_rectum') {
            riskScore += 20;
            riskFactorDetails.push({
                factor: 'Low rectal tumor',
                impact: 'High',
                description: 'Lower anastomosis increases LARS risk'
            });
        } else if (riskFactors.tumorLocation === 'rectum') {
            riskScore += 10;
            riskFactorDetails.push({
                factor: 'Rectal tumor',
                impact: 'Medium',
                description: 'Rectal location increases risk'
            });
        }

        // Anastomosis height
        if (riskFactors.anastomosisHeight < 3) {
            riskScore += 25;
            riskFactorDetails.push({
                factor: 'Very low anastomosis (&lt; 3cm)',
                impact: 'High',
                description: 'Very low anastomosis significantly increases risk'
            });
        } else if (riskFactors.anastomosisHeight < 5) {
            riskScore += 15;
            riskFactorDetails.push({
                factor: 'Low anastomosis (3-5cm)',
                impact: 'High',
                description: 'Low anastomosis increases risk'
            });
        }

        // Treatment factors
        if (riskFactors.neoadjuvantTherapy) {
            riskScore += 8;
            riskFactorDetails.push({
                factor: 'Neoadjuvant therapy',
                impact: 'Medium',
                description: 'Pre-surgery treatment may affect function'
            });
        }

        if (riskFactors.adjuvantTherapy) {
            riskScore += 6;
            riskFactorDetails.push({
                factor: 'Adjuvant therapy',
                impact: 'Medium',
                description: 'Post-surgery treatment may affect recovery'
            });
        }

        // Medical history
        if (riskFactors.diabetes) {
            riskScore += 5;
            riskFactorDetails.push({
                factor: 'Diabetes',
                impact: 'Medium',
                description: 'Diabetes may affect healing'
            });
        }

        if (riskFactors.smoking) {
            riskScore += 8;
            riskFactorDetails.push({
                factor: 'Smoking',
                impact: 'High',
                description: 'Smoking impairs healing and function'
            });
        }

        // Determine risk level
        let overallRisk: 'Low' | 'Moderate' | 'High';
        if (riskScore < 30) {
            overallRisk = 'Low';
        } else if (riskScore < 60) {
            overallRisk = 'Moderate';
        } else {
            overallRisk = 'High';
        }

        // Generate recommendations
        const recommendations: string[] = [];
        if (overallRisk === 'High') {
            recommendations.push('Consider prehabilitation program');
            recommendations.push('Discuss stoma options with surgeon');
            recommendations.push('Plan for intensive post-surgery support');
            recommendations.push('Consider referral to LARS specialist');
        } else if (overallRisk === 'Moderate') {
            recommendations.push('Optimize pre-surgery health');
            recommendations.push('Plan for post-surgery monitoring');
            recommendations.push('Consider dietary counseling');
        } else {
            recommendations.push('Maintain current health status');
            recommendations.push('Standard post-surgery care plan');
        }

        const result: PredictionResult = {
            overallRisk,
            riskScore: Math.min(riskScore, 100),
            confidence: Math.max(75, 100 - riskScore * 0.3),
            recommendations,
            riskFactors: riskFactorDetails
        };

        setPrediction(result);
        setIsCalculating(false);
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Low': return 'text-green-600 bg-green-100';
            case 'Moderate': return 'text-yellow-600 bg-yellow-100';
            case 'High': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'Low': return 'text-green-600';
            case 'Medium': return 'text-yellow-600';
            case 'High': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <RoleGuard allowedRoles={['survivor', 'caregiver', 'clinician']}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Home
                                </Button>
                                <div className="h-6 w-px bg-gray-300" />
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <h1 className="text-xl font-semibold text-primary">LARS Likelihood Predictor (LLP)</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                            LARS Likelihood Predictor (LLP)
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Advanced AI-powered tool that predicts LARS severity before surgery, enabling proactive treatment planning and personalized care strategies. 
                            Enhanced with comprehensive educational modules and evidence-based learning resources.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Form */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Calculator className="w-5 h-5 mr-2 text-primary" />
                                        Risk Assessment
                                    </CardTitle>
                                    <CardDescription>
                                        Enter patient information to calculate LARS likelihood
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Demographics */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-lg">Demographics</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="age">Age</Label>
                                                <Input
                                                    id="age"
                                                    type="number"
                                                    value={riskFactors.age}
                                                    onChange={(e) => setRiskFactors(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                                                    min="18"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="gender">Gender</Label>
                                                <Select value={riskFactors.gender} onValueChange={(value) => setRiskFactors(prev => ({ ...prev, gender: value }))}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="bmi">BMI</Label>
                                            <Input
                                                id="bmi"
                                                type="number"
                                                value={riskFactors.bmi}
                                                onChange={(e) => setRiskFactors(prev => ({ ...prev, bmi: parseFloat(e.target.value) || 0 }))}
                                                min="15"
                                                max="50"
                                                step="0.1"
                                            />
                                        </div>
                                    </div>

                                    {/* Tumor Information */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-lg">Tumor Information</h4>
                                        <div>
                                            <Label htmlFor="tumorLocation">Tumor Location</Label>
                                            <Select value={riskFactors.tumorLocation} onValueChange={(value) => setRiskFactors(prev => ({ ...prev, tumorLocation: value }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="colon">Colon</SelectItem>
                                                    <SelectItem value="rectum">Rectum</SelectItem>
                                                    <SelectItem value="low_rectum">Low Rectum (&lt; 5cm)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="anastomosisHeight">Anastomosis Height (cm)</Label>
                                            <Input
                                                id="anastomosisHeight"
                                                type="number"
                                                value={riskFactors.anastomosisHeight}
                                                onChange={(e) => setRiskFactors(prev => ({ ...prev, anastomosisHeight: parseFloat(e.target.value) || 0 }))}
                                                min="0"
                                                max="15"
                                                step="0.5"
                                            />
                                        </div>
                                    </div>

                                    {/* Treatment History */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-lg">Treatment History</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="neoadjuvant"
                                                    checked={riskFactors.neoadjuvantTherapy}
                                                    onChange={(e) => setRiskFactors(prev => ({ ...prev, neoadjuvantTherapy: e.target.checked }))}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="neoadjuvant">Neoadjuvant therapy</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="adjuvant"
                                                    checked={riskFactors.adjuvantTherapy}
                                                    onChange={(e) => setRiskFactors(prev => ({ ...prev, adjuvantTherapy: e.target.checked }))}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="adjuvant">Adjuvant therapy</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="stoma"
                                                    checked={riskFactors.stomaCreation}
                                                    onChange={(e) => setRiskFactors(prev => ({ ...prev, stomaCreation: e.target.checked }))}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="stoma">Stoma creation planned</Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Medical History */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-lg">Medical History</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="diabetes"
                                                    checked={riskFactors.diabetes}
                                                    onChange={(e) => setRiskFactors(prev => ({ ...prev, diabetes: e.target.checked }))}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="diabetes">Diabetes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="smoking"
                                                    checked={riskFactors.smoking}
                                                    onChange={(e) => setRiskFactors(prev => ({ ...prev, smoking: e.target.checked }))}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="smoking">Current smoker</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="previousSurgery"
                                                    checked={riskFactors.previousAbdominalSurgery}
                                                    onChange={(e) => setRiskFactors(prev => ({ ...prev, previousAbdominalSurgery: e.target.checked }))}
                                                    className="rounded"
                                                />
                                                <Label htmlFor="previousSurgery">Previous abdominal surgery</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={calculateRisk}
                                        disabled={isCalculating}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        {isCalculating ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Calculating Risk...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Brain className="w-4 h-4 mr-2" />
                                                Calculate LARS Risk
                                            </div>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Results */}
                        <div className="space-y-6">
                            {prediction ? (
                                <>
                                    {/* Overall Risk */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Target className="w-5 h-5 mr-2 text-primary" />
                                                Risk Assessment Results
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="text-center">
                                                <Badge className={`text-lg px-4 py-2 ${getRiskColor(prediction.overallRisk)}`}>
                                                    {prediction.overallRisk} Risk
                                                </Badge>
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span>Risk Score</span>
                                                        <span>{prediction.riskScore}/100</span>
                                                    </div>
                                                    <Progress value={prediction.riskScore} className="h-3" />
                                                </div>
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span>Confidence</span>
                                                        <span>{Math.round(prediction.confidence)}%</span>
                                                    </div>
                                                    <Progress value={prediction.confidence} className="h-2" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Risk Factors */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                                                Contributing Risk Factors
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {prediction.riskFactors.map((factor, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{factor.factor}</p>
                                                            <p className="text-sm text-muted-foreground">{factor.description}</p>
                                                        </div>
                                                        <Badge className={getImpactColor(factor.impact)}>
                                                            {factor.impact}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recommendations */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                                                Recommendations
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {prediction.recommendations.map((rec, index) => (
                                                    <div key={index} className="flex items-start space-x-2">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm">{rec}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Ready to Calculate Risk</h3>
                                        <p className="text-muted-foreground">
                                            Fill in the patient information and click "Calculate LARS Risk" to get personalized predictions.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Educational Modules Section */}
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold text-center text-primary mb-8">Educational Learning Modules</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="p-6">
                                <div className="text-center mb-4">
                                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📚</span>
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Understanding LARS</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Comprehensive guide to Low Anterior Resection Syndrome, its causes, symptoms, and impact on daily life.
                                </p>
                                <Button variant="outline" className="w-full">
                                    Start Learning
                                </Button>
                            </Card>

                            <Card className="p-6">
                                <div className="text-center mb-4">
                                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🔬</span>
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Risk Factors & Prevention</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Learn about modifiable and non-modifiable risk factors, and strategies for risk reduction.
                                </p>
                                <Button variant="outline" className="w-full">
                                    Start Learning
                                </Button>
                            </Card>

                            <Card className="p-6">
                                <div className="text-center mb-4">
                                    <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🏥</span>
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Treatment Options</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Explore surgical techniques, medical treatments, and rehabilitation approaches for LARS management.
                                </p>
                                <Button variant="outline" className="w-full">
                                    Start Learning
                                </Button>
                            </Card>

                            <Card className="p-6">
                                <div className="text-center mb-4">
                                    <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🍎</span>
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Diet & Nutrition</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Dietary strategies, nutritional guidelines, and microbiome health for LARS patients.
                                </p>
                                <Button variant="outline" className="w-full">
                                    Start Learning
                                </Button>
                            </Card>

                            <Card className="p-6">
                                <div className="text-center mb-4">
                                    <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">💪</span>
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Quality of Life</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Psychological support, coping strategies, and improving overall quality of life with LARS.
                                </p>
                                <Button variant="outline" className="w-full">
                                    Start Learning
                                </Button>
                            </Card>

                            <Card className="p-6">
                                <div className="text-center mb-4">
                                    <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <h4 className="font-semibold text-primary mb-2">Research & Evidence</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Latest research findings, clinical studies, and evidence-based practices in LARS management.
                                </p>
                                <Button variant="outline" className="w-full">
                                    Start Learning
                                </Button>
                            </Card>
                        </div>
                    </div>

                    {/* Learning Progress Section */}
                    <div className="mt-16">
                        <Card className="p-8">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-primary mb-4">Your Learning Journey</h3>
                                <p className="text-muted-foreground">
                                    Track your progress through our comprehensive LARS education modules
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary mb-2">0/6</div>
                                    <p className="text-sm text-muted-foreground">Modules Completed</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary mb-2">0%</div>
                                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary mb-2">0</div>
                                    <p className="text-sm text-muted-foreground">Certificates Earned</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Information Alert */}
                    <Alert className="mt-8">
                        <Info className="w-4 h-4" />
                        <AlertDescription>
                            <strong>Disclaimer:</strong> This tool provides risk estimates based on current research and should be used as a clinical decision support tool.
                            Always consult with healthcare professionals for medical decisions. The algorithm is based on published research and may not account for all individual factors.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </RoleGuard>
    );
};

export default LLP;
