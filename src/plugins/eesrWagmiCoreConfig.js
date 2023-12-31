import {configureChains, createConfig} from "@wagmi/core";
import {walletConnectProvider} from "@web3modal/wagmi";
import {publicProvider} from "@wagmi/core/providers/public";
import {WalletConnectConnector} from "@wagmi/core/connectors/walletConnect";
import {InjectedConnector} from "@wagmi/core/connectors/injected";
import {EIP6963Connector} from "@web3modal/wagmi";
import {CoinbaseWalletConnector} from "@wagmi/core/connectors/coinbaseWallet";
import {EmailConnector} from "@web3modal/wagmi";
import {EesrConnector} from "@eoslabs/eesr";

export function eesrWagmiConfig({ projectId, chains, metadata, enableInjected, enableCoinbase, enableEIP6963, enableEmail, enableWalletConnect,enableEesr }) {
  const { publicClient } = configureChains(chains, [
    walletConnectProvider({ projectId }),
    publicProvider()
  ]);
  const connectors = [];
  if(enableEesr !== false){
    connectors.push(new EesrConnector({ chains, options: { projectId, showQrModal: false, metadata } }));
  }
  if (enableWalletConnect !== false) {
    connectors.push(new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }));
  }
  if (enableInjected !== false) {
    connectors.push(new InjectedConnector({ chains, options: { shimDisconnect: true } }));
  }
  if (enableEIP6963 !== false) {
    connectors.push(new EIP6963Connector({ chains }));
  }
  if (enableCoinbase !== false) {
    connectors.push(new CoinbaseWalletConnector({ chains, options: { appName: metadata?.name ?? 'Unknown' } }));
  }
  if (enableEmail === true) {
    connectors.push(new EmailConnector({ chains, options: { projectId } }));
  }
  return createConfig({
    autoConnect: true,
    connectors,
    publicClient
  });
}
