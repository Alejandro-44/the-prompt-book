import { Link, useNavigate } from "react-router";
import { UserMenu } from "./UserMenu";
import { Button } from "./ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "./ui/input";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="flex justify-cente px-4 border-b">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/">
          <span className="font-bold text-xl">ThePromptBook</span>
        </Link>

        <div className=" hidden md:flex flex-1 items-center justify-center max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar prompts..."
              className="w-full pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => navigate("/prompts/new")}
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
