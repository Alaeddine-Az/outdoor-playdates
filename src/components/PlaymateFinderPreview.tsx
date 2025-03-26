import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Search, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlaymateFinderPreview = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-24 px-6 relative overflow-hidden bg-muted/30"
    >
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side */}
          <div
            className={cn(
              'max-w-xl',
              isIntersecting ? 'animate-fade-in' : 'opacity-0'
            )}
          >
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-primary">
                Find Perfect Playmates
              </span>
            </div>
            <h2 className="font-bold tracking-tight mb-6 text-3xl sm:text-4xl">
              Connect with Verified <br />
              Families Near You
            </h2>
            <div className="space-y-6">
              <FeaturePoint
                icon={<Search className="h-5 w-5 text-primary" />}
                title="Intelligent Matching"
                description="Our AI suggests potential playmates based on location, interests, and age compatibility."
              />
              <FeaturePoint
                icon={<Shield className="h-5 w-5 text-primary" />}
                title="Verified Parents Only"
                description="All parents must complete our verification process before they can connect with others."
              />
              <FeaturePoint
                icon={<MapPin className="h-5 w-5 text-primary" />}
                title="Location-Based Discovery"
                description="Find families within walking distance or near your favorite play spots."
              />
            </div>
            <div className="mt-8">
              <Button
                size="lg"
                className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
                onClick={() =>
                  document
                    .getElementById('onboarding')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Start Finding Playmates
              </Button>
            </div>
          </div>

          {/* Right side */}
          <div
            className={cn(
              'w-full max-w-xl',
              isIntersecting ? 'animate-slide-in-right' : 'opacity-0'
            )}
          >
            <div className="bg-white rounded-2xl shadow-soft border border-muted p-6">
              {/* Search bar */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <div className="w-full h-10 px-10 bg-muted rounded-lg border border-input"></div>
                  <Button
                    variant="ghost"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
                  >
                    <MapPin className="h-4 w-4 mr-1" /> 2mi
                  </Button>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                <PlaymateCard
                  parentName="Sarah J."
                  parentInitial="SJ"
                  children={[
                    { name: 'Oliver', age: 6 },
                    { name: 'Sophia', age: 4 },
                  ]}
                  location="0.5 miles away"
                  interests={['Nature Explorers', 'LEGO Building']}
                  verified={true}
                />
                <PlaymateCard
                  parentName="David B."
                  parentInitial="DB"
                  children={[{ name: 'Emma', age: 5 }]}
                  location="0.8 miles away"
                  interests={['Arts & Crafts', 'Sports']}
                  verified={true}
                />
                <PlaymateCard
                  parentName="Jessica & Mike T."
                  parentInitial="JT"
                  children={[
                    { name: 'Liam', age: 7 },
                    { name: 'Ava', age: 5 },
                  ]}
                  location="1.2 miles away"
                  interests={['STEM Activities', 'Outdoor Games']}
                  verified={true}
                />
              </div>

              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="w-full sm:w-auto">
                  Load More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------
// Helper components
// -----------------------------

interface FeaturePointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeaturePoint = ({ icon, title, description }: FeaturePointProps) => (
  <div className="flex">
    <div className="mr-4 mt-1 flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-medium mb-1">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

interface Child {
  name: string;
  age: number;
}

interface PlaymateCardProps {
  parentName: string;
  parentInitial: string;
  children: Child[];
  location: string;
  interests: string[];
  verified: boolean;
}

const PlaymateCard = ({
  parentName,
  parentInitial,
  children,
  location,
  interests,
  verified,
}: PlaymateCardProps) => (
  <div className="bg-muted/50 hover:bg-muted/80 transition-colors rounded-xl p-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
      <div className="flex items-center">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
          {parentInitial}
        </div>
        <div>
          <div className="flex items-center flex-wrap gap-1">
            <h4 className="font-medium text-base">{parentName}</h4>
            {verified && (
              <div className="flex items-center text-play-green text-xs">
                <Shield className="h-3.5 w-3.5 mr-0.5" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="h-8 w-full sm:w-auto"
      >
        Connect
      </Button>
    </div>

    <div className="ml-0 sm:ml-12 mt-1 space-y-1">
      <div className="text-sm text-muted-foreground">
        {children.map((child, index) => (
          <span key={index}>
            {child.name} ({child.age})
            {index < children.length - 1 ? ' & ' : ''}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted-foreground flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        {location}
      </p>

      <div className="flex flex-wrap gap-2 mt-2">
        {interests.map((interest, index) => (
          <span
            key={index}
            className="inline-block px-2 py-0.5 bg-white text-xs rounded-full border border-muted"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default PlaymateFinderPreview;
