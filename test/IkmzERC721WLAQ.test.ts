const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai from "chai";
import ChaiAsPromised from "chai-as-promised";
chai.use(ChaiAsPromised);


// ***** ***** ***** ***** ***** ***** ***** ***** // 
// yarn run test test/IkmzERC721WLAQ.test.ts
// ***** ***** ***** ***** ***** ***** ***** ***** // 


let IkmzERC721WLAQFactory: Contract;
let IkmzERC721WLAQ: Contract;
let owner: SignerWithAddress;
let notOwner: SignerWithAddress;
let allowListedUser: any;
let notListedUser: any
// TODO: any 使うな馬鹿者！
let rootHash: any;
let hexProof: any;
let rootHashHexString: any;
const zeroAddress = '0x0000000000000000000000000000000000000000000000000000000000000000'


beforeEach(async () => {
  // 一般的には、getSigners()で返される配列の最初の署名者が、スマートコントラクトをデプロイしたアカウント、つまりowner権限を持つこととなります
  [owner, notOwner, allowListedUser, notListedUser] = await ethers.getSigners();

  // Define the Merkle Tree for whitelist verification
  const inputs = [
    {
      address: allowListedUser.address,
      quantity: 1,
    },
    {
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      quantity: 2,
    },
    {
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      quantity: 1,
    },
  ];

  // https://docs.ethers.org/v5/api/utils/hashing/#utils-solidityKeccak256
  // ethers.utils.solidityKeccak256はv5.7で実現可能
  // v6.x以降ではundefinedとなる
  const leaves = inputs.map((x) =>
    ethers.utils.solidityKeccak256(
      ["address", "uint256"],
      [x.address, x.quantity]
    )
  );

  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  // console.log(tree.toString());
  // └─ cd1ce05417f11ebd5c23784283d21a968ac750e5ac2c2baa6b82835f4ea7caf7
  //  ├─ f92db5e3e1d6bed45d8e50fad47eddeb89c5453802b5cb6d944df2f3679da55c
  //  │  ├─ 3f68e79174daf15b50e15833babc8eb7743e730bb9606f922c48e95314c3905c
  //  │  └─ b783e75c6c50486379cdb997f72be5bb2b6faae5b2251999cae874bc1b040af7
  //  └─ d0583fe73ce94e513e73539afcb4db4c1ed1834a418c3f0ef2d5cff7c8bb1dee
  //     └─ d0583fe73ce94e513e73539afcb4db4c1ed1834a418c3f0ef2d5cff7c8bb1dee

  hexProof = leaves.map(leaf => tree.getHexProof(leaf))
  console.log('hexProof', hexProof);
  // hexProof[
  //   [
  //     '0xb783e75c6c50486379cdb997f72be5bb2b6faae5b2251999cae874bc1b040af7',
  //     '0xd0583fe73ce94e513e73539afcb4db4c1ed1834a418c3f0ef2d5cff7c8bb1dee'
  //   ],
  //   [
  //     '0xf92db5e3e1d6bed45d8e50fad47eddeb89c5453802b5cb6d944df2f3679da55c'
  //   ],
  //   [
  //     '0x3f68e79174daf15b50e15833babc8eb7743e730bb9606f922c48e95314c3905c',
  //     '0xd0583fe73ce94e513e73539afcb4db4c1ed1834a418c3f0ef2d5cff7c8bb1dee'
  //   ]
  // ]

  rootHashHexString = tree.getHexRoot();
  console.log('rootHashHexString', rootHashHexString);

  // Deploy the IkmzERC721WLAQ contract
  IkmzERC721WLAQFactory = await ethers.getContractFactory("IkmzERC721WLAQ");
  IkmzERC721WLAQ = await IkmzERC721WLAQFactory.deploy(rootHashHexString);
});

describe("setMerkleRoot check", () => {
  it("[S] Should set the Merkle Root correctly by Owner", async function () {
    // Verify if the Merkle Root is set correctly
    expect(await IkmzERC721WLAQ.getMerkleRoot()).to.equal(rootHashHexString);
  });

  it("[R] Should not allow setting Merkle Root by notOwner", async function () {
    // Attempt to set the Merkle Root by a notOwner
    await expect(
      IkmzERC721WLAQ
        .connect(notOwner)
        .setMerkleRoot(rootHashHexString)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});

describe("whitelistMint check", () => {
  it("[S] Should successfully perform whitelistMint", async () => {
    // Test the current balance of allowListedUser and notListedUser
    expect(await IkmzERC721WLAQ.balanceOf(allowListedUser.address)).to.be.equal(BigInt(0));
    expect(await IkmzERC721WLAQ.balanceOf(notListedUser.address)).to.be.equal(BigInt(0));

    // Test the mint function call after setting the Merkle Root
    await IkmzERC721WLAQ.connect(owner).setMerkleRoot(rootHashHexString);
    expect(await IkmzERC721WLAQ.getMerkleRoot()).to.equal(rootHashHexString);

    console.log(' hexProof[0]', hexProof[0]);
    await IkmzERC721WLAQ.connect(allowListedUser).whitelistMint(1, hexProof[0]);

    // Test the balance after minting
    expect(await IkmzERC721WLAQ.balanceOf(allowListedUser.address)).to.be.equal(BigInt(1));
    expect(await IkmzERC721WLAQ.balanceOf(notListedUser.address)).to.be.equal(BigInt(0));

    // Ensure that non-listed user cannot mint with an invalid proof
    await expect(
      IkmzERC721WLAQ.connect(notListedUser).whitelistMint(1, hexProof[0])
    ).to.be.revertedWith("invalid proof");
  });
});
