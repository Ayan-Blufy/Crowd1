import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import Crowdfunding from '../../artifacts/contracts/CrowdFunding.sol/crowdfunding.json'
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Image from 'next/image'



const Address = ({ CurrentData, manager }) => {


    const [address, setAddress] = useState('');
    const [text, setText] = useState('');

    const Accounts = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();

            const account = await signer.getAddress();
            setAddress(account);

        }
        catch (err) {
            console.log(err);
        }
    }


    const solve = async () => {
        try {
            await window.ethereum.on('accountsChanged', Accounts);
        }
        catch (err) {
            console.log(err);
        }
    }


    const AddVote = async () => {

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();

            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, Crowdfunding.abi, signer);

            const vote = await contract.makeVote(CurrentData[0]?.requestNo);

            await vote.wait();

        } catch (err) {
            console.log(err);
        }

    }

    const MakePayments = async () => {

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();

            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, Crowdfunding.abi, signer);

            const vote = await contract.makePayment(CurrentData[0]?.requestNo);

            await vote.wait();

        } catch (err) {
            console.log(err);
        }

    }


    useEffect(() => {
        Accounts();
        solve();


        const solve1 = async () => {
            const data = await fetch(`https://ipfs.infura.io/ipfs/${CurrentData[0]?.story}`);
            const text = await data.text();
            setText(text);
        }



        solve1();


    }, [])

  

    return (
        <div className='gradient-bg-services min-h-screen p-2'>
            <Navbar />

            <div className="p-2 w-full  lg:w-full flex flex-col md:flex-row justify-center  px-4">
                <div className="bg-slate-900 rounded shadow-lg p-5 cursor-pointer hover:bg-[#101620]">
                    <div className="flex justify-center items-center h-full bg-slate-800 rounded-xl w-full p-2">

                        <Image src={"https://ipfs.infura.io/ipfs/" + CurrentData[0]?.image} width={400} height={200} className="0 rounded-xl " />


                    </div>




                </div>

                <div className="mt-4 md:px-4 py-4">
                    <div className="bg-slate-900 rounded shadow-lg p-5 cursor-pointer hover:bg-[#101620]">
                        <h4 className="text-green-300 text-xl font-poppins font-extrabold m-2">{CurrentData[0]?.title}</h4>
                        <div className={`flex align-middle justify-between  pt-[5px] pb-[5px] pl-[9px] pr-[9px] font-normal bg-gray-900 text-[#fff] rounded-xl mt-2 mb-2  `} >
                           
                            <div className="">
                                <span className='text-green-300'>Amount :</span>
                                <span className='text-blue-100 ml-2'>{CurrentData[0]?.amount} eth</span>
                            </div>
                        </div>
                        <p className="text-blue-100 text-sm mb-4 px-4 ">
                            {text}

                        </p>

                        <h2 className="text-green-700  text-sm w-full mb-3">
                            <span className='text-green-700 text-sm w-full '>
                                Address :-
                            </span>
                            <span className='text-blue-200 text-sm pl-2'>

                                {CurrentData[0]?.recipient?.slice(0, 6)}...{CurrentData[0]?.recipient?.slice(39)}
                            </span>

                        </h2>
                        <h2 className="text-green-700  text-sm w-full mb-4">

                            <span className='text-green-700 text-sm w-full '>
                                Request Created :-
                            </span>
                            <span className='text-blue-200 text-sm pl-2'>

                                {new Date(CurrentData[0]?.timestamp * 1000).toLocaleString()}
                            </span>

                        </h2>
                        {address != manager ?
                            <button className="inline-flex items-center justify-center w-full px-6 py-2 mb-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-400 sm:w-auto sm:mb-0" data-primary="green-400" data-rounded="rounded-2xl" data-primary-reset="{}"
                                onClick={AddVote}
                            >
                                Add My Vote
                            </button> :
                            <button className="w-full py-2 text-xl text-center text-white transition-colors duration-300 bg-green-400 rounded-full hover:bg-green-500 ease px-9 "
                            onClick={MakePayments}
                            >
                                Make Payment
                            </button>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Address


export async function getStaticPaths() {



    const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/5eCMd33ZlpMnutT7rxEVzem9yLLR905k");
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, Crowdfunding.abi, provider);



    const Donation = contract.filters.RequestCreated();
    const AllData = await contract.queryFilter(Donation);


    return {
        paths: AllData.map((e) => ({
            params: {
                address: e.blockHash.toString(),
            }
        })),
        fallback: "blocking"
    }
}


export async function getStaticProps(context) {



    const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/Qo1DxQ8U6Hzw3Da7p3n7zTlD0xUgMR4t');
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, Crowdfunding.abi, provider);
    const Donation = contract.filters.RequestCreated();
    const AllData = await contract.queryFilter(Donation);


    const manager = await contract.manager();


    const Data = AllData.map((ele, i) => {
        return {
            requestNo: i,
            title: ele?.args.title,
            story: ele?.args.description,
            image: ele?.args.image,
            amount: ethers.utils.formatEther(ele?.args.Amount),
            recipient: ele?.args.recipient,
            voters: ethers.utils.formatEther(ele?.args.voters),
            requestaddress: ele?.blockHash,
            timestamp: parseInt(ele?.args.timestamp)



        }
    })

    const CurrentData = Data.filter((ele) => {
        return ele.requestaddress == context.params.address;
    })




    return {
        props: {
            CurrentData,
            manager


        }
    }

}