
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Project } from '@/lib/types';

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
import { format } from 'date-fns';

function DeleteProjectButton({ projectId, onDeleted }: { projectId: string; onDeleted: () => void }) {
  const firestore = useFirestore();

  const handleDelete = async () => {
    if (!firestore) return;
    const docRef = doc(firestore, 'projects', projectId);
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
            This action cannot be undone. This will permanently delete the project.
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


export default function AdminProjectsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'projects'), orderBy('createdAt', 'desc')) : null),
    [firestore]
  );
  const { data: projects, isLoading, error } = useCollection<Project>(projectsQuery);

  const onProjectDeleted = () => {
    toast({
      title: 'Project Deleted',
      description: 'The project has been successfully removed.',
    });
  };

  const getFormattedDate = (date: any) => {
    if (!date) return 'N/A';
    try {
        // Firestore Timestamps can be either objects with toDate() on the server/client, 
        // or a string if it has been serialized from a server component.
        const dateObject = date.toDate ? date.toDate() : new Date(date);
        return format(dateObject, 'PP');
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Invalid Date';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Projects</h1>
            <p className="text-muted-foreground">Create, update, and delete game projects.</p>
        </div>
        <Button asChild>
            <Link href="/admin/projects/new">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create Project
            </Link>
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Projects ({isLoading ? '...' : projects?.length || 0})</CardTitle>
          <CardDescription>The list of all projects on your platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead className="hidden lg:table-cell">Version</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-destructive">
                      Error loading projects: {error.message}
                    </TableCell>
                  </TableRow>
                ) : projects && projects.length > 0 ? (
                  projects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-mono">{project.slug}</TableCell>
                       <TableCell className="hidden lg:table-cell">
                        <Badge variant="secondary">{project.version}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {getFormattedDate(project.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/projects/edit/${project.id}`}>
                            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteProjectButton projectId={project.id} onDeleted={onProjectDeleted} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No projects yet.</TableCell>
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
