import React from 'react'

import { ethers } from 'ethers'
import Crowdfunding from "../artifacts/contracts/CrowdFunding.sol/crowdfunding.json"

import Navbar from '../components/Navbar'
import Dasboard from '../components/Dasboard'

const MainDashboard = ({manager}) => {
    return (
        <>
            <div className='gradient-bg-services min-h-screen'>
                <Navbar manager={manager} />
                <Dasboard manager={manager}/>
            </div>
        </>
    )
}

export default MainDashboard
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