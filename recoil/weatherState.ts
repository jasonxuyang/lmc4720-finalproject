import { Weather } from "@/types";
import { atom } from "recoil";

const weatherState = atom<Weather>({
  key: "weather",
  default: Weather.Sunny,
});

export default weatherState;
