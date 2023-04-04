import { Person, PersonState } from "@/types";
import { atom } from "recoil";

type PeopleState = {
  [person in Person]: PersonState;
};

const peopleState = atom<PeopleState>({
  key: "people",
  default: {
    [Person.Riley]: { favor: 0 },
    [Person.Janitor]: { favor: 0 },
    [Person.Ryder]: { favor: 0 },
    [Person.Parker]: { favor: 0 },
  },
});

export default peopleState;
