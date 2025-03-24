
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Have questions or feedback? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container px-6 mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                  
                  {submitted ? (
                    <div className="bg-primary/10 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Thank You!</h3>
                      <p className="text-muted-foreground mb-6">
                        Your message has been sent successfully. We'll get back to you as soon as possible.
                      </p>
                      <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="What is your message about?"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="How can we help you?"
                          rows={5}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </div>
                
                {/* Contact Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Email</h3>
                        <p className="text-muted-foreground">support@goplaynow.com</p>
                        <p className="text-muted-foreground">info@goplaynow.com</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Phone</h3>
                        <p className="text-muted-foreground">(403) 123-4567</p>
                        <p className="text-muted-foreground">Monday-Friday: 9am-5pm MST</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Office</h3>
                        <p className="text-muted-foreground">123 Innovation Drive</p>
                        <p className="text-muted-foreground">Calgary, AB T2P 1K3</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-muted">
                    <h3 className="text-lg font-medium mb-2">Frequently Asked Questions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Before reaching out, you might find your answer in our FAQ section.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/faq">Visit FAQ</Link>
                    </Button>
                  </div>
                </div>
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

export default Contact;
