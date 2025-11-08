
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for FunToKnow platform.',
};

export default function PrivacyPage() {
  return (
    <div className="container py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">Privacy Policy</h1>
            <p className="mt-4 text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <article className="prose">
            <p>Welcome to FunToKnow. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

            <h2>Information We Collect</h2>
            <p>We may collect personal information that you voluntarily provide to us, such as your name, email address, and gaming habits when you register an account or contact us.</p>
            
            <h2>Use of Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Create and manage your account.</li>
                <li>Provide you with a personalized experience.</li>
                <li>Respond to your comments and inquiries.</li>
                <li>Send you updates and administrative messages.</li>
            </ul>

            <h2>Cookies and Web Beacons</h2>
            <p>We may use cookies and other tracking technologies to help customize the platform and improve your experience. You are free to decline our cookies if your browser permits, but some parts of our site may not work properly for you.</p>

            <h2>Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
            
            <h2>Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us through our <Link href="/contact">contact page</Link>.</p>
        </article>
      </div>
    </div>
  );
}
