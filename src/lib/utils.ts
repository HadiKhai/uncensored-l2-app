import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    AbiFunction,
    Address,
    encodeFunctionData,
    erc20Abi,
    parseAbi,
    parseAbiItem,
    parseUnits
} from "viem";
import { createPublicClient, http } from 'viem';
import { optimism, base,  mode, ink, soneium } from 'viem/chains';

const optimismClient = createPublicClient({
    chain: optimism,
    transport: http(),
})

const baseClient = createPublicClient({
    chain: base,
    transport: http(),
})

const modeClient = createPublicClient({
    chain: mode,
    transport: http(),
})

const inkClient = createPublicClient({
    chain: ink,
    transport: http(),
})

const soneiumClient = createPublicClient({
    chain: soneium,
    transport: http(),
})

const clients = {
    optimism: optimismClient,
    base: baseClient,
    modeNetwork: modeClient,
    ink: inkClient,
    soneium: soneiumClient,
}

export type SupportedChains = "optimism" | "base" | "soneium" | "modeNetwork" | "ink";

export const ChainsProxyContract: Record<SupportedChains, Address>= {
  optimism: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
  base: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
  soneium: '0x88e529A6ccd302c948689Cd5156C83D4614FAE92',
  modeNetwork: '0xad3DC277d3242938F8Be18f0560e3D9B9988C46A',
  ink: '0x9b17690dE96FcFA80a3acaEFE11d936629cd7a77',
};

export const RouterContracts: Record<keyof typeof ChainsProxyContract, Address> = {
  optimism: '0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2',
  base: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
  soneium: '0xE1A931937c8696aCA22f64212d8a779283b3b3Ab',
  modeNetwork: '0xCf9dc9AfB93BD3ef4fB3cc4dF7843abC3c9E169A',
  ink: '0x9b17690dE96FcFA80a3acaEFE11d936629cd7a77',
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tap = async <T>(value: T, cb: (value: T) => Promise<unknown>): Promise<T> => {
  await cb(value)
  return value
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
        'An error occurred while fetching the data.',
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export const encodeFunction = (functionSignature: string, args: unknown[]) => {
  try {
    const abiItem = parseAbiItem(`function ${functionSignature}`);
    if (abiItem.type !== 'function') {
      throw new Error(`Invalid function signature: ${functionSignature}`);
    }
    const functionAbi = abiItem as AbiFunction;
    const data = encodeFunctionData({
      abi: [functionAbi],
      functionName: functionAbi.name,
      args,
    });
    return data as Address;
  } catch (error) {
    throw new Error(
        `Failed to encode function call. Signature: ${functionSignature}, Args: ${JSON.stringify(
            args
        )}, Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const getDecimals = async (tokenAddress: Address, chainName: keyof typeof ChainsProxyContract) => {
    const result = await clients[chainName].readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals"
    })

    return result
}

export const getAmountsIn = async (path: Address[], chainName: keyof typeof ChainsProxyContract, amountOut: string, decimals: number) => {
    const result = await clients[chainName].readContract({
        address: RouterContracts[chainName],
        abi:parseAbi([
            `function getAmountsIn(uint amountOut, address[] memory path) view returns (uint[] memory amounts)`
        ]),
        functionName: 'getAmountsIn',
        args: [parseUnits(amountOut, decimals), path]
      })


  return result;

}


export const getRatePercent = async (chainName: keyof typeof ChainsProxyContract): Promise<bigint> => {
    if(chainName === "soneium" || chainName === "modeNetwork" || chainName === "ink"){
        const result = await clients[chainName].readContract({
            address: RouterContracts[chainName],
            abi:parseAbi([
                `function ratePercent() view returns (uint256)`
            ]),
            functionName: 'ratePercent',
        })


        return result
    }

    return BigInt(0)
}