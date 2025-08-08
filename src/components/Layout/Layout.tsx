import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}