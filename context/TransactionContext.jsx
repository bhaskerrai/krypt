import React, {createContext, useEffect, useState} from 'react'
import { ethers } from 'ethers';
import { contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = createContext();

// const { ethereum } = window;
// let window;
// let localStorage;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {    
    

    const [currentAccount, setCurrentAccount] = useState("")
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false)
    const [transactions, setTransactions] = useState([])

    
    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
      };

    const checkIfWalletConnected = async () => {

        try {
            if (!window.ethereum) return alert("Please install Metamask or use another brower that has Metamask installed in it.");

    
            const accounts = await window.ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            }
            else {
                console.log("No account found")
            }

        } catch (error) {
            console.log(error);
        }
     
    }

    const connectWallet = async () => {

        try {
            if (!window.ethereum) return alert("Please install Metamask or use another brower that has Metamask installed in it.");

    
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

            setCurrentAccount(accounts[0])

        } catch (error) {
            console.log(error)
        }

    }

    useEffect( () => {
        checkIfWalletConnected();
        checkIfTransactionsExist();
    }, [])



    const checkIfTransactionsExist = async () => {
        try {
            if (window.ethereum) {
                const transactionContract = getEthereumContract();
    
                const transactionCount = await transactionContract.getTransactionCount();

                window.localStorage.setItem("transactionCount", transactionCount)
            }

            
        } catch (error) {
            console.log(error);
        }
    }

    const getAllTransactions = async () => {
        try {
            if (window.ethereum) {
                const transactionContract = getEthereumContract();
    
                const availableTransactions = await transactionContract.getAllTransactions();

                const structuredTransaction = availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: parseInt(transaction.amount._hex) / (10 ** 18)
          
                }))

                console.log(structuredTransaction);
                setTransactions(structuredTransaction);
            }

        } catch (error) {
            console.log(error)
        }
    }


    const sendTransaction = async () => {
        try {
            if (!window.ethereum) return alert("Please install Metamask or use another brower that has Metamask installed in it.");

            const { addressTo, amount, keyword, message} = formData;

            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount)

            await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',  //21000 gwei(should be written in hexdecimal)
                    value: parsedAmount._hex //0.00001 
                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`)

            window.location.reload();


        } catch (error) {
            console.log(error);
        }
    }
    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, transactions, formData, handleChange, sendTransaction, isLoading }}>
            {children}
        </TransactionContext.Provider>
    );

}
