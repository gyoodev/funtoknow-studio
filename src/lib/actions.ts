'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
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
    // Save the data to Firestore in a 'messages' collection
    await addDoc(collection(db, 'messages'), {
      ...validatedFields.data,
      createdAt: serverTimestamp(),
    });

    return {
      message: 'Thank you for your message! We will get back to you soon.',
      success: true,
    };
  } catch (error) {
    console.error("Error writing message to Firestore: ", error);
    return {
      message: 'An internal error occurred. Please try again later.',
      success: false,
      errors: {},
    };
  }
}
