import { AppPagination } from "@/components/AppPagination";
import { UserCard } from "../components/UserCard";
import { useUser, useUserPrompts } from "../hooks";
import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { useNavigate, useParams } from "react-router";
import { PromptsGridSkeleton } from "@/features/prompts/components/PromptsGridSkeleton";
import { UserCardSkeleton } from "../components/UserCardSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrompts } from "@/features/prompts/hooks";
import { useRedirectOn } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { HeartCrack, PenLine, Sparkles } from "lucide-react";

type UserPageProps = {
  mode: "me" | "public";
};

export function UserPage({ mode }: UserPageProps) {
  const { userHandle } = useParams();
  const {
    user,
    isLoading: isUserLoading,
    error,
  } = useUser({ mode, userHandle });
  useRedirectOn({ when: error?.status === 404, to: "/404" });
  const navigate = useNavigate();
  const {
    prompts,
    isLoading: isPromptsLoading,
    page,
    pages,
    setPage,
  } = useUserPrompts({ mode, userHandle, limit: 9 });

  const {
    prompts: likedPrompts,
    page: likesPage,
    pages: likesPages,
    setPage: setLikesPages,
  } = usePrompts({ liked_by: user?.id, limit: 9 });

  return (
    <div className="w-full grid max-w-6xl gap-4">
      {isUserLoading && <UserCardSkeleton />}
      {user && <UserCard user={user} mode={mode} />}
      <section>
        {isPromptsLoading && <PromptsGridSkeleton />}
        {prompts && user && (
          <Tabs defaultValue="prompts" className="w-full">
            <TabsList variant="line">
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              {mode == "me" && <TabsTrigger value="likes">Likes</TabsTrigger>}
            </TabsList>
            <TabsContent value="prompts">
              {prompts.length === 0 && (
                <div className="py-16 text-center animate-fade-in">
                  <div className="mx-auto size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Sparkles className="size-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Share your first prompt!
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                    You haven't posted any prompts yet. Share your best prompts
                    with the community and help others get the most out of AI.
                  </p>
                  <Button
                    className="cursor-pointer gap-2"
                    onClick={() => navigate("/prompts/new")}
                  >
                    <PenLine className="size-4" />
                    Create my first prompt
                  </Button>
                </div>
              )}
              {prompts.length > 0 && (
                <>
                  <PromptsGrid prompts={prompts} editable={mode === "me"} itemsLimit={9} />
                  <AppPagination
                    page={page!}
                    totalPages={pages!}
                    onPageChange={setPage}
                  />
                </>
              )}
            </TabsContent>
            {mode == "me" && (
              <TabsContent value="likes">
                {likedPrompts.length === 0 && (
                  <div className="py-16 text-center animate-fade-in">
                    <div className="mx-auto size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <HeartCrack className="size-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      You haven't given any likes yet
                    </h3>
                  </div>
                )}
                {likedPrompts.length > 0 && (
                  <>
                    <PromptsGrid prompts={likedPrompts} />
                    <AppPagination
                      page={likesPage!}
                      totalPages={likesPages!}
                      onPageChange={setLikesPages}
                    />
                  </>
                )}
              </TabsContent>
            )}
          </Tabs>
        )}
      </section>
    </div>
  );
}
