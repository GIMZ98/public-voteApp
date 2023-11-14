// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Voting{
    struct Candidate{
        string name;
        uint256 voteCount;
    }

    mapping(string => bool) public candidateExists;

    Candidate[] public candidates;
    Candidate[] public maxCandidates;

    address owner;
    mapping (address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    constructor(string[] memory _candidateNames, uint256 _durationInMinutes){
        for (uint256 i=0; i<_candidateNames.length; i++){
            candidates.push(
                Candidate({
                    name: _candidateNames[i],
                    voteCount: 0
                })
            );
            candidateExists[_candidateNames[i]] = true;
        }

        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes );
    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    function addCandidate(string memory _name) public {
        require(!candidateExists[_name], "Candidate with this name already existes!");
        candidates.push(
            Candidate({
                name: _name,
                voteCount: 0
            })
        );
        candidateExists[_name] = true;
    }

    function removeCandidate(string memory _name) public {
        require(candidateExists[_name], "No candidate existes with this name!");
        uint256 index = getCandidateIndex(_name);
        candidates[index] = candidates[candidates.length - 1];
        candidates.pop();
        delete candidateExists[_name];
    }

    function vote(string memory _candidateName) public{
        require(!voters[msg.sender], "You have already voted!");
        require(getRemainingTime() > 0, "Voting has ended!");
        require(!(getCandidateIndex(_candidateName)==999), "Candidate not exists!");

        uint256 index = getCandidateIndex(_candidateName);
        candidates[index].voteCount++;
        voters[msg.sender] = true;
    }

    // Returns array of candidates with votes
    function getAllVotesOfCandidates() public view returns (Candidate[] memory){
        return candidates;
    }

    // Returns true if voting is not end, else returns false
    function getVotingStatus() public view returns (bool){
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    // Returns remaining time
    function getRemainingTime() public view returns (uint256){
        require(block.timestamp >= votingStart, "Voting has not started yet!");
        if (block.timestamp >= votingEnd){
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function getLead() public returns (Candidate[] memory){

        uint256 maxVotes = 0;
        for (uint256 i=0; i<candidates.length; i++){
            if(candidates[i].voteCount == maxVotes){
                maxVotes = candidates[i].voteCount;
                maxCandidates.push(candidates[i]);
            }
            else if(candidates[i].voteCount > maxVotes){
                delete maxCandidates;
                maxVotes = candidates[i].voteCount;
                maxCandidates.push(candidates[i]);
            }
        }
        return maxCandidates;
    }

    function getCandidateIndex(string memory _name) public view returns (uint256){
        for (uint256 i=0; i<candidates.length; i++){
            if(keccak256(abi.encodePacked(candidates[i].name)) == keccak256(abi.encodePacked(_name))){
                return i;
            }
        }
        return 999;
    }

    function addTime(uint256 _durationInMinutes) public onlyOwner{

        votingEnd += (_durationInMinutes * 1 minutes );
    }

    function reduceTime(uint256 _durationInMinutes) public onlyOwner{
        votingEnd -= (_durationInMinutes * 1 minutes );
    }

}