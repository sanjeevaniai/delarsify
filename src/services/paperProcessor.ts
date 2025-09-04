// Paper Processing Service for LARS Research Papers
import { PaperDocument } from './ragService';

export interface ProcessedPaper {
    id: string;
    filename: string;
    title: string;
    authors: string[];
    abstract: string;
    fullText: string;
    publicationDate: string;
    journal: string;
    doi: string;
    keywords: string[];
    extractedData: {
        methodology: string;
        findings: string[];
        conclusions: string[];
        recommendations: string[];
        patientPopulation: string;
        sampleSize: number;
        studyType: 'RCT' | 'Cohort' | 'Case-Control' | 'Meta-Analysis' | 'Review' | 'Other';
        evidenceLevel: 'High' | 'Medium' | 'Low';
    };
    processingStatus: 'pending' | 'processing' | 'completed' | 'error';
    processingError?: string;
    lastProcessed: string;
}

class PaperProcessor {
    private papers: ProcessedPaper[] = [];
    private processingQueue: string[] = [];

    constructor() {
        this.initializePaperList();
    }

    private initializePaperList() {
        // Initialize with the 28 papers from papers_RAG folder
        const paperFiles = [
            'LARS_1.pdf', 'LARS_2.pdf', 'LARS_3.pdf', 'LARS_4.pdf', 'LARS_5.pdf',
            'LARS_6.pdf', 'LARS_7.pdf', 'LARS_8.pdf', 'LARS_9.pdf', 'LARS_10.pdf',
            'LARS_11.pdf', 'LARS_12.pdf', 'LARS_13.pdf', 'LARS_14.pdf', 'LARS_15.pdf',
            'LARS_16.pdf', 'LARS_17.pdf', 'LARS_18.pdf', 'LARS_19.pdf', 'LARS_20.pdf',
            'LARS_21.pdf', 'LARS_22.pdf', 'LARS_23.pdf', 'LARS_24.pdf', 'LARS_25.pdf',
            'LARS_26.pdf', 'LARS_27.pdf', 'LARS_28.pdf'
        ];

        this.papers = paperFiles.map((filename, index) => ({
            id: `paper_${index + 1}`,
            filename,
            title: `LARS Research Paper ${index + 1}`,
            authors: [],
            abstract: '',
            fullText: '',
            publicationDate: '',
            journal: '',
            doi: '',
            keywords: [],
            extractedData: {
                methodology: '',
                findings: [],
                conclusions: [],
                recommendations: [],
                patientPopulation: '',
                sampleSize: 0,
                studyType: 'Other' as const,
                evidenceLevel: 'Medium' as const
            },
            processingStatus: 'pending' as const,
            lastProcessed: new Date().toISOString()
        }));
    }

    /**
     * Get all papers with their processing status
     */
    getPapers(): ProcessedPaper[] {
        return [...this.papers];
    }

    /**
     * Get papers by processing status
     */
    getPapersByStatus(status: ProcessedPaper['processingStatus']): ProcessedPaper[] {
        return this.papers.filter(paper => paper.processingStatus === status);
    }

    /**
     * Get processing statistics
     */
    getProcessingStats() {
        const total = this.papers.length;
        const pending = this.papers.filter(p => p.processingStatus === 'pending').length;
        const processing = this.papers.filter(p => p.processingStatus === 'processing').length;
        const completed = this.papers.filter(p => p.processingStatus === 'completed').length;
        const error = this.papers.filter(p => p.processingStatus === 'error').length;

        return {
            total,
            pending,
            processing,
            completed,
            error,
            progress: Math.round((completed / total) * 100)
        };
    }

    /**
     * Process a single paper
     */
    async processPaper(paperId: string): Promise<ProcessedPaper> {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) {
            throw new Error(`Paper with ID ${paperId} not found`);
        }

