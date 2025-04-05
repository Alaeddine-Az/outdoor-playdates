import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { CalendarClock, MapPin, Users, Clock, ArrowLeft, User, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChildProfile, PlaydateParticipant } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

const PlaydateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [playdate, setPlaydate] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [participants, setParticipants] = useState<PlaydateParticipant[]>([]);
  const [participantDetails, setParticipantDetails] = useState<{
    [key: string]: { parent: any; child: ChildProfile }
  }>({});
  const [userChildren, setUserChildren] = useState<any[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
      : '?';
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;

        // Fetch playdate
        const { data: playdateData, error: playdateError } = await supabase
          .from('playdates')
          .select('*')
          .eq('id', id)
          .single();
        if (playdateError) throw playdateError;
        setPlaydate(playdateData);

        // Fetch creator profile
        const { data: creatorData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', playdateData.creator_id)
          .single();
        setCreator(creatorData);

        // Fetch participants
        const { data: rawParticipants } = await supabase
          .from('playdate_participants')
          .select('*')
          .eq('playdate_id', id);
        if (!rawParticipants) return;

        const normalized = rawParticipants.map(p => ({
          ...p,
          child_ids: p.child_ids?.length ? p.child_ids : [p.child_id]
        }));
        setParticipants(normalized);

        // Fetch child & parent data for all child_ids
        const allChildIds = normalized.flatMap(p => p.child_ids).filter(Boolean);
        const uniqueChildIds = [...new Set(allChildIds)];

        const { data: allChildren } = await supabase
          .from('children')
          .select('*')
          .in('id', uniqueChildIds);

        const parentIds = allChildren?.map(c => c.parent_id).filter(Boolean);
        const uniqueParentIds = [...new Set(parentIds)];

        const { data: allParents } = await supabase
          .from('profiles')
          .select('*')
          .in('id', uniqueParentIds);

        const parentMap = Object.fromEntries(
          (allParents || []).map(p => [p.id, p])
        );

        const childMap = Object.fromEntries(
          (allChildren || []).map(c => [c.id, c])
        );

        const detailsObj: {
          [key: string]: { parent: any; child: ChildProfile };
        } = {};

        for (const p of normalized) {
          for (const childId of p.child_ids) {
            const child = childMap[childId];
            if (child) {
              const parent = parentMap[child.parent_id];
              detailsObj[`${p.id}_${childId}`] = { child, parent };
            }
          }
        }

        setParticipantDetails(detailsObj);

        // Fetch current user's children
        if (user) {
          const { data: childrenData } = await supabase
            .from('children')
            .select('*')
            .eq('parent_id', user.id);
          setUserChildren(childrenData || []);
        }
      } catch (err) {
        console.error('Failed to load playdate data:', err);
        toast({
          title: 'Error loading data',
          description: 'Could not load playdate or participants.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  const handleJoinPlaydate = async () => {
    if (!user || selectedChildIds.length === 0 || !id) {
      toast({
        title: 'Error',
        description: 'Select at least one child to join.',
        variant: 'destructive',
      });
      return;
    }

    setIsJoining(true);
    try {
      await supabase.from('playdate_participants').insert({
        playdate_id: id,
        child_ids: selectedChildIds,
        parent_id: user.id,
        status: 'pending'
      });

      toast({ title: 'Success', description: 'You have joined the playdate!' });
    } catch (err: any) {
      toast({
        title: 'Failed',
        description: err.message || 'Could not join playdate.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleChildSelection = (childId: string) => {
    setSelectedChildIds(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!playdate) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">Playdate Not Found</h2>
        <Button onClick={() => navigate('/playdates')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/playdates')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Playdates
      </Button>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{playdate.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-sm text-muted-foreground">
                <CalendarClock className="inline w-4 h-4 mr-1" />
                {format(new Date(playdate.start_time), 'PPPp')} –{' '}
                {format(new Date(playdate.end_time), 'p')}
              </div>

              <div className="mb-4">
                <MapPin className="inline w-4 h-4 mr-1" />
                <span className="font-medium">{playdate.location}</span>
              </div>

              <div className="w-full h-64 rounded overflow-hidden border">
                <iframe
                  title="Map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    playdate.location
                  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
              {playdate.description && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-1">About this Playdate</h3>
                <p className="text-muted-foreground">{playdate.description}</p>
              </div>
            )}
            </CardContent>
          </Card>

          {/* PARTICIPANTS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Participants ({Object.keys(participantDetails).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(participantDetails).map(([key, { parent, child }]) => (
                <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(child?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{child?.name}</p>
                    <p className="text-sm text-muted-foreground">{child?.age} years</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <User className="inline h-3 w-3 mr-1" />
                      Parent:{' '}
                      {parent ? (
                        <Link to={`/parent/${parent.id}`} className="hover:underline text-primary">
                          {parent.parent_name}
                        </Link>
                      ) : (
                        '?'
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Join this Playdate</CardTitle>
            </CardHeader>
            <CardContent>
              {userChildren.length > 0 ? (
                <>
                  <div className="mb-4 space-y-2">
                    {userChildren.map(child => (
                      <div key={child.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedChildIds.includes(child.id)}
                          onCheckedChange={() => handleChildSelection(child.id)}
                        />
                        <span>{child.name} ({child.age})</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    disabled={isJoining || selectedChildIds.length === 0}
                    onClick={handleJoinPlaydate}
                  >
                    {isJoining ? 'Joining...' : 'Join'}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">You need to add children first.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>When</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p><b>Date:</b> {format(new Date(playdate.start_time), 'PPP')}</p>
              <p><b>Time:</b> {format(new Date(playdate.start_time), 'p')} – {format(new Date(playdate.end_time), 'p')}</p>
              {playdate.max_participants && (
                <p><b>Capacity:</b> {participants.length} / {playdate.max_participants}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaydateDetail;
