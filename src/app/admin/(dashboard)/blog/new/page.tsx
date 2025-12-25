
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { format } from 'date-fns';
import { ImageUploader } from '@/components/admin/image-uploader';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  content: z.string().min(1, 'Content is required.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  imageHint: z.string().min(1, 'Image hint is required.'),
});

export default function NewBlogPostPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '', slug: '', content: '', imageUrl: '', imageHint: ''
    },
  });
  
  const title = form.watch('title');
  
  useEffect(() => {
    if (title) {
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [title, form]);


  async function onSubmit(values: z.infer<typeof blogPostSchema>) {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    
    const postData = {
      ...values,
      author: user.displayName || 'Anonymous',
      authorId: user.uid,
      date: format(new Date(), 'MMMM d, yyyy'),
      publicationDate: serverTimestamp(),
    };

    const collectionRef = collection(firestore, 'blogPosts');
    addDoc(collectionRef, postData)
      .then(() => {
        toast({ title: 'Post Created', description: 'The new blog post has been published.' });
        router.push('/admin/blog');
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: postData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          title: 'Error',
          description: 'Could not create post. Check permissions.',
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
          <Link href="/admin/blog">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
            <p className="text-muted-foreground">Write a new article for your developer blog.</p>
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
                            <FormControl><Input placeholder="Your Post Title" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl><Input placeholder="your-post-title" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <FormLabel>Featured Image</FormLabel>
                          <ImageUploader 
                            onUpload={(url) => form.setValue('imageUrl', url, { shouldValidate: true })}
                          />
                           <FormField control={form.control} name="imageUrl" render={() => <FormItem><FormMessage className="mt-2" /></FormItem>} />
                        </div>
                        <FormField control={form.control} name="imageHint" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image Hint</FormLabel>
                                <FormControl><Input placeholder="e.g., abstract waves" {...field} /></FormControl>
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
                            <FormControl><Textarea placeholder="Write your post here..." {...field} rows={15} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild><Link href="/admin/blog">Cancel</Link></Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : <FontAwesomeIcon icon={faSave} className="mr-2" />}
                    Publish Post
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}