        try {
            paper.processingStatus = 'processing';
            paper.lastProcessed = new Date().toISOString();

            // Simulate paper processing
            await this.simulatePaperProcessing(paper);

            paper.processingStatus = 'completed';
            return paper;
        } catch (error) {
            paper.processingStatus = 'error';
            paper.processingError = error instanceof Error ? error.message : 'Unknown error';
            throw error;
        }
    }

    /**
     * Process all pending papers
     */
    async processAllPapers(): Promise<ProcessedPaper[]> {
        const pendingPapers = this.papers.filter(p => p.processingStatus === 'pending');
        const results: ProcessedPaper[] = [];

        for (const paper of pendingPapers) {
            try {
                const processed = await this.processPaper(paper.id);
                results.push(processed);
            } catch (error) {
                console.error(`Failed to process paper ${paper.filename}:`, error);
                results.push(paper);
            }
        }

        return results;
    }

    /**
     * Convert ProcessedPaper to PaperDocument for RAG service
     */
    convertToPaperDocument(processedPaper: ProcessedPaper): PaperDocument {
        return {
            id: processedPaper.id,
            title: processedPaper.title,
            authors: processedPaper.authors,
            abstract: processedPaper.abstract,
            fullText: processedPaper.fullText,
            publicationDate: processedPaper.publicationDate,
            journal: processedPaper.journal,
            doi: processedPaper.doi,
            keywords: processedPaper.keywords,
            extractedData: processedPaper.extractedData,
            lastUpdated: processedPaper.lastProcessed
        };
    }

    /**
     * Search papers by query
     */
    searchPapers(query: string): ProcessedPaper[] {
        const queryLower = query.toLowerCase();
        return this.papers.filter(paper =>
            paper.title.toLowerCase().includes(queryLower) ||
            paper.abstract.toLowerCase().includes(queryLower) ||
            paper.authors.some(author => author.toLowerCase().includes(queryLower)) ||
            paper.keywords.some(keyword => keyword.toLowerCase().includes(queryLower))
        );
    }

    /**
     * Get papers by study type
     */
    getPapersByStudyType(studyType: string): ProcessedPaper[] {
        return this.papers.filter(paper => paper.extractedData.studyType === studyType);
    }

    /**
     * Get papers by evidence level
     */
    getPapersByEvidenceLevel(evidenceLevel: string): ProcessedPaper[] {
        return this.papers.filter(paper => paper.extractedData.evidenceLevel === evidenceLevel);
    }

    private async simulatePaperProcessing(paper: ProcessedPaper): Promise<void> {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock data extraction based on filename
        const paperNumber = parseInt(paper.filename.replace('LARS_', '').replace('.pdf', ''));

        // Generate mock but realistic data
        paper.title = this.generateMockTitle(paperNumber);
        paper.authors = this.generateMockAuthors(paperNumber);
        paper.abstract = this.generateMockAbstract(paperNumber);
        paper.fullText = this.generateMockFullText(paperNumber);
        paper.publicationDate = this.generateMockDate(paperNumber);
        paper.journal = this.generateMockJournal(paperNumber);
        paper.doi = this.generateMockDOI(paperNumber);
        paper.keywords = this.generateMockKeywords(paperNumber);

        // Extract structured data
        paper.extractedData = this.generateMockExtractedData(paperNumber);
    }

    private generateMockTitle(paperNumber: number): string {
        const titles = [
            'Low Anterior Resection Syndrome: A Comprehensive Review of Management Strategies',
            'Quality of Life Assessment in LARS Patients: A Prospective Cohort Study',
            'Microbiome Analysis and LARS Severity: A Cross-Sectional Study',
            'Dietary Interventions for LARS Management: A Randomized Controlled Trial',
            'Pelvic Floor Rehabilitation in LARS: A Systematic Review',
            'Psychological Impact of LARS on Colorectal Cancer Survivors',
            'Surgical Techniques and LARS Prevention: A Meta-Analysis',
            'Pharmacological Treatment Options for LARS: A Clinical Review',
            'Long-term Outcomes of LARS Management: A 5-Year Follow-up Study',
            'Patient-Reported Outcomes in LARS: A Qualitative Study',
            'Risk Factors for LARS Development: A Case-Control Study',
            'Rehabilitation Programs for LARS: A Comparative Analysis',
            'Nutritional Management of LARS: Evidence-Based Guidelines',
            'Social Support and LARS Coping: A Mixed-Methods Study',
            'Technology-Assisted LARS Management: A Pilot Study',
            'LARS in Elderly Patients: A Specialized Approach',
            'Multidisciplinary Care for LARS: A Care Pathway Analysis',
            'LARS and Sexual Function: A Cross-Sectional Study',
            'Economic Impact of LARS Management: A Cost-Effectiveness Analysis',
            'LARS Prevention Strategies: A Systematic Review',
            'Patient Education and LARS Self-Management: A Randomized Trial',
            'LARS and Work Productivity: A Longitudinal Study',
            'Alternative Therapies for LARS: A Scoping Review',
            'LARS in Different Cultural Contexts: A Comparative Study',
            'Technology Solutions for LARS Monitoring: A Feasibility Study',
            'LARS and Comorbid Conditions: A Cross-Sectional Analysis',
            'Family Support in LARS Management: A Qualitative Study',
            'LARS and Mental Health: A Comprehensive Review'
        ];

        return titles[paperNumber - 1] || `LARS Research Study ${paperNumber}`;
    }

    private generateMockAuthors(paperNumber: number): string[] {
        const authorSets = [
            ['Smith, J.', 'Johnson, A.', 'Brown, K.'],
            ['Garcia, M.', 'Lee, S.', 'Wilson, R.'],
            ['Chen, L.', 'Taylor, P.', 'Anderson, M.'],
            ['Davis, R.', 'Martinez, C.', 'Thompson, B.'],
            ['White, K.', 'Harris, D.', 'Clark, E.'],
            ['Miller, F.', 'Gonzalez, G.', 'Lewis, H.'],
            ['Moore, I.', 'Jackson, J.', 'Hall, L.'],
            ['Young, M.', 'King, N.', 'Wright, O.'],
            ['Scott, P.', 'Green, Q.', 'Adams, R.'],
            ['Baker, S.', 'Nelson, T.', 'Carter, U.'],
            ['Mitchell, V.', 'Perez, W.', 'Roberts, X.'],
            ['Campbell, Y.', 'Parker, Z.', 'Edwards, A.'],
            ['Evans, B.', 'Turner, C.', 'Phillips, D.'],
            ['Collins, E.', 'Stewart, F.', 'Sanchez, G.'],
            ['Morris, H.', 'Reed, I.', 'Cook, J.'],
            ['Rogers, K.', 'Morgan, L.', 'Bell, M.'],
            ['Murphy, N.', 'Bailey, O.', 'Rivera, P.'],
            ['Cooper, Q.', 'Richardson, R.', 'Cox, S.'],
            ['Ward, T.', 'Torres, U.', 'Peterson, V.'],
            ['Gray, W.', 'Ramirez, X.', 'James, Y.'],
            ['Watson, Z.', 'Brooks, A.', 'Kelly, B.'],
            ['Sanders, C.', 'Price, D.', 'Bennett, E.'],
            ['Wood, F.', 'Barnes, G.', 'Henderson, H.'],
            ['Coleman, I.', 'Jenkins, J.', 'Perry, K.'],
            ['Powell, L.', 'Long, M.', 'Patterson, N.'],
            ['Hughes, O.', 'Flores, P.', 'Washington, Q.'],
            ['Butler, R.', 'Simmons, S.', 'Foster, T.'],
            ['Gonzales, U.', 'Bryant, V.', 'Alexander, W.']
        ];

        return authorSets[paperNumber - 1] || ['Author, A.', 'Researcher, B.', 'Investigator, C.'];
    }

    private generateMockAbstract(paperNumber: number): string {
        const abstracts = [
            'This systematic review examines the effectiveness of various treatment modalities for Low Anterior Resection Syndrome (LARS) in colorectal cancer survivors. We analyzed 45 studies including over 2,500 patients to evaluate dietary interventions, pelvic floor exercises, and pharmacological treatments.',
            'A prospective cohort study investigating the relationship between gut microbiome composition and LARS severity in 200 patients over 12 months. We found significant correlations between specific bacterial species and symptom severity.',
            'This randomized controlled trial evaluates the effectiveness of a comprehensive dietary intervention program for LARS management. 150 patients were randomized to either standard care or the intervention group.',
            'A cross-sectional study examining quality of life outcomes in 300 LARS patients using validated questionnaires. We assessed physical, emotional, and social functioning domains.',
            'This meta-analysis synthesizes evidence from 30 studies on pelvic floor rehabilitation for LARS management. We found significant improvements in symptom severity and quality of life scores.',
            'A qualitative study exploring the psychological impact of LARS on colorectal cancer survivors. We conducted in-depth interviews with 25 patients to understand their experiences.',
            'This systematic review evaluates surgical techniques for preventing LARS development. We analyzed 20 studies comparing different anastomotic techniques and their outcomes.',
            'A clinical review of pharmacological treatment options for LARS management. We examined the evidence for antidiarrheal medications, antispasmodics, and other drug therapies.',
            'A 5-year follow-up study examining long-term outcomes of LARS management strategies. We followed 200 patients to assess symptom progression and treatment effectiveness.',
            'This qualitative study explores patient-reported outcomes in LARS management. We conducted focus groups with 40 patients to understand their treatment preferences and experiences.'
        ];

        return abstracts[paperNumber % abstracts.length] || 'This study investigates various aspects of Low Anterior Resection Syndrome (LARS) management and outcomes.';
    }

    private generateMockFullText(paperNumber: number): string {
        return `This is the full text content for ${this.generateMockTitle(paperNumber)}. 

The study methodology involved comprehensive data collection and analysis. Key findings include significant improvements in patient outcomes and quality of life measures. 

The results demonstrate the effectiveness of the intervention strategies examined in this research. Clinical implications and recommendations for future practice are discussed in detail.

Conclusion: The findings support the implementation of evidence-based LARS management strategies in clinical practice.`;
    }

    private generateMockDate(paperNumber: number): string {
        const baseYear = 2020;
        const year = baseYear + (paperNumber % 4);
        const month = (paperNumber % 12) + 1;
        const day = (paperNumber % 28) + 1;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    private generateMockJournal(paperNumber: number): string {
        const journals = [
            'Colorectal Disease',
            'Gut Microbes',
            'Quality of Life Research',
            'Journal of Gastrointestinal Surgery',
            'Diseases of the Colon & Rectum',
            'International Journal of Colorectal Disease',
            'European Journal of Surgical Oncology',
            'Annals of Surgery',
            'Surgery',
            'American Journal of Surgery',
            'Journal of Clinical Oncology',
            'Cancer',
            'Oncology',
            'Supportive Care in Cancer',
            'Psycho-Oncology'
        ];

        return journals[paperNumber % journals.length];
    }

    private generateMockDOI(paperNumber: number): string {
        return `10.1000/lars.${paperNumber.toString().padStart(3, '0')}.2023`;
    }

    private generateMockKeywords(paperNumber: number): string[] {
        const keywordSets = [
            ['LARS', 'rectal cancer', 'bowel function', 'quality of life'],
            ['microbiome', 'LARS', '16S rRNA', 'butyricicoccus'],
            ['dietary intervention', 'LARS', 'nutrition', 'fiber'],
            ['pelvic floor', 'rehabilitation', 'LARS', 'exercise'],
            ['psychological impact', 'LARS', 'mental health', 'coping'],
            ['surgical technique', 'LARS prevention', 'anastomosis'],
            ['pharmacological treatment', 'LARS', 'medication'],
            ['long-term outcomes', 'LARS', 'follow-up'],
            ['patient-reported outcomes', 'LARS', 'experience'],
            ['risk factors', 'LARS', 'prediction']
        ];

        return keywordSets[paperNumber % keywordSets.length];
    }

    private generateMockExtractedData(paperNumber: number): ProcessedPaper['extractedData'] {
        const studyTypes: Array<ProcessedPaper['extractedData']['studyType']> = ['RCT', 'Cohort', 'Case-Control', 'Meta-Analysis', 'Review', 'Other'];
        const evidenceLevels: Array<ProcessedPaper['extractedData']['evidenceLevel']> = ['High', 'Medium', 'Low'];

        return {
            methodology: `Study methodology for paper ${paperNumber}: Comprehensive data collection and analysis`,
            findings: [
                `Key finding 1 from paper ${paperNumber}`,
                `Key finding 2 from paper ${paperNumber}`,
                `Key finding 3 from paper ${paperNumber}`
            ],
            conclusions: [
                `Conclusion 1 from paper ${paperNumber}`,
                `Conclusion 2 from paper ${paperNumber}`
            ],
            recommendations: [
                `Recommendation 1 from paper ${paperNumber}`,
                `Recommendation 2 from paper ${paperNumber}`
            ],
            patientPopulation: `LARS patients in study ${paperNumber}`,
            sampleSize: 50 + (paperNumber * 10),
            studyType: studyTypes[paperNumber % studyTypes.length],
            evidenceLevel: evidenceLevels[paperNumber % evidenceLevels.length]
        };
    }
}

// Export singleton instance
export const paperProcessor = new PaperProcessor();
export default paperProcessor;
