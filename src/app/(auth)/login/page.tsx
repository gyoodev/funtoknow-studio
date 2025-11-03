
import { redirect } from 'next/navigation';
import { getSiteSettings } from '@/firebase/server-init';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/auth/login-form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default async function LoginPage() {
  const settings = await getSiteSettings();

  if (!settings?.loginActive) {
    return (
        <Card className="m-4">
            <CardHeader className="items-center text-center">
                <Logo />
                <CardTitle className="text-2xl">Login Disabled</CardTitle>
                <CardDescription>User login is currently turned off by the administrator.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <AlertTitle>Feature Unavailable</AlertTitle>
                    <AlertDescription>
                        We apologize for the inconvenience. Please try again later.
                    </AlertDescription>
                </Alert>
                <div className="mt-4 text-center text-sm">
                    <Link href="/" className="underline">
                        Return to Homepage
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="m-4">
      <CardHeader className="items-center text-center">
        <Logo />
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
