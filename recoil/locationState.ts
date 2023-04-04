import { Location } from "@/types";
import { atom } from "recoil";

const locationState = atom<Location | undefined>({
  key: "location",
  default: undefined,
});

export default locationState;
