import { useRecoilValue } from "recoil";
import peopleState from "@/recoil/peopleState";
import { Person } from "@/types";

export default function Homecoming() {
  const people = useRecoilValue(peopleState);
  return (
    <div className="w-8/12 p-12">
      <h2>Today is homecoming!</h2>
      <div className="mt-4">
        {Object.keys(people).map((person) => {
          return (
            <div key={person}>
              <p>
                {person}’s favor: {people[person as Person].favor}
              </p>
            </div>
          );
        })}
      </div>
      <div
        onClick={() => {
          window.location.reload();
        }}
        className="mt-4 w-fit cursor-pointer bg-white px-8 py-4 text-black hover:bg-gray-300"
      >
        Reset game
      </div>
    </div>
  );
}
