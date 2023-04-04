import { JournalEntry } from "@/types";
import { atom } from "recoil";

const journalState = atom<JournalEntry[]>({
  key: "journal",
  default: [],
});

export default journalState;
