import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Settings, RefreshCw } from "lucide-react";

function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <Link to="/" className="text-xl font-bold">
          Memos
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/new">
              <Plus className="h-5 w-5" />
              <span className="sr-only">New Note</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">Sync</span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto max-w-2xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
