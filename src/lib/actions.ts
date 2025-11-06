
'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/firebase/server-init';

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
      message: 'Failed to send message. Please check the errors.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const db = getDb();
    
    // Create a clean data object for Firestore
    const dataToStore = {
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      topic: validatedFields.data.topic,
      message: validatedFields.data.message,
      sentDate: serverTimestamp(),
    };
    
    await addDoc(collection(db, 'messages'), dataToStore);

    return {
      message: 'Thank you for your message! We will get back to you soon.',
      success: true,
    };
  } catch (error: any) {
    console.error("Error writing message to Firestore: ", error);
    return {
      message: 'An internal error occurred. Please try again later.',
      success: false,
      errors: {},
    };
  }
}
