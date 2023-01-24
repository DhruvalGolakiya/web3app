// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

 contract Lottery {
    address payable public owner;
    address[] public players;
    uint public ticketPrice;
    uint public totalTickets;
    uint public soldTickets;
    uint public winningNumber;
    address public winner;

    constructor(uint _totalTickets)  {
        owner = payable(msg.sender);
        totalTickets = _totalTickets;
        ticketPrice = 0 ether;
        console.log("Ticket price is",  ticketPrice  );
    }
    event TicketBought(address indexed _buyer, uint _ticketId);
    event WinnigNumber(uint indexed _number);
    function buyTicket() public payable {
        require(msg.value == ticketPrice, "Incorrect ticket price.");
        require(soldTickets == totalTickets, "All tickets have been sold.");
        players.push(msg.sender);
        soldTickets++;
        emit TicketBought(msg.sender, 1);
    }

    function generateWinningNumber() public {
        require(msg.sender == owner, "Only the owner can generate the winning number.");
        require(soldTickets <= totalTickets, "All tickets have not been sold.");
        winningNumber = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % totalTickets;
        emit WinnigNumber(winningNumber);
    }

    function claimPrize() public {
        require(msg.sender == winner, "You are not the winner.");
        payable(winner).transfer(address(this).balance);
    }

    function determineWinner() public {
        require(msg.sender == owner, "Only the owner can determine the winner.");
        for (uint i = 0; i < players.length; i++) {
            if (i == winningNumber) {
                winner = players[i];
                break;
            }
        }
    }
}