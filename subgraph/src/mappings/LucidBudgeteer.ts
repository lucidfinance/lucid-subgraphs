import { LucidBudgeteerCreated, LucidTagUpdated } from "../../generated/LucidBudgeteer/LucidBudgeteer";
import {
  createlucidBudgeteerCreatedEvent,
  getAccountTagId,
  getLucidTagUpdatedEventId,
  getOrCreateAccountTag,
  getOrCreateLucidTagUpdatedEvent
} from "../functions/LucidBudgeteer";
import { getOrCreateClaim } from "../functions/LucidTxERC721";

export function handleLucidTagUpdated(event: LucidTagUpdated): void {
  const ev = event.params;
  const tag = ev.tag.toString();
  const claimId = ev.tokenId;

  const tagUpdatedEventId = getLucidTagUpdatedEventId(event.params.tokenId, event);
  const tagUpdatedEvent = getOrCreateLucidTagUpdatedEvent(tagUpdatedEventId);

  tagUpdatedEvent.lucidManager = ev.lucidManager;
  tagUpdatedEvent.claim = claimId.toString();
  tagUpdatedEvent.updatedBy = ev.updatedBy;
  tagUpdatedEvent.tag = tag;
  tagUpdatedEvent.eventName = "LucidTagUpdated";
  tagUpdatedEvent.blockNumber = event.block.number;
  tagUpdatedEvent.transactionHash = event.transaction.hash;
  tagUpdatedEvent.logIndex = event.logIndex;
  tagUpdatedEvent.timestamp = event.block.timestamp;
  tagUpdatedEvent.save();

  const accountTagId = getAccountTagId(claimId, ev.updatedBy);
  const accountTag = getOrCreateAccountTag(accountTagId);

  accountTag.claim = claimId.toString();
  accountTag.userAddress = ev.updatedBy;
  accountTag.tag = tag;
  accountTag.save();

  const claim = getOrCreateClaim(claimId.toString());
  claim.lastUpdatedBlockNumber = event.block.number;
  claim.lastUpdatedTimestamp = event.block.timestamp;
  claim.save();
}

export function handlelucidBudgeteerCreated(event: LucidBudgeteerCreated): void {
  const ev = event.params;
  const lucidBudgeteerCreatedEvent = createlucidBudgeteerCreatedEvent(event);

  lucidBudgeteerCreatedEvent.lucidManager = ev.lucidManager;
  lucidBudgeteerCreatedEvent.lucidClaimERC721 = ev.lucidTxERC721;
  lucidBudgeteerCreatedEvent.lucidBudgeteer = ev.lucidBudgeteer;

  lucidBudgeteerCreatedEvent.timestamp = event.block.timestamp;
  lucidBudgeteerCreatedEvent.eventName = "lucidBudgeteerCreated";
  lucidBudgeteerCreatedEvent.blockNumber = event.block.number;
  lucidBudgeteerCreatedEvent.logIndex = event.logIndex;
  lucidBudgeteerCreatedEvent.transactionHash = event.transaction.hash;

  lucidBudgeteerCreatedEvent.save();
}
