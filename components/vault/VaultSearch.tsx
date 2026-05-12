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
    <InputGroup>
      <InputGroupInput
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
