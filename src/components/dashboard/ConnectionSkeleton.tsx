
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ConnectionSkeleton = () => {
  return (
    <Card className="rounded-3xl overflow-hidden border-none shadow-md">
      <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-play-purple/20 to-purple-100 pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <div className="w-10 h-10 rounded-full bg-play-purple/20 flex items-center justify-center mr-3 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
          Suggested Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <div className="space-y-3">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="p-4 rounded-2xl animate-pulse bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-muted"></div>
                <div className="flex-1">
                  <div className="h-5 w-24 bg-muted rounded mb-2"></div>
                  <div className="h-3 w-32 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionSkeleton;
