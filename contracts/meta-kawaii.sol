// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// https://zenn.dev/ryo_takahashi/scraps/ff70f43eb45856#comment-40095f6a46ae37

// アドレスを渡すとMerkleProofが返ってくるAPIのみ実装 運用コストは2円
// META KAWAIIコントラクトではMerkleTreeによるホワイトリストを採用している

// PresaleMintメソッドを呼び出す際に、引数として _merkleProof を渡す必要がある。
// この値を取得するAPIをCloudFunctionsにて生やしている

contract MetaKawaii is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    bytes32 public merkleRoot;
    mapping(address => bool) public whitelistClaimed;

    constructor() ERC721("whitelist", "WL") {}

    function preSaleMint(bytes32[] calldata _merkleProof)
        external
        payable
        // nonReentrant
    {
        // preSaleMintを呼び出しているアカウントアドレスの値をエンコードします
        // encodePacked は引数を直列にエンコードする関数で、この場合は msg.sender を単一の連結されたデータ（各バイトは16進数表現で表され、小文字に統一）としてエンコードします
        // keccak256 関数でエンコード後のアドレスをハッシュ化します
        // 計算されたハッシュを bytes32 型の変数 leaf に格納
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        // rootへの経路、現在値、leafを引数にして検証する
        require(
            MerkleProof.verify(
                _merkleProof,
                "", //whiteListRoot[currentPhase()],
                leaf
            ),
            "MerkleProof: Invalid proof."
        );
        // ...省略
    }
}