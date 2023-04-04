import { getNextDay, getVisitedCount } from "@/helpers";
import dayState from "@/recoil/dayState";
import journalState from "@/recoil/journalState";
import locationState from "@/recoil/locationState";
import { Location } from "@/types";
import { useRecoilState } from "recoil";
import Classroom from "./locations/classroom";

export default function LocationWrapper() {
  const [location, setLocation] = useRecoilState(locationState);
  const [journal, setJournal] = useRecoilState(journalState);
  const [day, setDay] = useRecoilState(dayState);

  if (!location) return null;
  if (location === Location.Classroom) return <Classroom />;
  const timesVisited = getVisitedCount(journal, location);

  return (
    <div className="w-8/12 p-12">
      <div>
        <h2>
          {location}: visited {timesVisited} times
        </h2>
      </div>
      <div className="flex w-full flex-row gap-x-24">
        <div
          className="cursor-pointer bg-white px-8 py-4 text-black hover:bg-gray-300"
          onClick={() => {
            setLocation(undefined);
            setDay(getNextDay(day));
            setJournal([...journal, { day, location }]);
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
}
