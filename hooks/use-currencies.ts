import { getCurrencies } from "@/app/_db/currencies";
import { useQuery } from "@tanstack/react-query";

export function useCurrencies(userId: string) {
  const { isFetching, data: currencies = [] } = useQuery({
    queryKey: ["currencies", userId],
    queryFn: () => getCurrencies(userId),
  });
  return { isFetching, currencies };
}
