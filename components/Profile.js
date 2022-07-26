import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import logo from "../image/logoa.png"
import { ethers } from "ethers";

import Crowdfunding from '../artifacts/contracts/CrowdFunding.sol/crowdfunding.json'

const Profile = ({manager}) => {



    const [address, setAddress] = useState('');
    const [Trans, setTrans] = useState([]);
    const [balance,setBalance]=useState(0);
    const [isvalid,setIsValid]=useState(false);

    const Accounts = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();

            const address = await signer.getAddress();
            setAddress(address);


        }
        catch (err) {
            console.log(err);
        }
    }
 
    const Transcation = async () => {
        try {

            const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/Qo1DxQ8U6Hzw3Da7p3n7zTlD0xUgMR4t');
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, Crowdfunding.abi, provider);
            const Ad = await window.ethereum.request({ method: 'eth_accounts' });

            
            const Address = Ad[0];



           
            const Donation = contract.filters.Transcations(Address);
            const AllData = await contract.queryFilter(Donation);

            const Data = AllData.map((ele) => {
                return {
                    contributer: ele?.args.contributer,
                    amount: ethers.utils.formatEther(ele?.args.Amount),
                    timestamp: parseInt(ele?.args.timestamp)
                }
            })

            const arr=Data.reverse();


            setTrans(arr);
        } catch (err) {
            console.log(err);
        }
    }


    const Connection=async()=>{
        try{

            const provider=new ethers.providers.Web3Provider(window.ethereum,'any');
            const signer=provider.getSigner();
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, Crowdfunding.abi, signer);


            const amount = ethers.utils.formatEther(await contract.getAmountDonted())
            setBalance(amount?.slice(0,6));
            const valid = await contract.vaildForRefund();
       
            setIsValid(valid);



        }catch(err){
            console.log(err);
        }
    }

    const getRef=async()=>{
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, Crowdfunding.abi, signer);


             const trans=await contract.getRefund();
             await trans.wait();
            


        } catch (err) {
            console.log(err);
        }
    }

    const solve = async () => {
        try {
            await window.ethereum.on('accountsChanged', () => {
                Accounts();
             Transcation();
             Connection();
            });
        }
        catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        Accounts();
        solve();
        Transcation();
        Connection();


    }, [])
  


    return (
        <>
            <div className="w-full h-full flex flex-col justify-center items-center pb-4">

                <div className="flex  flex-col w-full h-full justify-center md:justify-between items-center py-2">
                    <div className="rounded-full border border-gray-400 p-4">

                        <Image src={logo} width={200} height={200} />
                    </div>
                    <div className="p-4">
                        <div className="flex md:w-full  items-center justify-center">
                            <h1 className='text-white text-xl md:text-3xl'>{address}</h1>
                        </div>





                    </div>

                    <div className={`flex items-center justify-center flex-col md:flex-row w-[95%] p-2 md:w-[80%] h-full font-normal  bg-gray-900  text-[#fff] rounded-lg my-2 ${address!=manager?`block`:`hidden`} `}>



                        <div className="bg-gray-900 flex justify-center items-center rounded-lg pt-[5px] p-[5px] w-full">

                            <h2 className='text-sky-200 text-sm w-[50%]  flex justify-center md:justify-start pt-[5px] p-[5px]'>
                                Amount :-
                            </h2>
                            <h2 className='text-sky-200 text-sm w-[50%] flex justify-center md:justify-start'>
                             {balance} eth
                            </h2>

                        </div>
                        <div className="bg-gray-700 flex justify-center items-center h-[100%] rounded-lg pt-[5px] p-[5px] w-full">


                            <h2 className=' text-green-300 rounded-lg w-[50%] flex md:justify-start justify-center pt-[5px] p-[5px]  '>
                                Amounte Refundable:-
                            </h2>
                            <h2 className='text-sky-200 text-sm w-[50%] flex justify-center md:justify-start'>
                                {isvalid?'True':'False'}

                            </h2>
                            {isvalid?
                            <button className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-green-600  text-white w-[50%]" onClick={getRef} >
                                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-green-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                                <span className="relative text-white transition duration-300 group-hover:text-white ease">get Refund</span>
                            </button>:<></>}
                            

                        </div>

                    </div>

                </div>

                <div className={`flex items-center justify-center flex-col w-[95%] p-2 md:w-[80%] h-full font-normal  bg-gray-900  text-[#fff] rounded-lg my-2 `}>


                    <div className="bg-gray-900 flex justify-center items-center h-[100%] rounded-lg pt-[5px] p-[5px] w-full">


                        <h2 className='bg-gray-700 text-green-300 rounded-lg w-full flex justify-center pt-[5px] p-[5px]  '>
                            Transcation Logs
                        </h2>

                    </div>
                    <div className="bg-gray-900 flex flex-col justify-center items-center h-[100%] rounded-lg pt-[5px] p-[5px] w-full">
                        <div className="flex justify-evenly grid-cols-3 bg-gray-700 w-full rounded-full pt-[5px] p-[5px] my-2">
                            <p className='text-green-600 text-sm w-[50%]   flex justify-center '>
                                Address
                            </p>
                            <p className='text-green-600 text-sm w-[50%]  flex justify-center '>
                                Amount
                            </p>
                            <p className='text-green-600 text-sm w-[50%] flex justify-center '>
                                Timestamp
                            </p>
                        </div>
                        <div className="w-full h-[300px] verflow-y-scroll overflow-x-hidden scrollbar-hide tracking-wide">
                        {
                            Trans.map((ele,i) => {

                                return (
                                    <div className="flex justify-evenly grid-cols-3 bg-gray-700 w-full rounded-full pt-[5px] p-[5px] mb-2" key={i}>
                                        <p className='text-sky-200 text-xs md:text-sm w-full md:w-[50%]  flex justify-center '>
                                            {ele.contributer?.slice(0, 6)}...{ele.contributer?.slice(39)}
                                        </p>
                                        <p className='text-sky-200 text-xs md:text-sm w-full md:w-[50%]  flex justify-center '>
                                            {ele.amount}
                                        </p>
                                        <p className='text-sky-200 text-xs md:text-sm w-full md:w-[50%]  flex justify-center '>
                                            {new Date(ele?.timestamp * 1000).toLocaleString()}
                                        </p>
                                    </div>
                                )
                            })
                        }
                            
                         
                            
                            
                            
                        
                            
                        </div>


                    </div>

                </div>
            </div>




        </>
    )
}

export default Profile


