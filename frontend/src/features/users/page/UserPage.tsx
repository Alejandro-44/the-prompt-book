import { AppPagination } from "@/components/AppPagination";
import { UserCard } from "../components/UserCard";
import { useUser, useUserPrompts } from "../hooks";
import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { useParams } from "react-router";
import { PromptsGridSkeleton } from "@/features/prompts/components/PromptsGridSkeleton";
import { UserCardSkeleton } from "../components/UserCardSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrompts } from "@/features/prompts/hooks";

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

  const {
    prompts: likedPrompts,
    page: likesPage,
    pages: likesPages,
    setPage: setLikesPages
  } = usePrompts({ liked_by: user?.id });

  return (
    <div className="w-full grid max-w-6xl gap-4">
      {isUserLoading && <UserCardSkeleton />}
      {user && <UserCard user={user} mode={mode} />}
      <section>
        {isPromptsLoading && <PromptsGridSkeleton />}
        {prompts && (
          <Tabs defaultValue="prompts" className="w-full">
            <TabsList variant="line">
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              {mode == "me" && <TabsTrigger value="likes">Likes</TabsTrigger>}
            </TabsList>
            <TabsContent value="prompts">
              <PromptsGrid prompts={prompts} editable={mode === "me"} />
              <AppPagination
                page={page!}
                totalPages={pages!}
                onPageChange={setPage}
              />
            </TabsContent>
            {mode == "me" && <TabsContent value="likes">
              <PromptsGrid prompts={likedPrompts} />
              <AppPagination
                page={likesPage!}
                totalPages={likesPages!}
                onPageChange={setLikesPages}
              />
            </TabsContent>}
          </Tabs>
        )}
      </section>
    </div>
  );
}
