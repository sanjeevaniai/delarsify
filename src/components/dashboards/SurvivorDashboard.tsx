import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Heart,
    Activity,
    Calendar,
    MessageCircle,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Users,
    BookOpen,
    Target
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import LARSSymptomTracker from '@/components/LARSSymptomTracker';
import LARSScoreCalculator from '@/components/LARSScoreCalculator';
import MicrobiomeAnalysis from '@/components/MicrobiomeAnalysis';
import DietaryRecommendations from '@/components/DietaryRecommendations';

const SurvivorDashboard = () => {
    const { role, isVerified } = useRole();
    const [recentActivity, setRecentActivity] = useState([
        { id: 1, action: 'Logged symptoms', time: '2 hours ago', type: 'symptom' },
        { id: 2, action: 'Completed LARS score assessment', time: '1 day ago', type: 'assessment' },
        { id: 3, action: 'Joined community discussion', time: '2 days ago', type: 'community' },
    ]);

    const quickStats = [
        {
            title: 'Current LARS Score',
            value: '12',
            change: '-2 from last week',
            trend: 'down',
            icon: TrendingUp,
            color: 'text-green-600'
        },
        {
            title: 'Symptom-Free Days',
            value: '5',
            change: '+2 this week',
            trend: 'up',
            icon: CheckCircle,
            color: 'text-primary'
        },
        {
            title: 'Community Posts',
            value: '8',
            change: 'Active this week',
            trend: 'stable',
            icon: MessageCircle,
            color: 'text-primary'
        },
        {
            title: 'Resources Read',
            value: '12',
            change: 'This month',
            trend: 'up',
            icon: BookOpen,
            color: 'text-orange-600'
        }
    ];

    const upcomingTasks = [
        { id: 1, task: 'Daily symptom check-in', due: 'Today', priority: 'high' },
        { id: 2, task: 'Weekly LARS score assessment', due: 'Tomorrow', priority: 'medium' },
        { id: 3, task: 'Follow up with healthcare provider', due: 'Next week', priority: 'high' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Welcome back!</h1>
                        <p className="text-muted-foreground">
                            Track your progress and manage your LARS symptoms with personalized insights.
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant={isVerified ? "default" : "secondary"} className="mb-2">
                            {isVerified ? 'Verified Survivor' : 'Profile Pending'}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            {role?.charAt(0).toUpperCase()}{role?.slice(1)} Account
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                                    </div>
                                    <Icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                            <TabsTrigger value="microbiome">Microbiome</TabsTrigger>
                            <TabsTrigger value="diet">Diet</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Activity className="w-5 h-5 mr-2" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                                    <span className="text-sm">{activity.action}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="symptoms">
                            <LARSSymptomTracker />
                        </TabsContent>

                        <TabsContent value="microbiome">
                            <MicrobiomeAnalysis />
                        </TabsContent>

                        <TabsContent value="diet">
                            <DietaryRecommendations />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Upcoming Tasks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {upcomingTasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">{task.task}</p>
                                            <p className="text-xs text-muted-foreground">{task.due}</p>
                                        </div>
                                        <Badge
                                            variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                                            className="text-xs"
                                        >
                                            {task.priority}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Community Quick Access */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Community
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full" variant="outline">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Join Discussion
                            </Button>
                            <Button className="w-full" variant="outline">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Read Resources
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Target className="w-4 h-4 mr-2" />
                                Set Goals
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Progress Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Symptom Tracking</span>
                                        <span>85%</span>
                                    </div>
                                    <Progress value={85} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Diet Adherence</span>
                                        <span>70%</span>
                                    </div>
                                    <Progress value={70} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Exercise</span>
                                        <span>60%</span>
                                    </div>
                                    <Progress value={60} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SurvivorDashboard;
