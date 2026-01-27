import { Outlet } from "react-router";
import { Header } from "./Header";

export function Layout() {
  return (
    <>
      <Header />
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}
