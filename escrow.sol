// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address payable public buyer;
    address payable public seller;
    address public arbiter;
    uint256 public amount;
    bool public buyerApproved;
    bool public sellerApproved;

    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        REFUNDED
    }
    State public currentState;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only the buyer can call this function");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only the seller can call this function");
        _;
    }

    modifier onlyArbiter() {
        require(
            msg.sender == arbiter,
            "Only the arbiter can call this function"
        );
        _;
    }

    modifier inState(State _state) {
        require(currentState == _state, "Invalid state");
        _;
    }

    event PaymentDeposited(address depositor, uint256 amount);
    event ApprovedByBuyer();
    event ApprovedBySeller();
    event Refunded(address refundRecipient, uint256 amount);

    constructor(address _buyer, address _seller, address _arbiter) {
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        currentState = State.AWAITING_PAYMENT;
    }

    function deposit() external payable inState(State.AWAITING_PAYMENT) {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        require(msg.sender == buyer, "Only the buyer can deposit funds");

        amount = msg.value;
        currentState = State.AWAITING_DELIVERY;

        emit PaymentDeposited(msg.sender, msg.value);
    }

    function approveByBuyer()
        external
        onlyBuyer
        inState(State.AWAITING_DELIVERY)
    {
        buyerApproved = true;
        emit ApprovedByBuyer();

        if (sellerApproved) {
            currentState = State.COMPLETE;
            // Transfer funds to the seller
            (bool success, ) = seller.call{value: amount}("");
            require(success, "Failed to transfer funds to the seller");
        }
    }

    function approveBySeller()
        external
        onlySeller
        inState(State.AWAITING_DELIVERY)
    {
        sellerApproved = true;
        emit ApprovedBySeller();

        if (buyerApproved) {
            currentState = State.COMPLETE;
            // Transfer funds to the seller
            (bool success, ) = seller.call{value: amount}("");
            require(success, "Failed to transfer funds to the seller");
        }
    }

    function refundBuyer()
        external
        onlyArbiter
        inState(State.AWAITING_DELIVERY)
    {
        currentState = State.REFUNDED;
        // Refund the funds to the buyer
        (bool success, ) = buyer.call{value: amount}("");
        require(success, "Failed to refund the buyer");

        emit Refunded(buyer, amount);
    }
}
