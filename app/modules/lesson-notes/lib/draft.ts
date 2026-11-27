import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraftInput = {
  draft: string;
  savedBody: string | null;
  saving: boolean;
  error: string | undefined;
};

export type NoteDraftStatus =
  | { kind: "error"; message: string }
  | { kind: "saving" }
  | { kind: "over-limit" }
  | { kind: "unsaved" }
  | { kind: "saved" }
  | { kind: "empty" };

export type NoteDraftState = {
  length: number;
  max: number;
  overLimit: boolean;
  canSave: boolean;
  status: NoteDraftStatus;
};

export function describeDraft(input: NoteDraftInput): NoteDraftState {
  const { draft, savedBody, saving, error } = input;
  // The server trims before it checks the limit and stores the note, so the
  // draft is measured and compared the same way.
  const trimmed = draft.trim();
  const length = trimmed.length;
  const overLimit = length > MAX_NOTE_LENGTH;
  const blank = length === 0;
  const changed = trimmed !== (savedBody ?? "");

  return {
    length,
    max: MAX_NOTE_LENGTH,
    overLimit,
    canSave: changed && !blank && !overLimit && !saving,
    status: statusOf({ saving, error, overLimit, changed, savedBody }),
  };
}

function statusOf({
  saving,
  error,
  overLimit,
  changed,
  savedBody,
}: {
  saving: boolean;
  error: string | undefined;
  overLimit: boolean;
  changed: boolean;
  savedBody: string | null;
}): NoteDraftStatus {
  if (saving) return { kind: "saving" };
  // A server error describes the last submit; once the draft moves on it may no longer apply.
  if (error && changed) return { kind: "error", message: error };
  if (overLimit) return { kind: "over-limit" };
  if (changed) return { kind: "unsaved" };
  return savedBody === null ? { kind: "empty" } : { kind: "saved" };
}
