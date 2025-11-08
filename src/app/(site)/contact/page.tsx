
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { ContactForm } from '@/components/contact-form';
import { getSiteSettings } from '@/firebase/server-init';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with us. We would love to hear from you!',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const hasContactInfo = settings && (
    (settings.showContactEmail && settings.contactEmail) ||
    (settings.showContactPhone && settings.contactPhone) ||
    (settings.showContactAddress && settings.contactAddress)
  );

  return (
    <div className="container py-16 lg:py-24">
       <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">Get in Touch</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Have a question, a project idea, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            
            {!hasContactInfo && (
              <p className="text-muted-foreground">Contact details are not available at the moment. Please use the form to send us a message.</p>
            )}

            {settings?.showContactEmail && settings.contactEmail && (
              <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                      <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold">Email</h3>
                      <p className="text-muted-foreground">General Inquiries</p>
                      <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">{settings.contactEmail}</a>
                  </div>
              </div>
            )}
            {settings?.showContactPhone && settings.contactPhone && (
              <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                      <FontAwesomeIcon icon={faPhone} className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold">Phone</h3>
                      <p className="text-muted-foreground">Mon-Fri, 9am-5pm</p>
                      <a href={`tel:${settings.contactPhone}`} className="text-primary hover:underline">{settings.contactPhone}</a>
                  </div>
              </div>
            )}
            {settings?.showContactAddress && settings.contactAddress && (
              <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold">Office</h3>
                      <p className="text-muted-foreground">{settings.contactAddress}</p>
                  </div>
              </div>
            )}
        </div>
        
        <div>
            <h2 className="text-2xl font-bold mb-8">Send Us a Message</h2>
            <ContactForm />
        </div>
      </div>
    </div>
  );
}
