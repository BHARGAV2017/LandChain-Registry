# Blockchain-Based Land Registry System - System Design Documentation

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Data Flow & User Journey](#data-flow--user-journey)
5. [Blockchain Design](#blockchain-design)
6. [Database Schema](#database-schema)
7. [API Design](#api-design)
8. [Security Architecture](#security-architecture)
9. [File Storage Strategy](#file-storage-strategy)
10. [Deployment Architecture](#deployment-architecture)
11. [Implementation Phases](#implementation-phases)

---

## Executive Summary

This document outlines the system design for a **Blockchain-Based Land Registry System** that enables users to register land ownership with geolocation data, images, and supporting documents. The system leverages blockchain technology to create an immutable, transparent, and verifiable record of land ownership transfers.

### Key Objectives
- **Immutable Ownership Records**: All land ownership transactions stored on blockchain
- **Document Verification**: Cryptographic proof of document authenticity
- **Ownership Chain Tracking**: Complete history of ownership transfers
- **Geolocation Integration**: GPS coordinates linked to land parcels
- **Production-Grade Security**: Enterprise-level security measures
- **Cost-Effective**: Free/open-source technology stack

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Web App     │  │  Mobile App  │  │  Admin Panel │         │
│  │  (React)     │  │  (React      │  │  (React)     │         │
│  │              │  │   Native)    │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         REST API (Express.js / FastAPI)                   │  │
│  │  - Authentication & Authorization                         │  │
│  │  - Request Validation                                     │  │
│  │  - Rate Limiting                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Business    │  │  Blockchain  │  │  File        │         │
│  │  Logic       │  │  Service     │  │  Service     │         │
│  │  Service     │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Geolocation │  │  Document    │  │  Notification│         │
│  │  Service     │  │  Verification│  │  Service     │         │
│  │              │  │  Service     │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │  IPFS        │    │  Blockchain  │
│  Database    │    │  Storage     │    │  Network     │
│              │    │              │    │  (Polygon/   │
│              │    │              │    │   Ethereum)  │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Component Breakdown

#### 1. **Frontend Layer**
- **Web Application**: React.js with TypeScript
- **Mobile Application**: React Native (optional)
- **Admin Dashboard**: React.js for system administration

#### 2. **API Gateway**
- **RESTful API**: Express.js (Node.js) or FastAPI (Python)
- **Authentication**: JWT tokens with refresh mechanism
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize and validate all inputs

#### 3. **Application Services**
- **Business Logic Service**: Core application logic
- **Blockchain Service**: Smart contract interactions
- **File Service**: Handle file uploads and IPFS integration
- **Geolocation Service**: Validate and process GPS coordinates
- **Document Verification Service**: Cryptographic verification
- **Notification Service**: Email/SMS notifications

#### 4. **Data Layer**
- **PostgreSQL**: Relational database for metadata
- **IPFS**: Decentralized file storage
- **Blockchain**: Smart contracts for ownership records

---

## Technology Stack

### Frontend
| Technology | Purpose | License |
|------------|---------|---------|
| **React.js 18+** | Web application framework | MIT (Free) |
| **TypeScript** | Type-safe JavaScript | Apache 2.0 (Free) |
| **Next.js** | React framework with SSR | MIT (Free) |
| **Tailwind CSS** | Utility-first CSS framework | MIT (Free) |
| **React Query** | Data fetching and caching | MIT (Free) |
| **Web3.js / Ethers.js** | Blockchain interaction | MIT (Free) |
| **Leaflet / Mapbox** | Map visualization | BSD-2-Clause (Free) |

### Backend
| Technology | Purpose | License |
|------------|---------|---------|
| **Node.js 20+** | Runtime environment | MIT (Free) |
| **Express.js** | Web framework | MIT (Free) |
| **OR Python 3.11+** | Alternative runtime | PSF (Free) |
| **FastAPI** | Modern Python web framework | MIT (Free) |
| **PostgreSQL 15+** | Relational database | PostgreSQL License (Free) |
| **Redis** | Caching and session storage | BSD-3-Clause (Free) |
| **Prisma / SQLAlchemy** | ORM | Apache 2.0 / MIT (Free) |

### Blockchain
| Technology | Purpose | License |
|------------|---------|---------|
| **Solidity 0.8+** | Smart contract language | GPL-3.0 (Free) |
| **Hardhat / Foundry** | Development framework | MIT / Apache 2.0 (Free) |
| **Polygon PoS** | Layer 2 blockchain (low fees) | Open Source |
| **Ethereum** | Main blockchain (testnet for free) | Open Source |
| **IPFS** | Decentralized file storage | MIT / Apache 2.0 (Free) |
| **Pinata / Web3.Storage** | IPFS pinning service | Free tier available |

### DevOps & Infrastructure
| Technology | Purpose | License |
|------------|---------|---------|
| **Docker** | Containerization | Apache 2.0 (Free) |
| **Docker Compose** | Multi-container orchestration | Apache 2.0 (Free) |
| **GitHub Actions** | CI/CD pipeline | Free for public repos |
| **Nginx** | Reverse proxy and load balancer | BSD-2-Clause (Free) |
| **Let's Encrypt** | SSL/TLS certificates | Free |
| **AWS/GCP/Azure** | Cloud hosting (free tier) | Free tier available |

### Security & Authentication
| Technology | Purpose | License |
|------------|---------|---------|
| **JWT** | Authentication tokens | MIT (Free) |
| **bcrypt / Argon2** | Password hashing | MIT / Apache 2.0 (Free) |
| **Helmet.js** | Security headers | MIT (Free) |
| **CORS** | Cross-origin resource sharing | MIT (Free) |
| **Rate Limiting** | DDoS protection | MIT (Free) |

---

## Data Flow & User Journey

### User Registration Flow

```
1. User Registration
   ├─ User provides email, password, identity documents
   ├─ System validates documents
   ├─ Creates user account in PostgreSQL
   ├─ Generates wallet address (or user connects existing wallet)
   └─ Sends verification email

2. Land Registration
   ├─ User uploads:
   │  ├─ GPS coordinates (latitude, longitude)
   │  ├─ Land images (multiple)
   │  ├─ Ownership documents (PDF, images)
   │  └─ Additional metadata (area, address, etc.)
   ├─ System processes:
   │  ├─ Validates GPS coordinates
   │  ├─ Uploads files to IPFS
   │  ├─ Gets IPFS hashes (CIDs)
   │  ├─ Creates metadata record in PostgreSQL
   │  ├─ Generates unique land parcel ID
   │  └─ Prepares smart contract transaction
   ├─ Blockchain Transaction:
   │  ├─ User signs transaction with wallet
   │  ├─ Transaction sent to blockchain
   │  ├─ Smart contract stores:
   │  │  ├─ Land parcel ID
   │  │  ├─ Owner address
   │  │  ├─ IPFS hash of metadata
   │  │  ├─ Timestamp
   │  │  └─ GPS coordinates hash
   │  └─ Transaction receipt stored in PostgreSQL
   └─ Confirmation sent to user
```

### Ownership Transfer Flow

```
1. Ownership Transfer Request
   ├─ Current owner initiates transfer
   ├─ Enters recipient wallet address
   ├─ Uploads transfer documents
   └─ System validates ownership on blockchain

2. Transfer Approval
   ├─ Recipient receives notification
   ├─ Recipient reviews transfer details
   ├─ Recipient approves transfer
   └─ Both parties sign transaction

3. Blockchain Transaction
   ├─ Smart contract validates:
   │  ├─ Current owner is correct
   │  ├─ Both parties signed
   │  └─ Transfer documents hash
   ├─ Updates ownership on blockchain
   ├─ Records transfer in ownership history
   └─ Emits event for indexing

4. Post-Transfer
   ├─ Update PostgreSQL records
   ├─ Send confirmation to both parties
   └─ Update IPFS metadata
```

### Document Verification Flow

```
1. Document Upload
   ├─ User uploads document
   ├─ System calculates SHA-256 hash
   ├─ Uploads to IPFS
   └─ Stores hash in database

2. Verification Request
   ├─ User or third party requests verification
   ├─ System retrieves:
   │  ├─ Document from IPFS
   │  ├─ Hash from blockchain
   │  └─ Metadata from database
   ├─ Compares hashes
   └─ Returns verification result

3. Blockchain Proof
   ├─ Document hash stored in smart contract
   ├─ Immutable proof of existence
   └─ Timestamped verification
```

---

## Blockchain Design

### Smart Contract Architecture

#### 1. **LandRegistry.sol** - Main Registry Contract

```solidity
// Core functionality:
- registerLand(parcelId, owner, gpsHash, metadataHash)
- transferOwnership(parcelId, newOwner, transferHash)
- getCurrentOwner(parcelId) → address
- getOwnershipHistory(parcelId) → OwnershipRecord[]
- verifyDocument(documentHash) → bool
- updateLandMetadata(parcelId, metadataHash)
```

#### 2. **OwnershipRecord Structure**

```solidity
struct OwnershipRecord {
    address owner;
    uint256 timestamp;
    bytes32 transferHash;      // IPFS hash of transfer documents
    bytes32 metadataHash;       // IPFS hash of land metadata
    bytes32 gpsHash;           // Hash of GPS coordinates
    bool isActive;
}
```

#### 3. **Land Parcel Structure**

```solidity
struct LandParcel {
    bytes32 parcelId;          // Unique identifier
    address currentOwner;
    bytes32 gpsHash;           // Hash of GPS coordinates
    bytes32 metadataHash;      // IPFS hash of full metadata
    uint256 registrationDate;
    uint256 lastTransferDate;
    OwnershipRecord[] ownershipHistory;
}
```

### Blockchain Network Selection

#### Option 1: **Polygon PoS** (Recommended for Production)
- **Pros**: 
  - Low transaction fees (~$0.001 per transaction)
  - Fast confirmation times (2-3 seconds)
  - EVM compatible
  - High throughput
- **Cons**: 
  - Requires MATIC tokens for gas
- **Cost**: Minimal (can use faucets for testnet)

#### Option 2: **Ethereum Testnet** (For Development)
- **Pros**: 
  - Completely free (testnet)
  - Most established ecosystem
  - Extensive tooling
- **Cons**: 
  - Not production-ready (testnet only)
  - Mainnet fees are high
- **Cost**: Free (testnet)

#### Option 3: **Base** (Coinbase L2)
- **Pros**: 
  - Very low fees
  - EVM compatible
  - Growing ecosystem
- **Cons**: 
  - Newer network
- **Cost**: Minimal

### IPFS Integration Strategy

#### File Storage Flow
1. **Upload to IPFS**: Files uploaded via IPFS node or pinning service
2. **Get Content Identifier (CID)**: IPFS returns unique hash (CID)
3. **Pin Files**: Use Pinata or Web3.Storage to ensure persistence
4. **Store CID on Blockchain**: CID stored in smart contract
5. **Retrieval**: Files retrieved using CID from any IPFS node

#### IPFS Pinning Services (Free Tiers)
- **Pinata**: 1 GB free storage, 1000 pins/month
- **Web3.Storage**: 5 GB free storage
- **NFT.Storage**: Free for NFT metadata
- **Self-Hosted IPFS**: Unlimited (requires infrastructure)

---

## Database Schema

### PostgreSQL Schema Design

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    identity_document_hash VARCHAR(64), -- SHA-256 hash
    identity_document_ipfs_cid VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_email ON users(email);
```

#### Land Parcels Table
```sql
CREATE TABLE land_parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id VARCHAR(255) UNIQUE NOT NULL, -- Unique identifier
    current_owner_id UUID REFERENCES users(id),
    current_owner_wallet VARCHAR(42) NOT NULL,
    gps_latitude DECIMAL(10, 8) NOT NULL,
    gps_longitude DECIMAL(11, 8) NOT NULL,
    gps_hash VARCHAR(64) NOT NULL, -- Hash of coordinates
    area_square_meters DECIMAL(12, 2),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    metadata_ipfs_cid VARCHAR(255),
    images_ipfs_cid TEXT[], -- Array of IPFS CIDs
    documents_ipfs_cid TEXT[], -- Array of IPFS CIDs
    registration_tx_hash VARCHAR(66), -- Blockchain transaction hash
    registration_block_number BIGINT,
    registration_date TIMESTAMP,
    last_transfer_tx_hash VARCHAR(66),
    last_transfer_block_number BIGINT,
    last_transfer_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_parcels_owner ON land_parcels(current_owner_wallet);
CREATE INDEX idx_land_parcels_parcel_id ON land_parcels(parcel_id);
CREATE INDEX idx_land_parcels_gps ON land_parcels(gps_latitude, gps_longitude);
CREATE INDEX idx_land_parcels_tx_hash ON land_parcels(registration_tx_hash);
```

#### Ownership History Table
```sql
CREATE TABLE ownership_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    land_parcel_id UUID REFERENCES land_parcels(id),
    parcel_id VARCHAR(255) NOT NULL,
    previous_owner_wallet VARCHAR(42) NOT NULL,
    new_owner_wallet VARCHAR(42) NOT NULL,
    transfer_tx_hash VARCHAR(66) NOT NULL,
    transfer_block_number BIGINT NOT NULL,
    transfer_timestamp TIMESTAMP NOT NULL,
    transfer_documents_ipfs_cid TEXT[],
    transfer_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ownership_history_parcel ON ownership_history(parcel_id);
CREATE INDEX idx_ownership_history_tx_hash ON ownership_history(transfer_tx_hash);
CREATE INDEX idx_ownership_history_owner ON ownership_history(new_owner_wallet);
```

#### Documents Table
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    land_parcel_id UUID REFERENCES land_parcels(id),
    document_type VARCHAR(50) NOT NULL, -- 'ownership', 'transfer', 'survey', etc.
    document_name VARCHAR(255) NOT NULL,
    document_hash VARCHAR(64) NOT NULL, -- SHA-256 hash
    ipfs_cid VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_on_blockchain BOOLEAN DEFAULT FALSE,
    blockchain_tx_hash VARCHAR(66)
);

CREATE INDEX idx_documents_parcel ON documents(land_parcel_id);
CREATE INDEX idx_documents_hash ON documents(document_hash);
CREATE INDEX idx_documents_ipfs ON documents(ipfs_cid);
```

#### Blockchain Transactions Table
```sql
CREATE TABLE blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    tx_type VARCHAR(50) NOT NULL, -- 'registration', 'transfer', 'update'
    land_parcel_id UUID REFERENCES land_parcels(id),
    from_address VARCHAR(42),
    to_address VARCHAR(42),
    block_number BIGINT,
    block_hash VARCHAR(66),
    gas_used BIGINT,
    gas_price BIGINT,
    status VARCHAR(20) NOT NULL, -- 'pending', 'confirmed', 'failed'
    confirmation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

CREATE INDEX idx_tx_hash ON blockchain_transactions(tx_hash);
CREATE INDEX idx_tx_status ON blockchain_transactions(status);
CREATE INDEX idx_tx_parcel ON blockchain_transactions(land_parcel_id);
```

#### Verification Requests Table
```sql
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    land_parcel_id UUID REFERENCES land_parcels(id),
    document_id UUID REFERENCES documents(id),
    requested_by UUID REFERENCES users(id),
    verification_type VARCHAR(50) NOT NULL, -- 'ownership', 'document', 'chain'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'failed'
    verification_result JSONB,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_parcel ON verification_requests(land_parcel_id);
CREATE INDEX idx_verification_status ON verification_requests(status);
```

---

## API Design

### RESTful API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/verify-email
POST   /api/auth/reset-password
```

#### Land Parcel Endpoints
```
POST   /api/land-parcels                    # Register new land parcel
GET    /api/land-parcels                    # List user's land parcels
GET    /api/land-parcels/:id                # Get land parcel details
GET    /api/land-parcels/:id/history       # Get ownership history
PUT    /api/land-parcels/:id                # Update land parcel metadata
POST   /api/land-parcels/:id/transfer       # Initiate ownership transfer
POST   /api/land-parcels/:id/approve-transfer # Approve transfer
GET    /api/land-parcels/search             # Search by GPS, address, etc.
```

#### Document Endpoints
```
POST   /api/documents                       # Upload document
GET    /api/documents/:id                   # Get document details
GET    /api/documents/:id/download          # Download document
POST   /api/documents/:id/verify           # Verify document
DELETE /api/documents/:id                   # Delete document
```

#### Verification Endpoints
```
POST   /api/verification/ownership          # Verify ownership
POST   /api/verification/document           # Verify document
GET    /api/verification/chain/:parcelId    # Get ownership chain
GET    /api/verification/blockchain/:txHash # Verify blockchain transaction
```

#### Blockchain Endpoints
```
GET    /api/blockchain/status               # Get blockchain status
GET    /api/blockchain/transaction/:txHash  # Get transaction details
POST   /api/blockchain/sync                 # Sync blockchain data
```

### API Request/Response Examples

#### Register Land Parcel
```json
POST /api/land-parcels
Headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "multipart/form-data"
}

Body (Form Data):
{
  "gps_latitude": "40.7128",
  "gps_longitude": "-74.0060",
  "area_square_meters": "5000",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postal_code": "10001",
  "images": [File, File, ...],
  "documents": [File, File, ...]
}

Response: {
  "success": true,
  "data": {
    "parcel_id": "LP-2024-001",
    "land_parcel_id": "uuid",
    "ipfs_metadata_cid": "QmXxxx...",
    "transaction": {
      "tx_hash": "0xabc...",
      "status": "pending",
      "block_number": null
    }
  }
}
```

#### Get Ownership History
```json
GET /api/land-parcels/LP-2024-001/history

Response: {
  "success": true,
  "data": {
    "parcel_id": "LP-2024-001",
    "current_owner": {
      "wallet_address": "0x123...",
      "name": "John Doe",
      "since": "2024-01-15T10:30:00Z"
    },
    "ownership_chain": [
      {
        "owner": "0x123...",
        "name": "John Doe",
        "transfer_date": "2024-01-15T10:30:00Z",
        "tx_hash": "0xabc...",
        "transfer_documents": ["QmXxxx..."]
      },
      {
        "owner": "0x456...",
        "name": "Jane Smith",
        "transfer_date": "2023-06-20T14:20:00Z",
        "tx_hash": "0xdef...",
        "transfer_documents": ["QmYyyy..."]
      }
    ]
  }
}
```

---

## Security Architecture

### Authentication & Authorization

#### JWT Token Strategy
- **Access Token**: Short-lived (15 minutes), contains user ID and permissions
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
- **Token Rotation**: Refresh tokens rotated on each use

#### Wallet Integration
- **MetaMask Integration**: Users connect wallet for blockchain transactions
- **Wallet Verification**: Link wallet address to user account
- **Transaction Signing**: All blockchain transactions require user signature

### Data Security

#### Encryption
- **At Rest**: Database encryption (PostgreSQL TDE)
- **In Transit**: TLS 1.3 for all communications
- **Sensitive Data**: Encrypt PII before storage

#### Input Validation
- **Sanitization**: All user inputs sanitized
- **Schema Validation**: JSON schema validation for API requests
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Prevention**: Content Security Policy headers

#### File Upload Security
- **File Type Validation**: Whitelist allowed MIME types
- **File Size Limits**: Maximum 10MB per file
- **Virus Scanning**: Scan uploaded files (ClamAV)
- **Content Validation**: Verify file contents match extension

### Blockchain Security

#### Smart Contract Best Practices
- **Reentrancy Protection**: Use checks-effects-interactions pattern
- **Access Control**: Role-based access control
- **Input Validation**: Validate all inputs
- **Gas Optimization**: Efficient contract design
- **Audit**: Professional smart contract audit before production

#### Key Management
- **User Wallets**: Users manage their own private keys
- **Server Wallets**: Encrypted key storage for service operations
- **Hardware Security Modules**: For production key management (optional)

### Rate Limiting & DDoS Protection
- **API Rate Limiting**: 100 requests/minute per IP
- **Upload Rate Limiting**: 10 uploads/hour per user
- **DDoS Protection**: Cloudflare or similar service

---

## File Storage Strategy

### IPFS Architecture

#### File Upload Process
1. **Client Upload**: User uploads file via API
2. **Server Processing**: 
   - Validate file type and size
   - Calculate SHA-256 hash
   - Upload to IPFS node
   - Receive Content Identifier (CID)
3. **Pinning**: Pin file to ensure persistence
4. **Database Storage**: Store CID and metadata in PostgreSQL
5. **Blockchain Storage**: Store CID hash in smart contract

#### File Retrieval Process
1. **Request**: User requests file by document ID
2. **Database Lookup**: Retrieve CID from PostgreSQL
3. **IPFS Retrieval**: Fetch file from IPFS using CID
4. **Verification**: Verify file hash matches stored hash
5. **Delivery**: Return file to user

### IPFS Node Setup Options

#### Option 1: Self-Hosted IPFS Node
- **Pros**: Full control, unlimited storage
- **Cons**: Requires infrastructure management
- **Setup**: Docker container with IPFS

#### Option 2: IPFS Pinning Service
- **Pros**: Managed service, reliable pinning
- **Cons**: Storage limits on free tier
- **Services**: Pinata, Web3.Storage, NFT.Storage

#### Option 3: Hybrid Approach (Recommended)
- **Primary**: Self-hosted IPFS node
- **Backup**: Pinata for redundancy
- **CDN**: Cloudflare IPFS gateway for fast access

### File Organization in IPFS
```
/land-parcels/
  /{parcel_id}/
    /metadata.json          # Land parcel metadata
    /images/
      /image1.jpg
      /image2.jpg
    /documents/
      /ownership_deed.pdf
      /survey_report.pdf
    /transfers/
      /transfer_{tx_hash}/
        /transfer_doc.pdf
```

---

## Deployment Architecture

### Development Environment
```
┌─────────────────────────────────────────┐
│  Local Development                      │
│  - Node.js / Python                     │
│  - PostgreSQL (Docker)                  │
│  - IPFS Node (Docker)                   │
│  - Hardhat Local Node                   │
│  - React Dev Server                     │
└─────────────────────────────────────────┘
```

### Production Environment

#### Option 1: Cloud Deployment (Recommended)
```
┌─────────────────────────────────────────┐
│  Cloud Provider (AWS/GCP/Azure)         │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Load        │  │  API         │   │
│  │  Balancer    │  │  Servers     │   │
│  │  (Nginx)     │  │  (Docker)    │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │  Redis       │   │
│  │  (Managed)   │  │  (Cache)     │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  IPFS Node   │  │  CDN         │   │
│  │  (Docker)    │  │  (Cloudflare)│   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Blockchain Network                     │
│  - Polygon PoS Mainnet                  │
│  - Smart Contracts Deployed             │
└─────────────────────────────────────────┘
```

#### Option 2: Self-Hosted Deployment
```
┌─────────────────────────────────────────┐
│  VPS / Dedicated Server                   │
│  - Ubuntu 22.04 LTS                       │
│  - Docker & Docker Compose                │
│  - Nginx Reverse Proxy                    │
│  - Let's Encrypt SSL                      │
└─────────────────────────────────────────┘
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/landregistry
      - REDIS_URL=redis://redis:6379
      - IPFS_HOST=ipfs
      - BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
    depends_on:
      - db
      - redis
      - ipfs

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=landregistry
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  ipfs:
    image: ipfs/kubo:latest
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ipfs_data:/data/ipfs

volumes:
  postgres_data:
  redis_data:
  ipfs_data:
```

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: docker-compose build
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deployment commands
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up development environment
- [ ] Initialize project structure
- [ ] Set up PostgreSQL database
- [ ] Create database schema
- [ ] Set up IPFS node
- [ ] Basic API structure

### Phase 2: Core Features (Weeks 3-4)
- [ ] User authentication system
- [ ] Wallet integration (MetaMask)
- [ ] File upload to IPFS
- [ ] Land parcel registration API
- [ ] Database integration

### Phase 3: Blockchain Integration (Weeks 5-6)
- [ ] Smart contract development
- [ ] Smart contract testing
- [ ] Deploy to testnet
- [ ] Blockchain service integration
- [ ] Transaction monitoring

### Phase 4: Frontend Development (Weeks 7-8)
- [ ] React application setup
- [ ] Authentication UI
- [ ] Land registration form
- [ ] Map integration (GPS)
- [ ] File upload UI
- [ ] Ownership history display

### Phase 5: Advanced Features (Weeks 9-10)
- [ ] Ownership transfer functionality
- [ ] Document verification system
- [ ] Ownership chain visualization
- [ ] Search and filtering
- [ ] Admin dashboard

### Phase 6: Security & Testing (Weeks 11-12)
- [ ] Security audit
- [ ] Smart contract audit
- [ ] Penetration testing
- [ ] Load testing
- [ ] Bug fixes

### Phase 7: Deployment (Weeks 13-14)
- [ ] Production environment setup
- [ ] Deploy smart contracts to mainnet
- [ ] Deploy backend and frontend
- [ ] SSL certificates
- [ ] Monitoring and logging

### Phase 8: Launch & Maintenance (Week 15+)
- [ ] User acceptance testing
- [ ] Documentation completion
- [ ] User training materials
- [ ] Launch
- [ ] Ongoing maintenance

---

## Cost Analysis

### Free Tier Resources
- **PostgreSQL**: Supabase (500MB free), Railway (free tier)
- **IPFS**: Self-hosted (free), Pinata (1GB free)
- **Blockchain**: Polygon testnet (free), Polygon mainnet (minimal fees)
- **Hosting**: Railway, Render, Fly.io (free tiers available)
- **CDN**: Cloudflare (free tier)

### Estimated Monthly Costs (Production)
- **Blockchain Gas Fees**: $10-50/month (depending on usage)
- **IPFS Pinning**: $0-20/month (if using paid service)
- **Hosting**: $0-25/month (free tier or small VPS)
- **Domain & SSL**: $0-15/year (Let's Encrypt free)
- **Total**: **$10-95/month** (can be $0 with free tiers)

---

## Monitoring & Maintenance

### Monitoring Tools
- **Application Monitoring**: Prometheus + Grafana (free)
- **Error Tracking**: Sentry (free tier)
- **Logging**: ELK Stack (free) or CloudWatch (free tier)
- **Uptime Monitoring**: UptimeRobot (free tier)

### Key Metrics to Monitor
- API response times
- Database query performance
- IPFS upload/download success rates
- Blockchain transaction success rates
- Error rates
- User activity

---

## Conclusion

This system design provides a comprehensive, production-ready architecture for a blockchain-based land registry system. The technology stack is entirely free/open-source, making it cost-effective while maintaining enterprise-grade security and scalability.

The system leverages:
- **Blockchain** for immutable ownership records
- **IPFS** for decentralized document storage
- **PostgreSQL** for efficient querying and metadata
- **Modern web technologies** for user experience

This architecture ensures:
- ✅ Future-proof document verification
- ✅ Complete ownership chain tracking
- ✅ Secure and tamper-proof records
- ✅ Scalable and maintainable codebase
- ✅ Cost-effective operation

---

## Next Steps

1. Review and approve this system design
2. Set up development environment
3. Begin Phase 1 implementation
4. Regular design reviews during development
5. Security audit before production launch

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: System Design Team
