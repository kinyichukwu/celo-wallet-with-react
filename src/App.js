import logo from "./logo.svg";
import react, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";

function App() {
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);

  // connect to celo wallet
  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  console.log(address);


  // send money to other account
  async function sendCELOTx() {
    // Connect to the network and get the current tx count
    let nonce = await kit.web3.eth.getTransactionCount(kit.defaultAccount);

    // Send 0.1 CELO
    let amount = kit.web3.utils.toWei("0.1", "ether");

    let CeloTx = {
      to: "0x78820ee969c7C3264817723779b1D780f1aD0C13", // omit recipient for a contract deployment
      from: address,
      gas: 2000000, // surplus gas will be returned to the sender
      nonce: nonce,
      chainId: "44787", // Alfajores chainId
      data: "0x0", // data to send for smart contract execution
      value: amount,

      // The following fields can be omitted and will be filled by ContractKit, if required

      gasPrice: "30000000000",
      // gatewayFee: 0,
      // gatewayFeeRecipient: "",
      // feeCurrency: ""
    };

    let tx = await kit.sendTransaction(CeloTx);
    let receipt = await tx.waitReceipt();

    console.log(
      `CELO tx: https://alfajores-blockscout.celo-testnet.org/tx/${receipt.transactionHash}`
    );
  }

  useEffect(() => {
    connectToWallet();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Testing <code>celo</code>transaction
        </p>
        <button
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendCELOTx()}
        >
          Transfer
        </button>
      </header>
    </div>
  );
}

export default App;
