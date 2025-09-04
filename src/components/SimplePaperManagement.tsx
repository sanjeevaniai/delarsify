import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, RefreshCw, CheckCircle, Clock, XCircle, BarChart3 } from 'lucide-react';

const SimplePaperManagement: React.FC = () => {
    const [stats, setStats] = useState({
        total: 28,
        pending: 28,
        processing: 0,
        completed: 0,
        error: 0,
        progress: 0
    });

    const processAllPapers = async () => {
        console.log('Processing all papers...');
        // Simulate processing
        for (let i = 0; i < 28; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setStats(prev => ({
                ...prev,
                pending: prev.pending - 1,
                processing: prev.processing + 1,
                progress: Math.round(((i + 1) / 28) * 100)
            }));
        }

        setStats(prev => ({
            ...prev,
            processing: 0,
            completed: 28,
            progress: 100
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Research Paper Management</h2>
                    <p className="text-muted-foreground">
                        Manage and process LARS research papers for the knowledge base
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={processAllPapers}
                        disabled={stats.pending === 0}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Database className="w-4 h-4 mr-2" />
                        Process All Papers
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Database className="w-4 h-4 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Total Papers</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">Pending</p>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <RefreshCw className="w-4 h-4 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Processing</p>
                                <p className="text-2xl font-bold">{stats.processing}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <div>
                                <p className="text-sm font-medium">Completed</p>
                                <p className="text-2xl font-bold">{stats.completed}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-purple-500" />
                            <div>
                                <p className="text-sm font-medium">Progress</p>
                                <p className="text-2xl font-bold">{stats.progress}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Bar */}
            <Card>
                <CardContent className="p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Processing Progress</span>
                            <span>{stats.completed} / {stats.total} papers</span>
                        </div>
                        <Progress value={stats.progress} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Papers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Array.from({ length: 28 }, (_, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg">LARS Research Paper {i + 1}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Author 1, Author 2, Author 3
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <Badge className="bg-gray-100 text-gray-800">
                                        pending
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Badge variant="outline">RCT</Badge>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                    Medium Evidence
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    n=100
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                                This study investigates various aspects of Low Anterior Resection Syndrome (LARS) management and outcomes.
                            </p>

                            <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary" className="text-xs">LARS</Badge>
                                <Badge variant="secondary" className="text-xs">research</Badge>
                                <Badge variant="secondary" className="text-xs">study</Badge>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="text-xs text-muted-foreground">
                                    Journal Name • 2023-01-01
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Process
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SimplePaperManagement;
