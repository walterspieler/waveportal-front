interface EthereumProvider {
  isMetaMask?: boolean;
  request: any;
}

interface Window {
  ethereum: EthereumProvider;
}
