import { useState } from "react";
import { useFetcher } from "react-router";
import { NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { LessonSection } from "~/components/lesson-section";
import {
  describeNoteDraft,
  type NoteDraftStatus,
} from "~/modules/lesson-notes";
import { cn, formatRelativeTime } from "~/lib/utils";

export function LessonNote({
  note,
}: {
  note: { body: string; updatedAt: string } | null;
}) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [draft, setDraft] = useState(note?.body ?? "");
  const draftState = describeNoteDraft({
    draft,
    savedBody: note?.body ?? null,
    saving: fetcher.state !== "idle",
    error: fetcher.data?.error,
  });

  return (
    <LessonSection
      icon={NotebookPen}
      title="Your notes"
      description="Private to you. Jot things down while you watch."
    >
      <fetcher.Form method="post" className="space-y-2">
        <input type="hidden" name="intent" value="save-note" />
        <Textarea
          name="body"
          rows={4}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What do you want to remember from this lesson?"
          aria-label="Your notes"
          className="resize-y"
        />
        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={!draftState.canSave}>
            {draftState.status.kind === "saving" ? "Saving..." : "Save note"}
          </Button>
          <NoteStatus status={draftState.status} updatedAt={note?.updatedAt} />
          <span
            className={cn(
              "ml-auto text-xs",
              draftState.overLimit
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {draftState.length} / {draftState.max}
          </span>
        </div>
      </fetcher.Form>
    </LessonSection>
  );
}

function NoteStatus({
  status,
  updatedAt,
}: {
  status: NoteDraftStatus;
  updatedAt: string | undefined;
}) {
  switch (status.kind) {
    case "error":
      return <span className="text-xs text-destructive">{status.message}</span>;
    case "over-limit":
      return (
        <span className="text-xs text-destructive">
          Too long to save. Trim it down first.
        </span>
      );
    case "unsaved":
      return (
        <span className="text-xs text-muted-foreground">Unsaved changes</span>
      );
    case "saved":
      return updatedAt ? (
        <span
          suppressHydrationWarning
          className="text-xs text-muted-foreground"
        >
          Saved {formatRelativeTime(updatedAt)}
        </span>
      ) : null;
    case "saving":
    case "empty":
      return null;
  }
}
