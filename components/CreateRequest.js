import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { create as IPFSHTTPClient } from 'ipfs-http-client';
import Loader from "./Loader";
import { ethers } from 'ethers';
import Crowdfunding from '../artifacts/contracts/CrowdFunding.sol/crowdfunding.json';

const client = IPFSHTTPClient("https://ipfs.infura.io:5001/api/v0");


const CreateRequest = () => {

    const Router = useRouter();
    const [isuploaded, setIsUpload] = useState(false);

    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const [formval, setFormVal] = useState({ title: '', address: '', amount: 0 });
    const [image, setImage] = useState("");
    const [story, setStory] = useState("");
    const [imgurl, setImgUrl] = useState("");
    const [storyurl, setStoryUrl] = useState("");



    const uploadFiles = async (e) => {
        e.preventDefault();

        if (story && image) {

            setUploadLoading(true);

            if (form.story !== "") {
                try {

                    const added = await client.add(story);
                    const { path } = added;

                    // console.log(`imageUrl -> ${path}`);
                    setStoryUrl(path);


                } catch (err) {
                    console.log(err);
                    toast.error("error accoured while uploading");
                }
            }
            if (image !== null) {
                try {

                    const added = await client.add(image);
                    const { path } = added;
                    setImgUrl(path);

                } catch (err) {
                    console.log(err);
                    toast.error("error accoured while uploading");
                }

            }


            setUploadLoading(false);
            setIsUpload(true);

            toast.success("file uploaded");

        }
        else {
            toast.warn("please upload story and image to ipfs");
        }
    }

    const solve = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setFormVal({ ...formval, [name]: value });
    }

    const solve1 = (e) => {
        setImage(e.target.files[0]);
    }




    const SubmitForm = async (e) => {
        e.preventDefault();
        try {

            const { title, address, amount } = formval;
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();
            if (isuploaded && title && storyurl && imgurl && address && amount) {


                setUploaded(true);


                const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, Crowdfunding.abi, signer);
                const Amount = ethers.utils.parseEther(amount);
                const sendMessage = await contract.createRequest(title, storyurl, imgurl, address, Amount);

                await sendMessage.wait();

                setUploaded(false);
                Router.push("/requests");
                setFormVal({ title: '', address: '', amount: '' });
            }
            else if (!isuploaded) {
                toast.warn("Please upload to Image && Story IPFS")
            }






        } catch (err) {
            console.log(err);
        }



    }
    const solve3 = () => {
        console.log(storyurl);
        console.log(imgurl);
    }


    return (
        <>

            <div className="flex justify-center items-center h-full py-16">
                <div id="form" className=" p-6 rounded-xl shodow-md bg-slate-900 shadow-slate-300 w-[90%] md:w-[50%] ">
                    <h2 className="text-sky-100 text-3xl flex justify-center font-semibold my-4">Create Request</h2>
                    <ToastContainer />

                    <div id="fullName" className="flex flex-col justify-evenly items-center px-18 md:px-20">
                        <div className="w-full mb-4">
                            <label className="block">
                                <span className=" block text-sm font-medium text-sky-100">
                                    Title
                                </span>
                                <input type='text' name="title" value={formval.title} onChange={solve} className="mt-1 px-3 py-2 outline-none bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none  block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Title..." />
                            </label>
                        </div>
                        <div className="w-full mb-4">
                            <label className="block">
                                <span className=" block text-sm font-medium text-sky-100">
                                    Description&apos;s
                                </span>
                                <textarea type="text" rows={2} cols={10} name="story" onChange={(e) => { setStory(e.target.value) }} value={story} className="mt-1 px-3 py-2 outline-none scrollbar-hide bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none  block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Description..." />
                            </label>
                        </div>
                        <div className="w-full mb-4">
                            <label className="block">
                                <span className=" block text-sm font-medium text-sky-100">
                                    Image
                                </span>
                                <input type="file" name="image" onChange={solve1} className="mt-1 px-3 py-2 outline-none bg-slate-100 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none  block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Please Select a pic" accept='image/*' />
                            </label>
                        </div>

                        <div className="w-full mb-4">
                            <label className="block">
                                <span className=" block text-sm font-medium text-sky-100">
                                    Recipient
                                </span>
                                <input type="Text" name="address" onChange={solve} value={formval.address} className="mt-1 px-3 py-2 outline-none bg-slate-100 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none  block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Please Enter Recipient Address...." />
                            </label>
                        </div>

                        <div className="w-full mb-4">
                            <label className="block">
                                <span className=" block text-sm font-medium text-sky-100">
                                    Amount
                                </span>
                                <input type="number" name="amount" value={formval.amount} onChange={solve} className="mt-1 px-3 py-2 outline-none bg-slate-100 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none  block w-full rounded-md sm:text-sm focus:ring-1" placeholder="Please Enter Amount...." />
                            </label>
                        </div>

                        {!isuploaded ?
                            <button className="w-full py-2 text-xl text-center text-white transition-colors duration-300 bg-green-600 rounded-full hover:bg-green-500 mb-4 ease px-9 md:w-full" onClick={uploadFiles}>
                                Upload Files to IPFS
                            </button> :
                            <button className="w-full py-2 text-xl text-center text-white transition-colors duration-300 bg-green-800 rounded-full  mb-4 ease px-9 md:w-full" onClick={solve3}>
                                Files uploaded Sucessfully
                            </button>}

                        {uploaded == true ? <Loader /> :
                            <button className="w-full py-3 text-xl text-center text-white transition-colors duration-300 bg-green-700 rounded-full hover:bg-green-500 mb-4 ease px-9 md:w-full" onClick={SubmitForm}>
                                Start Campaign
                            </button>}

                    </div>
                </div>
            </div>



        </>
    )

}

export default CreateRequest
