import "../styles/globals.scss";
import type { AppProps } from "next/app";
import ConnectWalletModal from "../components/connectWalletModal";
import Layout from "../components/common/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <ConnectWalletModal />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
