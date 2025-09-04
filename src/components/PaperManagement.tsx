import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    FileText,
    Search,
    Filter,
    Download,
    Upload,
    CheckCircle,
    AlertCircle,
    Clock,
    XCircle,
    BarChart3,
    BookOpen,
    Database,
    RefreshCw
} from 'lucide-react';
import { paperProcessor, ProcessedPaper } from '@/services/paperProcessor';
import { ragService } from '@/services/ragService';

const PaperManagement: React.FC = () => {
    const [papers, setPapers] = useState<ProcessedPaper[]>([]);
    const [filteredPapers, setFilteredPapers] = useState<ProcessedPaper[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterStudyType, setFilterStudyType] = useState<string>('all');
    const [filterEvidenceLevel, setFilterEvidenceLevel] = useState<string>('all');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<ProcessedPaper | null>(null);

    useEffect(() => {
        loadPapers();
    }, []);

    useEffect(() => {
        filterPapers();
    }, [papers, searchQuery, filterStatus, filterStudyType, filterEvidenceLevel]);

    const loadPapers = () => {
        const allPapers = paperProcessor.getPapers();
        setPapers(allPapers);
    };

    const filterPapers = () => {
        let filtered = papers;

        // Search filter
        if (searchQuery) {
            filtered = paperProcessor.searchPapers(searchQuery);
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(paper => paper.processingStatus === filterStatus);
        }

        // Study type filter
        if (filterStudyType !== 'all') {
            filtered = filtered.filter(paper => paper.extractedData.studyType === filterStudyType);
        }

        // Evidence level filter
        if (filterEvidenceLevel !== 'all') {
            filtered = filtered.filter(paper => paper.extractedData.evidenceLevel === filterEvidenceLevel);
        }

        setFilteredPapers(filtered);
    };

    const processAllPapers = async () => {
        setIsProcessing(true);
        try {
            const processedPapers = await paperProcessor.processAllPapers();

            // Add processed papers to RAG service
            for (const paper of processedPapers) {
                if (paper.processingStatus === 'completed') {
                    const paperDocument = paperProcessor.convertToPaperDocument(paper);
                    await ragService.addPaper(paperDocument);
                }
            }

            loadPapers();
        } catch (error) {
            console.error('Failed to process papers:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const processSinglePaper = async (paperId: string) => {
        try {
            const processedPaper = await paperProcessor.processPaper(paperId);

            if (processedPaper.processingStatus === 'completed') {
                const paperDocument = paperProcessor.convertToPaperDocument(processedPaper);
                await ragService.addPaper(paperDocument);
            }

            loadPapers();
        } catch (error) {
            console.error('Failed to process paper:', error);
        }
    };

    const getStatusIcon = (status: ProcessedPaper['processingStatus']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'processing':
                return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: ProcessedPaper['processingStatus']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getEvidenceLevelColor = (level: string) => {
        switch (level) {
            case 'High':
                return 'bg-green-100 text-green-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Low':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const stats = paperProcessor.getProcessingStats();

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
                        disabled={isProcessing || stats.pending === 0}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {isProcessing ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Database className="w-4 h-4 mr-2" />
                        )}
                        {isProcessing ? 'Processing...' : 'Process All Papers'}
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-500" />
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

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search papers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterStudyType} onValueChange={setFilterStudyType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by study type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Study Types</SelectItem>
                                <SelectItem value="RCT">RCT</SelectItem>
                                <SelectItem value="Cohort">Cohort</SelectItem>
                                <SelectItem value="Case-Control">Case-Control</SelectItem>
                                <SelectItem value="Meta-Analysis">Meta-Analysis</SelectItem>
                                <SelectItem value="Review">Review</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterEvidenceLevel} onValueChange={setFilterEvidenceLevel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by evidence level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Evidence Levels</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Papers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredPapers.map((paper) => (
                    <Card key={paper.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {paper.authors.join(', ')}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    {getStatusIcon(paper.processingStatus)}
                                    <Badge className={getStatusColor(paper.processingStatus)}>
                                        {paper.processingStatus}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Badge variant="outline">{paper.extractedData.studyType}</Badge>
                                <Badge className={getEvidenceLevelColor(paper.extractedData.evidenceLevel)}>
                                    {paper.extractedData.evidenceLevel} Evidence
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    n={paper.extractedData.sampleSize}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {paper.abstract}
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {paper.keywords.slice(0, 3).map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {keyword}
                                    </Badge>
                                ))}
                                {paper.keywords.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{paper.keywords.length - 3} more
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="text-xs text-muted-foreground">
                                    {paper.journal} • {paper.publicationDate}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedPaper(paper)}
                                    >
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        View
                                    </Button>
                                    {paper.processingStatus === 'pending' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => processSinglePaper(paper.id)}
                                        >
                                            <RefreshCw className="w-3 h-3 mr-1" />
                                            Process
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Paper Details Modal */}
            {selectedPaper && (
                <Card className="fixed inset-4 z-50 overflow-auto">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-xl">{selectedPaper.title}</CardTitle>
                                <CardDescription className="mt-1">
                                    {selectedPaper.authors.join(', ')}
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPaper(null)}
                            >
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Study Details</h4>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Type:</strong> {selectedPaper.extractedData.studyType}</p>
                                    <p><strong>Evidence Level:</strong> {selectedPaper.extractedData.evidenceLevel}</p>
                                    <p><strong>Sample Size:</strong> {selectedPaper.extractedData.sampleSize}</p>
                                    <p><strong>Journal:</strong> {selectedPaper.journal}</p>
                                    <p><strong>DOI:</strong> {selectedPaper.doi}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Keywords</h4>
                                <div className="flex flex-wrap gap-1">
                                    {selectedPaper.keywords.map((keyword, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Abstract</h4>
                            <p className="text-sm text-muted-foreground">{selectedPaper.abstract}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Key Findings</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {selectedPaper.extractedData.findings.map((finding, index) => (
                                    <li key={index}>{finding}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Recommendations</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {selectedPaper.extractedData.recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PaperManagement;
