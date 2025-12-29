import { Outlet } from "react-router";
import { Header } from "./Header";
import { Container } from "@mui/material";

export function Layout() {
  return (
    <>
      <Header />
      <Container component="main" sx={{ my: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
