import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChildProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { useChildRemoval } from '@/hooks/useChildRemoval';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChildrenSectionProps {
  children: ChildProfile[];
}

const AGE_OPTIONS = Array.from({ length: 18 }, (_, i) => `${i + 1}`);

const ChildrenSection = ({ children }: ChildrenSectionProps) => {
  const { removeChild, isRemoving } = useChildRemoval();
  const [childInterestsMap, setChildInterestsMap] = useState<Record<string, string[]>>({});

  const handleRemoveChild = async (childId: string, childName: string) => {
    await removeChild(childId, childName);
  };

  useEffect(() => {
    async function fetchChildInterests() {
      const childIds = children.map(c => c.id);
      if (childIds.length === 0) return;

      const { data: interestsData, error } = await supabase
        .from('child_interests')
        .select('child_id, interest_id');

      if (error) {
        console.error('Error fetching child interests:', error);
        return;
      }

      const interestIds = [...new Set(interestsData.map(ci => ci.interest_id))];
      const { data: interestNames, error: interestNameError } = await supabase
        .from('interests')
        .select('id, name')
        .in('id', interestIds);

      if (interestNameError) {
        console.error('Error fetching interest names:', interestNameError);
        return;
      }

      const interestMap = Object.fromEntries(interestNames.map(i => [i.id, i.name]));
      const groupedInterests: Record<string, string[]> = {};

      interestsData.forEach(({ child_id, interest_id }) => {
        if (!groupedInterests[child_id]) groupedInterests[child_id] = [];
        if (interestMap[interest_id]) groupedInterests[child_id].push(interestMap[interest_id]);
      });

      setChildInterestsMap(groupedInterests);
    }

    fetchChildInterests();
  }, [children]);

  if (children.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You haven't added any children to your profile yet.</p>
        <Button asChild>
          <Link to="/add-child">Add Your First Child</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Children Profiles</h2>
        <Button asChild variant="outline" className="gap-1">
          <Link to="/add-child">
            <Plus className="h-4 w-4" /> Add Child
          </Link>
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {children.map((child) => (
          <Card key={child.id} className="border rounded-lg overflow-hidden">
            <AccordionItem value={child.id} className="border-0">
              <CardHeader className="p-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <CardTitle className="text-left">{child.name}</CardTitle>
                </AccordionTrigger>
              </CardHeader>

              <AccordionContent>
                <CardContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Child's Name</Label>
                      <Input defaultValue={child.name} readOnly />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Age</Label>
                      <select
                        defaultValue={child.age}
                        disabled
                        className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
                      >
                        <option>Select age</option>
                        {AGE_OPTIONS.map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {(childInterestsMap[child.id] || []).map((interest) => (
                        <Badge
                          key={interest}
                          variant="secondary"
                          className="rounded-full py-1 px-3"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Description</Label>
                    <Textarea
                      defaultValue={child.bio || ''}
                      readOnly
                      className="min-h-[100px] bg-muted"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/edit-child/${child.id}`}>Edit Child</Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isRemoving}
                          className="gap-1"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove {child.name}'s profile from your account. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleRemoveChild(child.id, child.name)}
                          >
                            {isRemoving ? "Removing..." : "Remove"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default ChildrenSection;
