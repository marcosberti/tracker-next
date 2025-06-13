import { getCurrencies } from "@/app/_db/currencies";
import { useQuery } from "@tanstack/react-query";

export function useCurrencies() {
  const { isFetching, data: currencies = [] } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => getCurrencies(),
  });
  return { isFetching, currencies };
}
