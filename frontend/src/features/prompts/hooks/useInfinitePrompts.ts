import { PromptsService } from "@/services";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfinitePrompts() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    status,
  } = useInfiniteQuery({
    queryKey: ["infinite-prompts"],
    queryFn: ({ pageParam }) => {
      return PromptsService.getAllPrompts({ page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    }
  });

  const prompts = data?.pages.flatMap((page) => page.items)

  return {
    prompts,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    status,
    error
  }
}
