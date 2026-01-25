import { Link, useNavigate } from "react-router";
import { UserMenu } from "./UserMenu";
import { Button } from "./ui/button";
import { Plus, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks";
import SearchForm from "@/features/explore/components/SearchForm";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const onSeacrh = (value: string) => {
    navigate(`/explore?search=${value}`);
  }
  const openSearch = () => {
    setIsSearchOpen(true);
  };
  const closeSearch = () => {
    setIsSearchOpen(false);
  };
  return (
    <header className="relative flex justify-center px-4 border-b mx-auto">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/">
          <span className="font-bold text-xl">ThePromptBook</span>
        </Link>

        {isSearchOpen && (
          <div className="absolute z-10 inset-0 flex items-center gap-2 bg-background px-4 md:hidden">
            <SearchForm onSearch={onSeacrh} />
            <Button variant="ghost" size="icon" onClick={closeSearch}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="hidden md:flex flex-1 items-center justify-center max-w-md">
          <SearchForm onSearch={onSeacrh} />
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
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
