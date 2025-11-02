'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, query, orderBy, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { SocialLink } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';
import { faGithub, faTwitter, faLinkedin, faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const socialPlatforms = ['github', 'twitter', 'linkedin', 'facebook', 'instagram', 'youtube'] as const;

const socialIconMap: Record<typeof socialPlatforms[number], IconDefinition> = {
  github: faGithub,
  twitter: faTwitter,
  linkedin: faLinkedin,
  facebook: faFacebook,
  instagram: faInstagram,
  youtube: faYoutube,
};

const socialLinkFormSchema = z.object({
  platform: z.enum(socialPlatforms, {
    required_error: "Please select a platform.",
  }),
  url: z.string().url({ message: "Please enter a valid URL." }),
});


export default function AdminSettingsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialLinksQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'socialLinks'), orderBy('order')) : null,
    [firestore]
  );

  const { data: socialLinks, isLoading, error } = useCollection<SocialLink>(socialLinksQuery);

  const form = useForm<z.infer<typeof socialLinkFormSchema>>({
    resolver: zodResolver(socialLinkFormSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'socialLinks', id);
    deleteDoc(docRef).catch((e) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    })
  };
  
  async function onSubmit(values: z.infer<typeof socialLinkFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const newLink = {
      ...values,
      order: socialLinks?.length || 0,
    };

    const collectionRef = collection(firestore, 'socialLinks');
    addDoc(collectionRef, newLink)
      .then(() => {
        toast({ title: "Success", description: "Social link added." });
        form.reset({ platform: undefined, url: '' });
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: newLink,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
      <p className="text-muted-foreground">Manage global settings for your website.</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Manage the social links that appear in your site's footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-medium">Current Links</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : socialLinks && socialLinks.length > 0 ? (
                    socialLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell className="font-medium capitalize flex items-center gap-2">
                           <FontAwesomeIcon icon={socialIconMap[link.platform]} className="h-4 w-4 text-muted-foreground" />
                          {link.platform}
                        </TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-xs"><a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{link.url}</a></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}>
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24">No social links yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
             {error && <p className="text-sm text-destructive mt-2">Error loading social links: {error.message}</p>}
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Add New Link</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
                 <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-48">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {socialPlatforms.map(p => (
                            <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full">
                      <FormControl>
                        <Input placeholder="https://twitter.com/yourhandle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting ? (
                    <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                     <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
                  )}
                  Add Link
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    