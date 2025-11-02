import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
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
            <CardTitle className="text-2xl">Welcome Back!</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}