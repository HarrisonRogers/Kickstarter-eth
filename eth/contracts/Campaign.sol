// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum, string memory title, string memory description) public {
        address newCampaign = address(new Campaign(minimum, msg.sender, title, description));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
   
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
    }

    // variables
    address public manager;
    string public campaignTitle;
    string public campaignDescription;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    mapping(uint => mapping(address => bool)) public approvedAddresses;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager, "Caller is not the manager");
        _;
    }

    constructor(uint minimum, address creator, string memory title, string memory description) {
        manager = creator;
        minimumContribution = minimum;
        campaignTitle = title;
        campaignDescription = description;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Minimum contribution is not matched");

        // Turn the user address to true so they are now a "approver"
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        // Create a new Request in storage
        Request storage newRequest = requests.push();

        // Initialize the new request
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]);
        require(!approvedAddresses[index][msg.sender]);

        approvedAddresses[index][msg.sender] = true;
        requests[index].approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2), "Not enough approvals");
        require(!request.complete, "Request already finalized");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function getDetails() public view returns (
        string memory title,
        string memory description,
        uint minimumContributionAmount,
        uint balance,
        address managerAddress,
        uint requestsCount,
        uint campaignApproversCount
    ) {
        return (
            campaignTitle,
            campaignDescription,
            minimumContribution,
            address(this).balance,
            manager,
            requests.length,
            approversCount
        );
    }
}

