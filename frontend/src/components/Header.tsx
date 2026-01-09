import { useAuth, useLogout } from "@/features/auth/hooks/useAuth";
import { useUserStore } from "@/features/users/contexts";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router";

export const Header = () => {
  const navigate = useNavigate();
  const { mutate: logoutUser } = useLogout();
  const { user } = useAuth()
  return (
    <AppBar position="relative">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" component="h2">
            <Link to="/">ThePromptBook</Link>
          </Typography>
        </Box>
        {user ? (
          <Box>
            <Typography
              variant="body1"
              component="span"
              sx={{ marginRight: 2 }}
            >
              Hello, {user.handle}
            </Typography>
            <Button
              onClick={() => {
                logoutUser();
                useUserStore.getState().clearUser();
                navigate("/");
              }}
              color="inherit"
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              startIcon={<LogIn />}
              onClick={() => navigate("/login")}
              color="inherit"
            >
              SignIn
            </Button>
            <Button onClick={() => navigate("/register")} color="inherit">
              SignUp
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
