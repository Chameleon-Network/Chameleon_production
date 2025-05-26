pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TestToken
 * @dev ERC20 Token đơn giản để thử nghiệm với các contract khác.
 * Chứa các chức năng tiêu chuẩn của ERC20 và thêm chức năng mint token.
 */
contract TestToken is ERC20, Ownable {
    // Decimals cho token (tipically 18 tương tự ETH)
    uint8 private _decimals = 18;

    /**
     * @dev Khởi tạo contract và mint cho người deploy số lượng token ban đầu
     * @param name Tên của token
     * @param symbol Ký hiệu của token
     * @param initialSupply Số lượng token khởi tạo
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public ERC20(name, symbol) {
        _setupDecimals(_decimals);

        // Mint số lượng token ban đầu cho người deploy
        _mint(msg.sender, initialSupply * (10 ** uint256(_decimals)));
    }

    /**
     * @dev Cho phép owner mint thêm token
     * @param to Địa chỉ nhận token
     * @param amount Số lượng token cần mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Đốt token của người gọi
     * @param amount Số lượng token cần đốt
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
