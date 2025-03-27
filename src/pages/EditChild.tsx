
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusCircle, XCircle, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ChildProfile } from '@/types';

// Common child interests for selection
const COMMON_CHILD_INTERESTS = [
  'Drawing', 'Sports', 'Nature', 'Music', 'Reading',
  'Science', 'Building', 'Dolls', 'Cars', 'Animals',
  'Swimming', 'Biking', 'Running', 'Playgrounds', 'Dinosaurs',
  'Princesses', 'Superheroes', 'Magic', 'Dancing', 'Cooking'
];

// Age options for selection
const AGE_OPTIONS = Array.from({ length: 18 }, (_, i) => `${i + 1}`);

const EditChild = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isNewChild = !id;
  
  const [child, setChild] = useState<Partial<ChildProfile>>({
    name: '',
    age: '',
    bio: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(!isNewChild);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchChild = async () => {
      if (isNewChild || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('id', id)
          .eq('parent_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setChild({
            id: data.id,
            name: data.name,
            age: data.age,
            bio: data.bio || '',
            parent_id: data.parent_id,
            created_at: data.created_at,
            updated_at: data.updated_at
          });
          
          // Fetch child interests
          const { data: interestsData, error: interestsError } = await supabase
            .from('child_interests')
            .select('interests(name)')
            .eq('child_id', id);
          
          if (interestsError) throw interestsError;
          
          if (interestsData) {
            const interests = interestsData.map((item: any) => item.interests.name);
            setSelectedInterests(interests);
          }
        }
      } catch (error: any) {
        console.error('Error fetching child:', error);
        toast({
          title: "Error loading child",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChild();
  }, [id, user, isNewChild]);

  const handleSave = async () => {
    if (!user) return;
    
    // Validate inputs
    if (!child.name?.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your child",
        variant: "destructive"
      });
      return;
    }
    
    if (!child.age) {
      toast({
        title: "Missing information",
        description: "Please select your child's age",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      let childId = child.id;
      
      if (isNewChild) {
        // Create new child
        const { data, error } = await supabase
          .from('children')
          .insert({
            name: child.name.trim(),
            age: child.age,
            bio: child.bio?.trim() || null,
            parent_id: user.id
          })
          .select();
        
        if (error) throw error;
        childId = data?.[0]?.id;
      } else {
        // Update existing child
        const { error } = await supabase
          .from('children')
          .update({
            name: child.name.trim(),
            age: child.age,
            bio: child.bio?.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('parent_id', user.id);
        
        if (error) throw error;
      }
      
      // Handle interests
      if (childId) {
        // First remove existing interests
        if (!isNewChild) {
          await supabase
            .from('child_interests')
            .delete()
            .eq('child_id', childId);
        }
        
        // Insert new interests
        if (selectedInterests.length > 0) {
          // First, ensure all interests exist in the interests table
          for (const interest of selectedInterests) {
            // Check if interest exists
            const { data: existingInterest } = await supabase
              .from('interests')
              .select('id')
              .eq('name', interest)
              .single();
            
            let interestId = existingInterest?.id;
            
            // If interest doesn't exist, create it
            if (!interestId) {
              const { data: newInterest, error: createError } = await supabase
                .from('interests')
                .insert({ name: interest })
                .select()
                .single();
              
              if (createError) throw createError;
              interestId = newInterest.id;
            }
            
            // Now link child to interest
            const { error: linkError } = await supabase
              .from('child_interests')
              .insert({
                child_id: childId,
                interest_id: interestId
              });
            
            if (linkError) throw linkError;
          }
        }
      }
      
      toast({
        title: isNewChild ? "Child added" : "Child updated",
        description: isNewChild 
          ? `${child.name} has been added to your profile` 
          : `${child.name}'s profile has been updated`,
      });
      
      // Redirect back to parent profile
      navigate('/parent-profile');
    } catch (error: any) {
      console.error('Error saving child:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
    setCustomInterest('');
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      removeInterest(interest);
    } else {
      addInterest(interest);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <div className="h-10 w-40 bg-muted rounded animate-pulse mb-4"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/parent-profile')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">
          {isNewChild ? 'Add a Child' : `Edit ${child.name}'s Profile`}
        </h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Child's Name</Label>
                <Input 
                  id="name" 
                  value={child.name} 
                  onChange={(e) => setChild({ ...child, name: e.target.value })} 
                  placeholder="Your child's name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <select
                  id="age"
                  value={child.age}
                  onChange={(e) => setChild({ ...child, age: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select age</option>
                  {AGE_OPTIONS.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">About Your Child</Label>
                <Textarea 
                  id="bio" 
                  value={child.bio || ''} 
                  onChange={(e) => setChild({ ...child, bio: e.target.value })} 
                  placeholder="Tell us about your child's personality, likes, and what they enjoy doing"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Select your child's interests to help connect with like-minded playmates
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedInterests.map((interest) => (
                  <Badge 
                    key={interest}
                    variant="secondary"
                    className="rounded-full py-1.5 px-3 flex items-center gap-1 text-sm"
                  >
                    {interest}
                    <XCircle 
                      className="h-4 w-4 ml-1 cursor-pointer" 
                      onClick={() => removeInterest(interest)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a custom interest..."
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customInterest) {
                      e.preventDefault();
                      addInterest(customInterest);
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={() => addInterest(customInterest)}
                  disabled={!customInterest}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Common Interests</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_CHILD_INTERESTS.map((interest) => (
                    <Badge 
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className="rounded-full py-1.5 px-3 cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/parent-profile')}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !child.name || !child.age}
              className="button-glow bg-primary hover:bg-primary/90 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : isNewChild ? "Add Child" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditChild;
