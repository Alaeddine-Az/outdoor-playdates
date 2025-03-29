
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
      GoPlayNow is a joyful platform for parents to discover and organize outdoor playdates with other families. Designed with safety, fun, and simplicity in mind, we help you connect your kids with great playmates nearby—and spark lifelong memories through outdoor activities.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-2">
    <AccordionTrigger>How does the matching system work?</AccordionTrigger>
    <AccordionContent>
      We match families based on their children's age, location, and shared interests. When you create a profile, our system uses this info to recommend compatible playmates. You stay in control—only connecting with families that feel like the right fit for yours.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-3">
    <AccordionTrigger>Is GoPlayNow free to use?</AccordionTrigger>
    <AccordionContent>
      Yes! Our core features are completely free—including creating profiles, browsing local playdates, and connecting with families. We may introduce optional premium features later, but GoPlayNow will always remain accessible and valuable to all families.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-4">
    <AccordionTrigger>How does GoPlayNow ensure safety?</AccordionTrigger>
    <AccordionContent>
      Safety is at the heart of everything we do. We verify parents during onboarding, allow privacy control over your family’s profile, and give you full control over who you connect with. You can block, report, or decline any request at any time—and your child's information is never public.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-5">
    <AccordionTrigger>What age groups does GoPlayNow serve?</AccordionTrigger>
    <AccordionContent>
      GoPlayNow is built for kids aged 3 to 12. Whether you're looking for toddler adventures or grade-school buddies, our platform helps you find families with similarly aged children for age-appropriate playdates.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-6">
    <AccordionTrigger>How can I schedule a playdate?</AccordionTrigger>
    <AccordionContent>
      After connecting with another parent, you can suggest a playdate directly. Choose a time, place, and fun activity. The other parent can accept, decline, or suggest changes. Once agreed upon, it's added to your dashboard. Simple, fast, and collaborative.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-7">
    <AccordionTrigger>What are Outdoor Challenges?</AccordionTrigger>
    <AccordionContent>
      Outdoor Challenges are creative, fun mini-adventures designed to spark curiosity and movement. Think nature treasure hunts, sidewalk art, or building leaf forts. Completing challenges earns kids digital badges—making outdoor time even more exciting!
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-8">
    <AccordionTrigger>Is my information private?</AccordionTrigger>
    <AccordionContent>
      Absolutely. You decide what information others can see. Parent profiles are verified, and child details remain private unless shared by you. We follow strict privacy practices and never sell your data. Learn more in our Privacy Policy.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-9">
    <AccordionTrigger>Can I create multiple child profiles?</AccordionTrigger>
    <AccordionContent>
      Yes! You can add multiple children under your account. Each child can have their own profile with specific interests and age, making it easier to get personalized playdate suggestions.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-10">
    <AccordionTrigger>How can I report inappropriate behavior?</AccordionTrigger>
    <AccordionContent>
      Every profile, message, and playdate includes a “Report” option. Our moderation team responds quickly to keep our community safe and positive. You can also block users or remove connections at any time.
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-11">
    <AccordionTrigger>Why is GoPlayNow invitation-only?</AccordionTrigger>
    <AccordionContent>
      GoPlayNow is currently invitation-only to build a trusted, close-knit community of like-minded families. We believe in quality over quantity—so instead of opening the doors to everyone, we’re growing slowly and intentionally. This allows us to ensure trust, safety, and shared values within our member base. If you've received an invite, it means someone in our community believes you'd be a great addition. Want in? <Link to="/contact" className="underline">Reach out to us</Link> to request an invite.
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
