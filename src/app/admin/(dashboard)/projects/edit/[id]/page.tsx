
'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faSpinner, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and contain only letters, numbers, and hyphens.'),
  description: z.string().min(1, 'Description is required.'),
  version: z.string().min(1, 'Version is required (e.g., 1.0.0).'),
  type: z.enum(['game', 'app', 'library']),
  os: z.array(z.string()).min(1, 'At least one operating system must be selected.'),
  videoEmbedUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  readme: z.string().optional(),
  gallery: z.array(z.object({
    url: z.string().url('Must be a valid URL.'),
    hint: z.string().min(1, 'Hint is required.'),
  })).optional(),
  links: z.array(z.object({
    platform: z.enum(['github', 'playstore', 'appstore', 'website', 'steam', 'epicgames', 'itchio', 'gog']),
    url: z.string().url('Must be a valid URL.'),
  })).optional(),
});

const osOptions = [
  { id: 'windows', label: 'Windows' },
  { id: 'mac', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
  { id: 'android', label: 'Android' },
  { id: 'ios', label: 'iOS' },
  { id: 'web', label: 'Web' },
] as const;


export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
        title: '',
        slug: '',
        description: '',
        version: '',
        type: 'game',
        os: [],
        videoEmbedUrl: '',
        readme: '',
        gallery: [],
        links: [],
    }
  });

  useEffect(() => {
    if (!firestore || !projectId) return;
    setIsLoading(true);
    const docRef = doc(firestore, 'projects', projectId);
    getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Project;
        form.reset(data);
      } else {
        toast({ title: 'Error', description: 'Project not found.', variant: 'destructive' });
        router.push('/admin/projects');
      }
    }).catch(error => {
      console.error("Error fetching project:", error);
      toast({ title: 'Error', description: 'Failed to load project data.', variant: 'destructive' });
    }).finally(() => {
      setIsLoading(false);
    });
  }, [firestore, projectId, form, router, toast]);

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control: form.control,
    name: "gallery",
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control: form.control,
    name: "links",
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    const docRef = doc(firestore, 'projects', projectId);
    updateDoc(docRef, values)
      .then(() => {
        toast({ title: 'Project Updated', description: 'The project has been saved successfully.' });
        router.push('/admin/projects');
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          title: 'Error',
          description: 'Could not update project. Check permissions.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }
  
    if (isLoading) {
        return (
            <div className="p-4 md:p-8 space-y-8">
                <Skeleton className="h-12 w-1/2" />
                <div className="space-y-6">
                    <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-48 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent></Card>
                </div>
            </div>
        );
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
            <p className="text-muted-foreground">Update the details for this project.</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Core Details</CardTitle>
                    <CardDescription>Basic information about the project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="version" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Version</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                 <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="game">Game</SelectItem>
                                        <SelectItem value="app">App</SelectItem>
                                        <SelectItem value="library">Library</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <FormField
                        control={form.control}
                        name="os"
                        render={() => (
                            <FormItem>
                                <FormLabel>Operating Systems</FormLabel>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {osOptions.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="os"
                                        render={({ field }) => {
                                        return (
                                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...field.value, item.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== item.id
                                                        )
                                                    )
                                                }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                            </FormItem>
                                        )
                                        }}
                                    />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Add a video and gallery images.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="videoEmbedUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Video URL</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    <div>
                        <FormLabel>Image Gallery</FormLabel>
                        <div className="space-y-4 mt-2">
                        {galleryFields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md">
                                <FormField control={form.control} name={`gallery.${index}.url`} render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name={`gallery.${index}.hint`} render={({ field }) => (
                                     <FormItem className="flex-1">
                                        <FormLabel>Image Hint</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeGallery(index)}>
                                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => appendGallery({ url: '', hint: '' })}>
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Image
                        </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Project Links</CardTitle>
                    <CardDescription>Add relevant links like GitHub, Play Store, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {linkFields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md">
                             <FormField control={form.control} name={`links.${index}.platform`} render={({ field }) => (
                                <FormItem className="w-48">
                                    <FormLabel>Platform</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="github">GitHub</SelectItem>
                                            <SelectItem value="playstore">Play Store</SelectItem>
                                            <SelectItem value="appstore">App Store</SelectItem>
                                            <SelectItem value="website">Website</SelectItem>
                                            <SelectItem value="steam">Steam</SelectItem>
                                            <SelectItem value="epicgames">Epic Games</SelectItem>
                                            <SelectItem value="itchio">Itch.io</SelectItem>
                                            <SelectItem value="gog">GOG</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name={`links.${index}.url`} render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>URL</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeLink(index)}>
                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendLink({ platform: 'github', url: '' })}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Link
                    </Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>README</CardTitle>
                    <CardDescription>Full project details in Markdown format.</CardDescription>
                </CardHeader>
                <CardContent>
                     <FormField control={form.control} name="readme" render={({ field }) => (
                        <FormItem>
                            <FormControl><Textarea {...field} rows={20} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href="/admin/projects">Cancel</Link>
                </Button>
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

    