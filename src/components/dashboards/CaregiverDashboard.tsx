import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Heart,
    Users,
    Calendar,
    MessageCircle,
    BookOpen,
    AlertCircle,
    CheckCircle,
    Phone,
    MapPin,
    Clock,
    Target,
    FileText
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';

const CaregiverDashboard = () => {
    const { role, isVerified } = useRole();
    const [selectedSurvivor, setSelectedSurvivor] = useState(null);

    // Mock data for survivors being cared for
    const survivors = [
        {
            id: 1,
            name: 'John Smith',
            relationship: 'Father',
            age: 65,
            larsScore: 28,
            lastUpdate: '2024-01-15',
            status: 'moderate',
            nextAppointment: '2024-01-22',
            symptoms: ['Frequency', 'Urgency', 'Incontinence'],
            medications: ['Loperamide', 'Psyllium'],
            emergencyContact: 'Dr. Johnson - (555) 123-4567'
        },
        {
            id: 2,
            name: 'Sarah Wilson',
            relationship: 'Sister',
            age: 58,
            larsScore: 15,
            lastUpdate: '2024-01-14',
            status: 'mild',
            nextAppointment: '2024-01-28',
            symptoms: ['Frequency'],
            medications: ['Dietary modifications'],
            emergencyContact: 'Dr. Brown - (555) 987-6543'
        }
    ];

    const upcomingTasks = [
        {
            id: 1,
            task: 'Help John with daily symptom tracking',
            due: 'Today',
            priority: 'high',
            survivor: 'John Smith'
        },
        {
            id: 2,
            task: 'Prepare for Sarah\'s doctor appointment',
            due: 'Tomorrow',
            priority: 'medium',
            survivor: 'Sarah Wilson'
        },
        {
            id: 3,
            task: 'Research dietary recommendations',
            due: 'This week',
            priority: 'low',
            survivor: 'Both'
        }
    ];

    const resources = [
        {
            title: 'Caregiver Support Guide',
            description: 'Comprehensive guide for supporting LARS patients',
            type: 'Guide',
            url: '#'
        },
        {
            title: 'Emergency Protocols',
            description: 'What to do in case of severe symptoms',
            type: 'Protocol',
            url: '#'
        },
        {
            title: 'Support Group Meeting',
            description: 'Monthly caregiver support group',
            type: 'Event',
            url: '#'
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
                        <h1 className="text-2xl font-bold text-primary">Caregiver Dashboard</h1>
                        <p className="text-muted-foreground">
                            Support your loved ones in their LARS management journey.
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant={isVerified ? "default" : "secondary"} className="mb-2">
                            {isVerified ? 'Verified Caregiver' : 'Verification Pending'}
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
                                <p className="text-sm font-medium text-muted-foreground">People You Care For</p>
                                <p className="text-2xl font-bold">{survivors.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Upcoming Tasks</p>
                                <p className="text-2xl font-bold">{upcomingTasks.length}</p>
                            </div>
                            <Target className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Resources Accessed</p>
                                <p className="text-2xl font-bold">12</p>
                            </div>
                            <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Support Hours</p>
                                <p className="text-2xl font-bold">24/7</p>
                            </div>
                            <Heart className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="survivors" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="survivors">Your Loved Ones</TabsTrigger>
                            <TabsTrigger value="tasks">Tasks & Reminders</TabsTrigger>
                            <TabsTrigger value="resources">Resources</TabsTrigger>
                        </TabsList>

                        <TabsContent value="survivors" className="space-y-4">
                            <div className="space-y-3">
                                {survivors.map((survivor) => (
                                    <Card key={survivor.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="font-semibold">{survivor.name}</h3>
                                                        <Badge variant="outline">{survivor.relationship}</Badge>
                                                        <Badge className={getStatusColor(survivor.status)}>
                                                            {survivor.status}
                                                        </Badge>
                                                        <span className={`text-lg font-bold ${getLARSScoreColor(survivor.larsScore)}`}>
                                                            LARS: {survivor.larsScore}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground space-y-1">
                                                        <p>Age: {survivor.age} • Last update: {survivor.lastUpdate}</p>
                                                        <p>Symptoms: {survivor.symptoms.join(', ')}</p>
                                                        <p>Medications: {survivor.medications.join(', ')}</p>
                                                        <p>Next appointment: {survivor.nextAppointment}</p>
                                                        <p className="flex items-center">
                                                            <Phone className="w-3 h-3 mr-1" />
                                                            Emergency: {survivor.emergencyContact}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button size="sm" variant="outline">
                                                        <MessageCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Calendar className="w-4 h-4" />
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

                        <TabsContent value="tasks" className="space-y-4">
                            <div className="space-y-3">
                                {upcomingTasks.map((task) => (
                                    <Card key={task.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{task.task}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        For: {task.survivor} • Due: {task.due}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge
                                                        variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                    <Button size="sm" variant="outline">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="resources" className="space-y-4">
                            <div className="space-y-3">
                                {resources.map((resource, index) => (
                                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{resource.title}</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {resource.description}
                                                    </p>
                                                    <Badge variant="outline" className="text-xs">
                                                        {resource.type}
                                                    </Badge>
                                                </div>
                                                <Button size="sm" variant="outline">
                                                    <BookOpen className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
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
                                <Users className="w-4 h-4 mr-2" />
                                Add Person to Care For
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Reminder
                            </Button>
                            <Button className="w-full" variant="outline">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Join Support Group
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Emergency Contacts */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Emergency Contacts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-2 bg-red-50 rounded">
                                    <Phone className="w-4 h-4 text-red-500" />
                                    <div className="text-sm">
                                        <p className="font-medium">Emergency: 911</p>
                                        <p className="text-muted-foreground">For life-threatening situations</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-2 bg-primary/10 rounded">
                                    <Phone className="w-4 h-4 text-primary" />
                                    <div className="text-sm">
                                        <p className="font-medium">LARS Hotline</p>
                                        <p className="text-muted-foreground">(555) LARS-HELP</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                                    <MapPin className="w-4 h-4 text-green-500" />
                                    <div className="text-sm">
                                        <p className="font-medium">Nearest Hospital</p>
                                        <p className="text-muted-foreground">City General - 2.3 miles</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Resources */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Support Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Caregiver Guide
                            </Button>
                            <Button className="w-full" variant="outline">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Support Groups
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Heart className="w-4 h-4 mr-2" />
                                Self-Care Tips
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CaregiverDashboard;
