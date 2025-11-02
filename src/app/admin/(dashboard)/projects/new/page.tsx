
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

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
    platform: z.enum(['github', 'playstore', 'appstore', 'website', 'steam', 'epicgames', 'itchio', 'gog', 'aptoide']),
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


export default function NewProjectPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      version: '1.0.0',
      type: 'game',
      os: ['web'],
      videoEmbedUrl: '',
      readme: '',
      gallery: [],
      links: [],
    },
  });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control: form.control,
    name: "gallery",
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control: form.control,
    name: "links",
  });
  
  const title = form.watch('title');

  useEffect(() => {
    if (title) {
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [title, form]);


  async function onSubmit(values: z.infer<typeof projectSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    const projectData = {
        ...values,
        createdAt: serverTimestamp(),
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
                            <FormControl><Input placeholder="My Awesome Game" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl><Input placeholder="my-awesome-game" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl><Textarea placeholder="A brief, catchy description of the project." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="version" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Version</FormLabel>
                                <FormControl><Input placeholder="1.0.0" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} /></FormControl>
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
                                        <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name={`gallery.${index}.hint`} render={({ field }) => (
                                     <FormItem className="flex-1">
                                        <FormLabel>Image Hint</FormLabel>
                                        <FormControl><Input placeholder="e.g., character art" {...field} /></FormControl>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Platform"/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="github">GitHub</SelectItem>
                                            <SelectItem value="playstore">Play Store</SelectItem>
                                            <SelectItem value="appstore">App Store</SelectItem>
                                            <SelectItem value="website">Website</SelectItem>
                                            <SelectItem value="steam">Steam</SelectItem>
                                            <SelectItem value="epicgames">Epic Games</SelectItem>
                                            <SelectItem value="itchio">Itch.io</SelectItem>
                                            <SelectItem value="gog">GOG</SelectItem>
                                            <SelectItem value="aptoide">Aptoide</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name={`links.${index}.url`} render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>URL</FormLabel>
                                    <FormControl><Input placeholder="https://github.com/user/repo" {...field} /></FormControl>
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
                            <FormControl><Textarea placeholder="Write your full project README here. Supports Markdown." {...field} rows={20} /></FormControl>
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
                    Create Project
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}

    