
import React from 'react';
import { ChildProfile } from '@/types';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ChildrenSectionProps {
  children: ChildProfile[];
  parentId: string;
  isCurrentUser: boolean;
}

export default function ChildrenSection({ children, parentId, isCurrentUser }: ChildrenSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Children</h2>
        {isCurrentUser && (
          <Button asChild>
            <Link to="/add-child" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Child
            </Link>
          </Button>
        )}
      </div>

      {children.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground border rounded-lg">
          {isCurrentUser 
            ? "You haven't added any children yet. Click 'Add Child' to get started."
            : "No children have been added yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-secondary/10 text-secondary">
                      {child.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link to={`/child/${child.id}`} className="font-medium hover:text-primary transition-colors">
                      {child.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{child.age} years old</p>

                    {/* Show interests if available */}
                    {child.interests && child.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {child.interests.slice(0, 2).map((interest) => (
                          <Badge
                            key={interest}
                            className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {child.bio && (
                  <p className="text-sm text-muted-foreground mb-3">{child.bio}</p>
                )}
                
                {isCurrentUser && (
                  <div className="flex justify-end">
                    <Link 
                      to={`/edit-child/${child.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit Profile
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
