'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  content: z.string().min(1, 'Content is required.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  imageHint: z.string().min(1, 'Image hint is required.'),
});


export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '', slug: '', content: '', imageUrl: '', imageHint: ''
    },
  });

  useEffect(() => {
    if (!firestore || !postId) return;
    setIsLoadingData(true);
    const docRef = doc(firestore, 'blogPosts', postId);
    getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        form.reset(docSnap.data() as BlogPost);
      } else {
        toast({ title: 'Error', description: 'Blog post not found.', variant: 'destructive' });
        router.push('/admin/blog');
      }
    }).catch(error => {
      console.error("Error fetching post:", error);
      toast({ title: 'Error', description: 'Failed to load post data.', variant: 'destructive' });
    }).finally(() => {
      setIsLoadingData(false);
    });
  }, [firestore, postId, form, router, toast]);

  async function onSubmit(values: z.infer<typeof blogPostSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    const docRef = doc(firestore, 'blogPosts', postId);
    const dataToUpdate = {
        ...values,
        updatedAt: serverTimestamp(),
    }
    updateDoc(docRef, dataToUpdate)
      .then(() => {
        toast({ title: 'Post Updated', description: 'The blog post has been saved successfully.' });
        router.push('/admin/blog');
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          title: 'Error',
          description: 'Could not update post. Check permissions.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  if (isLoadingData) {
    return (
        <div className="p-4 md:p-8">
            <Skeleton className="h-12 w-1/2 mb-8" />
            <div className="space-y-6">
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <div className="grid md:grid-cols-2 gap-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-64 w-full" /></CardContent>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/blog">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
            <p className="text-muted-foreground">Update this blog post.</p>
        </div>
      </div>

       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Post Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Featured Image URL</FormLabel>
                                <FormControl><Input type="url" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="imageHint" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image Hint</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                <CardContent>
                    <FormField control={form.control} name="content" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Post Body (Markdown)</FormLabel>
                            <FormControl><Textarea {...field} rows={15} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild><Link href="/admin/blog">Cancel</Link></Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : <FontAwesomeIcon icon={faSave} className="mr-2" />}
                    Save Changes
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}
