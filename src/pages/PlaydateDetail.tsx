
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { CalendarClock, MapPin, Users, Clock, ArrowLeft, User, Crown, Edit, Save } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChildProfile, PlaydateParticipant } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      startDate: '',
      startTime: '',
      endTime: '',
      maxParticipants: ''
    }
  });

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

        // Set form default values for editing
        if (playdateData) {
          const startDate = new Date(playdateData.start_time);
          const endDate = new Date(playdateData.end_time);
          
          form.reset({
            title: playdateData.title,
            description: playdateData.description || '',
            location: playdateData.location,
            startDate: format(startDate, 'yyyy-MM-dd'),
            startTime: format(startDate, 'HH:mm'),
            endTime: format(endDate, 'HH:mm'),
            maxParticipants: playdateData.max_participants?.toString() || ''
          });
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
  }, [id, user, form]);

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
      // Get the first child ID to use as the primary child_id (required by the schema)
      const primaryChildId = selectedChildIds[0];
      
      await supabase.from('playdate_participants').insert({
        playdate_id: id,
        child_id: primaryChildId, // Add the required child_id field
        child_ids: selectedChildIds,
        parent_id: user.id,
        status: 'pending'
      });

      toast({ title: 'Success', description: 'You have joined the playdate!' });
      
      // Refresh the participants list after joining
      const { data: rawParticipants } = await supabase
        .from('playdate_participants')
        .select('*')
        .eq('playdate_id', id);
        
      if (rawParticipants) {
        const normalized = rawParticipants.map(p => ({
          ...p,
          child_ids: p.child_ids?.length ? p.child_ids : [p.child_id]
        }));
        setParticipants(normalized);
      }
      
    } catch (err: any) {
      console.error('Error joining playdate:', err);
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

  const handleUpdatePlaydate = async (values: any) => {
    if (!user || !id || user.id !== playdate?.creator_id) {
      toast({
        title: 'Unauthorized',
        description: 'You can only edit playdates you created.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Format date and time fields into ISO strings
      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.startDate}T${values.endTime}`);

      // Validate end time is after start time
      if (endDateTime <= startDateTime) {
        toast({
          title: 'Invalid time range',
          description: 'End time must be after start time.',
          variant: 'destructive',
        });
        setIsUpdating(false);
        return;
      }

      const { error } = await supabase
        .from('playdates')
        .update({
          title: values.title,
          description: values.description,
          location: values.location,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          max_participants: values.maxParticipants ? parseInt(values.maxParticipants) : null
        })
        .eq('id', id);

      if (error) throw error;

      // Update the local state
      setPlaydate({
        ...playdate,
        title: values.title,
        description: values.description,
        location: values.location,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        max_participants: values.maxParticipants ? parseInt(values.maxParticipants) : null
      });

      setIsEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Playdate updated successfully!',
      });
    } catch (err: any) {
      console.error('Failed to update playdate:', err);
      toast({
        title: 'Update failed',
        description: err.message || 'Could not update playdate.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
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

  // Check if the current user is the creator of the playdate
  const isCreator = user && playdate.creator_id === user.id;

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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{playdate.title}</CardTitle>
              {isCreator && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Playdate</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleUpdatePlaydate)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Playdate title" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Description (optional)" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Address" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="maxParticipants"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Max Participants</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Optional" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {/* Add host information here */}
              {creator && (
                <div className="flex items-center mb-4 bg-primary/5 p-3 rounded-md">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={creator.avatar_url} alt={creator.parent_name} />
                    <AvatarFallback>{creator.parent_name ? creator.parent_name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm text-muted-foreground">Hosted by</div>
                    <Link to={`/parent/${creator.id}`} className="font-medium text-primary hover:underline">
                      {creator.parent_name}
                    </Link>
                  </div>
                </div>
              )}

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
