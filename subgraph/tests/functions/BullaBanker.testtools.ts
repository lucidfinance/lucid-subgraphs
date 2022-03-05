import { Address, Bytes, ByteArray, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import { lucidBudgeteerCreated, LucidTagUpdated } from "../../generated/lucidBudgeteer/lucidBudgeteer";
import { toEthAddress, MOCK_MANAGER_ADDRESS, toUint256, DEFAULT_TIMESTAMP } from "../helpers";

export const newLucidTagUpdatedEvent = (tokenId: BigInt, updatedBy: Address, _tag: string): LucidTagUpdated => {
  const tag: Bytes = Bytes.fromByteArray(ByteArray.fromUTF8(_tag));
  const event: LucidTagUpdated = changetype<LucidTagUpdated>(newMockEvent());
  const lucidManagerParam = new ethereum.EventParam("lucidManager", toEthAddress(MOCK_MANAGER_ADDRESS));
  const tokenIdParam = new ethereum.EventParam("tokenId", toUint256(tokenId));
  const updatedByParam = new ethereum.EventParam("updatedBy", toEthAddress(updatedBy));
  const tagParam = new ethereum.EventParam("tag", ethereum.Value.fromBytes(tag));
  const blocktimeParam = new ethereum.EventParam("blocktime", toUint256(DEFAULT_TIMESTAMP.plus(BigInt.fromU32(1500))));
  event.parameters = [lucidManagerParam, tokenIdParam, updatedByParam, tagParam, blocktimeParam];

  return event;
};

export const newlucidBudgeteerCreatedEvent = (lucidManager: Address, lucidClaimERC721: Address, lucidBudgeteer: Address): lucidBudgeteerCreated => {
  const event: lucidBudgeteerCreated = changetype<lucidBudgeteerCreated>(newMockEvent());
  const lucidManagerParam = new ethereum.EventParam("lucidManager", toEthAddress(lucidManager));
  const lucidClaimERC721Param = new ethereum.EventParam("lucidClaimERC721", toEthAddress(lucidClaimERC721));
  const lucidBudgeteerParam = new ethereum.EventParam("lucidBudgeteer", toEthAddress(lucidBudgeteer));
  const timestampParam = new ethereum.EventParam("timestamp", toUint256(DEFAULT_TIMESTAMP));
  event.parameters = [lucidManagerParam, lucidClaimERC721Param, lucidBudgeteerParam, timestampParam];

  return event;
};
