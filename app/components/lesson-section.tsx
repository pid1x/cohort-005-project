import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "~/components/ui/card";

/**
 * The card a lesson page section sits in, so the notes and the discussion
 * read as parts of one page rather than two designs.
 */
export function LessonSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="mb-8 gap-0 py-0">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
