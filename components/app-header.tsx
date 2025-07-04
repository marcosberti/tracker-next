"use client";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./theme-toggle";

export function AppHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <ModeToggle />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {children}
      </div>
    </header>
  );
}
