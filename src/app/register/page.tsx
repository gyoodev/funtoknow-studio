import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'auth-background');

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover"
          data-ai-hint={bgImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="m-4">
          <CardHeader className="items-center text-center">
            <Link href="/" aria-label="Home">
              <Logo />
            </Link>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>Join our community to showcase your projects and connect with creators.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}