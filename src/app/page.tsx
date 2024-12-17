"use client";

import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContract,
  useReadContracts,
} from "wagmi";
import TetherAbi from "../abis/Tether.json";
import { useMemo } from "react";
import { Abi } from "viem";

function App() {
  const account = useAccount();
  const chainId = useChainId();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const tetherContract: {
    abi: Abi;
    address: `0x${string}`;
    chainId: 1 | 11155111;
  } = {
    abi: TetherAbi as Abi,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    chainId: chainId,
  };

  const result = useReadContract({
    ...tetherContract,
    functionName: "totalSupply",
    query: {
      select(result) {
        return Number(result || 0);
      },
    },
  });

  const { data } = useReadContracts({
    contracts: [
      {
        ...tetherContract,
        functionName: "decimals",
      },
      {
        ...tetherContract,
        functionName: "symbol",
      },
    ],
  });

  const { data: secondData } = useReadContracts({
    contracts: [
      {
        ...tetherContract,
        functionName: "decimals",
      },
      {
        ...tetherContract,
        functionName: "symbol",
      },
    ],
    query: {
      select(result) {
        const _data = result?.map((e) => e.result);
        return {
          decimals: _data[0],
          symbol: _data[1],
        };
      },
    },
  });

  console.log(secondData?.decimals);

  const [formattedAmount, symbol] = useMemo(() => {
    if (data && result?.data) {
      const [decimals, symbol] = data?.map((e) => e?.result);

      return [
        (result?.data / 10 ** Number(decimals))?.toLocaleString(),
        String(symbol),
      ];
    }
    return [0, ""];
  }, [data, result]);

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      <div>
        <h2>Read Contract</h2>
        <div>Call status: {result?.status}</div>

        <div>
          {formattedAmount} {symbol}
        </div>
      </div>
    </>
  );
}

export default App;
