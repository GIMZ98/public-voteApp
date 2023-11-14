import { useEffect, useState } from 'react'
import $ from 'jquery'
import { ethers } from 'ethers'
import contractAbi from '../assets/contractAbi'
import { selectAddress } from './addressSlicer'
import { useSelector } from 'react-redux'

const StatusContent = () => {

  const contractAddress = import.meta.env.VITE_BASE_CONTRACT_ADDRESS
  const walletConnected = useSelector(selectAddress)
  const [candidates, setCandidates] = useState(undefined)

  //console.log("StatusContent walletConnected: ", walletConnected)

  if (walletConnected==0){
    $("#metamaskNotification").html(`Please connect to metamask`).removeClass("text-green-500").addClass("text-slate-500")
  }
  if (walletConnected!=0){
    $("#metamaskNotification").html(`Metamask is connected ${walletConnected}`).addClass("text-green-500").removeClass("text-slate-500")
  }


  useEffect(() => {
    const intervalId = setInterval(updateTimer, 1000);
    if(walletConnected!=0){
      displayCandidates();
      displayStatus();
      $("#connectButton").removeClass("bg-blue-600").addClass("bg-green-500").text("Wallet connected");
      $("#metamaskNotification").html(`Metamask is connected ${walletConnected}`).addClass("text-green-500").removeClass("text-slate-500") 
      var notConnectedElement = $("#NotConnected");
      notConnectedElement.text("Loading current results...")  
    }
    else{
        $("#metamaskNotification").html(`Please connect to metamask`).removeClass("text-green-500").addClass("text-slate-500")   
         
    }

    return () => {
      clearInterval(intervalId);
    };
    }, [])

    useEffect(() => {
        //console.log("candidates: ", candidates);
        if(candidates != undefined){
            var notConnectedElement = $("#NotConnected");
            notConnectedElement.removeClass("block").addClass("hidden");
            var candidatesDiv = $("#CandidatesTable");
            
            candidatesDiv.removeClass("hidden").addClass("block");
            $("#CandidatesList").empty();
            for (let i=0; i<candidates.length; i++){
                //console.log('name: ', candidates[i].name, ' ,votes: ', parseInt((candidates[i].voteCount), 16));
                candidatesDiv.append(`
                <div class='flex text-slate-800 md:text-2xl font-bold bg-blue-300'>
                <div class='md:w-[450px] w-2/3 py-5 pl-10'>${candidates[i].name}</div>
                <div class='md:w-[450px] w-1/3 py-5 pl-10'>${candidates[i].voteCount}</div>
                </div>
                `);
            }
        }
      }, [candidates]);

  //   $("#metamaskNotification").html(`Metamask is connected ${WALLET_CONNECTED}`);
  //   $("#connectButton").removeClass("bg-blue-600").addClass("bg-green-500").text("Wallet connected");

  const displayCandidates = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    var candidates_ = await contractInstance.getAllVotesOfCandidates();
    setCandidates(candidates_)
    var notConnectedElement = $("#NotConnected");
    notConnectedElement.text("Loading current results...")
  }

  const displayStatus = async() => {
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
        if(time/86400>0){
            remainingTime.html(`<span id="votingTime" class="hidden">${time}</span>Time Remains<br /> <span id="votingTimeDiv" class="text-green-600 font-bold">${Math.floor(time/86400)} Days</span>`)
          }
          else if(time/3600>0){
            remainingTime.html(`<span id="votingTime" class="hidden">${time}</span>Time Remains<br /> <span id="votingTimeDiv" class="text-green-600 font-bold">${Math.floor(time/3600)} Hours</span>`)
          }
          else if(time/60>0){
            remainingTime.html(`<span id="votingTime" class="hidden">${time}</span>Time Remains<br /> <span id="votingTimeDiv" class="text-green-600 font-bold">${Math.floor(time/60)} Minutes</span>`)
          }
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
  }

  return (
    <>
     <div className="h-[50px] text-3xl font-bold text-center my-[25px]">
        Welcome!
    </div>

    <div className="ml-5 bg-slate-0 text-center">
        <p id="metamaskNotification" className="text-slate-500 font-bold sm:text-xl text-sm"></p>
    </div>

    <div className="flex flex-col bg-slate-0 items-center my-[50px]">
        <p className="md:text-3xl text-xl md:mb-5 font-bold text-slate-500">Current Voting Results</p>
        <div id="NotConnected" className='block bg-slate-400 p-5 text-white md:text-3xl mt-10'>Please connect metamask to get Current results</div>

        <div id="CandidatesTable" className='hidden flex-col md:w-[900px] w-full mt-8'>
            <div className='flex text-white md:text-2xl font-bold bg-blue-800'>
                <div className='md:w-[450px] w-2/3 py-5 pl-10'>Candidate</div>
                <div className='md:w-[450px] w-1/3 py-5 pl-10'>Votes</div>
            </div>
            <div id='CandidatesList'></div>
        </div>
    </div>

    <div className="flex flex-col bg-slate-0 items-center my-[50px]">
        <p id="status" className='text-slate-600 md:text-2xl mt-5'></p>
        <p id="time" className='md:text-3xl sm:text-[20px] text-[16px]'></p>
    </div>
    </>
  )
}

export default StatusContent; 