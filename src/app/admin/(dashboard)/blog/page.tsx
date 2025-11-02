'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

function DeletePostButton({ postId, onDeleted }: { postId: string; onDeleted: () => void }) {
  const firestore = useFirestore();

  const handleDelete = async () => {
    if (!firestore) return;
    const docRef = doc(firestore, 'blogPosts', postId);
    try {
      await deleteDoc(docRef);
      onDeleted();
    } catch (e) {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FontAwesomeIcon icon={faTrash} className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the blog post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function AdminBlogPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const postsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'blogPosts'), orderBy('publicationDate', 'desc')) : null),
    [firestore]
  );
  const { data: posts, isLoading, error } = useCollection<BlogPost>(postsQuery);

  const onPostDeleted = () => {
    toast({
      title: 'Post Deleted',
      description: 'The blog post has been successfully removed.',
    });
  };

  return (
    <div className="p-4 md:p-8">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage Blog</h1>
                <p className="text-muted-foreground">Write, update, and delete blog posts.</p>
            </div>
            <Button asChild>
                <Link href="/admin/blog/new">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create Post
                </Link>
            </Button>
        </div>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>All Posts ({isLoading ? '...' : posts?.length || 0})</CardTitle>
                <CardDescription>
                    The list of all blog posts on your platform.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Author</TableHead>
                                <TableHead className="hidden lg:table-cell">Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-destructive">
                                    Error loading posts: {error.message}
                                    </TableCell>
                                </TableRow>
                            ) : posts && posts.length > 0 ? (
                                posts.map(post => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{post.author}</TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                          {post.date}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/blog/edit/${post.id}`}>
                                                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeletePostButton postId={post.id} onDeleted={onPostDeleted} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No posts yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
