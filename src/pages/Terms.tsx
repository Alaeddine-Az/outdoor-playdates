
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Last updated: June 15, 2023
              </p>
            </div>
          </div>
        </section>
        
        {/* Terms Content */}
        <section className="py-16">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto prose">
              <p>
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the GoPlayNow website and mobile application (the "Service") operated by GoPlayNow Inc. ("us", "we", or "our").
              </p>
              
              <p>
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
              
              <p>
                By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
              </p>
              
              <h2>1. Accounts</h2>
              
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
              </p>
              
              <p>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
              
              <h2>2. Parent and Child Profiles</h2>
              
              <p>
                GoPlayNow allows parents to create profiles for their children. You must be the legal guardian or have appropriate authorization to create and manage profiles for any children you add to the Service.
              </p>
              
              <p>
                You are solely responsible for all content, information, and activities associated with child profiles you create. You must ensure that all information provided is accurate and that your use of the Service on behalf of a child complies with these Terms and our Privacy Policy.
              </p>
              
              <h2>3. Content</h2>
              
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
              </p>
              
              <p>
                By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
              </p>
              
              <h2>4. Prohibited Activities</h2>
              
              <p>You agree not to engage in any of the following prohibited activities:</p>
              
              <ul>
                <li>Using the Service for any purpose that is illegal or prohibited by these Terms.</li>
                <li>Posting or transmitting any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</li>
                <li>Impersonating any person or entity or falsely stating or otherwise misrepresenting your affiliation with a person or entity.</li>
                <li>Interfering with or disrupting the Service or servers or networks connected to the Service.</li>
                <li>Collecting or storing personal data about other users without their express consent.</li>
                <li>Using the Service in any way related to the exploitation or harm of minors.</li>
              </ul>
              
              <h2>5. Privacy</h2>
              
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service and explains how we collect, use, and disclose information that pertains to your privacy.
              </p>
              
              <h2>6. Changes</h2>
              
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              
              <h2>7. Contact Us</h2>
              
              <p>
                If you have any questions about these Terms, please contact us at support@goplaynow.com.
              </p>
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

export default Terms;
