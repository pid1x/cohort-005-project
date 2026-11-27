import { describeDraft, type NoteDraftInput } from "./lib/draft";

export type { NoteDraftState, NoteDraftStatus } from "./lib/draft";

export function describeNoteDraft(input: NoteDraftInput) {
  return describeDraft(input);
}
