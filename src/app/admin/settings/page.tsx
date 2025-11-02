'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, query, orderBy, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import type { SocialLink, SiteSettings } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrash, faPlus, faSave, faTriangleExclamation, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';
import { faGithub, faTwitter, faLinkedin, faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

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

const siteSettingsFormSchema = z.object({
  siteName: z.string().min(1, 'Site name is required.'),
  description: z.string().min(1, 'Description is required.'),
  metaTags: z.string().optional(),
  loginActive: z.boolean(),
  registerActive: z.boolean(),
  underDevelopment: z.boolean(),
  showSystemNotification: z.boolean(),
  systemNotification: z.string().optional(),
});

function GeneralSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof siteSettingsFormSchema>>({
    resolver: zodResolver(siteSettingsFormSchema),
    values: {
      siteName: settings?.siteName || '',
      description: settings?.description || '',
      metaTags: settings?.metaTags || '',
      loginActive: settings?.loginActive ?? true,
      registerActive: settings?.registerActive ?? true,
      underDevelopment: settings?.underDevelopment ?? false,
      showSystemNotification: settings?.showSystemNotification ?? false,
      systemNotification: settings?.systemNotification || '',
    },
  });

  async function onSubmit(values: z.infer<typeof siteSettingsFormSchema>) {
    if (!firestore) return;
    setIsSaving(true);
    const settingsRef = doc(firestore, 'settings', 'global');
    setDoc(settingsRef, values, { merge: true })
      .then(() => {
        toast({ title: 'Success', description: 'Site settings updated.' });
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update',
          requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Awesome Site" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaTags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Tags (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="gaming, dev, blog" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="A short description for SEO..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="grid md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="loginActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Login Active</FormLabel>
                  <p className="text-sm text-muted-foreground">Allow users to log in.</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registerActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Registration Active</FormLabel>
                  <p className="text-sm text-muted-foreground">Allow new users to register.</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </form>
    </Form>
  )
}

function BannersForm({ settings }: { settings: SiteSettings | null }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof siteSettingsFormSchema>>({
    resolver: zodResolver(siteSettingsFormSchema),
    values: {
      siteName: settings?.siteName || '',
      description: settings?.description || '',
      metaTags: settings?.metaTags || '',
      loginActive: settings?.loginActive ?? true,
      registerActive: settings?.registerActive ?? true,
      underDevelopment: settings?.underDevelopment ?? false,
      showSystemNotification: settings?.showSystemNotification ?? false,
      systemNotification: settings?.systemNotification || '',
    },
  });

  const showSystemNotification = form.watch('showSystemNotification');

  async function onSubmit(values: z.infer<typeof siteSettingsFormSchema>) {
    if (!firestore) return;
    setIsSaving(true);
    const settingsRef = doc(firestore, 'settings', 'global');
    // We only want to save the banner-related settings from this form
    const dataToSave = {
      underDevelopment: values.underDevelopment,
      showSystemNotification: values.showSystemNotification,
      systemNotification: values.systemNotification,
    }
    setDoc(settingsRef, dataToSave, { merge: true })
      .then(() => {
        toast({ title: 'Success', description: 'Banner settings updated.' });
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'update',
          requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="underDevelopment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">"Under Development" Banner</FormLabel>
                  <p className="text-sm text-muted-foreground">Display a sitewide development warning.</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="showSystemNotification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">System Notification Banner</FormLabel>
                  <p className="text-sm text-muted-foreground">Display a custom sitewide message.</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
        />
        
        {showSystemNotification && (
          <FormField
            control={form.control}
            name="systemNotification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="E.g., Scheduled maintenance this Sunday at 2 AM EST." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}


        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" />
          )}
          Save Banner Settings
        </Button>
      </form>
    </Form>
  )
}


export default function AdminSettingsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'global') : null, [firestore]);
  const { data: siteSettings, isLoading: isLoadingSettings } = useDoc<SiteSettings>(settingsRef);
  
  const socialLinksQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'socialLinks'), orderBy('order')) : null,
    [firestore]
  );
  const { data: socialLinks, isLoading: isLoadingSocial, error: errorSocial } = useCollection<SocialLink>(socialLinksQuery);

  const socialForm = useForm<z.infer<typeof socialLinkFormSchema>>({
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
  
  async function onSocialSubmit(values: z.infer<typeof socialLinkFormSchema>) {
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
        socialForm.reset({ platform: undefined, url: '' });
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
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground">Manage global settings for your website.</p>
      </div>

      <Card>
         <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general site information and features.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSettings ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
            <GeneralSettingsForm settings={siteSettings} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banners & Notifications</CardTitle>
          <CardDescription>Configure sitewide banners and notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSettings ? (
            <div className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-48" />
            </div>
          ) : (
            <BannersForm settings={siteSettings} />
          )}
        </CardContent>
      </Card>


      <Card>
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
                  {isLoadingSocial ? (
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
             {errorSocial && <p className="text-sm text-destructive mt-2">Error loading social links: {errorSocial.message}</p>}
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Add New Link</h3>
            <Form {...socialForm}>
              <form onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
                 <FormField
                  control={socialForm.control}
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
                  control={socialForm.control}
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
    