import { AppPagination } from "@/components/AppPagination";
import { UserCard } from "../components/UserCard";
import { useUser, useUserPrompts } from "../hooks";
import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { useParams } from "react-router";

type UserPageProps = {
  mode: "me" | "public";
};

export function UserPage({ mode }: UserPageProps) {
  const { userHandle } = useParams();
  const { user, isLoading, error } = useUser({ mode, userHandle });
  const { prompts, page, pages, setPage } = useUserPrompts({ mode, userHandle });

  if (error) {
    return (
      <div >
        <p>
          Error loading user: {error.message}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <p>User not found</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <UserCard user={user} />
      </div>
      <div className="mt-2">
        <h2>
          {mode === "me" ? "My Prompts" : `${user.username}'s prompts`}
        </h2>
        <div>
          {prompts ? (
            <>
              <PromptsGrid prompts={prompts} editable={mode === "me"} />
              <AppPagination page={page!} totalPages={pages!} onPageChange={setPage} />
            </>
          ) : (
            <p>Share your first prompt</p>
          )}
        </div>
      </div>
    </>
  );
}
