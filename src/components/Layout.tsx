import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>ArtTrace AI</span>
              <span>•</span>
              <span>Creator Protection Suite</span>
            </div>
          </header>
          <main className="flex flex-1 flex-col">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}