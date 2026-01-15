import { Link, useNavigate } from "react-router";
import { UserMenu } from "./UserMenu";
import { Button } from "./ui/button";
import { Plus, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks";

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openSearch = () => {
    setIsSearchOpen(true);
  };
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };
  return (
    <header className="relative flex justify-center px-4 border-b mx-auto">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/">
          <span className="font-bold text-xl">ThePromptBook</span>
        </Link>

        {isSearchOpen && (
          <div className="absolute z-10 inset-0 flex items-center gap-2 bg-background px-4 md:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar prompts..."
                className="w-full pl-10"
                value={searchQuery}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={closeSearch}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="hidden md:flex flex-1 items-center justify-center max-w-md">
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
            className="md:hidden cursor-pointer"
            variant="ghost"
            onClick={openSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          {isAuthenticated && (
            <Button
              onClick={() => navigate("/prompts/new")}
              variant="outline"
              size="sm"
              className="gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
