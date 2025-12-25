'use client';

import { useMemo, useState } from 'react';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { ContactMessage } from '@/lib/types';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEnvelope, faEye } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';


function ViewMessageDialog({ message }: { message: ContactMessage }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Message from {message.name}</DialogTitle>
          <DialogDescription>
            <a href={`mailto:${message.email}`} className="text-primary hover:underline">{message.email}</a>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{message.sentDate ? format(new Date(message.sentDate.seconds * 1000), 'PPP p') : 'N/A'}</span>
          </DialogDescription>
        </DialogHeader>
         <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Topic:</span>
            <Badge variant="secondary" className="capitalize">{message.topic}</Badge>
        </div>
        <div className="py-4 whitespace-pre-wrap text-sm">{message.message}</div>
        <Separator />
        
        <DialogFooter>
          <a href={`mailto:${message.email}`}>
            <Button>
              Reply via Email Client
            </Button>
          </a>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteMessageButton({ messageId, onDeleted }: { messageId: string; onDeleted: () => void }) {
  const firestore = useFirestore();

  const handleDelete = async () => {
    if (!firestore) return;
    const docRef = doc(firestore, 'messages', messageId);
    deleteDoc(docRef)
      .then(() => {
        onDeleted();
      })
      .catch((e) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
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
            This action cannot be undone. This will permanently delete this message.
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

export default function AdminMessagesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const messagesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'messages'), orderBy('sentDate', 'desc')) : null),
    [firestore]
  );
  const { data: messages, isLoading, error } = useCollection<ContactMessage>(messagesQuery);

  const onMessageDeleted = () => {
    toast({
      title: 'Message Deleted',
      description: 'The contact message has been successfully removed.',
    });
  };

  const getTopicVariant = (topic: ContactMessage['topic']) => {
    switch (topic) {
      case 'project':
        return 'default';
      case 'bug':
        return 'destructive';
      case 'general':
      default:
        return 'secondary';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground">View and manage messages submitted via the contact form.</p>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Messages ({isLoading ? '...' : messages?.length || 0})</CardTitle>
          <CardDescription>
            The list of all contact submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Topic</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="hidden lg:table-cell">Date Sent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-destructive">
                      Error loading messages: {error.message}
                    </TableCell>
                  </TableRow>
                ) : messages && messages.length > 0 ? (
                  messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.name}</TableCell>
                       <TableCell className="hidden md:table-cell">
                        <Badge variant={getTopicVariant(message.topic)} className="capitalize">{message.topic}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{message.message}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {message.sentDate ? format(new Date(message.sentDate.seconds * 1000), 'PPp') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <ViewMessageDialog message={message} />
                        <DeleteMessageButton messageId={message.id} onDeleted={onMessageDeleted} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <FontAwesomeIcon icon={faEnvelope} className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p>No messages yet.</p>
                    </TableCell>
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
