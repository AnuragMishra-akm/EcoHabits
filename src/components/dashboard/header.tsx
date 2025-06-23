import { Logo } from "@/components/icons/logo";

export function Header() {
  return (
    <header className="flex items-center p-4 border-b bg-card">
      <div className="flex items-center gap-2">
        <Logo className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          EcoHabits
        </h1>
      </div>
    </header>
  );
}
