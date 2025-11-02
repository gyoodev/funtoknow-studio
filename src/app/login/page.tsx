import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center">
      <Card className="max-w-md text-center">
        <CardHeader>
           <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle>Page Disabled</CardTitle>
          <CardDescription>
            This login page is currently disabled. Please use the designated admin login if you are an administrator.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
