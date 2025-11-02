import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBlogPage() {
  return (
    <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Blog</h1>
        <p className="text-muted-foreground">Write, update, and delete blog posts.</p>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                    The interface for managing the blog will be built here.
                </CardDescription>
            </CardHeader>
        </Card>
    </div>
  );
}
