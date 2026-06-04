import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

type VaultSearchProps = {
  value: string;
  onchange: (value: string) => void;
};

const VaultSearch = ({ value, onchange }: VaultSearchProps) => {
  return (
    <InputGroup className="mb-4">
      <InputGroupInput
        className="font-serif text-lg!"
        placeholder="Search..."
        value={value}
        onChange={(e) => onchange(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default VaultSearch;
