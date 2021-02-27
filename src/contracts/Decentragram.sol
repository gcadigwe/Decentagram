pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "Decentragram";
  uint public imageCount = 0;



  //store images
  mapping(uint => Images) public images; 

    struct Images {
  	uint id;
  	string hash;
  	string description;
  	uint tipAmount;
  	address payable author;
  }

  event ImageCreated(
  	uint id,
  	string hash,
  	string description,
  	uint tipAmount,
  	address payable author

  	);


  //create images

  function uploadImage(string memory _imghash, string memory _imgdesc) public {
  	require(bytes(_imghash).length > 0);
  	require(bytes(_imgdesc).length > 0);
  	require(msg.sender != address(0x0));
  	imageCount++;

  	//check if hash and description is > 0
  

  	//add images to mapping
  	images[imageCount] = Images(imageCount,_imghash,_imgdesc,0,msg.sender);

  	 //emitting event
  	emit ImageCreated(imageCount,_imghash,_imgdesc,0,msg.sender);


  }


  //tip images


}