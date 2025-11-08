
import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
  Section,
  Hr,
} from '@react-email/components';

interface ReplyEmailTemplateProps {
  replyMessage: string;
}

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: 'PT Sans, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  margin: '40px auto',
  padding: '40px',
  width: '100%',
  maxWidth: '600px',
};

const heading = {
  color: '#673ab7',
  fontSize: '28px',
  fontWeight: 'bold',
  fontFamily: 'Poppins, sans-serif',
};

const text = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '26px',
};

const footerText = {
    color: '#888888',
    fontSize: '12px',
    lineHeight: '18px',
}

export const ReplyEmailTemplate: React.FC<Readonly<ReplyEmailTemplateProps>> = ({
  replyMessage,
}) => (
  <Html>
    <Head />
    <Preview>A reply from FunToKnow</Preview>
    <Tailwind>
        <Body style={main}>
        <Container style={container}>
            <Heading style={heading}>FunToKnow</Heading>
            <Text style={text}>
                Hello,
            </Text>
            <Text style={text}>
                Thank you for contacting us. Here is a reply regarding your message:
            </Text>
            <Section className="bg-slate-100 rounded-lg p-6 my-6">
                <Text style={text} className="whitespace-pre-wrap">{replyMessage}</Text>
            </Section>
            <Text style={text}>
                If you have any further questions, please feel free to reply to this email.
            </Text>
            <Text style={text}>
                Best regards,
                <br />
                The FunToKnow Team
            </Text>
            <Hr className="border-gray-300 my-8" />
            <Text style={footerText}>
                FunToKnow Platform. This is an automated message, but you can reply directly.
            </Text>
        </Container>
        </Body>
    </Tailwind>
  </Html>
);
