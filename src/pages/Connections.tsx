
import React, { useState, useEffect } from 'react';
import { useConnections } from '@/hooks/useConnections';
import ConnectionsList from '@/components/ConnectionsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchSuggestedConnections } from '@/services/connectionService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ConnectionData } from '@/types/dashboard';

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState('accepted');
  const [retrying, setRetrying] = useState(false);
  const [suggestedConnections, setSuggestedConnections] = useState<ConnectionData[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  
  const { 
    loading, 
    error,
    pendingRequests, 
    sentRequests, 
    connections, 
    connectionProfiles,
    respondToRequest 
  } = useConnections();
  
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user?.id && !loading && !error) {
      loadSuggestions();
    }
  }, [user?.id, loading, error]);

  const loadSuggestions = async () => {
    if (!user?.id) return;
    
    try {
      setSuggestionsLoading(true);
      const suggestions = await fetchSuggestedConnections(user.id);
      setSuggestedConnections(suggestions);
    } catch (e) {
      console.error('Error fetching suggested connections:', e);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleRespond = async (connectionId: string, accept: boolean) => {
    await respondToRequest(connectionId, accept);
  };

  const handleRetry = async () => {
    setRetrying(true);
    // Force a rerender by temporarily unmounting and remounting the component
    setActiveTab('');
    await new Promise(resolve => setTimeout(resolve, 100));
    setActiveTab('accepted');
    setRetrying(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 px-1 sm:px-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Connections</h1>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button 
          onClick={handleRetry} 
          disabled={retrying}
          className="mx-auto block"
        >
          {retrying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> 
              Retry
            </>
          )}
        </Button>
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
          
          <TabsTrigger value="suggested" className="flex-1 sm:flex-initial text-sm sm:text-base">
            Suggested
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
        
        <TabsContent value="suggested" className="pt-2 sm:pt-4">
          <Card>
            <CardHeader className={isMobile ? "px-3 py-2" : undefined}>
              <CardTitle className="text-lg">Suggested Connections</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-2" : undefined}>
              {suggestionsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <>
                  {suggestedConnections.length > 0 ? (
                    <div className="grid gap-3">
                      {suggestedConnections.map(suggestion => (
                        <Card key={suggestion.id} className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{suggestion.name}</h3>
                              <p className="text-sm text-muted-foreground">{suggestion.childName}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {suggestion.interests.slice(0, 3).map((interest, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <Button size="sm" variant="outline">Connect</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No suggested connections available.</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionsPage;
