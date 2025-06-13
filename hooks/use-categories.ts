import { getCategories } from "@/app/_db/categories";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const { isFetching, data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  return { isFetching, categories };
}
