import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function AdminDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome to the control center for the FunToKnow Platform.</p>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
            <FontAwesomeIcon icon={faInfoCircle} className="h-8 w-8 text-primary" />
            <div>
                <CardTitle>Welcome to the FunToKnow Admin Panel</CardTitle>
                <CardDescription>
                    This panel was developed by GKDEV to provide a centralized interface for managing your application.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <p className="mb-4">From here, you can manage all the core aspects of your site. The sections below provide quick access to the main functions:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Projects:</strong> Add, edit, or remove the game projects displayed on your site.</li>
                <li><strong>Blog:</strong> Create and manage all of your developer blog posts.</li>
                <li><strong>Users:</strong> View registered users and manage their roles and permissions.</li>
                <li><strong>Settings:</strong> Configure global site settings, social media links, and banners.</li>
            </ul>
        </CardContent>
      </Card>

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
