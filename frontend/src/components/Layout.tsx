import { Outlet } from "react-router";
import { Header } from "./Header";
import { Container } from "@mui/material";

export function Layout() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}
