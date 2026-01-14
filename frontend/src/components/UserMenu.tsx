import { useNavigate } from "react-router";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

export function UserMenu() {
  const { user } = useAuth();
  const { mutate: logoutUser } = useLogout();
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/users/me");
  };

  const handleLogout = () => {
    logoutUser();
  };

  if (!user) {
    return (
      <div className="flex gap-1">
        <Button onClick={handleSignIn} className="bg-inherit cursor-pointer">
          Sign In
        </Button>
        <Button onClick={handleSignUp} className="bg-inherit border-2 cursor-pointer">
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <Menubar className="p-0 m-0 size-fit rounded-full shadow-none border-0">
      <MenubarMenu>
        <MenubarTrigger className="p-0">
          <Avatar className="flex justify-center items-center">
            <AvatarFallback>
              {user?.handle.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={handleProfile}>Profile</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
