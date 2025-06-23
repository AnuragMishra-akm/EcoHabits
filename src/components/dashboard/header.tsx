"use client";

import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user } = useUser();
  return (
    <div className="flex items-center gap-4">
       <Avatar className="w-10 h-10 border">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back, Eco-Warrior {user.name}!</p>
      </div>
    </div>
  );
}
