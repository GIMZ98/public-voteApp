const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting;
  let voting;
  let owner;
  let addr1;

  beforeEach(async function () {
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1] = await ethers.getSigners();
    voting = await Voting.deploy(["NAM", "GIM"], 50); // 50 minutes duration
    await voting.deployed();
    
  });

  it("Should initialize with correct candidates and duration", async function () {
    const candidates = await voting.getAllVotesOfCandidates();
    expect(candidates[0].name).to.equal("NAM");
    expect(candidates[1].name).to.equal("GIM");

    const votingStatus = await voting.getVotingStatus();
    expect(votingStatus).to.equal(true);

    const remainingTime = await voting.getRemainingTime();
    //console.log("remainingTime: ", parseInt(remainingTime))
    expect(parseInt(remainingTime)).to.be.above(0);
  });

  it("Should allow adding a new candidate by owner", async function () {
    let candidate = "biz";
    await voting.connect(owner).addCandidate(candidate.toUpperCase());
    const candidates = await voting.getAllVotesOfCandidates();
    //console.log("candidates b: ", candidates);

    expect(candidates[2].name).to.equal("BIZ");

  });

  it("Should be reverted by adding same candidate name twice", async function () {
    let candidate = "biz";
    await voting.connect(owner).addCandidate("BIZ");
    await expect(voting.connect(owner).addCandidate("BIZ")).to.be.revertedWith("Candidate with this name already existes!");
  });

  it("Should allow voting and update vote count", async function () {
    await voting.connect(addr1).vote("GIM");
    const candidates = await voting.getAllVotesOfCandidates();
    //console.log("candidates v: ", candidates);
    //console.log("candidates[0].voteCount: ", parseInt(candidates[0].voteCount));
    expect(parseInt(candidates[1].voteCount)).to.equal(1);

    // Try to vote again, should fail
    await expect(voting.connect(addr1).vote("GIM")).to.be.revertedWith("You have already voted!");
    //await assert(voting.connect(addr1).vote(0)).to.equal("You have already voted!");
  });

  it("Should delete a candidate by owner", async function () {
    await voting.connect(owner).addCandidate("GIZ");
    await voting.connect(owner).removeCandidate("GIZ");
    await expect(voting.connect(addr1).vote("GIZ")).to.be.revertedWith("Candidate not exists!");
  });

  it("Should prevent voting after the end of the voting period", async function () {

    // Fast-forward time to end the voting period
    await ethers.provider.send("evm_increaseTime", [61 * 60]); // 61 minutes
    await ethers.provider.send("evm_mine", []);

    const votingStatus = await voting.getVotingStatus();
    //console.log("votingStatus: ", votingStatus);
    expect(votingStatus).to.equal(false);

    // console.log("After increase time using evm_increaseTime");
    // const remainingTime2 = await voting.getRemainingTime();
    // console.log("remainingTime: ", parseInt(remainingTime2));

    // Try to vote after the end of the voting period, should fail
    await expect(voting.connect(addr1).vote(0)).to.be.revertedWith("Voting has ended!");

    // try{
    //   await voting.connect(addr1).vote(0);
    // }
    // catch(err){
    //   console.log("err: ", err.message);
    // }
  });


  it("should show remaining time", async function () {
    await voting.connect(owner).addTime(20)
    await voting.connect(owner).reduceTime(20)
    
    const remainingTime = await voting.connect(addr1).getRemainingTime()
    console.log("Remaining time: ", remainingTime)
  });
});