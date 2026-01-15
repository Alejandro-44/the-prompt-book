import { Outlet } from "react-router";
import { Header } from "./Header";

export function Layout() {
  return (
    <>
      <Header />
      <main className="flex justify-center px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}
