import { Link, useNavigate } from "react-router";
import { UserMenu } from "./UserMenu";
import { Button } from "./ui/button";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import SearchForm from "@/features/explore/components/SearchForm";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const onSeacrh = (value: string) => {
    navigate(`/explore?search=${value}`);
  };
  const openSearch = () => {
    setIsSearchOpen(true);
  };
  const closeSearch = () => {
    setIsSearchOpen(false);
  };
  return (
    <header className="sticky top-0 left-0 flex justify-center w-full px-4 border-b mx-auto bg-background z-20">
      <div className="container grid grid-cols-2 md:grid-cols-[1fr_1.5fr_1fr] items-center h-16">
        <Link className= "flex justify-start align-baseline gap-x-2" to="/">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <span className="font-bold text-xl hidden md:inline">ThePromptBook</span>
        </Link>

        {isSearchOpen && (
          <div className="absolute z-10 inset-0 flex items-center gap-2 bg-background px-4 md:hidden">
            <SearchForm onSearch={onSeacrh} />
            <Button variant="ghost" size="icon" onClick={closeSearch}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="hidden md:flex items-center justify-center w-full">
          <SearchForm onSearch={onSeacrh} />
        </div>

        <menu className="justify-self-end flex items-center gap-2">
          <Button
            className="md:hidden cursor-pointer"
            variant="ghost"
            onClick={openSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => navigate("/prompts/new")}
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
          >
            <Plus className="size-4" />
            <span className="hidden lg:inline">Share</span>
          </Button>
          <ThemeToggle />
          <UserMenu />
        </menu>
      </div>
    </header>
  );
};
