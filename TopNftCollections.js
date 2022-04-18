import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DataTable from 'react-data-table-component';
import axios from 'axios'

//**********************************************
//*             Setting up some basic stuff
//**********************************************
const apiKey = //ADD your API key here
const nftDataRequestURL = `https://api.covalenthq.com/v1/1/nft_market/`

const Container = styled.div`
    width: 70%;
    border: 1px dotted blue;
    margin: auto;
    padding: 20px;
`
const Img = (url) => {
    console.log(url.url)
    return(
        <div>
            <img src={url.url} alt='ds' width='70' height='70'/>
        </div>
    )
}

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const TopNftCollections = () => {
    const [nftData, setNftData] = useState([])
    //**********************************************
    //*             Getting NFT Data from Covalent
    //**********************************************
    useEffect(() => {
        axios
            .get(nftDataRequestURL, {
                auth: {
                    username: apiKey
                }
            })
            .then(res => {
                console.log('NFT data retrieved')
                setNftData(res.data)
            })
            .catch(e => console.log(e))
    }, [])
    //**********************************************
    //*             Selecting Columns to be displayed
    //**********************************************
    if (nftData.data) {
        console.log(nftData.data)
        nftData.data.items.forEach((item, index) => {item.rank = index+1})
        const columns = [
            {
                name: 'Rank',
                selector: row => row.rank,
                width:'100px',
            },
            {
                name: 'Collection',
                selector: row => row.first_nft_image_256,
                format: row => <Img key={row.first_nft_image_256} url={row.first_nft_image_256}/>,
            },
            {
                name: 'Collection Name',
                selector: row => row.collection_name,
                sortable: true,
            },
            {
                name: 'Market Cap',
                selector: row => row.market_cap_quote,
                format: row => formatter.format(row.market_cap_quote),
                sortable: true,
            },
            {
                name: 'Unique Wallet Purchase Count',
                selector: row => row.unique_wallet_purchase_count_alltime,
                sortable: true,
            }
        ]

        return (
            <Container>
                <h1>Top NFT collections on Ethereum Component </h1>
                <DataTable
                    columns={columns}
                    data={nftData.data.items}
                    striped={true}
                />
            </Container>
        )
    }

}



export default TopNftCollections
