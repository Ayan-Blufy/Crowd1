 //SPDX-License-Identifier: UNLICENSED
 pragma solidity >= 0.5.0 < 0.9.0;



 contract crowdfunding{


     address public manager;
    uint public raisedAmount;
    uint public noOfContributors;
    uint public minimumContribution;
    uint public numRequest;

    struct Voter{
        bool voted;
        uint Amount;
    }


    struct Request{
        string title;
    string description;
    string image;
    address recipient;
    uint target;
    bool completed;
    uint noOfVoters;
    mapping(address=>bool) voters;
}
    mapping(uint=>Request) public requests;
    mapping(address=>Voter) public contributers;

     constructor(){
        manager=msg.sender;
        minimumContribution=10;
     }



    event RequestCreated(uint requestNo,string title,string description,string image,address recipient,uint Amount,uint voters,bool completed,uint indexed timestamp);
    event RequestPaid(string description,string image,address recipient,uint target,uint noOfVoters,uint indexed timestamp);
    event Transcations(address indexed contributer,uint indexed Amount,uint indexed timestamp);


    modifier onlyManager(){
      require(msg.sender==manager,"Only manager can call this function");
      _;

     } 
     function sendEth() public payable{
         if(contributers[msg.sender].Amount==0)
         {
             noOfContributors++;
             contributers[msg.sender].voted=false;
         }
         raisedAmount+=msg.value;
         contributers[msg.sender].Amount+=msg.value;

        emit Transcations(msg.sender,msg.value,block.timestamp);
         
     }


    function vaildForRefund() public view returns(bool)
    {
        if(contributers[msg.sender].voted==false)
        {
            return true;
        }

        return false;
    }

    function getAmountDonted() public view returns(uint)
    {
        return contributers[msg.sender].Amount;
    }


     function getBalance() public view returns(uint){
         return address(this).balance;
     }

     function getRefund() public {

         require(contributers[msg.sender].Amount>minimumContribution && contributers[msg.sender].voted==false,"You are not eligible for refund");

        address payable recipient=payable(msg.sender);

        recipient.transfer(contributers[recipient].Amount);
        raisedAmount-=contributers[recipient].Amount;
        contributers[recipient].Amount=0;
        noOfContributors--;

       
     }

    function checkCompleted(uint requestNo) public view returns(bool){
     Request storage newRequest=requests[requestNo];
     if(newRequest.completed==false)
     {
         return false;
     }
    
    return true;

        
    }


    function createRequest(string memory _title,string memory _description,string memory _image,address _recipient,uint value) public onlyManager{
   
   require(_recipient!=manager,"this recipient is not allowed");
   require(raisedAmount>value,"Amount for request is too high");
    Request storage newRequest=requests[numRequest];
    numRequest++;
    newRequest.title=_title;
    newRequest.description=_description;
    newRequest.image=_image;
    newRequest.recipient=_recipient;
    newRequest.target=value;
    newRequest.completed=false;
    newRequest.noOfVoters=0;


    emit RequestCreated( numRequest-1,_title,_description,_image,_recipient,value,newRequest.noOfVoters,newRequest.completed,block.timestamp);

    }


    function makePayment(uint _requestNo) public onlyManager{
    
    Request storage thisRequest=requests[_requestNo];
    require( raisedAmount>thisRequest.target,"Sorry we don't have enough money");
    require(thisRequest.completed==false,"This request is completed");
    require(thisRequest.noOfVoters>noOfContributors/2);

    address payable to=payable(thisRequest.recipient);
    to.transfer(thisRequest.target);
    thisRequest.completed=true;
    raisedAmount-=thisRequest.target;
     

    emit RequestPaid(thisRequest.description,thisRequest.image,thisRequest.recipient,thisRequest.target,thisRequest.noOfVoters,block.timestamp);

}

    function makeVote(uint requestNo) public
    {
        require(contributers[msg.sender].Amount>minimumContribution,"You cannot Vote");
        Request storage thisrequest=requests[requestNo];
        require(thisrequest.voters[msg.sender]==false,"You have already voted");
        require(thisrequest.completed==false,"This request is completed");
        contributers[msg.sender].voted=true;
        thisrequest.voters[msg.sender]=true;
        thisrequest.noOfVoters+=1;

    }

 }