import AdminShell from './AdminShell';

// The admin desk renders behind a client-side auth check, so its segments cannot
// be validated for instant navigation. Opt the whole /admin tree out of that check.
export const instant = false;

export const metadata = {
  title: 'Aggarwal Steels – Admin Desk',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
