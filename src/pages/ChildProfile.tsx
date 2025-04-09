import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { ChildProfile, ParentProfile } from '@/types';

const ChildProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function loadChildProfile() {
    if (!id) return;

    try {
      setLoading(true);

      // STEP 1 — Get the child
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .single();

      if (childError) throw childError;
      setChild(childData);
      console.log('✅ Child loaded:', childData);

      // STEP 2 — Get parent
      const { data: parentData, error: parentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', childData.parent_id)
        .single();

      if (parentError) throw parentError;
      setParent(parentData);
      console.log('✅ Parent loaded:', parentData);

      // STEP 3 — Get interest IDs from child_interests
      const { data: childInterests, error: childInterestsError } = await supabase
        .from('child_interests')
        .select('interest_id')
        .eq('child_id', id);

      if (childInterestsError) throw childInterestsError;
      console.log('✅ child_interests:', childInterests);

      const interestIds = childInterests.map(ci => ci.interest_id);
      console.log('🎯 interestIds:', interestIds);

      if (interestIds.length === 0) {
        setInterests([]);
        return;
      }

      // STEP 4 — Fetch interest names
      const { data: interestNames, error: interestNamesError } = await supabase
        .from('interests')
        .select('name')
        .in('id', interestIds);

      if (interestNamesError) throw interestNamesError;
      console.log('✅ interests:', interestNames);

      setInterests(interestNames.map(i => i.name));
    } catch (e: any) {
      console.error('❌ Error loading profile:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  loadChildProfile();
}, [id]);

  const isParent = user && parent && user.id === parent.id;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!child || !parent) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Child Profile Not Found</h1>
        <p className="text-muted-foreground">
          The requested child profile could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-soft border border-muted p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="bg-secondary/10 text-secondary text-4xl">
              {child.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-grow text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{child.name}</h1>
              <Badge variant="outline" className="sm:ml-2">
                {child.age} years old
              </Badge>
            </div>

            {child.bio && (
              <p className="text-muted-foreground mb-4">{child.bio}</p>
            )}

            {/* Interests section */}
            {interests.length > 0 && (
              <div className="mb-4">
              <div className="text-sm font-medium mb-2">Interests:</div>
              {interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm italic">No interests found.</div>
              )}
            </div>
            )}

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Parent:</div>
              <Link
                to={`/parent/${parent.id}`}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <User className="h-4 w-4" />
                {parent.parent_name}
              </Link>
            </div>

            {isParent && (
              <Button asChild variant="outline">
                <Link to={`/edit-child/${child.id}`}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Profile
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProfilePage;
