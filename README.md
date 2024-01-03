# whitelist-address-mint 
## Demo
1. Clone this repository: `git clone git@github.com:ikmzkRo/WLA-mint.git`
2. Install packages: `yarn`
3. Add `.env` file
```
PRIVATE_KEY = ""
ALCHEMY_API_KEY = ""
ETHERSCAN_API_KEY = ""
COINMARKETCAP_API_KEY = ""
REPORT_GAS = "true"
```
4. Compile solidity code: `yarn run compile`
```
yarn run v1.22.21
$ hardhat compile
Nothing to compile
Done in 0.78s.
```
5. Debug testcode: `yarn run test test/IkmzERC721WL.test.ts`
```
yarn run v1.22.21
$ hardhat test test/IkmzERC721WL.test.ts
Compiled 19 Solidity files successfully (evm target: london).


  Verification of Merkle Proof Authentication using MerkleTree in merkletreejs.
Whitelist Merkle Tree
 └─ 2e35b61278fbcec3f3b0bb361d928e373e089a61758af09690ce0a5391078ff2
   ├─ b159efe4c3ee94e91cc5740b9dbb26fc5ef48a14b53ad84d591d0eb3d65891ab
   │  ├─ bc4a4ed157fa72898498bb307296ae1433d0fce7a8a54b914ecba0935ceb66db
   │  │  ├─ a75fc2c892c5f6169d4898ec344e04fefa775bec94ce9789162a33ba8190feaa
   │  │  └─ 0638d297af6d64984635a8a3ef8f9846d80e329bbc4257d664450ad460e05b67
   │  └─ 4dc98316390ed7bafbf7169a7fe567a3f601f8b790edcd0824a5869dd6716e0e
   │     ├─ d4bc9c4a8ea382b2b23a23c15df7c4282de14a2f2e4504677961a3dd9bfaaf6a
   │     └─ 7233f3daf0bfb978df9344d326d541ef989dcf2e6a83f05bf7d1b73e09bcd610
   └─ acded574e09cb6e9cacdce3bd3268fc5aa37ec3fc513b681b746f586a025cb4c
      ├─ 702d0f86c1baf15ac2b8aae489113b59d27419b751fbf7da0ef0bae4688abc7a
      │  ├─ 4f5b9af3c6d4ccfe4079f8b3847212ba15b98b06bd5d5348fb6cf33150d8a806
      │  └─ 548b0b7a29ad8ed0431801dc03fb78d10453e83bcff1e908227ab9f99760bf56
      └─ afe7c546eb582218cf94b848c36f3b058e2518876240ae6100c4ef23d38f3e07
         └─ afe7c546eb582218cf94b848c36f3b058e2518876240ae6100c4ef23d38f3e07

Root Hash:  <Buffer 2e 35 b6 12 78 fb ce c3 f3 b0 bb 36 1d 92 8e 37 3e 08 9a 61 75 8a f0 96 90 ce 0a 53 91 07 8f f2>
Hex Proof: [
  '0x702d0f86c1baf15ac2b8aae489113b59d27419b751fbf7da0ef0bae4688abc7a',
  '0xb159efe4c3ee94e91cc5740b9dbb26fc5ef48a14b53ad84d591d0eb3d65891ab'
]
Claiming Address: <Buffer af e7 c5 46 eb 58 22 18 cf 94 b8 48 c3 6f 3b 05 8e 25 18 87 62 40 ae 61 00 c4 ef 23 d3 8f 3e 07>
Allowlist Root Hash: <Buffer 2e 35 b6 12 78 fb ce c3 f3 b0 bb 36 1d 92 8e 37 3e 08 9a 61 75 8a f0 96 90 ce 0a 53 91 07 8f f2>
Verification Result: true
    ✔ [S] Verification of Merkle Proof Authentication

  setMerkleRoot check
    ✔ [S] Should set the Merkle Root correctly by Owner
    ✔ [R] Should not allow setting Merkle Root by non-owner

  whitelistMint check
    ✔ [S] Should successfully perform whitelistMint (50ms)


  4 passing (939ms)

Done in 4.80s.
```
6. Deploy contracts code: `npx hardhat run scripts/deploy/ikmzERC721WL.ts --network goerli`
7. Verify contracts code: `npx hardhat verify --network goerli ${6.CA}`

## Ref List
| Ref | Title |
| ---- | ---- |
| https://github.com/OpenZeppelin/merkle-tree | OpenZeppelin/merkle-tree |
| https://zenn.dev/sakuracase/articles/4f58609f3da6e8 | ゼロ知識でふんわり理解するマークルツリー |
| https://zenn.dev/mizuneko4345/articles/f0b7efe1eedd28 | Pythonで作るマークルツリー |
| https://zenn.dev/microverse_dev/articles/how-to-allowlist-mint | AllowList を用いた NFT の mint |
| https://zenn.dev/ryo_takahashi/scraps/ff70f43eb45856#comment-40095f6a46ae37 | META KAWAII 🍭 を支える技術 |
| https://zenn.dev/serinuntius/articles/35c1b6a042174e847766?redirected=1 | Uniswapが1200ものアドレスにトークン配布した方法が賢すぎるのでメモ |
| https://zenn.dev/serinuntius/articles/f56b3dc2871a03?redirected=1 | zkRollupの回路内で計算してること |
| https://zenn.dev/no_plan/articles/581be4ad731a79#merkle-proof%E3%82%92%E7%94%A8%E6%84%8F%E3%81%99%E3%82%8B | NFTを用いたCTFを開催したので問題作成者が解説してみる |
| https://zenn.dev/0xywzx/articles/bdb6c991f3fc8b | ZKP（zkSNARKs）の使い方と活用事例 |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
