import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Trophy } from 'lucide-react';

const Achievements = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Achievements</h1>
          <p className="text-muted-foreground text-lg">
            Complete fun outdoor challenges and earn rewards
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Content remains the same as the Challenges page */}
            <section className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-medium mb-6">Content from Challenges page</h2>
              <p className="text-muted-foreground">The achievements content will be displayed here.</p>
            </section>
          </div>
          
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-medium text-center mb-2">Your Progress</h2>
              <p className="text-muted-foreground text-center mb-6">
                You've completed 12 outdoor challenges so far!
              </p>
              <div className="space-y-4">
                <ProgressItem label="Weekly Goals" progress={75} />
                <ProgressItem label="Monthly Streak" progress={60} />
                <ProgressItem label="Badges Earned" progress={40} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface ProgressItemProps {
  label: string;
  progress: number;
}

const ProgressItem = ({ label, progress }: ProgressItemProps) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-muted-foreground">{progress}%</span>
    </div>
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className="bg-primary rounded-full h-2"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default Achievements;
