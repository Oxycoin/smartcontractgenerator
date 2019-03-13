var data1 = `pragma solidity ^0.4.25;

library SafeMath {
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
      c = a + b;
      require(c >= a);
  }
  function sub(uint256 a, uint256 b) internal pure returns (uint256 c) {
      require(b <= a);
      c = a - b;
  }
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
      c = a * b;
      require(a == 0 || c / a == b);
  }
  function div(uint256 a, uint256 b) internal pure returns (uint256 c) {
      require(b > 0);
      c = a / b;
  }
}

contract ERC20Interface {
  function totalSupply() public constant returns (uint256);
  function balanceOf(address tokenOwner) public constant returns (uint256 balance);
  function allowance(address tokenOwner, address spender) public constant returns (uint256 remaining);
  function transfer(address to, uint256 tokens) public returns (bool success);
  function approve(address spender, uint256 tokens) public returns (bool success);
  function transferFrom(address from, address to, uint256 tokens) public returns (bool success);

  event Transfer(address indexed from, address indexed to, uint256 tokens);
  event Approval(address indexed tokenOwner, address indexed spender, uint256 tokens);
  event Burn(address indexed from, uint256 value);
}

contract Owned {
  address public owner;
  address public newOwner;

  event OwnershipTransferred(address indexed from, address indexed _to);

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address _newOwner) public onlyOwner {
    newOwner = _newOwner;
  }

  function acceptOwnership() public {
    require(msg.sender == newOwner);
    owner = newOwner;
    newOwner = address(0);
    emit OwnershipTransferred(owner, newOwner);
  }
}

contract Pausable is Owned {
  event Pause();
  event Unpause();

  bool public paused = false;

  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  modifier whenPaused() {
    require(paused);
    _;
  }

  function pause() onlyOwner whenNotPaused public {
    paused = true;
    emit Pause();
  }

  function unpause() onlyOwner whenPaused public {
    paused = false;
    emit Unpause();
  }
}

`