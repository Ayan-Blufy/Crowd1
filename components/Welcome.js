import React, { useContext, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from "./Loader";
import { ethers } from "ethers";
import Crowdfunding from "../artifacts/contracts/CrowdFunding.sol/crowdfunding.json";


const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
        placeholder={placeholder}
        type={type}
        step="0.0001"
        value={value}
        onChange={handleChange}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);

const Welcome = () => {



    const [account, setAccount] = useState('0x9eB3dE65796710be7733E74c4a98F96eB16eA99B');
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(0);

    const handleChange = (e) => {
        setAmount(e.target.value);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            if(amount==0)
            {
                toast.warn("Please Enter Some Amount");
            }
            else{
                setIsLoading(true);
                await window.ethereum.request({method:'eth_requestAccounts'});
                const provider=new ethers.providers.Web3Provider(window.ethereum,'any');
                const signer=provider.getSigner();

                const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS,Crowdfunding.abi,signer);

                const transcation = await contract.sendEth({value:ethers.utils.parseEther(amount)});
                await transcation.wait();

                setIsLoading(false);
                setAmount(0);
              


            }


           
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex w-full min-h-screen justify-center items-center">
            <div className="flex md:flex-row flex-col items-start justify-around md:p-20 py-10 px-2">
                <div className="flex flex-1 justify-start items-start flex-col md:mr-20">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                        Send Crypto <br /> across the world
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Crowdfunding is the practice of funding to the people who really needed a financial help  by raising money from a large number of people who donate some amount fund&apos;s
                        in order to save an individual  life.

                    </p>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-md ">
                      Minimum Amount of Donation you can make :- 100 wei

                    </p>
                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                            Reliability
                        </div>
                        <div className={companyCommonStyles}>Security</div>
                        <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                            Ethereum
                        </div>
                        <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                            Web 3.0
                        </div>
                        <div className={companyCommonStyles}>Low Fees</div>
                        <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                            Blockchain
                        </div>
                    </div>
                </div>
            <ToastContainer/>
                <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
                    <div className="p-5 flex justify-end items-start flex-col rounded-xl h-40 sm:w-80 w-full my-5 eth-card .white-glassmorphism ">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                    <SiEthereum fontSize={21} color="#fff" />
                                </div>
                                <BsInfoCircle fontSize={17} color="#fff" />
                            </div>
                            <div>
                                <p className="text-white font-light text-sm">
                                    {account?.slice(0, 6)}...{account?.slice(39)}
                                </p>
                                <p className="text-white font-semibold text-lg mt-1">
                                    Ethereum
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <Input placeholder="Amount (ETH)" name="amount" value={amount} type="number" handleChange={handleChange} />
                        <div className="h-[1px] w-full bg-gray-400 my-2" />
                        {isLoading
                            ? <Loader />
                            : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                                >
                                    Send now
                                </button>
                            )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;


