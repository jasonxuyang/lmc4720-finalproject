import { Flag } from "@/types";
import { atom } from "recoil";

const flagsState = atom<Flag[]>({
  key: "flags",
  default: [],
});

export default flagsState;
