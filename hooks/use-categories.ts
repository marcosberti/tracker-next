import { getCategories } from "@/app/_db/categories";
import { useQuery } from "@tanstack/react-query";

export function useCategories(userId: string) {
  const { isFetching, data: categories = [] } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategories(userId),
  });
  return { isFetching, categories };
}
