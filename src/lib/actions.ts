
'use server';

import { z } from 'zod';
import { getDb } from '@/firebase/server-init';
import { FieldValue } from 'firebase-admin/firestore';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  topic: z.enum(['general', 'project', 'bug'], { required_error: 'Please select a topic.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    topic?: string[];
    message?: string[];
  };
  success: boolean;
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    topic: formData.get('topic'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Failed to send message. Please check the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const db = getDb();
    
    // This is the data that will be stored in Firestore.
    // It includes the validated form data and the server timestamp.
    const dataToStore = {
      ...validatedFields.data,
      sentDate: FieldValue.serverTimestamp(),
    };
    
    await db.collection('messages').add(dataToStore);

    return {
      message: 'Thank you for your message! We will get back to you soon.',
      success: true,
    };
  } catch (error: any) {
    // This block will now catch any server-side errors,
    // including initialization or write failures.
    console.error("Critical Error writing message to Firestore: ", error);
    return {
      message: 'An unexpected internal error occurred. Please try again later.',
      success: false,
      errors: {},
    };
  }
}
