import { PromptsService } from "@/services";
import { useInfiniteQuery } from "@tanstack/react-query";

type CommentsHookProps = {
  promptId: string;
};

export function useInfiniteComments({ promptId }: CommentsHookProps) {
  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["prompt", promptId, "comments"],
    queryFn: ({ pageParam }) => 
      PromptsService.getPromptComments(promptId, pageParam)
    ,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const comments = data?.pages.flatMap((page) => page.items)

  return {
    comments,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    status,
  };
}
