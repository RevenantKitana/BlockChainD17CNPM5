# 🔐 CƠ CHẾ MÃ HÓA VÀ ĐỒNG THUẬN BLOCKCHAIN

## 📋 MỤC LỤC
- [Cơ chế mã hóa](#-cơ-chế-mã-hóa)
- [Cơ chế đồng thuận](#-cơ-chế-đồng-thuận)
- [Áp dụng trong dự án](#-áp-dụng-trong-dự-án)

---

## 🔐 CƠ CHẾ MÃ HÓA

### 1. Hash Functions (Hàm băm)

**Định nghĩa:** Chuyển dữ liệu bất kỳ thành chuỗi cố định (256 bit)

**Ethereum sử dụng:** Keccak-256

**Tính chất:**
- ✅ **Một chiều:** Input → Hash (dễ) | Hash → Input (không thể)
- ✅ **Deterministic:** Input giống → Hash giống 100%
- ✅ **Avalanche effect:** Thay đổi 1 bit → Hash hoàn toàn khác
- ✅ **Collision resistant:** Rất khó tìm 2 inputs có cùng hash

**Ví dụ:**
```javascript
Keccak256("Hello")  = "0x06b3dfaec148fb1e8cf..."
Keccak256("hello")  = "0x1c8aff950685c2ed4bc..." // Khác hoàn toàn!
```

**Ứng dụng:**
```
1. Block Hash:    Hash(Block) → ID duy nhất
2. Transaction Hash: Hash(Tx) → Tracking ID
3. Address:       Hash(PublicKey) → Ethereum Address
4. Function Selector: Hash("sendMessage(string)") → 0x7d8c6e52
5. Merkle Root:   Hash của tree → Verify nhiều tx nhanh
```

**Liên kết blocks:**
```
Block 1          Block 2              Block 3
hash: 0xabc  ←─  prevHash: 0xabc  ←─  prevHash: 0xdef
             │   hash: 0xdef      │   hash: 0x123
             └───────────────────┘
                   
→ Sửa Block 1 → Hash thay đổi → Block 2,3,4... không hợp lệ
```

---

### 2. Public Key Cryptography (Mã hóa bất đối xứng)

**Định nghĩa:** Hệ thống 2 khóa - Private Key và Public Key

**Ethereum sử dụng:** ECDSA (Elliptic Curve Digital Signature Algorithm) với curve secp256k1

**Cặp khóa:**
```
Private Key (256 bit random)
    ↓ Nhân với điểm G trên Elliptic Curve
Public Key (512 bit)
    ↓ Hash + lấy 20 bytes cuối
Ethereum Address (160 bit)

Ví dụ:
Private: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Public:  0x2f3d8e4c... (không show hết)
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Tính chất quan trọng:**
- ✅ **One-way:** Private Key → Public Key (dễ)
- ❌ **Impossible:** Public Key → Private Key (không thể)
- 🔒 **Security:** Dựa trên Discrete Logarithm Problem

**So sánh:**
```
Symmetric (AES):        1 khóa dùng chung  → Mã hóa data
Asymmetric (ECDSA):     2 khóa riêng biệt  → Xác thực identity
```

---

### 3. Digital Signatures (Chữ ký số)

**Mục đích:** Chứng minh bạn là chủ của Private Key mà không cần lộ Private Key

**Quy trình ký:**
```javascript
// 1. Tạo transaction
tx = {
    from: "0x742d35Cc...",
    to: "0xe7f1725E...",
    data: "sendMessage('Hello')",
    nonce: 5,
    gasLimit: 150000
}

// 2. Hash transaction
txHash = Keccak256(serialize(tx))

// 3. Ký hash bằng Private Key
signature = sign(txHash, privateKey)
// → { r, s, v } - 3 numbers

// 4. Broadcast
broadcast(tx + signature)
```

**Quy trình verify:**
```javascript
// Node nhận được tx + signature

// 1. Hash lại transaction
txHash = Keccak256(serialize(tx))

// 2. Recover Public Key từ signature
publicKey = ecrecover(txHash, signature)

// 3. Tính Address
recoveredAddress = address(publicKey)

// 4. So sánh
if (recoveredAddress === tx.from) {
    ✅ "Chữ ký hợp lệ!"
} else {
    ❌ "Giả mạo!"
}
```

**Tính chất bảo mật:**
- ✅ **Authentication:** Chứng minh identity
- ✅ **Non-repudiation:** Không thể chối bỏ
- ✅ **Integrity:** Sửa tx → Signature invalid
- ✅ **Unforgeable:** Không có Private Key → Không tạo được signature hợp lệ

---

## 🤝 CƠ CHẾ ĐỒNG THUẬN

### Vấn đề cần giải quyết

```
Blockchain = Distributed system với hàng nghìn nodes
→ Ai quyết định block nào hợp lệ?
→ Làm sao đảm bảo tất cả đồng ý?
→ Làm sao ngăn gian lận?
```

**Mục tiêu:**
- ✅ Agreement: Tất cả nodes đồng ý về state
- ✅ Consistency: Dữ liệu nhất quán
- ✅ Fault Tolerance: Hoạt động dù có nodes lỗi/gian lận
- ✅ Security: Chống tấn công 51%, double-spending

---

### 1. Proof of Work (PoW) - Bằng chứng công việc

**Sử dụng:** Bitcoin, Ethereum (trước 2022)

**Nguyên lý:** Giải bài toán khó → Được quyền tạo block → Nhận phần thưởng

**Cách hoạt động:**
```javascript
// Tìm nonce sao cho:
Hash(block + nonce) < Target (nhiều số 0 đầu)

nonce = 0
while (true) {
    hash = Keccak256(block + nonce)
    if (hash.startsWith("0000")) {
        console.log("Tìm ra! Nonce =", nonce)
        return block
    }
    nonce++ // Thử tiếp...
}

// Có thể thử hàng tỷ lần!
```

**Quy trình:**
```
1. Miners chọn transactions từ mempool
2. Tạo block candidate
3. Racing - Thi nhau tìm nonce
4. Ai tìm ra trước → Broadcast block
5. Nodes khác verify
6. Accept block → Miners mine block tiếp theo
```

**Bảo mật:**
```
Tấn công 51%:
- Cần > 50% hashrate toàn mạng
- Bitcoin: Cần ~$10 tỷ thiết bị
- Sửa block cũ → Phải re-mine tất cả blocks sau
- Không khả thi về kinh tế!
```

**Ưu điểm:**
- ✅ Rất bảo mật (test 15+ năm)
- ✅ Truly decentralized
- ✅ Simple & proven

**Nhược điểm:**
- ❌ Lãng phí năng lượng (~150 TWh/năm cho Bitcoin)
- ❌ Chậm (Bitcoin: ~10 phút/block)
- ❌ Tốn kém (cần ASIC miners)
- ❌ Mining pools → Centralization risk

---

### 2. Proof of Stake (PoS) - Bằng chứng cổ phần

**Sử dụng:** Ethereum (từ 2022), Cardano, Polkadot

**Nguyên lý:** Stake tiền → Được random chọn làm validator → Xác nhận block

**Cách hoạt động:**
```javascript
// Validator pool
validators = [
    { address: "0xA...", stake: 32 ETH },
    { address: "0xB...", stake: 64 ETH },
    { address: "0xC...", stake: 32 ETH }
]

// Mỗi 12 giây (slot)
selectedValidator = random_weighted_by_stake(validators)

// Validator propose block
block = createBlock(transactions)
sign(block, validator.privateKey)
broadcast(block)

// Committee validators attest (xác nhận)
attestations = 128_validators_attest(block)

// Nếu ≥ 2/3 attest → Block finalized
if (attestations >= total * 2/3) {
    finalizeBlock(block)
}
```

**Slashing (trừng phạt):**
```
Hành vi gian lận:
- Double signing (ký 2 blocks khác nhau)
- Surround voting (vote mâu thuẫn)
- Offline quá lâu

Penalty:
→ Slash stake (mất 1-100% stake)
→ Kick out khỏi validator set
```

**Bảo mật:**
```
Tấn công 51%:
- Cần stake > 50% total ETH
- Ethereum: ~15M ETH (~$30 tỷ)
- Nếu tấn công → Stake bị slash → Mất tiền
- Kinh tế không khả thi!
```

**Ưu điểm:**
- ✅ Tiết kiệm năng lượng 99.95%
- ✅ Nhanh hơn (~12s/block)
- ✅ Không cần hardware đặc biệt
- ✅ Lower barrier (32 ETH hoặc join pool)

**Nhược điểm:**
- ❌ Rich get richer
- ❌ Phức tạp hơn PoW
- ❌ Mới hơn (ít history)

---

### 3. Proof of Authority (PoA) - Bằng chứng uy tín

**Sử dụng:** VeChain, Private chains, Testnets (Goerli)

**Nguyên lý:** Pre-approved validators → Lần lượt tạo blocks (round-robin)

**Cách hoạt động:**
```javascript
// Approved validators (5-25 nodes)
authorizedValidators = [
    "0xCompanyA...",
    "0xCompanyB...",
    "0xCompanyC..."
]

// Round-robin
validatorIndex = blockNumber % validators.length
currentValidator = validators[validatorIndex]

// Validator tạo block
if (isMyTurn(blockNumber)) {
    block = createBlock()
    sign(block, myPrivateKey)
    broadcast(block)
}
```

**Ưu điểm:**
- ✅ Rất nhanh (~1-2s/block)
- ✅ Không tốn năng lượng
- ✅ Predictable
- ✅ Low cost

**Nhược điểm:**
- ❌ Centralized (chỉ vài validators)
- ❌ Phải trust validators
- ❌ Không suitable cho public chains

---

### 4. So sánh tổng hợp

| Tiêu chí | PoW | PoS | PoA |
|----------|-----|-----|-----|
| **Speed** | Chậm (10 phút) | Trung bình (12s) | Nhanh (1-2s) |
| **Security** | Rất cao | Cao | Trung bình |
| **Decentralization** | Cao | Cao | Thấp |
| **Energy** | Rất cao | Rất thấp | Rất thấp |
| **Cost** | Đắt | Trung bình | Rẻ |
| **TPS** | ~7 | ~30 | ~10,000 |
| **Use Case** | Public | Public | Private/Test |
| **Examples** | Bitcoin | Ethereum | Goerli |

---

## 🎯 ÁP DỤNG TRONG DỰ ÁN MESSAGEBOARD

### 1. Mã hóa trong dự án

#### a) Hash Functions

**Address Generation:**
```javascript
// MetaMask tạo ví
privateKey = random256bits()
publicKey = privateKey × G (ECDSA)
address = Keccak256(publicKey).slice(-20)
// → 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Function Selector:**
```javascript
// Khi call contract.sendMessage("Hello")
functionSignature = "sendMessage(string)"
selector = Keccak256(functionSignature).slice(0, 4)
// → 0x7d8c6e52

// Transaction data:
data = "0x7d8c6e52" + encode("Hello")
```

**Transaction Hash:**
```javascript
// Mỗi transaction có ID duy nhất
tx = { from, to, data, nonce, gas, ... }
txHash = Keccak256(serialize(tx))
// → 0x8f3d2e1a4b5c6d7e...

// Dùng để tracking transaction
```

#### b) Digital Signatures

**Gửi message:**
```javascript
// 1. User click "Gửi Tin Nhắn"
const tx = await contract.sendMessage("Hello World")

// 2. MetaMask creates transaction
rawTx = {
    from: userAddress,
    to: contractAddress,
    data: "0x7d8c6e52..." + encode("Hello World"),
    nonce: 5
}

// 3. MetaMask signs (user không thấy Private Key!)
txHash = Keccak256(rawTx)
signature = sign(txHash, privateKey)

// 4. Broadcast to blockchain
broadcast(rawTx + signature)

// 5. Blockchain verifies
recoveredAddress = ecrecover(txHash, signature)
if (recoveredAddress === rawTx.from) {
    execute(rawTx) // ✅
}
```

**Bảo mật:**
- Private Key **KHÔNG BAO GIỜ** rời khỏi MetaMask
- Không thể giả mạo signature
- Mỗi transaction phải được user approve

---

### 2. Đồng thuận trong dự án

#### Development (Hardhat Local)

**Cơ chế:** Instant Mining (không có consensus thực sự)

```javascript
// hardhat.config.js
networks: {
    localhost: {
        url: "http://127.0.0.1:8545"
    }
}

// Khi run: npx hardhat node
```

**Hoạt động:**
```
Transaction gửi đến
    ↓
Hardhat node validate
    ↓
Execute ngay lập tức
    ↓
Create block (block time ~0ms)
    ↓
Return receipt
    
→ KHÔNG có mining
→ KHÔNG có validators
→ KHÔNG có consensus
```

**Đặc điểm:**
- ⚡ Instant confirmation
- 💰 Free gas (fake ETH)
- 🔄 Có thể reset
- 🎓 Dùng để học và test

---

#### Testnet (Sepolia)

**Cơ chế:** Proof of Stake (giống Ethereum mainnet)

```
Validators: Public staking
Block time: ~12 seconds
Cost: Free testnet ETH (từ faucet)
```

**Quy trình:**
```
1. Transaction → Mempool
2. Validator được random chọn
3. Validator propose block
4. Committee attest
5. Block finalized (~13 phút)
6. Receipt returned
```

---

#### Production (Ethereum Mainnet)

**Cơ chế:** Proof of Stake

**Thống kê (2024):**
```
- Validators: ~900,000
- Total staked: ~30M ETH (~$60B)
- Min stake: 32 ETH (~$64,000)
- APR: ~4%
- Block time: ~12 seconds
- Energy: ~0.01 TWh/year (↓99.95% vs PoW)
```

**Chi phí thực tế:**
```javascript
sendMessage("Hello World"):
  Gas used: ~100,000
  Gas price: 30 gwei
  Total: 0.003 ETH
  
  ETH = $2,000:
  → Chi phí: ~$6 per message

Deploy contract:
  Gas: ~1,000,000
  Total: 0.03 ETH
  → Chi phí: ~$60
```

---

### 3. So sánh environments

| | Local (Hardhat) | Testnet (Sepolia) | Mainnet (Ethereum) |
|---|---|---|---|
| **Consensus** | None (instant) | PoS | PoS |
| **Validators** | 0 (single node) | ~Thousands | ~900,000 |
| **Block time** | ~0ms | ~12s | ~12s |
| **Cost** | FREE | FREE | $6/tx |
| **Security** | None | Medium | Very High |
| **Use case** | Development | Testing | Production |
| **Reset** | ✅ Yes | ❌ No | ❌ No |

---

## 🔒 BẢO MẬT TỔNG HỢP

### 1. Các lớp bảo mật

```
Layer 1: Cryptography
├─ Hash Functions: Liên kết blocks, tạo IDs
├─ Public Key: Tạo addresses, xác thực
└─ Signatures: Chứng minh ownership

Layer 2: Consensus
├─ PoW: Computational impossibility
├─ PoS: Economic impossibility
└─ PoA: Trusted validators

Layer 3: Smart Contract
├─ require() statements
├─ Access control
└─ Input validation

Layer 4: Application
├─ MetaMask: User confirmation
├─ Frontend: Client-side validation
└─ UX: Clear warnings
```

### 2. Tấn công và phòng thủ

**51% Attack:**
```
PoW: Cần > 50% hashrate → $10B+ thiết bị → Không khả thi
PoS: Cần > 50% stake → Bị slash nếu gian lận → Tự thua
```

**Double Spending:**
```
Gửi cùng 1 coin 2 lần:
→ Nonce mechanism ngăn chặn
→ Consensus finality đảm bảo
```

**Private Key Theft:**
```
Nếu mất Private Key:
→ Attacker có toàn quyền
→ KHÔNG THỂ khôi phục
→ Bảo mật: Hardware wallet, 2FA, backup seed phrase
```

**Smart Contract Bugs:**
```
Code có lỗi:
→ Không thể sửa sau khi deploy
→ Phòng ngừa: Audit, Testing, Upgradeable patterns
```

---

## 📊 THỐNG KÊ VÀ METRICS

### Ethereum (Post-Merge)

```
Consensus: Proof of Stake (Casper FFG + LMD GHOST)
Block time: ~12 seconds
Finality: ~13 minutes (2 epochs)
Energy: ~0.01 TWh/year (↓99.95% vs PoW)
TPS: ~30 (Layer 1)
Validators: ~900,000
Min stake: 32 ETH
Reward: ~4% APR
Slashing: 1 ETH (minor) to 100% (major)
```

### Bitcoin (PoW)

```
Consensus: Proof of Work (SHA-256)
Block time: ~10 minutes
Finality: ~60 minutes (6 confirmations)
Energy: ~150 TWh/year
TPS: ~7
Hashrate: ~400 EH/s
Mining reward: 6.25 BTC (~$250K)
Difficulty adjust: Every 2016 blocks (~2 weeks)
```

### Hardhat Local

```
Consensus: None (instant mining)
Block time: ~0ms
Finality: Instant
Energy: Negligible
TPS: Unlimited
Accounts: 20 (pre-funded with 10K ETH each)
Cost: FREE
Reset: ✅ Possible
```

---

## 🎓 KẾT LUẬN

### Mã hóa (Cryptography)

```
Hash Functions:    Tạo IDs, liên kết blocks, kiểm tra toàn vẹn
Public Key Crypto: Tạo addresses, xác thực ownership
Digital Signatures: Chứng minh transactions, không thể giả mạo

→ Toán học đảm bảo bảo mật
→ Không phụ thuộc trust
```

### Đồng thuận (Consensus)

```
PoW:  Computational power → Security, but slow & energy-intensive
PoS:  Economic stake → Fast, efficient, secure
PoA:  Trust validators → Very fast, for private chains

→ Cơ chế đảm bảo tất cả nodes đồng ý
→ Chống gian lận & tấn công
```

### Blockchain = Cryptography + Consensus

```
Cryptography:  Bảo mật từng transaction
    +
Consensus:     Đồng ý về toàn bộ chain
    =
Blockchain:    Distributed ledger không cần trust
```

---

## 📚 TÀI LIỆU THAM KHẢO

### Mã hóa
- [Keccak-256 Specification](https://keccak.team/keccak.html)
- [ECDSA explained](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)
- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)

### Đồng thuận
- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf) - PoW original
- [Ethereum 2.0 Specs](https://github.com/ethereum/consensus-specs) - PoS
- [Consensus Mechanisms Comparison](https://ethereum.org/en/developers/docs/consensus-mechanisms/)

### Tools
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [MetaMask Documentation](https://docs.metamask.io/)

---

**Document Version:** 1.0  
**Last Updated:** December 18, 2025  
**Project:** Message Board DApp - Blockchain CNPM  

---

**🔐 Cryptography + 🤝 Consensus = 🔗 Blockchain Security!**
