import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome to the control center.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Manage game projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Here you can create, edit, and delete project entries.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Blog</CardTitle>
            <CardDescription>Manage blog posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Write new posts, update existing ones, and manage comments.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View user roles and manage permissions.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
