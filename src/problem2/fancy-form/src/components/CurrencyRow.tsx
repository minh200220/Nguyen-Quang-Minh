import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Token from "../interfaces/Token";
import eth from "../tokens/ETH.svg";

interface CurrencyRowProps {
  amountLabel: string;
  amountValue: number;
  amountOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: Token[];
  selectedValue: string;
  handleSelect: (event: SelectChangeEvent<string>) => void;
}

const CurrencyRow = ({
  amountLabel,
  amountValue,
  amountOnChange,
  options,
  selectedValue,
  handleSelect,
}: CurrencyRowProps) => {
  return (
    <div className="currency-row">
      <TextField
        required
        label={amountLabel}
        value={amountValue}
        onChange={amountOnChange}
        type="number"
        placeholder="0"
      />
      <Select value={selectedValue} onChange={handleSelect}>
        {options?.map((option, index) => (
          <MenuItem key={index} value={option.currency}>
            <span>
              {option.currency + " "}
              <img className="token-img" src={option.src} alt="Example SVG" />
            </span>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default CurrencyRow;
