let compiler
let optimize = 1
let compiledContract

window.onload = function () {

  if (!BrowserSolc) {
    console.log('You have to load browser-solc.js in the page. We recommend using a <script> tag.')
    throw new Error()
  }

  BrowserSolc.getVersions(function (soljsonSources, soljsonReleases) {
    setVersion(soljsonReleases['0.4.25'])
    loadSolcVersion()
  })
}

function loadSolcVersion() {
  BrowserSolc.loadVersion(getVersion(), function (c) {
    compiler = c
  })

  addCompileEvent()
}

function getVersion() {
  return document.getElementById('versions').value
}

function setVersion(version) {
  document.getElementById('versions').value = version
}

function addCompileEvent() {
  const compileBtn = document.getElementById('contract-compile')
  compileBtn.addEventListener('click', solcCompile)
}

function solcCompile() {
  if (!compiler) return alert('Please select a compiler version.')

  compiledContract = compiler.compile(getSourceCode(), optimize)
  
  renderContractList()
}

function renderContractList() {
  var contractName = document.getElementById('contract-name').value
  const { contracts } = compiledContract

  Object.keys(contracts).forEach((contract) => {
    if (contract.substring(1, contract.length) == contractName) {    
      renderContractDetails(contracts[contract])
    }
    //else{
    //  alert(contract)
    //}
  })
}

function getSourceCode() {
  var compilerVersion = document.getElementById('versions').value
  var contractSymbol = document.getElementById('contract-symbol').value
  var contractName = document.getElementById('contract-name').value
  var contractDecimals = document.getElementById('contract-decimals').value
  var contractAmount = document.getElementById('contract-amount').value
  
  data2 = `contract ${contractName} is ERC20Interface, Owned, Pausable {
  using SafeMath for uint256;

  string public symbol;
  string public name;
  uint8 public decimals;
  uint256 _totalSupply;

  mapping(address => uint256) balances;
  mapping(address => mapping(address => uint256)) allowed;

  constructor() public {
    symbol = "${contractSymbol}";
    name = "${contractName}";
    decimals = ${contractDecimals};
    _totalSupply = ${contractAmount} * 10 ** uint256(decimals);
    balances[owner] = _totalSupply;
    emit Transfer(address(0), owner, _totalSupply);
  }`

  var part1 = data1
  var part2 = data2
  var part3 = data3
  var allParts = part1 + part2 + part3

  return allParts
}

function renderContractDetails(contract) {
  const contractContainer = document.getElementById('bytecode')
  contractContainer.innerHTML = `${contract.bytecode}`

  return contractContainer
}