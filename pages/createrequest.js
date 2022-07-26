import React from 'react'
import Navbar from '../components/Navbar'
import CreateRequest from '../components/CreateRequest'
import { ethers } from 'ethers'
import Crowdfunding from "../artifacts/contracts/CrowdFunding.sol/crowdfunding.json"

const MainCreaterequest = ({manager}) => {
    return (
        <>
            <div className='gradient-bg-services min-h-screen'>
                <Navbar manager={manager}/>
                <CreateRequest/>
            </div>
        </>
    )
}

export default MainCreaterequest
export async function getStaticProps() {

    const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/Qo1DxQ8U6Hzw3Da7p3n7zTlD0xUgMR4t");
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, Crowdfunding.abi, provider);

    const manager = await contract.manager();




    return {
        props: {
            manager

        }
    }
}