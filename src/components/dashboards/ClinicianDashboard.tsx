import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Stethoscope,
    Users,
    FileText,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Search,
    Plus,
    Filter,
    Download,
    Eye,
    Edit
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';

const ClinicianDashboard = () => {
    const { role, isVerified } = useRole();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Mock patient data - in real app, this would come from API
    const patients = [
        {
            id: 1,
            name: 'John Smith',
            age: 65,
            larsScore: 28,
            lastVisit: '2024-01-15',
            status: 'moderate',
            symptoms: ['Frequency', 'Urgency', 'Incontinence'],
            nextAppointment: '2024-01-22'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            age: 58,
            larsScore: 15,
            lastVisit: '2024-01-14',
            status: 'mild',
            symptoms: ['Frequency'],
            nextAppointment: '2024-01-28'
        },
        {
            id: 3,
            name: 'Michael Brown',
            age: 72,
            larsScore: 35,
            lastVisit: '2024-01-10',
            status: 'severe',
            symptoms: ['Frequency', 'Urgency', 'Incontinence', 'Clustering'],
            nextAppointment: '2024-01-20'
        }
    ];

    const recentNotes = [
        {
            id: 1,
            patient: 'John Smith',
            date: '2024-01-15',
            type: 'Follow-up',
            content: 'Patient reports improvement in urgency symptoms. Continuing current treatment plan.',
            author: 'Dr. Smith'
        },
        {
            id: 2,
            patient: 'Sarah Johnson',
            date: '2024-01-14',
            type: 'Initial Assessment',
            content: 'New patient with mild LARS symptoms. Started on dietary modifications.',
            author: 'Dr. Smith'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'mild': return 'bg-green-100 text-green-800';
            case 'moderate': return 'bg-yellow-100 text-yellow-800';
            case 'severe': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLARSScoreColor = (score: number) => {
        if (score <= 20) return 'text-green-600';
        if (score <= 29) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Clinical Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage your patients and access clinical tools for LARS management.
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant={isVerified ? "default" : "secondary"} className="mb-2">
                            {isVerified ? 'Verified Clinician' : 'Verification Pending'}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            {role?.charAt(0).toUpperCase()}{role?.slice(1)} Account
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                                <p className="text-2xl font-bold">{patients.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                                <p className="text-2xl font-bold">{patients.filter(p => p.status !== 'mild').length}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Notes This Week</p>
                                <p className="text-2xl font-bold">{recentNotes.length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg LARS Score</p>
                                <p className="text-2xl font-bold">
                                    {Math.round(patients.reduce((acc, p) => acc + p.larsScore, 0) / patients.length)}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="patients" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="patients">Patients</TabsTrigger>
                            <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
                            <TabsTrigger value="tools">Clinical Tools</TabsTrigger>
                        </TabsList>

                        <TabsContent value="patients" className="space-y-4">
                            {/* Search and Filters */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    placeholder="Search patients..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                        <Button variant="outline">
                                            <Filter className="w-4 h-4 mr-2" />
                                            Filter
                                        </Button>
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Patient
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Patient List */}
                            <div className="space-y-3">
                                {patients
                                    .filter(patient =>
                                        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((patient) => (
                                        <Card key={patient.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="font-semibold">{patient.name}</h3>
                                                            <Badge className={getStatusColor(patient.status)}>
                                                                {patient.status}
                                                            </Badge>
                                                            <span className={`text-lg font-bold ${getLARSScoreColor(patient.larsScore)}`}>
                                                                LARS: {patient.larsScore}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground space-y-1">
                                                            <p>Age: {patient.age} • Last visit: {patient.lastVisit}</p>
                                                            <p>Symptoms: {patient.symptoms.join(', ')}</p>
                                                            <p>Next appointment: {patient.nextAppointment}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <FileText className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="notes" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Recent Clinical Notes</h3>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Note
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {recentNotes.map((note) => (
                                    <Card key={note.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-semibold">{note.patient}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {note.type} • {note.date} • {note.author}
                                                    </p>
                                                </div>
                                                <Badge variant="outline">{note.type}</Badge>
                                            </div>
                                            <p className="text-sm">{note.content}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="tools" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <Stethoscope className="w-12 h-12 mx-auto mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">LARS Assessment Tools</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Access validated LARS scoring and assessment tools
                                        </p>
                                        <Button size="sm">Open Tools</Button>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">Patient Analytics</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            View patient progress and treatment outcomes
                                        </p>
                                        <Button size="sm">View Analytics</Button>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <FileText className="w-12 h-12 mx-auto mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">Treatment Guidelines</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Access evidence-based treatment protocols
                                        </p>
                                        <Button size="sm">View Guidelines</Button>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 text-center">
                                        <Download className="w-12 h-12 mx-auto mb-3 text-primary" />
                                        <h3 className="font-semibold mb-2">Export Reports</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Generate and download patient reports
                                        </p>
                                        <Button size="sm">Export</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Patient
                            </Button>
                            <Button className="w-full" variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                Create Note
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <div className="text-sm">
                                        <p className="font-medium">Patient John Smith</p>
                                        <p className="text-muted-foreground">Updated LARS score</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <div className="text-sm">
                                        <p className="font-medium">New clinical note</p>
                                        <p className="text-muted-foreground">Sarah Johnson follow-up</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClinicianDashboard;
