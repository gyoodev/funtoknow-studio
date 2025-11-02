import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBlogPage() {
  return (
    <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Blog Posts</h1>
        <p className="text-muted-foreground">Create, update, and delete blog articles.</p>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                    The interface for managing blog posts will be built here.
                </CardDescription>
            </CardHeader>
        </Card>
    </div>
  );
}
