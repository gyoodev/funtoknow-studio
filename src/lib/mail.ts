
'use server';

import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { ReplyEmailTemplate } from '@/components/email-templates/reply-template';

interface SendEmailPayload {
  to: string;
  subject: string;
  replyMessage: string;
}

export async function sendEmail(payload: SendEmailPayload) {
  const { to, subject, replyMessage } = payload;
  const {
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER,
    EMAIL_SERVER_PASS,
    EMAIL_FROM,
  } = process.env;

  if (
    !EMAIL_SERVER_HOST ||
    !EMAIL_SERVER_PORT ||
    !EMAIL_SERVER_USER ||
    !EMAIL_SERVER_PASS ||
    !EMAIL_FROM
  ) {
    console.error('Missing email environment variables.');
    return { success: false, message: 'Server is not configured for sending emails.' };
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: parseInt(EMAIL_SERVER_PORT, 10),
    secure: parseInt(EMAIL_SERVER_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASS,
    },
  });

  try {
    const emailHtml = render(ReplyEmailTemplate({ replyMessage }));

    const options = {
      from: EMAIL_FROM,
      to,
      subject,
      html: emailHtml,
    };

    await transporter.sendMail(options);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { success: false, message: error.message || 'Failed to send email.' };
  }
}
