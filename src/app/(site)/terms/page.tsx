
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for FunToKnow platform.',
};

export default function TermsPage() {
  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">Terms of Service</h1>
            <p className="mt-4 text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <article className="prose">
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.</p>

            <h2>2. User Accounts</h2>
            <p>To access certain features of the platform, you may be required to create an account. You are responsible for safeguarding your account information and for all activities that occur under your account.</p>
            
            <h2>3. User Conduct</h2>
            <p>You agree not to use the platform for any purpose that is illegal or prohibited by these terms. You agree not to post any content that is abusive, threatening, obscene, defamatory, or racially, sexually, religiously, or otherwise objectionable and offensive.</p>

            <h2>4. Intellectual Property</h2>
            <p>The platform and its original content, features, and functionality are and will remain the exclusive property of FunToKnow and its licensors.</p>

            <h2>5. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2>6. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us.</p>
        </article>
      </div>
    </div>
  );
}
