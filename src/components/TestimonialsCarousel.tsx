
import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, Quote } from 'lucide-react';

const TestimonialsCarousel = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-16 px-6 relative overflow-hidden"
    >
      <div id="TestimonialsCarousel" className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] rounded-full bg-primary/5 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[20%] h-[20%] rounded-full bg-secondary/5 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block rounded-full bg-muted px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-foreground/80">
              Parents Love GoPlayNow
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            What Families Are <span className="text-primary">Saying</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Hear from parents who have transformed their children's playtime experience with GoPlayNow.
          </p>
        </div>

        <div className={cn(
          "max-w-5xl mx-auto",
          isIntersecting ? "animate-fade-in" : "opacity-0"
        )}>
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote="GoPlayNow helped my shy daughter make friends in our new neighborhood. The verification system gives me peace of mind."
                  author="Jessica T."
                  role="Mother of two"
                  rating={5}
                  imageSrc="https://img.freepik.com/free-photo/portrait-beautiful-young-woman-standing-grey-wall_231208-10760.jpg?ga=GA1.1.927601997.1731108421&semt=ais_hybrid"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote="The gamified challenges keep my kids excited about outdoor play. They've earned so many badges they can't wait to earn more!"
                  author="Michael R."
                  role="Father of three"
                  rating={5}
                  imageSrc="https://img.freepik.com/free-photo/young-father-spending-time-with-his-adorable-daughter_23-2148989019.jpg?ga=GA1.1.927601997.1731108421&semt=ais_hybrid"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote="Finding other families that share our values and interests has been amazing. We've made lasting friendships through GoPlayNow."
                  author="Samantha K."
                  role="Mother of one"
                  rating={5}
                  imageSrc="https://img.freepik.com/free-photo/plus-size-t-shirt-white-basic-women-rsquo-s-casual-wear-outdoor-shoot_53876-101203.jpg?ga=GA1.1.927601997.1731108421&semt=ais_hybrid"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote="The location suggestions are spot on. We've discovered amazing playgrounds we never knew existed in our own neighborhood!"
                  author="David L."
                  role="Father of two"
                  rating={5}
                  imageSrc="https://img.freepik.com/free-photo/smiling-businessman-with-phone-downtown_23-2147689110.jpg?ga=GA1.1.927601997.1731108421&semt=ais_hybrid"
                />
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="relative static transform-none mx-2" />
              <CarouselNext className="relative static transform-none mx-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  imageSrc: string;
}

const TestimonialCard = ({ quote, author, role, rating, imageSrc }: TestimonialCardProps) => (
  <div className="glass-card p-6 h-full flex flex-col">
    <div className="flex-grow">
      <div className="flex mb-4 text-yellow-400">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <div className="relative mb-4">
        <Quote className="absolute top-0 left-0 h-6 w-6 text-primary/20 -translate-x-2 -translate-y-2" />
        <p className="text-foreground text-left">{quote}</p>
      </div>
    </div>
    <div className="flex items-center mt-4 pt-4 border-t border-muted">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
        <img 
          src={imageSrc} 
          alt={author} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-left">
        <h4 className="font-medium">{author}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

export default TestimonialsCarousel;
