import { describe, it, expect } from "vitest";
import { describeNoteDraft } from "../index";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

const base = { savedBody: null, saving: false, error: undefined };

describe("describeNoteDraft", () => {
  it("counts characters against the note limit", () => {
    const state = describeNoteDraft({ ...base, draft: "hello" });
    expect(state.length).toBe(5);
    expect(state.max).toBe(MAX_NOTE_LENGTH);
    expect(state.overLimit).toBe(false);
  });

  it("is empty and unsaveable before anything is written", () => {
    const state = describeNoteDraft({ ...base, draft: "" });
    expect(state.canSave).toBe(false);
    expect(state.status).toEqual({ kind: "empty" });
  });

  it("does not allow saving a blank draft", () => {
    const state = describeNoteDraft({ ...base, draft: "   \n " });
    expect(state.canSave).toBe(false);
  });

  it("allows saving a new draft and marks it unsaved", () => {
    const state = describeNoteDraft({ ...base, draft: "a thought" });
    expect(state.canSave).toBe(true);
    expect(state.status).toEqual({ kind: "unsaved" });
  });

  it("is saved, and not saveable again, when the draft matches the note", () => {
    const state = describeNoteDraft({
      ...base,
      savedBody: "a thought",
      draft: "a thought",
    });
    expect(state.canSave).toBe(false);
    expect(state.status).toEqual({ kind: "saved" });
  });

  it("marks an edit to a saved note as unsaved", () => {
    const state = describeNoteDraft({
      ...base,
      savedBody: "a thought",
      draft: "a better thought",
    });
    expect(state.canSave).toBe(true);
    expect(state.status).toEqual({ kind: "unsaved" });
  });

  it("allows exactly the limit but not one character over", () => {
    const atLimit = describeNoteDraft({
      ...base,
      draft: "x".repeat(MAX_NOTE_LENGTH),
    });
    expect(atLimit.overLimit).toBe(false);
    expect(atLimit.canSave).toBe(true);

    const over = describeNoteDraft({
      ...base,
      draft: "x".repeat(MAX_NOTE_LENGTH + 1),
    });
    expect(over.overLimit).toBe(true);
    expect(over.canSave).toBe(false);
    expect(over.status).toEqual({ kind: "over-limit" });
  });

  it("shows saving, and blocks a second submit, while a save is in flight", () => {
    const state = describeNoteDraft({ ...base, draft: "a", saving: true });
    expect(state.canSave).toBe(false);
    expect(state.status).toEqual({ kind: "saving" });
  });

  it("shows the server's error for a draft that did not save", () => {
    const state = describeNoteDraft({
      ...base,
      savedBody: "old",
      draft: "new",
      error: "Too long",
    });
    expect(state.status).toEqual({ kind: "error", message: "Too long" });
    expect(state.canSave).toBe(true);
  });

  it("drops a stale error once the draft matches the saved note", () => {
    const state = describeNoteDraft({
      ...base,
      savedBody: "old",
      draft: "old",
      error: "Too long",
    });
    expect(state.status).toEqual({ kind: "saved" });
  });

  it("compares and counts the draft trimmed, as the server stores it", () => {
    const state = describeNoteDraft({
      ...base,
      savedBody: "a thought",
      draft: "  a thought\n",
    });
    expect(state.length).toBe(9);
    expect(state.canSave).toBe(false);
    expect(state.status).toEqual({ kind: "saved" });

    const padded = describeNoteDraft({
      ...base,
      draft: ` ${"x".repeat(MAX_NOTE_LENGTH)} `,
    });
    expect(padded.overLimit).toBe(false);
  });

  it("does not allow saving a cleared note, which the server would reject", () => {
    const state = describeNoteDraft({ ...base, savedBody: "old", draft: "  " });
    expect(state.canSave).toBe(false);
    expect(state.status).toEqual({ kind: "unsaved" });
  });
});
