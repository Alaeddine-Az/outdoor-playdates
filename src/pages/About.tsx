
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { MapPin, Clock, Users, Shield, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">About GoPlayNow</h1>
              <p className="text-lg text-muted-foreground mb-8">
                We're on a mission to bring back outdoor play and help children develop meaningful connections in a safe, trusted environment.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Our Story</h2>
              <p className="mb-4">
                GoPlayNow was born from a simple observation: in today's digital world, children spend less time playing outdoors and making real-world connections.
              </p>
              <p className="mb-4">
                Founded in 2025 by a group of concerned parents in Calgary, our platform aims to reverse this trend by making it easy for families to connect, schedule outdoor activities, and help children develop essential social skills while having fun in nature.
              </p>
              <p className="mb-8">
                We believe that meaningful childhood experiences happen when kids are free to explore, create, and connect with peers in safe outdoor environments. Our platform makes this possible by connecting like-minded families who share these values.
              </p>
              
              <div className="bg-muted/30 rounded-xl p-6 mb-8 border border-muted">
                <h3 className="font-medium mb-2">Our Vision</h3>
                <p className="italic text-muted-foreground">
                  "A world where every child has access to enriching outdoor play experiences and meaningful connections with peers, empowering them to develop into confident, well-rounded individuals."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="bg-muted/20 py-16">
          <div className="container px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-10 text-center">Our Core Values</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-muted">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Safety & Trust</h3>
                  <p className="text-muted-foreground">
                    We prioritize the safety of children through careful verification processes and parent-approved activities.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-muted">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Community Connection</h3>
                  <p className="text-muted-foreground">
                    We believe in the power of local communities and meaningful relationships between families.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-muted">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Outdoor Exploration</h3>
                  <p className="text-muted-foreground">
                    We champion the benefits of outdoor play for physical health, creativity, and cognitive development.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-muted">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Inclusive Environment</h3>
                  <p className="text-muted-foreground">
                    We welcome families from all backgrounds and work to create a platform where everyone feels valued.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team section */}
        <section className="py-16">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-10">Our Team</h2>
              
              <p className="mb-8">
                GoPlayNow is built by a dedicated team of parents, educators, and technology experts who are passionate about childhood development and community building.
              </p>
              
              <div className="bg-muted/30 rounded-xl p-6 mb-8 border border-muted">
                <p className="mb-4">
                  Want to join our team? We're always looking for passionate individuals who share our vision.
                </p>
                <Button asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to action */}
        <section className="bg-primary/5 py-16">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Ready to connect your children with meaningful outdoor play experiences?
              </p>
              <Button asChild size="lg">
                <Link to="/#onboarding">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-8 border-t border-muted">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} GoPlayNow. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
