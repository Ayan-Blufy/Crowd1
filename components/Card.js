import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from 'next/router';


import logo from "../image/logoa.png"
const Card = ({ title, amount, story, voters, address, image, requestaddress }) => {

console.log(voters);    

const router=useRouter();
    const [account, setAccount] = useState('0x8dE3D1661A03Dcef623a34b00511Ad840fEfFcd7');

    const [detail, setDetails] = useState('');

    useEffect(() => {
        let storyData = "";


        const solve = async () => {
            const data = await fetch(`https://ipfs.infura.io/ipfs/${story}`);
            const text=await data.text();
            setDetails(text);
        }



        solve();




    }, [])

    
    return (

        <div className="p-2 w-full  lg:w-[80%]  ">
            <div className="bg-slate-900 rounded shadow-lg p-5 cursor-pointer hover:bg-[#101620]">
                <div className="flex justify-center bg-slate-800 rounded-xl w-full p-2">

                    <Image src={"https://ipfs.infura.io/ipfs/" + image} width={200} height={150} className="0 rounded-xl " />


                </div>
                <div className="mt-4">
                    <h4 className="text-green-300 text-xl font-poppins font-extrabold m-2">{title}</h4>
                    <div className={`flex align-middle justify-between  pt-[5px] pb-[5px] pl-[9px] pr-[9px] font-normal bg-gray-900 text-[#fff] rounded-xl mt-2 mb-2  `} >
                        <div className="">
                            <span className='text-green-300'>Number of Voter :</span>
                            <span className='text-blue-100 ml-2'>{voters}</span>
                        </div>
                        <div className="">
                            <span className='text-green-300'>Amount :</span>
                            <span className='text-blue-100 ml-2'>{amount} eth</span>
                        </div>
                    </div>
                    <p className="text-blue-100 text-sm mb-4 px-4 ">
                        {detail}
                    </p>

                    <h2 className="text-green-700  text-sm w-full mb-3">
                        <span className='text-green-700 text-sm w-full '>
                            Address :-
                        </span>
                        <span className='text-blue-200 text-sm pl-2'>

                            {address?.slice(0, 6)}...{address?.slice(39)}
                        </span>

                    </h2>

                    <button className='w-full py-1 text-lg text-center text-white transition-colors duration-300 bg-green-700 rounded-full hover:bg-green-500 mb-1 ease px-9 md:w-full'
                        onClick={()=>{
                           router.push(`/requests/${requestaddress}`); 
                        }}
                    >

                        Go to Campaign

                    </button>


                </div>

            </div>
        </div>

    )
}

export default Card
