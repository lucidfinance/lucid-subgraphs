import { Address, Bytes, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { encode } from "as-base58/assembly/index";
import { ClaimCreatedClaimAttachmentStruct } from "../../generated/LucidTxERC721/LucidTxERC721";
import { ERC20 } from "../../generated/LucidTxERC721/ERC20";
import { LucidManager as LucidManagerContract } from "../../generated/LucidManager/LucidManager";
import { LucidManager, Token, User } from "../../generated/schema";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const EMPTY_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const CLAIM_TYPE_INVOICE = "Invoice";
export const CLAIM_TYPE_PAYMENT = "Payment";

export const CLAIM_STATUS_PENDING = "Pending";
export const CLAIM_STATUS_REJECTED = "Rejected";
export const CLAIM_STATUS_RESCINDED = "Rescinded";
export const CLAIM_STATUS_REPAYING = "Repaying";
export const CLAIM_STATUS_PAID = "Paid";

export const multihashStructToBase58 = (hash: Bytes, size: u32, hashFunction: u32): string => {
  const hashBuffer = new Uint8Array(34);
  hashBuffer[0] = hashFunction;
  hashBuffer[1] = size;
  for (let i = 0; i < 32; i++) {
    hashBuffer[i + 2] = hash[i];
  }
  // hashBuffer.set(hash, 2);

  return encode(hashBuffer);
};

export const getIPFSHash = (attachment: ClaimCreatedClaimAttachmentStruct): string | null => {
  if (attachment.hash.equals(Bytes.fromHexString(EMPTY_BYTES32))) return null;
  const ipfsHash = multihashStructToBase58(attachment.hash, attachment.size, attachment.hashFunction);
  return ipfsHash;
};

export const getOrCreateUser = (address: Address): User => {
  let user = User.load(address.toHexString());
  if (!user) {
    user = new User(address.toHexString());
    user.address = address;
    user.claims = [];
    user.save();
  }

  return user!;
};

export const getOrCreateToken = (tokenAddress: Address): Token => {
  let token = Token.load(tokenAddress.toHexString());
  if (token === null) {
    const TokenContract = ERC20.bind(tokenAddress);
    token = new Token(tokenAddress.toHexString());
    token.address = tokenAddress;
    token.decimals = TokenContract.decimals();
    token.symbol = TokenContract.symbol();
    token.isNative = tokenAddress.equals(Address.fromHexString(ADDRESS_ZERO));
    token.network = dataSource.network();
    token.save();
  }
  return token!;
};

export const getOrCreateLucidManager = (event: ethereum.Event): LucidManager => {
  const address = event.address.toHexString();
  let lucidManager = LucidManager.load(address);

  if (lucidManager === null) {
    const lucidManagerContract = LucidManagerContract.bind(event.address);

    lucidManager = new LucidManager(address);
    lucidManager.address = event.address;
    lucidManager.description = lucidManagerContract.description().toString();
    lucidManager.lastUpdatedBlockNumber = event.block.number;
    lucidManager.lastUpdatedTimestamp = event.block.timestamp;
    lucidManager.save();
  }

  return lucidManager!;
};
