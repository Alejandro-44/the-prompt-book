import { Outlet } from "react-router";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-dvh">
      <Header />
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-border">
        <div className="mx-auto max-w-7xl p-4 flex items-center justify-center text-sm text-froregorund">
          <span>
            Built with ❤️ by{" "}
            <a
              href="https://github.com/alejandro-44"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              Alejandro Argüello
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
