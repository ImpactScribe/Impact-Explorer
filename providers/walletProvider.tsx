"use client";

import { store } from "@/redux/store";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { Provider } from "react-redux";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

const goerli = {
  chainId: 5,
  name: "Goerli Testnet",
  currency: "ETH",
  explorerUrl: "https://goerli.etherscan.io",
  rpcUrl: "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID", // You'll need to replace "YOUR_INFURA_PROJECT_ID" with your actual Infura project ID
};

// 3. Create modal
const metadata = {
  name: "ImapactScribe",
  description: "Developing ImpactCerts",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

const web3Modal = createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata: metadata,
    defaultChainId: 1,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: "...", // used for the Coinbase SDK
  }),
  chains: [goerli],
  projectId,
});

function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <div className="mt-[40px]">{children}</div>
    </Provider>
  );
}
export default WalletProvider;
