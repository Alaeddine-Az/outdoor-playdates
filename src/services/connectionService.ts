
import { supabase } from '@/integrations/supabase/client';
import { ConnectionData } from '@/types/dashboard';

export async function fetchSuggestedConnections(userId: string): Promise<ConnectionData[]> {
  try {
    // Get accepted connections to exclude
    const { data: acceptedConnections, error: connectionsError } = await supabase
      .from('connections')
      .select('requester_id, recipient_id')
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (connectionsError) throw connectionsError;

    const connectedUserIds = acceptedConnections.map(conn =>
      conn.requester_id === userId ? conn.recipient_id : conn.requester_id
    );

    // Get all profiles and filter
    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, parent_name, city');

    if (profilesError || !allProfiles) throw profilesError;

    const profiles = allProfiles.filter(
      p => p.id !== userId && !connectedUserIds.includes(p.id)
    );

    const profileIds = profiles.map(p => p.id);

    const { data: childrenData, error: childrenError } = await supabase
      .from('children')
      .select('id, name, age, parent_id')
      .in('parent_id', profileIds);

    if (childrenError || !childrenData) throw childrenError;

    const childIds = childrenData.map(c => c.id);

    const { data: childInterests, error: childInterestsError } = await supabase
      .from('child_interests')
      .select('child_id, interest_id')
      .in('child_id', childIds);

    if (childInterestsError || !childInterests) throw childInterestsError;

    const interestIds = [...new Set(childInterests.map(ci => ci.interest_id))];

    const { data: interests, error: interestsError } = await supabase
      .from('interests')
      .select('id, name')
      .in('id', interestIds);

    if (interestsError || !interests) throw interestsError;

    const interestMap = Object.fromEntries(interests.map(i => [i.id, i.name]));
    const childInterestMap = childInterests.reduce((acc, ci) => {
      if (!acc[ci.child_id]) acc[ci.child_id] = [];
      acc[ci.child_id].push(interestMap[ci.interest_id]);
      return acc;
    }, {} as Record<string, string[]>);

    // Group children by parent
    const parentChildMap = childrenData.reduce((acc, child) => {
      if (!acc[child.parent_id]) acc[child.parent_id] = [];
      acc[child.parent_id].push(child);
      return acc;
    }, {} as Record<string, typeof childrenData>);

    const realConnections: ConnectionData[] = Object.entries(parentChildMap).map(
      ([parentId, children]) => {
        const parent = profiles.find(p => p.id === parentId);
        const firstTwoChildren = children.slice(0, 2);
        const firstChild = firstTwoChildren[0];

        const childName = children.length === 1
          ? `${firstChild.name} (${firstChild.age})`
          : `${firstChild.name} (${firstChild.age}) + ${children.length - 1} more`;

        // Show interests from only first two children
        const interestsFromFirstTwo = firstTwoChildren.flatMap(
          child => childInterestMap[child.id] ?? []
        );
        const uniqueInterests = [...new Set(interestsFromFirstTwo)];

        return {
          id: parent?.id ?? '',
          name: parent?.parent_name ?? '',
          childName,
          interests: uniqueInterests,
          distance: '' // optional
        };
      }
    );

    // 🎲 Randomize and limit to 3
    return realConnections
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
  } catch (error) {
    console.error("Error fetching suggested connections:", error);
    return [];
  }
}
