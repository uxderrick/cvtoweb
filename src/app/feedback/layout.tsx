import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback — CVtoWeb',
  description: 'Share feedback or suggestions to help improve CVtoWeb.',
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
