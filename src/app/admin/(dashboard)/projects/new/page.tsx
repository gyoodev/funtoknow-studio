'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faSpinner, faGamepad, faPlay, faMusic } from '@fortawesome/free-solid-svg-icons';
import { faTiktok, faApple, faCodepen } from '@fortawesome/free-brands-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';


const projectSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  award: z.string().min(1, 'Award is required.'),
  date: z.string().min(1, 'Date is required.'),
  location: z.string().min(1, 'Location is required.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  imageHint: z.string().min(1, 'Image hint is required.'),
  logo: z.string().min(1, 'Logo is required.'),
  logoBg: z.string().min(1, 'Logo background color is required.'),
});

const logoOptions: { value: string, label: string, icon: IconDefinition }[] = [
    { value: 'Gamepad2', label: 'Gamepad', icon: faGamepad },
    { value: 'Apple', label: 'Apple', icon: faApple },
    { value: 'Codepen', label: 'Codepen', icon: faCodepen },
    { value: 'Play', label: 'Play', icon: faPlay },
    { value: 'Music', label: 'Music', icon: faMusic },
    { value: 'Tiktok', label: 'Tiktok', icon: faTiktok },
];

export default function NewProjectPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      award: '',
      date: '',
      location: '',
      imageUrl: '',
      imageHint: '',
      logo: '',
      logoBg: '',
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    const projectData = {
        ...values,
        id: '', // Firestore will generate it
    };

    const collectionRef = collection(firestore, 'projects');
    addDoc(collectionRef, projectData)
      .then(() => {
        toast({ title: 'Project Created', description: 'The new project has been added successfully.' });
        router.push('/admin/projects');
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: projectData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          title: 'Error',
          description: 'Could not create project. Check permissions.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/projects">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground">Fill out the details for the new project.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>All fields are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input placeholder="Project Title" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="award" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Award</FormLabel>
                            <FormControl><Input placeholder="e.g., Gold Winner" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl><Input placeholder="e.g., 28 Dec 2019" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl><Input placeholder="e.g., Toronto, Canada" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl><Input type="url" placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="imageHint" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image Hint</FormLabel>
                        <FormControl><Input placeholder="e.g., abstract waves" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <div className="grid md:grid-cols-2 gap-6">
                     <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a logo" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {logoOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={option.icon} className="h-4 w-4" />
                                        {option.label}
                                    </div>
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField control={form.control} name="logoBg" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logo Background Color</FormLabel>
                            <FormControl><Input placeholder="e.g., bg-orange-500" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/projects">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : <FontAwesomeIcon icon={faSave} className="mr-2" />}
                        Create Project
                    </Button>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
