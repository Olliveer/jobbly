import { SelectItem } from "@/components/ui/select";
import states from "@/data/states.json";

export function StateSelectItems() {
  return Object.entries(states).map(([key, value], index) => (
    <SelectItem key={index} value={key}>
      {value}
    </SelectItem>
  ));
}
