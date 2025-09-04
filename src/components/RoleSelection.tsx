import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    User,
    Heart,
    Stethoscope,
    Microscope,
    Shield,
    AlertCircle,
    CheckCircle,
    FileText
} from 'lucide-react';
import { useRole, UserRole } from '@/hooks/useRole';
import { useToast } from '@/hooks/use-toast';

interface RoleSelectionProps {
    onComplete: () => void;
    onSkip?: () => void;
}

const RoleSelection = ({ onComplete, onSkip }: RoleSelectionProps) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [verificationData, setVerificationData] = useState({
        professionalLicense: '',
        institution: '',
        specialization: '',
        verificationDocument: null as File | null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateUserRole } = useRole();
    const { toast } = useToast();

    const roles = [
        {
            id: 'survivor' as UserRole,
            title: 'Cancer Survivor',
            description: 'I am a cancer survivor managing my own health journey',
            icon: User,
            color: 'from-primary to-primary/80',
            requirements: ['Personal health information', 'Treatment history', 'Symptom tracking'],
            verificationRequired: false,
        },
        {
            id: 'caregiver' as UserRole,
            title: 'Caregiver',
            description: 'I support a cancer survivor in their health journey',
            icon: Heart,
            color: 'from-pink-500 to-pink-600',
            requirements: ['Relationship to survivor', 'Care responsibilities', 'Support needs'],
            verificationRequired: false,
        },
        {
            id: 'clinician' as UserRole,
            title: 'Healthcare Professional',
            description: 'I am a licensed healthcare provider treating cancer patients',
            icon: Stethoscope,
            color: 'from-green-500 to-green-600',
            requirements: ['Professional license', 'Institution affiliation', 'Specialization'],
            verificationRequired: true,
        },
        {
            id: 'researcher' as UserRole,
            title: 'Researcher',
            description: 'I conduct research related to cancer care and LARS',
            icon: Microscope,
            color: 'from-primary to-primary/80',
            requirements: ['Institution affiliation', 'Research focus', 'IRB approval'],
            verificationRequired: true,
        },
    ];

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleSubmit = async () => {
        if (!selectedRole) return;

        setIsSubmitting(true);
        try {
            const success = await updateUserRole(selectedRole, verificationData);

            if (success) {
                toast({
                    title: "Role selected successfully",
                    description: roles.find(r => r.id === selectedRole)?.verificationRequired
                        ? "Your role has been submitted for verification. You'll receive an email once verified."
                        : "Your profile has been created successfully.",
                });
                onComplete();
            } else {
                throw new Error('Failed to update role');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update your role. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedRoleData = roles.find(r => r.id === selectedRole);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary">Select Your Role</h1>
                <p className="text-lg text-muted-foreground">
                    Choose the role that best describes your relationship to cancer care and LARS management
                </p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;

                    return (
                        <Card
                            key={role.id}
                            className={`cursor-pointer transition-all duration-200 ${isSelected
                                ? 'ring-2 ring-primary shadow-lg'
                                : 'hover:shadow-md'
                                }`}
                            onClick={() => handleRoleSelect(role.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{role.title}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {role.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Requirements:</p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {role.requirements.map((req, index) => (
                                            <li key={index} className="flex items-center">
                                                <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                    {role.verificationRequired && (
                                        <Alert className="mt-3">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription className="text-xs">
                                                Verification required - you'll need to provide professional credentials
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Verification Form for Professional Roles */}
            {selectedRoleData?.verificationRequired && (
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-primary" />
                            Professional Verification
                        </CardTitle>
                        <CardDescription>
                            Please provide your professional credentials for verification
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="license">Professional License Number</Label>
                                <Input
                                    id="license"
                                    value={verificationData.professionalLicense}
                                    onChange={(e) => setVerificationData(prev => ({
                                        ...prev,
                                        professionalLicense: e.target.value
                                    }))}
                                    placeholder="Enter your license number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution/Organization</Label>
                                <Input
                                    id="institution"
                                    value={verificationData.institution}
                                    onChange={(e) => setVerificationData(prev => ({
                                        ...prev,
                                        institution: e.target.value
                                    }))}
                                    placeholder="Enter your institution name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization/Research Focus</Label>
                            <Textarea
                                id="specialization"
                                value={verificationData.specialization}
                                onChange={(e) => setVerificationData(prev => ({
                                    ...prev,
                                    specialization: e.target.value
                                }))}
                                placeholder="Describe your specialization or research focus"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="document">Verification Document (Optional)</Label>
                            <Input
                                id="document"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setVerificationData(prev => ({
                                    ...prev,
                                    verificationDocument: e.target.files?.[0] || null
                                }))}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                            />
                            <p className="text-xs text-muted-foreground">
                                Upload a copy of your license, ID, or institutional affiliation document
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6">
                {onSkip && (
                    <Button
                        variant="outline"
                        onClick={onSkip}
                        disabled={isSubmitting}
                    >
                        Skip for Now
                    </Button>
                )}

                <Button
                    onClick={handleSubmit}
                    disabled={!selectedRole || isSubmitting}
                    className="ml-auto"
                >
                    {isSubmitting ? (
                        <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Creating Profile...
                        </div>
                    ) : (
                        'Complete Profile'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default RoleSelection;
