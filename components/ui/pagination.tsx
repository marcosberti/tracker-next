import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function SchPagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<typeof Button>;
// &
// React.ComponentProps<typeof Link>;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      variant={isActive ? "default" : "ghost"}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) {
  const items = [];
  if (currentPage - 1 > 1) {
    items.push(
      <PaginationItem key={`pagination-ellipsis-${currentPage - 1}`}>
        <PaginationEllipsis />
      </PaginationItem>
    );
  }

  if (currentPage > 1) {
    items.push(
      <PaginationItem key={`pagination-previous-${currentPage - 1}`}>
        <PaginationLink onClick={() => onPageChange(currentPage - 1)}>
          {currentPage - 1}
        </PaginationLink>
      </PaginationItem>
    );
  }
  items.push(
    <PaginationItem key={`pagination-current-${currentPage}`}>
      <PaginationLink isActive>{currentPage}</PaginationLink>
    </PaginationItem>
  );

  if (currentPage < totalPages) {
    items.push(
      <PaginationItem key={`pagination-next-${currentPage + 1}`}>
        <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
          {currentPage + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  if (currentPage + 1 < totalPages) {
    items.push(
      <PaginationItem key={`pagination-ellipsis-${currentPage + 1}`}>
        <PaginationEllipsis />
      </PaginationItem>
    );
  }
  return items;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const paginationItems = getPaginationItems(
    currentPage,
    totalPages,
    onPageChange
  );
  return (
    <div className="ml-auto">
      <SchPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>
          {paginationItems}
          <PaginationItem>
            <PaginationNext
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </SchPagination>
    </div>
  );
}

export {
  Pagination,
  SchPagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
