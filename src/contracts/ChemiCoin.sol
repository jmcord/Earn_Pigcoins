
pragma solidity ^0.8.4;


// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract ChemiCoin is ERC20, Ownable {


    //uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // Max total supply of Chemicoins
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public rewardsBalance;
    mapping(address => uint256) public lastRewardClaimTime;

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);
    event RewardClaimed(address indexed staker, uint256 amount);
    // Evento para registrar la compra de tokens
    event TokensPurchased(address buyer, uint256 amount, uint256 tokensReceived);

    constructor() ERC20('PigCoin', 'PIG') {
    
        _mint(address(this), 10000 * 10**18);
    }

    // Visualizacion del balance de tokens ERC-20 de un usuario
    function balanceTokens(address _account) public view returns (uint256){
        return balanceOf(_account);
    }
    
        // Visualizacion del balance de tokens ERC-20 del Smart Contract
    function balanceTokensSC() public view returns (uint256){
        return balanceOf(address(this));
    }

    function mint(address to, uint256 amount) external onlyOwner {
        //require((totalSupply() + amount) <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit Mint(to, amount);
    }

    function burn(uint256 amount) external payable {
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    // Función para que los usuarios compren tokens
    function buyTokens(uint256 tokensToBuy) public payable {
        require(tokensToBuy > 0, "tokensToBuy must be greater than 0");

        // Calcular el monto de ETH necesario para comprar los tokens (0.01 ETH por token)
        uint256 amount = tokensToBuy * 1 ether / 100;

        // Verificar si se ha enviado suficiente ETH
        require(msg.value >= amount, "Insufficient ETH sent");

        // Transferir ETH al contrato
        payable(address(this)).transfer(amount);

        // Transferir tokens al comprador
        _transfer(address(this), msg.sender, tokensToBuy);
    }

    // Función para que los usuarios compren tokens
    function buyTokens2() public payable {
        // Calcular el monto de ETH necesario para comprar un token (0.01 ETH por token)
        uint256 tokenPrice = 0.01 ether;
    
        // Calcular la cantidad de tokens que se comprarán en función del valor de msg.value
        uint256 tokensToBuy = msg.value / tokenPrice;
    
        // Verificar si se ha enviado suficiente ETH para comprar al menos un token
        require(tokensToBuy > 0, "Insufficient ETH sent");

        // Transferir tokens al comprador
        _transfer(address(this), msg.sender, tokensToBuy);
    }

    // Función para que los usuarios compren tokens
    function buyTokens3() external payable {
        // Obtiene el monto de ETH enviado por el comprador
        uint256 ethAmount = msg.value;
    
        // Calcula la cantidad de tokens a recibir (por ejemplo, 1 ETH = 100 tokens)
        uint256 tokenAmount = ethAmount * 100; // Suponiendo que 1 ETH equivale a 100 tokens

        // Transfiere los tokens al comprador
        payable(msg.sender).transfer(tokenAmount);

        // Emite el evento
        emit TokensPurchased(msg.sender, ethAmount, tokenAmount);
    }

      function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        // Actualizar el tiempo del último stake del 'msg.sender'
        lastRewardClaimTime[msg.sender] = block.timestamp;
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + amount; //.add(amount);
        _transfer(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

function unstake(uint256 amount) external {
    require(amount > 0, "Amount must be greater than 0");
    require(stakingBalance[msg.sender] >= amount, "Insufficient staked balance");
    
    // Restar la cantidad 'amount' del balance de staking del 'msg.sender'
    stakingBalance[msg.sender] -= amount;
    
    // Transferir la cantidad 'amount' de tokens desde el contrato al 'msg.sender'
    _transfer(address(this), msg.sender, amount);
    
    emit Unstaked(msg.sender, amount);
}

uint256 constant public APY = 10; // 10% APY

// Función para reclamar recompensa
function claimReward() external {
    require(lastRewardClaimTime[msg.sender] != 0, "No reward available");
    
    uint256 timeElapsed = block.timestamp - lastRewardClaimTime[msg.sender];
    uint256 reward = stakingBalance[msg.sender] * timeElapsed * APY / (365 days); // Calcular recompensa basada en tiempo y APY
    rewardsBalance[msg.sender] += reward;
    lastRewardClaimTime[msg.sender] = block.timestamp; // Actualizar el tiempo de la última reclamación
    
    emit RewardClaimed(msg.sender, reward);
}

// Función para retirar recompensa
function withdrawReward() public payable {
    require(stakingBalance[msg.sender] > 0, "No rewards to withdraw");
    require(block.timestamp > lastRewardClaimTime[msg.sender], "No rewards to withdraw");
    uint256 reward = calculateReward(msg.sender);
    rewardsBalance[msg.sender] = 0;
    payable(msg.sender).transfer(reward);
}

function calculateReward(address account) public view returns (uint256) {
    uint256 timeElapsed = block.timestamp - lastRewardClaimTime[msg.sender];
    uint256 reward = (stakingBalance[account] * APY * timeElapsed) / (365 * 24 * 60 * 60 * 100); // APY * timeElapsed / 365 days
    return reward;
}

    // Función para obtener el saldo de tokens en staking de un usuario
    function getStakingBalance(address account) public view returns (uint256) {
        return stakingBalance[account];
    }

    // Función para obtener el saldo de recompensas acumuladas de un usuario
    function getRewardsBalance(address account) public view returns (uint256) {
        return rewardsBalance[account];
    }
    
    receive() external payable {
        // Función de respaldo para aceptar Ether
    }

}
