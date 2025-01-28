interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // hardcode value for blockchain, can move values to a different file as constants
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // Property 'blockchain' does not exist on type 'WalletBalance'
        // Replace blockchain by currency
        const balancePriority = getPriority(balance.blockchain);
        // lhsPriority should be balancePriority
        if (lhsPriority > -99) {
          // balance.amount >= 0
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // Replace blockchain by currency for 2 lines
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });

    // price is not being used to calculate, remove price from dependency array
  }, [balances, prices]);

  // optimize formattedBalances on useMemo above to reduce redundant operations
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // Replace sortedBalances with formattedBalances
  // Compute usdValue on useMemo above
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // balance.currency might not exist in prices, need to validate
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
