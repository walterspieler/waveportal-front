import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../utils/WavePortal.json";
import { Wave } from "../utils/wave.interface";
import { DateTime } from "luxon";
import Waves from "../components/waves";
import CreateWave from "../components/createWave";
import MessageModal from "../components/messageModal";
import useLocalStorage from "@rehooks/local-storage";
import { checkIfWalletIsConnected } from "../lib/wallet.service";

const Home = () => {
  const [allWaves, setAllWaves] = useState<Wave[]>([]);
  const [wallet] = useLocalStorage("wallet");
  const [message, setMessage] = useState<{ message: string; title: string }>();
  const [showMessageModal, setshowMessageModal] = useState<boolean>(false);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
  const contractABI = abi.abi;

  const wave = async (message: string) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        setshowMessageModal(true);

        setMessage({
          message: "Retrieving total wave count...",
          title: `Sending to: ${contractAddress}`,
        });
        let count = await wavePortalContract.getTotalWaves();
        setMessage({
          message: `Retrieved ${count.toNumber()} waves`,
          title: `Sending to: ${contractAddress}`,
        });

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(message);
        setMessage({
          message: `Mining… ${waveTxn.hash}`,
          title: `Sending to: ${contractAddress}`,
        });
        await waveTxn.wait();
        setMessage({
          message: `Mined ${waveTxn.hash}`,
          title: `Sent to: ${contractAddress}`,
        });
        count = await wavePortalContract.getTotalWaves();
        setMessage({
          message: `Retrieved ${count.toNumber()} waves`,
          title: `Sending to: ${contractAddress}`,
        });
        await getAllWaves();
        setshowMessageModal(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves: { waver: string; timestamp: number; message: string }[] =
          await wavePortalContract.getAllWaves();

        let wavesCleaned = waves.reduce((acc: Wave[], wave) => {
          return [
            ...acc,
            {
              address: `${wave.waver.substring(0, 5)}…${wave.waver.substring(
                wave.waver.length - 5
              )}`,
              timestamp: DateTime.fromMillis(
                wave.timestamp * 1000
              ).toLocaleString(DateTime.DATETIME_SHORT),
              message: wave.message,
            },
          ];
        }, []);
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWaves();
  }, [wallet]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div>
          <Waves waves={allWaves} />
        </div>
        <div>
          <CreateWave onWave={wave} />
        </div>
      </div>
      <MessageModal
        open={showMessageModal}
        message={message?.message}
        title={message?.title}
      />
    </div>
  );
};

export default Home;
