import { Logo } from "@/components/icons/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-secondary/50">
        <div className="flex items-center gap-3 mb-8">
            <Logo className="w-10 h-10 text-primary"/>
            <h1 className="text-4xl font-bold text-foreground font-headline">EcoHabits</h1>
        </div>
        {children}
    </div>
  )
}
