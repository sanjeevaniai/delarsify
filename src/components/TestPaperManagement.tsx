import React from 'react';
import PaperManagement from './PaperManagement';

const TestPaperManagement: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test Paper Management</h1>
            <PaperManagement />
        </div>
    );
};

export default TestPaperManagement;
