import { Day } from "@/types";
import { atom } from "recoil";

const dayState = atom<Day>({
  key: "day",
  default: Day.Monday,
});

export default dayState;
