import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from '@/components/logo';

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle>Registration Disabled</CardTitle>
          <CardDescription>
            Public user registration is currently not available.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
