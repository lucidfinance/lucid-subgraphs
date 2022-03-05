import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { LucidBudgeteerCreated } from "../../generated/LucidBudgeteer/LucidBudgeteer";
import { AccountTag, LucidBudgeteerCreatedEvent, LucidTagUpdatedEvent } from "../../generated/schema";

export const getLucidTagUpdatedEventId = (tokenId: BigInt, event: ethereum.Event): string =>
  "LucidTagUpdated-" + tokenId.toString() + "-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getAccountTagId = (tokenId: BigInt, userAddress: Bytes): string => tokenId.toString() + "-" + userAddress.toHexString();

export const getlucidBudgeteerCreatedId = (event: ethereum.Event): string => "lucidBudgeteerCreated-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getOrCreateLucidTagUpdatedEvent = (lucidTagUpdatedId: string): LucidTagUpdatedEvent => {
  let lucidTagUpdatedEvent = LucidTagUpdatedEvent.load(lucidTagUpdatedId);
  if (!lucidTagUpdatedEvent) lucidTagUpdatedEvent = new LucidTagUpdatedEvent(lucidTagUpdatedId);

  return lucidTagUpdatedEvent!;
};

export const getOrCreateAccountTag = (accountTagId: string): AccountTag => {
  let accountTag = AccountTag.load(accountTagId);
  if (!accountTag) accountTag = new AccountTag(accountTagId);

  return accountTag!;
};

export const createlucidBudgeteerCreatedEvent = (event: LucidBudgeteerCreated): LucidBudgeteerCreatedEvent => new LucidBudgeteerCreatedEvent(getlucidBudgeteerCreatedId(event));
