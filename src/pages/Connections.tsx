
import React, { useState } from 'react';
import { useConnections } from '@/hooks/useConnections';
import ConnectionsList from '@/components/ConnectionsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState('accepted');
  const { 
    loading, 
    pendingRequests, 
    sentRequests, 
    connections, 
    connectionProfiles,
    respondToRequest 
  } = useConnections();
  const isMobile = useIsMobile();

  const handleRespond = async (connectionId: string, accept: boolean) => {
    await respondToRequest(connectionId, accept);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-1 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Connections</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted w-full mb-4 sm:w-auto">
          <TabsTrigger value="accepted" className="flex-1 sm:flex-initial text-sm sm:text-base">
            Connected
            {connections.length > 0 && (
              <span className="ml-1 sm:ml-2 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-xs font-semibold rounded-full bg-primary text-white">
                {connections.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="pending" className="flex-1 sm:flex-initial text-sm sm:text-base">
            Requests
            {pendingRequests.length > 0 && (
              <span className="ml-1 sm:ml-2 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-xs font-semibold rounded-full bg-primary text-white">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="sent" className="flex-1 sm:flex-initial text-sm sm:text-base">
            Sent
            {sentRequests.length > 0 && (
              <span className="ml-1 sm:ml-2 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-xs font-semibold rounded-full bg-primary text-white">
                {sentRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accepted" className="pt-2 sm:pt-4">
          <Card>
            <CardHeader className={isMobile ? "px-3 py-2" : undefined}>
              <CardTitle className="text-lg">Your Connections</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-2" : undefined}>
              <ConnectionsList 
                connections={connections}
                profiles={connectionProfiles}
                type="accepted"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="pt-2 sm:pt-4">
          <Card>
            <CardHeader className={isMobile ? "px-3 py-2" : undefined}>
              <CardTitle className="text-lg">Pending Connection Requests</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-2" : undefined}>
              <ConnectionsList 
                connections={pendingRequests}
                profiles={connectionProfiles}
                onRespond={handleRespond}
                type="pending"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="pt-2 sm:pt-4">
          <Card>
            <CardHeader className={isMobile ? "px-3 py-2" : undefined}>
              <CardTitle className="text-lg">Sent Connection Requests</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-2" : undefined}>
              <ConnectionsList 
                connections={sentRequests}
                profiles={connectionProfiles}
                type="sent"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionsPage;
