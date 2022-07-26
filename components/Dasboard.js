import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react'
import Crowdfunding from '../artifacts/contracts/CrowdFunding.sol/crowdfunding.json'






const Dasboard = ({manager}) => {

    const [balance, setBalance] = useState(0);
    const [count,setCount]=useState(0);
    const [arr, setArr] = useState([]);
    const solve = async () => {
        try {

            const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/Qo1DxQ8U6Hzw3Da7p3n7zTlD0xUgMR4t');
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, Crowdfunding.abi, provider);





            const bal = await contract.getBalance();
            const amount = ethers.utils.formatEther(bal);
            setBalance(amount);

        } catch (err) {
            console.log(err);
        }
    }

    const Transaction = async () => {
        try {

            const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/Qo1DxQ8U6Hzw3Da7p3n7zTlD0xUgMR4t');
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, Crowdfunding.abi, provider);

            const Contributers = parseInt(await contract.noOfContributors());
            setCount(Contributers);
            const data = contract.filters.RequestPaid();
            const PaidData = await contract.queryFilter(data);

            const Data = PaidData.map((ele) => {
                return {



                    amount: ethers.utils.formatEther(ele?.args.target),
                    recipient: ele?.args.recipient,

                    timestamp: parseInt(ele?.args.timestamp)
                }
            })
           
            const Arr=Data.reverse();
            setArr(Arr);


        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        solve();
        Transaction();

    }, []);

    return (
        <>


            <div className="w-full h-full flex flex-col justify-center items-center ">




                <div className={`flex items-center justify-center flex-col md:flex-row w-[90%] p-2 md:w-[50%] h-full font-normal  bg-gray-900  text-[#fff] rounded-lg my-2 `}>

                    <div className="bg-gray-900 flex justify-center items-center rounded-lg pt-[5px] p-[5px] w-full">

                        <h2 className='text-sky-200 text-sm w-[50%]  flex justify-center md:justify-start pt-[5px] p-[5px]'>
                            No Contributers :-
                        </h2>
                        <h2 className='text-sky-200 text-sm w-[50%] flex justify-center md:justify-start'>
                            
                            {count} 
                        </h2>

                    </div>

                    <div className="bg-gray-700 flex justify-center items-center h-[100%] rounded-lg pt-[5px] p-[5px] w-full">


                        <h2 className=' text-green-300 rounded-lg w-[50%] flex md:justify-start justify-center pt-[5px] p-[5px]  '>
                            Contract Balance:-
                        </h2>
                        <h2 className='text-sky-200 text-sm w-[50%] flex justify-center md:justify-start'>
                            { balance }Eth

                        </h2>



                    </div>

                </div>

                <div className={`flex items-center justify-center flex-col w-[95%] p-2 md:w-[80%] h-full font-normal  bg-gray-900  text-[#fff] rounded-lg my-2 `}>


                    <div className="bg-gray-900 flex justify-center items-center h-[100%] rounded-lg pt-[5px] p-[5px] w-full">


                        <h2 className='bg-gray-700 text-green-300 rounded-lg w-full flex justify-center pt-[5px] p-[5px]  '>
                            Transcation Logs
                        </h2>

                    </div>
                    <div className="bg-gray-900 flex flex-col justify-center items-center h-[100%] rounded-lg pt-[5px] p-[5px] w-full">
                        <div className="flex justify-evenly grid-cols-4 bg-gray-700 w-full rounded-full pt-[5px] p-[5px] my-2">
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
                                arr.map((ele,i) => {

                                    return (
                                        <div className="flex justify-evenly grid-cols-3 bg-gray-700 w-full rounded-full pt-[5px] p-[5px] mb-2" key={i}>
                                            <p className='text-sky-200 text-xs md:text-sm w-full md:w-[50%]  flex justify-center '>
                                                {ele.recipient?.slice(0, 6)}...{ele.recipient?.slice(39)}
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

export default Dasboard
