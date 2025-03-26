
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
      className="py-12 px-6 relative overflow-hidden"
    >
      {/* Playful background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] rounded-full bg-play-purple/10 filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[20%] h-[20%] rounded-full bg-play-orange/10 filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-[10%] left-[30%] w-[15%] h-[15%] rounded-full bg-play-green/10 filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block rounded-full bg-gradient-to-r from-play-purple/20 to-play-blue/20 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-foreground/80">
              Parents Love GoPlayNow
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4 relative">
            What Families Are <span className="text-primary">Saying</span>
            <svg className="absolute -bottom-2 left-1/4 w-1/2" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,10 Q50,20 100,10 T200,10" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" 
                strokeLinecap="round" />
            </svg>
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
                  color="bg-play-blue/10"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote="The gamified challenges keep my kids excited about outdoor play. They've earned so many badges they can't wait to earn more!"
                  author="Michael R."
                  role="Father of three"
                  rating={5}
                  imageSrc="https://img.freepik.com/free-photo/young-father-spending-time-with-his-adorable-daughter_23-2148989019.jpg?ga=GA1.1.927601997.1731108421&semt=ais_hybrid"
                  color="bg-play-green/10"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote="Finding other families that share our values and interests has been amazing. We've made lasting friendships through GoPlayNow."
                  author="Samantha K."
                  role="Mother of one"
                  rating={5}
                  imageSrc="https://img.freepik.com/free-photo/plus-size-t-shirt-white-basic-women-rsquo-s-casual-wear-outdoor-shoot_53876-101203.jpg?ga=GA1.1.927601997.1731108421&semt=ais_hybrid"
                  color="bg-play-orange/10"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote="The location suggestions are spot on. We've discovered amazing playgrounds we never knew existed in our own neighborhood!"
                  author="David L."
                  role="Father of two"
                  rating={5}
                  imageSrc="https://img.freepik.com/free-photo/smiling-businessman-with-phone-downtown_23-2147689110.jpg?ga=GA1.1.927601997.1731108421&semt=ais_hybrid"
                  color="bg-play-purple/10"
                />
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="relative static transform-none mx-2 bg-white hover:bg-play-blue/10 hover:text-play-blue border-play-blue/20" />
              <CarouselNext className="relative static transform-none mx-2 bg-white hover:bg-play-blue/10 hover:text-play-blue border-play-blue/20" />
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
  color?: string;
}

const TestimonialCard = ({ quote, author, role, rating, imageSrc, color = "bg-primary/10" }: TestimonialCardProps) => (
  <div className="glass-card p-6 h-full flex flex-col rounded-2xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex-grow">
      <div className="flex mb-4 text-yellow-400">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <div className="relative mb-4">
        <Quote className="absolute top-0 left-0 h-6 w-6 text-play-blue/30 -translate-x-2 -translate-y-2" />
        <p className="text-foreground text-left">{quote}</p>
      </div>
    </div>
    <div className="flex items-center mt-4 pt-4 border-t border-muted">
      <div className={cn("w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-offset-2", color === "bg-play-blue/10" ? "ring-play-blue" : color === "bg-play-green/10" ? "ring-play-green" : color === "bg-play-orange/10" ? "ring-play-orange" : "ring-play-purple")}>
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
