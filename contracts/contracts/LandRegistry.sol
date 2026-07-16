// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LandRegistry
 * @dev Demo land registry: register parcels, transfer ownership, query history.
 */
contract LandRegistry is ReentrancyGuard {
    struct OwnershipRecord {
        address owner;
        uint256 timestamp;
        bytes32 transferHash;
        bytes32 metadataHash;
        bytes32 gpsHash;
        bool isActive;
    }

    struct LandParcel {
        bytes32 parcelId;
        address currentOwner;
        bytes32 gpsHash;
        bytes32 metadataHash;
        uint256 registrationDate;
        uint256 lastTransferDate;
        bool exists;
    }

    event LandRegistered(
        bytes32 indexed parcelId,
        address indexed owner,
        bytes32 gpsHash,
        bytes32 metadataHash,
        uint256 timestamp
    );

    event OwnershipTransferred(
        bytes32 indexed parcelId,
        address indexed previousOwner,
        address indexed newOwner,
        bytes32 transferHash,
        uint256 timestamp
    );

    mapping(bytes32 => LandParcel) private parcels;
    mapping(bytes32 => OwnershipRecord[]) private ownershipHistory;
    mapping(address => bytes32[]) private ownerParcels;

    uint256 public totalParcels;

    modifier parcelExists(bytes32 parcelId) {
        require(parcels[parcelId].exists, "Parcel does not exist");
        _;
    }

    modifier onlyOwner(bytes32 parcelId) {
        require(parcels[parcelId].currentOwner == msg.sender, "Not parcel owner");
        _;
    }

    function registerLand(
        bytes32 parcelId,
        bytes32 gpsHash,
        bytes32 metadataHash
    ) external nonReentrant {
        require(!parcels[parcelId].exists, "Parcel already registered");
        require(parcelId != bytes32(0), "Invalid parcel ID");
        require(gpsHash != bytes32(0), "Invalid GPS hash");
        require(metadataHash != bytes32(0), "Invalid metadata hash");

        parcels[parcelId] = LandParcel({
            parcelId: parcelId,
            currentOwner: msg.sender,
            gpsHash: gpsHash,
            metadataHash: metadataHash,
            registrationDate: block.timestamp,
            lastTransferDate: block.timestamp,
            exists: true
        });

        ownershipHistory[parcelId].push(
            OwnershipRecord({
                owner: msg.sender,
                timestamp: block.timestamp,
                transferHash: bytes32(0),
                metadataHash: metadataHash,
                gpsHash: gpsHash,
                isActive: true
            })
        );

        ownerParcels[msg.sender].push(parcelId);
        totalParcels++;

        emit LandRegistered(parcelId, msg.sender, gpsHash, metadataHash, block.timestamp);
    }

    function transferOwnership(
        bytes32 parcelId,
        address newOwner,
        bytes32 transferHash
    ) external parcelExists(parcelId) onlyOwner(parcelId) nonReentrant {
        require(newOwner != address(0), "Invalid new owner");
        require(newOwner != msg.sender, "Cannot transfer to self");

        LandParcel storage parcel = parcels[parcelId];
        address previousOwner = parcel.currentOwner;

        OwnershipRecord[] storage history = ownershipHistory[parcelId];
        if (history.length > 0) {
            history[history.length - 1].isActive = false;
        }

        history.push(
            OwnershipRecord({
                owner: newOwner,
                timestamp: block.timestamp,
                transferHash: transferHash,
                metadataHash: parcel.metadataHash,
                gpsHash: parcel.gpsHash,
                isActive: true
            })
        );

        parcel.currentOwner = newOwner;
        parcel.lastTransferDate = block.timestamp;
        ownerParcels[newOwner].push(parcelId);

        emit OwnershipTransferred(parcelId, previousOwner, newOwner, transferHash, block.timestamp);
    }

    function getCurrentOwner(bytes32 parcelId) external view parcelExists(parcelId) returns (address) {
        return parcels[parcelId].currentOwner;
    }

    function getOwnershipHistory(bytes32 parcelId)
        external
        view
        parcelExists(parcelId)
        returns (OwnershipRecord[] memory)
    {
        return ownershipHistory[parcelId];
    }

    function getParcelDetails(bytes32 parcelId)
        external
        view
        parcelExists(parcelId)
        returns (
            address currentOwner,
            bytes32 gpsHash,
            bytes32 metadataHash,
            uint256 registrationDate,
            uint256 lastTransferDate
        )
    {
        LandParcel storage parcel = parcels[parcelId];
        return (
            parcel.currentOwner,
            parcel.gpsHash,
            parcel.metadataHash,
            parcel.registrationDate,
            parcel.lastTransferDate
        );
    }

    function verifyOwnership(bytes32 parcelId, address owner) external view returns (bool) {
        if (!parcels[parcelId].exists) return false;
        return parcels[parcelId].currentOwner == owner;
    }

    function getParcelsByOwner(address owner) external view returns (bytes32[] memory) {
        return ownerParcels[owner];
    }

    function parcelExistsCheck(bytes32 parcelId) external view returns (bool) {
        return parcels[parcelId].exists;
    }
}
