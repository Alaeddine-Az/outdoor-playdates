
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, MinusCircle } from 'lucide-react';

export interface ChildInfo {
  name: string;
  age: string;
}

interface ChildProfileStepProps {
  children: ChildInfo[];
  onChange: (children: ChildInfo[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ChildProfileStep: React.FC<ChildProfileStepProps> = ({
  children,
  onChange,
  onNext,
  onBack
}) => {
  const updateChild = (index: number, field: keyof ChildInfo, value: string) => {
    const updatedChildren = [...children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value
    };
    onChange(updatedChildren);
  };

  const removeChild = (index: number) => {
    const updatedChildren = children.filter((_, i) => i !== index);
    onChange(updatedChildren);
  };

  const addChild = () => {
    onChange([...children, { name: "", age: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Tell us about your children</h2>
        <p className="text-muted-foreground">
          This information helps us find appropriate playdates for your children.
        </p>
      </div>

      <div className="space-y-4">
        {children.map((child, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 bg-muted/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Child {index + 1}</h3>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChild(index)}
                    >
                      <MinusCircle className="h-5 w-5 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`child-name-${index}`}>Name</Label>
                    <Input
                      id={`child-name-${index}`}
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                      placeholder="Child's name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`child-age-${index}`}>Age</Label>
                    <Input
                      id={`child-age-${index}`}
                      value={child.age}
                      onChange={(e) => updateChild(index, 'age', e.target.value)}
                      placeholder="Age"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addChild}
          className="w-full flex items-center justify-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add another child
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default ChildProfileStep;
