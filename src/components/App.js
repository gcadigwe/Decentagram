import React, { useState,useEffect } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const App = () => {
  const [account,setAccount] = useState('')
  const [loading,setLoading] = useState(true)
  const [decentragram, setDecentragram] = useState(null)
  const [images, setImages] = useState([])
  const [imagesCount,setImagesCount] = useState(0)
  const [buffer, setBuffer] = useState(null)

  useEffect(()=>{
     loadWeb3()
     loadBlockchainData()
  },[])

  const loadWeb3 = async() => {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else {
      window.alert("Non-Ethereum browser detected. You should consider trying metamask!")
    }
  }

  const loadBlockchainData = async () => {
    const web3 = await window.web3

    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    console.log(accounts)

    const networkId = await web3.eth.net.getId()

    const networkData = Decentragram.networks[networkId]

    if(networkData){
      const decentragram = web3.eth.Contract(Decentragram.abi, networkData.address)
      console.log(decentragram)
      setDecentragram(decentragram)

      const ImageCount = await decentragram.methods.imageCount.call()
      console.log("Image Count,",ImageCount.toNumber())
      setImagesCount(ImageCount.toNumber())
      setLoading(false)

      for(var i =1; i <= ImageCount; i++){
        const image = await decentragram.methods.images(i).call()
        setImages([...images, image])
      }


    }else{
      window.alert("Decentragram network has not been deployed")
    }

  }

   const captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      const bufferFile = Buffer(reader.result)
      setBuffer(bufferFile)
    }
  }

   const uploadImage = description => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

      setLoading(true)
        decentragram.methods.uploadImage(result[0].hash, description).send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false)
      })
    })
  }

  const tipImageOwner = (id, tipAmount) => {
    setLoading(true)
    decentragram.methods.tipImageOwner(id).send({from: account, value: tipAmount}).on('transactionHash',(hash) => {
      setLoading(false)
    })
  }





  return (
    <>
      
      <Navbar account={account} />
      {loading ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
      :  <Main captureFile={captureFile} tipImageOwner={tipImageOwner} uploadImage={uploadImage} images={images} />
      }
    </>
    )
}

export default App;