import journalState from "@/recoil/journalState";
import { useRecoilValue } from "recoil";

export default function Journal() {
  const journal = useRecoilValue(journalState);
  return (
    <div className="display: fixed bottom-4 right-4 flex w-fit flex-col gap-y-2">
      <h3>Journal</h3>
      {journal.map((entry, index) => {
        return (
          <p key={index}>
            {entry.day}: {entry?.flag ? entry.flag : "Filmed"} in the{" "}
            {entry.location}
          </p>
        );
      })}
    </div>
  );
}
