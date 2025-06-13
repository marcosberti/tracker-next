import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

type GradientCardProps = {
  headerDescription?: string | React.ReactNode;
  headerTitle?: string | React.ReactNode;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

function GradientCard({
  headerDescription,
  headerTitle,
  badge,
  footer,
  className,
}: GradientCardProps) {
  return (
    <Card
      className={cn(
        "@container/card from-primary/5 dark:bg-card to-card bg-gradient-to-t shadow-xs",
        className
      )}
    >
      <CardHeader>
        {(headerDescription || badge) && (
          <CardDescription>
            <div className="flex justify-between">
              {headerDescription}
              {badge && <Badge variant="outline">{badge}</Badge>}
            </div>
          </CardDescription>
        )}
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {headerTitle}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {footer && (
          <div className="line-clamp-1 flex gap-2 font-medium">{footer}</div>
        )}
      </CardFooter>
    </Card>
  );
}

export { GradientCard as Card };
