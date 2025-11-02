// This file is no longer needed as the dashboard has been moved.
// To prevent issues, it's best to have a minimal component here or handle redirection if needed.
import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // Redirect to the main admin dashboard page inside the group.
  redirect('/admin/dashboard');
}
