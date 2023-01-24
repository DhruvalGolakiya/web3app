declare var window: any;

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3 from "web3";
import Lottery from "../artifacts/contracts/Transfer.sol/Lottery.json";
import { type } from "os";

const Home: NextPage = () => {
  let MetaMaskProvider: any;
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");

  const contractProvider = new ethers.providers.JsonRpcProvider();
  const abi = Lottery.abi;
  const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // async function setPlayer() {
  //   const signer = contractProvider.getSigner();
  //   const lotteryContract = new ethers.Contract(address, abi, signer);
  //   const tx = await lotteryContract.pickWinner();
  //   console.log(tx);
  // }

  // async function getInfo() {
  //   const lotteryContract = new ethers.Contract(address, abi, contractProvider);
  //   console.log(lotteryContract);
  // }
  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        MetaMaskProvider = new ethers.providers.Web3Provider(window.ethereum);
        let balanceInBigNumber = await MetaMaskProvider.getBalance(accounts[0]);
        await setWalletAddress(accounts[0]);
        let balance = ethers.utils.formatEther(balanceInBigNumber);
        setBalance(balance);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    connectWallet();
  }, [balance]);
  async function buyTicket() {
    const signer = contractProvider.getSigner();
    const lotteryContract = new ethers.Contract(address, abi, signer);
    const accounts = await contractProvider.listAccounts();
    // let gasEstimate = await lotteryContract.estimateGas.buyTicket({
    //   value: ethers.utils.parseEther("0"),
    //   from: accounts[0],
    // });
    // console.log(gasEstimate);
    await lotteryContract.functions.buyTicket({
      value: ethers.utils.parseEther("0"),
      from: accounts[0],
      gasLimit: 100000,
    });

    // update the state to reflect the new ticket purchase
  }

  async function HandleEvent() {
    const signer = contractProvider.getSigner();
    const lotteryContract = new ethers.Contract(address, abi, signer);
    await lotteryContract.on("TicketBought", (ticket) => {
      console.log(ticket);
    });
  }

  async function generateWinningNumber() {
    const signer = contractProvider.getSigner();
    const lotteryContract = new ethers.Contract(address, abi, signer);
    const accounts = await contractProvider.listAccounts();
    await lotteryContract.functions.generateWinningNumber({
      from: accounts[0],
    });

    await lotteryContract.on("WinnigNumber", (_number) => {
      console.log(_number);
      console.log(ethers.utils.formatUnits(_number));
    });
    // update the state to reflect the new winning number
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <button
        onClick={() => {
          buyTicket();
        }}
      >
        Click
      </button>
      <button
        onClick={() => {
          connectWallet();
        }}
      >
        Connect Wallet
      </button>
      <div className="text-[20px] text-[red]">{balance}</div>
    </div>
  );
};

export default Home;
