
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Find answers to common questions about GoPlayNow, our platform, and how it works.
              </p>
            </div>
          </div>
        </section>
        
        {/* FAQ Accordion */}
        <section className="py-16">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is GoPlayNow?</AccordionTrigger>
                  <AccordionContent>
                    GoPlayNow is a platform that connects families with children for safe, outdoor playdates. We help parents find trusted playmates for their kids, schedule activities, and discover fun outdoor challenges that promote physical activity and social development.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does the matching system work?</AccordionTrigger>
                  <AccordionContent>
                    Our matching system connects families based on children's ages, interests, and location. Parents create profiles for their children, including their interests and preferences. Our algorithm then suggests potential playmates based on compatibility and proximity, allowing parents to connect with families who share similar values.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is GoPlayNow free to use?</AccordionTrigger>
                  <AccordionContent>
                    Yes, our basic services are free for all users. This includes creating profiles, finding playmates, and scheduling basic playdates. We may introduce premium features in the future, but our core functionality will always remain free to ensure accessibility for all families.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>How does GoPlayNow ensure safety?</AccordionTrigger>
                  <AccordionContent>
                    Safety is our top priority. We implement several measures including: verification of parent accounts, privacy controls for family information, parent-approved activities and connections, clear community guidelines, and a reporting system. Parents always maintain full control over their children's connections and activities.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>What age groups does GoPlayNow serve?</AccordionTrigger>
                  <AccordionContent>
                    GoPlayNow is designed for children aged 3-12 years old. Our platform recognizes the different developmental needs across this age range and allows parents to find appropriate playmates within more specific age brackets.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>How can I schedule a playdate?</AccordionTrigger>
                  <AccordionContent>
                    After connecting with other families, you can propose a playdate by selecting "Schedule" on their profile. You'll be able to suggest a location, date, time, and activity. The other parent will receive a notification and can accept, decline, or suggest alternatives. Once confirmed, the playdate will appear in both families' calendars.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger>What are Outdoor Challenges?</AccordionTrigger>
                  <AccordionContent>
                    Outdoor Challenges are fun activities designed to encourage exploration, creativity, and physical activity. They range from nature scavenger hunts to outdoor art projects to physical challenges. Completing challenges earns children badges and rewards, making outdoor play more engaging and motivating.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger>Is my information private?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we take privacy seriously. Your personal information is protected and only shared with other users according to your privacy settings. You control what information is visible to others, and children's information is especially protected. Please see our Privacy Policy for more details on how we handle your data.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-9">
                  <AccordionTrigger>Can I create multiple child profiles?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can create profiles for all your children under your parent account. Each child can have their own customized profile with specific interests, allowing for more accurate playmate matching.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-10">
                  <AccordionTrigger>How can I report inappropriate behavior?</AccordionTrigger>
                  <AccordionContent>
                    If you encounter any inappropriate behavior or content, please use the "Report" feature available on user profiles, messages, and playdate listings. Our team reviews all reports promptly and takes appropriate action to maintain a safe community environment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-muted text-center">
                <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
                <p className="mb-4 text-muted-foreground">
                  We're here to help! Reach out to our team for assistance.
                </p>
                <Button asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
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

export default FAQ;
