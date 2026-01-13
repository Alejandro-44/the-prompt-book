import { Link } from "react-router";
import { UserMenu } from "./UserMenu";

export const Header = () => {
  return (
    <header className="flex justify-between items-center max-w-6xl mx-auto px-4 h-12">
      <Link to="/">
        <span className="font-bold text-xl">ThePromptBook</span>
      </Link>
      <nav></nav>
      <UserMenu />
    </header>
  );
};
