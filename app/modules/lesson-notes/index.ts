import { describeDraft, type NoteDraftInput } from "./lib/draft";

export type { NoteDraftState, NoteDraftStatus } from "./lib/draft";

/**
 * What the lesson note editor shows for a draft: the character count against
 * the limit, whether Save is allowed, and which status line to show. Like the
 * server, it measures and compares the trimmed draft. Save is allowed only for
 * a non-blank draft within the limit that differs from the saved note.
 */
export function describeNoteDraft(input: NoteDraftInput) {
  return describeDraft(input);
}
