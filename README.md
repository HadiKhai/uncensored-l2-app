# Uncensored L2s: Force Transaction Inclusion on L2 Chains

⚠️ **Disclaimer**

This is a Proof of Concept (PoC) tool. Use with caution.

## Overview

**TxIncluderv1** is designed as an easy way to force transaction inclusion on any Layer 2 (L2) network, regardless of their permissions.

Currently, the tool supports the `swapExactETHForTokensSupportingFeeOnTransferTokens` function (used for buying tokens with WETH) via the v2Router on the following supported chains:

- **Base:** Uniswap
- **Optimism:** Uniswap
- **Soneium:** DYORSwap
- **Mode Network:** DYORSwap
- **Ink:** DYORSwap

## How It Works

This AI agent assists in crafting the transaction you'd like to force include. You'll need to provide the following:

- **Token Amount:** The amount of the token you'd like to purchase.
- **Chain Name:** The L2 network where the transaction should occur.
- **Token Address:** The address of the token on the L2 network.
- **Receiver Address:** The destination address for the purchased tokens on the L2 chain.

## Features

### Supported Functionality

- **Function Supported:**
  - `swapExactETHForTokensSupportingFeeOnTransferTokens` (currently only this function is supported)

### Supported Chains

- **Initial Support for Five Chains:**
  - Base
  - Optimism
  - Soneium
  - Mode Network
  - Ink

_Plans for future expansion to support additional chains and protocols._

## Future Work

- **User Experience:**
  - Abstract some input requirements for a simpler user experience.
- **Expansion:**
  - Support additional chains and protocols.
- **Functionality:**
  - Expand functionality to cover more transaction types.

## Deployment Addresses

| **Network** | **Address**                                  |
| ----------- | -------------------------------------------- |
| Mainnet     | `0x6A20DAA469A26aF06BDC012147996030BB08106F` |
| Sepolia     | `0xb2382eA48E00F6cB56663d8EEE9c7c68Cd21AB9B` |

---
