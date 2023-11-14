import React, { useState, useEffect } from 'react'
import sepoliaLogo from '../assets/img/sepoliaLogo.png'
import $ from 'jquery'
import { ethers } from 'ethers'
import contractAbi from '../assets/contractAbi'
import { setAddress, selectAddress } from './addressSlicer'
import { useDispatch, useSelector } from 'react-redux'

const VoteContent = () => {
  const dispatch = useDispatch()
  const contractAddress = import.meta.env.VITE_BASE_CONTRACT_ADDRESS

  const [candidates, setCandidates] = useState(undefined)
  const [walletConnected, setWalletConnected] = useState(useSelector(selectAddress))

  const wallet1 = useSelector(selectAddress)
  //console.log('wallet: ', wallet1)

  useEffect(() => {
    $('input[type="radio"]').change(function() {
        $('label').addClass('bg-slate-200').removeClass('bg-slate-300');
        if ($(this).is(':checked')) {
            $(this).parent('label').addClass('bg-slate-300');
        }
    });
    const intervalId = setInterval(updateTimer, 1000);
    if(walletConnected!=0){
      $("#connectButton").removeClass("bg-blue-600").addClass("bg-green-500").text("Wallet connected");
      $("#metamaskNotification").html(`Metamask is connected ${walletConnected}`);

      const reload = async () => {
        var notConnectedElement = $("#NotConnected");
        notConnectedElement.text("fetching candidates...")
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const candidates_ = await contractInstance.getAllVotesOfCandidates();
        setCandidates(candidates_);
      }

      reload()
    }



    return () => {
      clearInterval(intervalId);
    };

  }, [])


  useEffect(() => {
    //console.log("candidates: ", candidates);
    if(candidates != undefined){
      //console.log("candidates: ", candidates);
      var notConnectedElement = $("#NotConnected");
      notConnectedElement.addClass("hidden");
      var candidatesDiv = $("#VoteCandidatesList");
      candidatesDiv.empty();
      //console.log("candidates div: ", candidatesDiv)
      for (let i=0; i<candidates.length; i++){
        //console.log('name: ', candidates[i].name, ' ,votes: ', parseInt((candidates[i].voteCount), 16));
        candidatesDiv.append(`
        <label class='flex justify-left w-full bg-slate-200 hover:bg-green-300 py-2 px-5 text-xl'>
          <input type="radio" name="voteFor" value="${candidates[i].name}" class='mr-5 w-6 text-xl'/>
            ${candidates[i].name}
        </label>
        <br />
        `);
      }
    }
  }, [candidates]);
  

  const connectMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const wallet_connected = await signer.getAddress();
    setWalletConnected(wallet_connected);
    dispatch(
      setAddress(
        {
          address: wallet_connected
        } 
      )
    )
    $("#metamaskNotification").html(`Metamask is connected ${wallet_connected}`);
    $("#connectButton").removeClass("bg-blue-600").addClass("bg-green-500").text("Wallet connected");
    var notConnectedElement = $("#NotConnected");
    notConnectedElement.text("fetching candidates...")
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const candidates_ = await contractInstance.getAllVotesOfCandidates();
    setCandidates(candidates_);
    //console.log(candidates_);
    var notConnectedElement = $("#NotConnected");
    notConnectedElement.text("Loading...")
  }

  const addVote = async() => {

    if (walletConnected !=0 ){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        var cand = $("#cand");
        cand.html("<span class='text-slate-500 font-bold'>Vote is adding!</span>");
        
        var errMsg = '';
        var selectedCandidate = $("input[name='voteFor']:checked").val();
          
        //console.log("selected candidate: " + selectedCandidate);

        if(selectedCandidate == undefined){
          if($("#VoteCandidatesList").text().trim() === ''){
            cand.html("<span class='text-slate-500 font-bold'>Please wait!</span>");
          }
          else{
            cand.html("<span class='text-red-500 font-bold'>Select a candidate!</span>");
          }
        }
  
        try{
            const tx = await contractInstance.vote(selectedCandidate);
            await tx.wait();
            cand.html("<span class='text-green-600 font-bold'>Voted successfully!</span>");
        }
        catch(err){
            //console.log("err:", err)
            if (err.error.message!=undefined){
              //console.log("err voting: ", err.error.message);
              errMsg = err.error.message;

              if(errMsg == 'execution reverted: You have already voted!'){
                cand.html("<span class='text-red-600 font-bold'>You have already voted!</span>");
              }
              else{
                  cand.html("Error Occured!");
              }
            }
            else if(err.error.code){
              //console.log("err code:", err.error.code)
              if(err.error.code == 'ACTION_REJECTED'){
              
              }
            }

        }
    }
    else{
        var status = $("#status");
        status.html("<span class='text-slate-500 font-bold'>Please connect to Metamask!</span>");
    }   
  }


  const voteStatus = async() => {
      var status = $("#status");
      if (walletConnected !=0 ){
          var remainingTime = $("#time");
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();


          const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
          const currentStatus = await contractInstance.getVotingStatus();
          const time = await contractInstance.getRemainingTime();
    
          
    
          currentStatus == 1 ? status.html("Voting is on Progress") : status.html("Voting is Ended!")
          //remainingTime.html(`)
          if(time/86400>0){
            remainingTime.html(`<span id="votingTime" class="hidden">${time}</span>Time Remains<br /> <span id="votingTimeDiv" class="text-green-600 font-bold">${Math.floor(time/86400)} Days</span>`)
          }
          else if(time/3600>0){
            remainingTime.html(`<span id="votingTime" class="hidden">${time}</span>Time Remains<br /> <span id="votingTimeDiv" class="text-green-600 font-bold">${Math.floor(time/3600)} Hours</span>`)
          }
          else if(time/60>0){
            remainingTime.html(`<span id="votingTime" class="hidden">${time}</span>Time Remains<br /> <span id="votingTimeDiv" class="text-green-600 font-bold">${Math.floor(time/60)} Minutes</span>`)
          }

          
          //getAllCandidates();
      }
      else{
          //var status = $("#status");
          status.html("<span class='text-slate-500 font-bold'>Please connect to Metamask!</span>");
      }
    }
    
    function updateTimer() {
      const timerElement = $("#votingTime");
      const timerDivElement = $("#votingTimeDiv")
      let seconds_ = parseInt(timerElement.text());
      seconds_--;
      timerElement.html(seconds_);
      const days = Math.floor(seconds_/86400)
      const sec_d = seconds_%86400
      const hours = Math.floor(sec_d/3600)
      const sec_h = sec_d%3600
      const minutes = Math.floor(sec_h/60)
      const sec_m = sec_h%60
      const seconds = sec_m

      timerDivElement.html(`${days} d - ${hours} h - ${minutes} m - ${seconds} s`)

      // if(seconds/86400>0){
      //   timerDivElement.html(`${Math.floor(seconds/86400)} Days`)
      // }
      // else if(seconds/3600>0){
      //   timerDivElement.html(`${Math.floor(seconds/3600)} Hours`)
      // }
      // else if(seconds/60>0){
      //   timerDivElement.html(`${Math.floor(seconds/60)} Minutes`)
      // }

    }

  return (
    <>
      <div className='mt-[80px]'>
        <div className="flex justify-center items-center my-[25px">
          <img src={sepoliaLogo} className="sm:h-[100px] h-[50px]"/>
          <p className="sm:text-3xl text-2xl font-mono text-center my-[25px] text-green-500">Sepolia Network</p>
        </div>

        <div className="ml-5 bg-slate-0 text-center">
            <button id='connectButton' onClick={connectMetamask} className="md:text-2xl bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-800 hover:font-bold my-5">Connect Metamask</button>
            <p id="metamaskNotification" className="text-green-500 font-bold sm:text-xl text-sm"></p>
        </div>

        <div className="flex flex-col bg-slate-0 items-center my-[50px]">
            <p className="md:text-3xl text-xl md:mb-5  font-bold text-slate-500">Vote here</p>
            <div id="NotConnected" className='  bg-slate-400 p-5 text-white md:text-3xl'>Please connect metamask to get Candidates</div>

            <div id="VoteCandidatesList" className=' flex flex-col bg-slate-200 md:w-[800px] w-full'>

            </div>

            <button id='voteButton' onClick={addVote} className="md:text-2xl bg-blue-600 text-white p-3 px-[50px] rounded-2xl hover:bg-blue-800 hover:font-bold my-2">Vote</button>
            <p id="cand" className='md:text-2xl'></p>
        </div>

        <div className="flex flex-col bg-slate-0 items-center my-[50px]">
            <button onClick={voteStatus} className="md:text-2xl bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-800 hover:font-bold">Check Voting Status</button>
            <p id="status" className='text-slate-600 md:text-2xl mt-5'></p>
            <p id="time" className='md:text-3xl sm:text-[20px] text-[16px]'></p>
        </div>
      </div>
    </>
  )
}

export default VoteContent
