import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import CurrencyRow from "./components/CurrencyRow";
import Token from "./interfaces/Token";
import "./App.css";

const BASE_URL = "https://interview.switcheo.com/prices.json";

function App() {
  const [isLoading, setLoading] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [sendCurrency, setSendCurrency] = useState<Token | null>(null);
  const [receiveCurrency, setReceiveCurrency] = useState<Token | null>(null);
  const [amount, setAmount] = useState(0);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount = 0,
    fromAmount = 0;
  if (sendCurrency === receiveCurrency) {
    fromAmount = amount;
    toAmount = amount;
  } else if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = (amount * sendCurrency?.price) / receiveCurrency?.price;
  } else {
    toAmount = amount;
    fromAmount = (amount * receiveCurrency?.price) / sendCurrency?.price;
  }

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
    setAmountInFromCurrency(true);
    if (!isDirty) {
      setDirty(true);
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
    setAmountInFromCurrency(false);
    if (!isDirty) {
      setDirty(true);
    }
  };

  const handleSwap = () => {
    setLoading(true);
    setAmount(0);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    setDirty(false);
  };

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const tokens = data.map((token: Token) => ({
          src: "/tokens/" + token.currency + ".svg",
          ...token,
        }));
        console.log(tokens);
        setTokens(tokens);
        setSendCurrency(data[0]);
        setReceiveCurrency(data[0]);
      });
  }, []);

  return (
    <>
      <h1 style={{ color: "#fff" }}>SWAP</h1>
      <CurrencyRow
        amountLabel="Amount to send"
        amountValue={fromAmount || 0}
        amountOnChange={handleFromAmountChange}
        options={tokens || []}
        selectedValue={sendCurrency?.currency || ""}
        handleSelect={(e: SelectChangeEvent) => {
          const selectedOption =
            tokens?.find((token) => token.currency === e.target.value) || null;
          setSendCurrency(selectedOption);
          if (!isDirty) {
            setDirty(true);
          }
        }}
      />
      <KeyboardDoubleArrowDownIcon fontSize="large" color="primary" />
      <CurrencyRow
        amountLabel="Amount to receive"
        amountValue={toAmount || 0}
        amountOnChange={handleToAmountChange}
        options={tokens || []}
        selectedValue={receiveCurrency?.currency || ""}
        handleSelect={(e: SelectChangeEvent) => {
          const selectedOption =
            tokens?.find((token) => token.currency === e.target.value) || null;
          setReceiveCurrency(selectedOption);
          if (!isDirty) {
            setDirty(true);
          }
        }}
      />

      <div className="submit-button">
        <Button
          disabled={!toAmount || sendCurrency === receiveCurrency}
          loading={isLoading}
          variant="contained"
          onClick={handleSwap}
          loadingPosition="end"
        >
          CONFIRM SWAP
        </Button>
      </div>
      {!toAmount && isDirty ? (
        <h5 className="error-text">Swap amount must be greater than zero</h5>
      ) : null}
      {sendCurrency === receiveCurrency && isDirty ? (
        <h5 className="error-text">
          Send currency must be different from receive currency
        </h5>
      ) : null}
    </>
  );
}

export default App;
