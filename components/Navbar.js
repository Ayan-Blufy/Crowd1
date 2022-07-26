import React, { useState, useEffect } from "react";
import { HiMenuAlt4, HiMenu } from "react-icons/hi";

import { AiFillAccountBook, AiOutlineClose } from "react-icons/ai";
import Image from 'next/image';
import logo from "../image/logoa.png"
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Crowdfunding from "../artifacts/contracts/CrowdFunding.sol/crowdfunding.json";

const Navbar = ({ manager }) => {
    const router = useRouter();
    const [toggleMenu, setToggleMenu] = useState(false);
    const [account, setAccount] = useState('');
    // const [manager, setManager] = useState('');
    const [balance, setBalance] = useState('');



    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install Metamask");
                return;
            }
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();

            const address = await signer.getAddress();
            const balance = await signer.getBalance();
            setAccount(address);
            setBalance(balance?.slice(0, 5));




        }
        catch (err) {
            console.log(err);
        }

    }

    const Accounts = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();

            const address = await signer.getAddress();
            const balance = ethers.utils.formatEther(await signer.getBalance());
            setAccount(address);
            setBalance(balance?.slice(0, 5));
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


    useEffect(() => {
        Accounts();
        solve();


    }, [])


    return (
        <nav className="w-full flex md:justify-center justify-between items-center">
            <div className="md:flex-[0.5]  flex-initial justify-center items-center">
                <Image alt="logo" src={logo} width={100} height={100} className="w-1 h-1 cursor-pointer " />

            </div>
            <ul className="text-white md:flex hidden list-none flex-row items-center justify-center  ">

                <li className={`mx-4 cursor-pointer ${router.pathname == '/' ? `hidden` : 'block'}`}>
                    <Link href={"/"}>Home</Link>
                </li>
                <li className={`mx-4 cursor-pointer ${router.pathname == '/requests' ? `hidden` : 'block'}`}>
                    <Link href={"/requests"}>Request's</Link>
                </li>
                <li className={`mx-4 cursor-pointer ${router.pathname == '/profile' ? `hidden` : 'block'}  ${account != '' ? `block` : `hidden`}`}>
                    <Link href={"/profile"}>Profile</Link>
                </li>
                <li className={`mx-4 cursor-pointer ${router.pathname == '/createrequest' ? `hidden` : 'block'} ${account != manager ? `hidden` : `block`}`}>
                    <Link href={"/createrequest"}>CreateRequest</Link>
                </li>
                <li className={`mx-4 cursor-pointer ${router.pathname == '/dashboard' ? `hidden` : 'block'} ${account != manager ? `hidden` : `block`}`}>
                    <Link href={"/dashboard"}>Dashboard</Link>
                </li>
                <button className={`flex align-middle justify-between  pt-[5px] pb-[5px] pl-[9px] pr-[9px] font-normal  ${account != '' ? `bg-slate-900` : `bg-gray-900`}  text-[#fff] rounded-lg `} onClick={account != '' ? '' : connectWallet}>
                    {balance === '' ? <div className="flex justify-center align-middle h-[100%]"></div> : <div className="flex justify-center align-middle h-[100%] pt-[5px] pr-[5px]">{balance} Eth</div>}
                    {account === '' ? <div className="bg-gray-700 flex justify-center  rounded-lg p-[5px]">Connect Wallet</div> : <div className="bg-gray-700 flex justify-center  rounded-lg p-[5px]">{account?.slice(0, 6)}...{account?.slice(39)}</div>}



                </button>

            </ul>
            <div className="flex relative">
                {!toggleMenu && (
                    <HiMenu fontSize={32} className="text-white mr-4 md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
                )}
                {toggleMenu && (
                    <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
                )}
                {toggleMenu && (
                    <ul
                        className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-center rounded-md blue-glassmorphism text-white animate-slide-in"
                    >
                        <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
                        <li className="my-2 text-lg cursor-pointer">
                            <Link href={"/"}>Home</Link>
                        </li>
                        <li className="my-2 text-lg cursor-pointer">
                            <Link href={"/requests"}>Request's</Link>
                        </li>
                        <li className={`my-2 text-lg cursor-pointer ${account != '' ? `block` : `hidden`}`}>
                            <Link href={"/proflie"}>Profile</Link>
                        </li>
                        <li className={`my-2 text-lg cursor-pointer ${account != manager ? `hidden` : `block`}`}>
                            <Link href={"/createrequest"}>CreateRequest</Link>
                        </li>
                        <li className={`my-2 text-lg cursor-pointer ${account != manager ? `hidden` : `block`}`}>
                            <Link href={"/dashboard"}>Dashboard</Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};



export default Navbar;



