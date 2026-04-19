import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — CVtoWeb',
  description: 'Terms and conditions for using CVtoWeb.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
