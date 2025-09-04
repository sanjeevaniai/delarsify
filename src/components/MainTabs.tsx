import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamSection from './TeamSection';
import MarketResearch from './MarketResearch';
import { Users, FileSearch } from 'lucide-react';

const MainTabs = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="team" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 glass-card">
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="market-research" className="flex items-center gap-2">
                <FileSearch className="h-4 w-4" />
                Market Research
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="team" className="mt-8">
            <TeamSection />
          </TabsContent>

          <TabsContent value="market-research" className="mt-8">
            <MarketResearch />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MainTabs;