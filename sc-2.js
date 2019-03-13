var data3 = `

  modifier onlyPayloadSize(uint256 numWords) {
    assert(msg.data.length >= numWords * 32 + 4);
    _;
  }
    
 /**
  * @dev function to check whether passed address is a contract address
  */
    function isContract(address _address) private view returns (bool is_contract) {
      uint256 length;
      assembly {
      //retrieve the size of the code on target address, this needs assembly
        length := extcodesize(_address)
      }
      return (length > 0);
    }
    
  /**
  * @dev Total number of tokens in existence
  */
    function totalSupply() public view returns (uint256) {
      return _totalSupply;
    }
    
    
 /**
  * @dev Gets the balance of the specified address.
  * @param tokenOwner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */

  function balanceOf(address tokenOwner) public view returns (uint256 balance) {
    return balances[tokenOwner];
  }


 /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param tokenOwner address The address which owns the funds.
   * @param spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(address tokenOwner, address spender) public view returns (uint256 remaining) {
    return allowed[tokenOwner][spender];
  }
    
    
 /**
  * @dev Transfer token for a specified address
  * @param to The address to transfer to.
  * @param tokens The amount to be transferred.
  */
  function transfer(address to, uint256 tokens) public whenNotPaused onlyPayloadSize(2) returns (bool success) {
    require(to != address(0));
    require(tokens > 0);
    require(tokens <= balances[msg.sender]);
    balances[msg.sender] = balances[msg.sender].sub(tokens);
    balances[to] = balances[to].add(tokens);
    emit Transfer(msg.sender, to, tokens);
    return true;
  }
 /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * @param spender The address which will spend the funds.
   * @param tokens The amount of tokens to be spent.
   */
  function approve(address spender, uint256 tokens) public whenNotPaused onlyPayloadSize(2) returns (bool success) {
    require(spender != address(0));
    allowed[msg.sender][spender] = tokens;
    emit Approval(msg.sender, spender, tokens);
    return true;
  }

    
 /**
   * @dev Transfer tokens from one address to another
   * @param from address The address which you want to send tokens from
   * @param to address The address which you want to transfer to
   * @param tokens uint256 the amount of tokens to be transferred
   */
    function transferFrom(address from, address to, uint256 tokens) public whenNotPaused onlyPayloadSize(3) returns (bool success) {
        require(tokens > 0);
        require(from != address(0));
        require(to != address(0));
        require(allowed[from][msg.sender] > 0);
        require(balances[from]>0);
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
 

 /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   */
    function burn(uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] = balances[msg.sender].sub(_value);
        _totalSupply =_totalSupply.sub(_value);
        emit Burn(msg.sender, _value);
        return true;
    }
  
  /**
   * @dev Burns a specific amount of tokens from the target address and decrements allowance
   * @param from address The address which you want to send tokens from
   * @param _value uint256 The amount of token to be burned
   */
    function burnFrom(address from, uint256 _value) public returns (bool success) {
        require(balances[from] >= _value);
        require(_value <= allowed[from][msg.sender]);
        balances[from] = balances[from].sub(_value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(_value);
        _totalSupply = _totalSupply.sub(_value);
        emit Burn(from, _value);
        return true;
    }
 /**
   * @dev Function to mint tokens
   * @param target The address that will receive the minted tokens.
   * @param mintedAmount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
    function mintToken(address target, uint256 mintedAmount) onlyOwner public  returns (bool) {
        require(mintedAmount > 0);
        require(target != address(0));
        balances[target] = balances[target].add(mintedAmount);
        _totalSupply = _totalSupply.add(mintedAmount);
        emit Transfer(owner, target, mintedAmount);
        return true;
    }

    function () public payable {
        revert();
    }
    
    
/**
   * @dev Function to transfer any ERC20 token  to owner address which gets accidentally transferred to this contract
   * @param tokenAddress The address of the ERC20 contract
   * @param tokens The amount of tokens to transfer.
   * @return A boolean that indicates if the operation was successful.
   */
    function transferAnyERC20Token(address tokenAddress, uint256 tokens) public onlyOwner returns (bool success) {
        require(tokenAddress != address(0));
        require(isContract(tokenAddress));
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
}`