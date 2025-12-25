'use client';

import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faNewspaper, faUsers, faCog, faTachometerAlt, faUserShield, faSignOutAlt, faBars, faTimes, faSpinner, faInbox } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/firebase';
import { cn } from '@/lib/utils';
import { Preloader } from '@/components/preloader';

const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: faTachometerAlt },
    { href: '/admin/projects', label: 'Projects', icon: faGamepad },
    { href: '/admin/blog', label: 'Blog', icon: faNewspaper },
    { href: '/admin/messages', label: 'Messages', icon: faInbox },
    { href: '/admin/users', label: 'Users', icon: faUsers },
    { href: '/admin/settings', label: 'Settings', icon: faCog },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isLoading = isUserLoading || isProfileLoading;

  useEffect(() => {
    if (isLoading) return; // Wait until user data is loaded

    // If no user is logged in, redirect to the admin login page
    if (!user) {
      router.push('/admin/login');
      return;
    }

    // If the user is logged in but is not an admin, redirect to the homepage
    if (userProfile && userProfile.role !== 'admin') {
      router.push('/');
    }
  }, [user, userProfile, isLoading, router]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  const userInitial = userProfile?.displayName?.charAt(0)?.toUpperCase() || '?';

  // While loading or if redirection is happening, show a loading state or nothing
  if (isLoading || !user || (userProfile && userProfile.role !== 'admin')) {
    return (
      <div className="h-screen w-full">
        <Preloader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            <Logo />
            <nav className="ml-10 hidden items-center space-x-6 text-sm font-medium md:flex">
                {navLinks.map(({ href, label }) => (
                    <Link
                    key={href}
                    href={href}
                    className={cn(
                        'transition-colors hover:text-primary',
                        pathname.startsWith(href) && href !== '/admin/dashboard' || pathname === href ? 'text-primary' : 'text-muted-foreground'
                    )}
                    >
                    {label}
                    </Link>
                ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
                {isLoading ? (
                <Skeleton className="h-8 w-8 rounded-full" />
                ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={userProfile?.displayName || ''} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile?.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/">
                        <FontAwesomeIcon icon={faUserShield} className="mr-2 h-4 w-4" />
                        <span>View Site</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                        <FontAwesomeIcon icon={faTachometerAlt} className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                ) : null}
            </div>
            <button
                className="ml-2 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                {isOpen ? <FontAwesomeIcon icon={faTimes} className="h-6 w-6" /> : <FontAwesomeIcon icon={faBars} className="h-6 w-6" />}
            </button>
        </div>
         {isOpen && (
            <div className="md:hidden">
            <div className="container flex flex-col items-start space-y-4 py-4">
                {navLinks.map(({ href, label }) => (
                <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                    'w-full rounded-md p-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === href && 'bg-accent text-accent-foreground'
                    )}
                >
                    {label}
                </Link>
                ))}
            </div>
            </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
