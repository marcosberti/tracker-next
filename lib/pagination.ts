export const ITEMS_PER_PAGE = 10;

export const getPagination = (totalItems: number, page: number) => {
  const totalPages = Math.floor(
    (totalItems + ITEMS_PER_PAGE - 1) / ITEMS_PER_PAGE
  );
  const start = page * ITEMS_PER_PAGE - (ITEMS_PER_PAGE - 1);
  const end = Math.min(start + ITEMS_PER_PAGE - 1, totalItems);

  return {
    totalPages,
    start,
    end,
  };
};
