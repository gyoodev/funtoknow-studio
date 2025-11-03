
import { getSiteSettings } from '@/firebase/server-init';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { RegisterForm } from "@/components/auth/register-form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default async function RegisterPage() {
  const settings = await getSiteSettings();

  if (!settings?.registerActive) {
     return (
        <Card className="m-4">
            <CardHeader className="items-center text-center">
                <Logo />
                <CardTitle className="text-2xl">Registration Disabled</CardTitle>
                <CardDescription>New user registration is currently turned off by the administrator.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Alert variant="destructive">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <AlertTitle>Feature Unavailable</AlertTitle>
                    <AlertDescription>
                        We apologize for the inconvenience. Please check back later.
                    </AlertDescription>
                </Alert>
                <div className="mt-4 text-center text-sm">
                    <Link href="/login" className="underline">
                        Already have an account? Sign In
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
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Enter your details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
         <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
