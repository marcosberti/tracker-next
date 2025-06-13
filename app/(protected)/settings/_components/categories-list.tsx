"use client";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconPencil } from "@tabler/icons-react";
import { Category } from "@prisma/client";
import { CategoryModal } from "./category-modal";
import { startTransition, useState } from "react";

type CategoriesListProps = {
  categories: Category[];
};

export function CategoriesList({ categories }: CategoriesListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  if (!categories.length) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-center">No categories</CardTitle>
          <CardDescription className="text-center">
            You haven't added any categories yet. Click the "Add category"
            button above to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="group col-span-1 md:col-span-1 lg:col-span-1"
        >
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span
                    // className="text-blue-300"
                    style={
                      {
                        color: category.color,
                      } as React.CSSProperties
                    }
                  >
                    <Icon name={category.icon} />
                  </span>
                  <span>{category.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setCategory(category);
                    setIsOpen(true);
                  }}
                >
                  <IconPencil className="size-6" />
                </Button>
              </div>
            </CardTitle>
            {/* <CardDescription>{category.code}</CardDescription>  */}
          </CardHeader>
        </Card>
      ))}
      {isOpen && (
        <CategoryModal
          isOpen={isOpen}
          category={category as Category}
          onClose={() => {
            startTransition(() => {
              setIsOpen(false);
              setCategory(null);
            });
          }}
        />
      )}
    </div>
  );
}
