import { AppPagination } from "@/components/AppPagination";
import { UserCard } from "../components/UserCard";
import { useUser, useUserPrompts } from "../hooks";
import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { useParams } from "react-router";
import { PromptsGridSkeleton } from "@/features/prompts/components/PromptsGridSkeleton";
import { UserCardSkeleton } from "../components/UserCardSkeleton";

type UserPageProps = {
  mode: "me" | "public";
};

export function UserPage({ mode }: UserPageProps) {
  const { userHandle } = useParams();
  const { user, isLoading: isUserLoading } = useUser({ mode, userHandle });
  const {
    prompts,
    isLoading: isPromptsLoading,
    page,
    pages,
    setPage,
  } = useUserPrompts({ mode, userHandle });

  return (
    <div className="w-full grid max-w-6xl gap-4">
      {isUserLoading && <UserCardSkeleton />}
      {user && <UserCard user={user} />}
      <section >
        <h2 className="mb-4 scroll-m-20 text-2xl font-bold tracking-tight">
          {user && mode === "me" && `My prompts`}
          {user && mode === "public" && `${user.username}'s public prompts`}
        </h2>
        {isPromptsLoading && <PromptsGridSkeleton />}
        {prompts && (
          <>
            <PromptsGrid prompts={prompts} editable={mode === "me"} />
            <AppPagination
              page={page!}
              totalPages={pages!}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
