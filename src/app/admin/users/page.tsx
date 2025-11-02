'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('displayName'));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        } as UserProfile));
        setUsers(usersData);
      } catch (e) {
        console.error("Error fetching users: ", e);
        setError("Failed to load users. Please check the console for more details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
      <p className="text-muted-foreground">View users and manage their roles.</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Users ({loading ? '...' : users.length})</CardTitle>
          <CardDescription>A list of all registered users in the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-center py-4 text-destructive">{error}</p>}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead>User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  users.map(user => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">{user.displayName}</TableCell>
                      <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{user.uid}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {!loading && users.length === 0 && !error && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-semibold">No users found.</p>
              <p className="text-sm">When users register, they will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
