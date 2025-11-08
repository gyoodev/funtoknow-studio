
import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
    title: 'FAQ',
    description: 'Frequently Asked Questions about the FunToKnow platform.',
};

const faqs = [
    {
        question: "What is FunToKnow?",
        answer: "FunToKnow is a modern web application designed for showcasing game projects, publishing a developer blog, and managing a user community."
    },
    {
        question: "How do I create an account?",
        answer: "You can create an account by clicking the 'Sign In' button in the navigation bar and then selecting 'Sign up'. This feature can be enabled or disabled by the site administrator."
    },
    {
        question: "Can I submit my own project?",
        answer: "Currently, projects are managed by the site administrators. We may open up public project submissions in the future."
    },
    {
        question: "How can I contact support?",
        answer: "You can get in touch with us by using the form on our Contact page. We'd love to hear from you!"
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we take data security very seriously. We use modern security practices and technologies, including Firebase Authentication and Firestore Security Rules, to protect your information. For more details, please see our Privacy Policy."
    }
];

export default function FaqPage() {
  return (
    <div className="container py-16 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
        </p>
      </div>

      <div className="mt-12 mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
