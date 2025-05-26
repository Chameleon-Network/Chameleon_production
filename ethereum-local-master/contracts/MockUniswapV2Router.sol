pragma solidity ^0.6.12;

contract MockUniswapV2Router {
    address private constant _WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // Giả địa chỉ WETH

    function factory() external pure returns (address) {
        return address(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // Giả địa chỉ Factory
    }

    function WETH() external pure returns (address) {
        return _WETH;
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
        // Mock implementation
        uint[] memory result = new uint[](path.length);
        result[0] = amountIn;
        result[1] = amountIn * 2; // Giả định output là gấp đôi input
        return result;
    }

    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts) {
        // Mock implementation
        uint[] memory result = new uint[](path.length);
        result[0] = msg.value;
        result[1] = msg.value * 2; // Giả định output là gấp đôi input
        return result;
    }

    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
        // Mock implementation
        uint[] memory result = new uint[](path.length);
        result[0] = amountIn;
        result[1] = amountIn * 2; // Giả định output là gấp đôi input
        return result;
    }

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts) {
        // Mock implementation
        uint[] memory result = new uint[](path.length);
        result[0] = amountIn;
        result[1] = amountIn * 2; // Giả định output là gấp đôi input
        return result;
    }
}
