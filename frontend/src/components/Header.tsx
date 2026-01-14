import { Link } from "react-router";
import { UserMenu } from "./UserMenu";

export const Header = () => {
  return (
    <header className="flex justify-center text-white bg-black">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/">
          <span className="font-bold text-xl">ThePromptBook</span>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
};
