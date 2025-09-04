import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Microscope,
    BarChart3,
    Download,
    Upload,
    Filter,
    Search,
    TrendingUp,
    Users,
    FileText,
    Database,
    Shield,
    Eye,
    Edit
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';

const ResearcherDashboard = () => {
    const { role, isVerified } = useRole();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDataset, setSelectedDataset] = useState(null);

    // Mock research data - in real app, this would come from API
    const datasets = [
        {
            id: 1,
            name: 'LARS Microbiome Study 2024',
            description: '16S rRNA sequencing data from 150 LARS patients',
            size: '2.3 GB',
            participants: 150,
            status: 'active',
            lastUpdated: '2024-01-15',
            irbApproval: 'IRB-2024-001',
            dataTypes: ['Microbiome', 'Clinical', 'Demographics']
        },
        {
            id: 2,
            name: 'LARS Treatment Outcomes',
            description: 'Longitudinal study of treatment effectiveness',
            size: '1.8 GB',
            participants: 89,
            status: 'completed',
            lastUpdated: '2024-01-10',
            irbApproval: 'IRB-2023-045',
            dataTypes: ['Clinical', 'Outcomes', 'Quality of Life']
        },
        {
            id: 3,
            name: 'LARS Symptom Patterns',
            description: 'Daily symptom tracking data from mobile app',
            size: '4.1 GB',
            participants: 234,
            status: 'active',
            lastUpdated: '2024-01-14',
            irbApproval: 'IRB-2024-012',
            dataTypes: ['Symptom', 'Behavioral', 'Environmental']
        }
    ];

    const publications = [
        {
            id: 1,
            title: 'Gut Microbiome Diversity in LARS Patients',
            journal: 'Gastroenterology Research',
            status: 'published',
            date: '2024-01-10',
            authors: ['Dr. Smith', 'Dr. Johnson', 'Dr. Brown'],
            doi: '10.1234/gastro.2024.001'
        },
        {
            id: 2,
            title: 'Predictive Models for LARS Severity',
            journal: 'Journal of Clinical Medicine',
            status: 'under_review',
            date: '2024-01-05',
            authors: ['Dr. Smith', 'Dr. Wilson'],
            doi: null
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-primary/10 text-primary';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'published': return 'bg-green-100 text-green-800';
            case 'under_review': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Research Dashboard</h1>
                        <p className="text-muted-foreground">
                            Access anonymized research data and collaborate with the research community.
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant={isVerified ? "default" : "secondary"} className="mb-2">
                            {isVerified ? 'Verified Researcher' : 'Verification Pending'}
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
                                <p className="text-sm font-medium text-muted-foreground">Active Studies</p>
                                <p className="text-2xl font-bold">{datasets.filter(d => d.status === 'active').length}</p>
                            </div>
                            <Microscope className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                                <p className="text-2xl font-bold">{datasets.reduce((acc, d) => acc + d.participants, 0)}</p>
                            </div>
                            <Users className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Publications</p>
                                <p className="text-2xl font-bold">{publications.length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Data Size</p>
                                <p className="text-2xl font-bold">
                                    {datasets.reduce((acc, d) => acc + parseFloat(d.size), 0).toFixed(1)}GB
                                </p>
                            </div>
                            <Database className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="datasets" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="datasets">Datasets</TabsTrigger>
                            <TabsTrigger value="publications">Publications</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        </TabsList>

                        <TabsContent value="datasets" className="space-y-4">
                            {/* Search and Filters */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    placeholder="Search datasets..."
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
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Dataset
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Dataset List */}
                            <div className="space-y-3">
                                {datasets
                                    .filter(dataset =>
                                        dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((dataset) => (
                                        <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="font-semibold">{dataset.name}</h3>
                                                            <Badge className={getStatusColor(dataset.status)}>
                                                                {dataset.status}
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                <Shield className="w-3 h-3 mr-1" />
                                                                IRB Approved
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {dataset.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {dataset.dataTypes.map((type, index) => (
                                                                <Badge key={index} variant="secondary" className="text-xs">
                                                                    {type}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground space-y-1">
                                                            <p>Participants: {dataset.participants} • Size: {dataset.size} • Updated: {dataset.lastUpdated}</p>
                                                            <p>IRB: {dataset.irbApproval}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <BarChart3 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="publications" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Publications & Preprints</h3>
                                <Button>
                                    <FileText className="w-4 h-4 mr-2" />
                                    New Publication
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {publications.map((pub) => (
                                    <Card key={pub.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{pub.title}</h4>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        {pub.journal} • {pub.date}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Authors: {pub.authors.join(', ')}
                                                    </p>
                                                    {pub.doi && (
                                                        <p className="text-xs text-primary mt-1">
                                                            DOI: {pub.doi}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge className={getStatusColor(pub.status)}>
                                                    {pub.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="analytics" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Data Usage Analytics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Downloads this month</span>
                                                <span className="font-semibold">24</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Active researchers</span>
                                                <span className="font-semibold">8</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Collaborations</span>
                                                <span className="font-semibold">12</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Research Impact</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Total citations</span>
                                                <span className="font-semibold">156</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">H-index</span>
                                                <span className="font-semibold">8</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Impact factor</span>
                                                <span className="font-semibold">4.2</span>
                                            </div>
                                        </div>
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
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Dataset
                            </Button>
                            <Button className="w-full" variant="outline">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Create Analysis
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Research Tools */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Research Tools</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                <Microscope className="w-4 h-4 mr-2" />
                                Microbiome Analysis
                            </Button>
                            <Button className="w-full" variant="outline">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Statistical Analysis
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Database className="w-4 h-4 mr-2" />
                                Data Management
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Compliance Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Compliance Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">IRB Approval</span>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Data Privacy</span>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">HIPAA Compliance</span>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">GDPR Compliance</span>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ResearcherDashboard;
