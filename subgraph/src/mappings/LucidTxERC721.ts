import { Bytes } from "@graphprotocol/graph-ts";
import {
  LucidManagerSet,
  ClaimCreated,
  ClaimPayment,
  ClaimRejected,
  ClaimRescinded,
  FeePaid,
  Transfer as ERC721TransferEvent
} from "../../generated/LucidTxERC721/LucidTxERC721";
import { ClaimCreatedEvent, FeePaidEvent } from "../../generated/schema";
import {
  createLucidManagerSet,
  getClaimCreatedEventId,
  getClaimPaymentEventId,
  getClaimRejectedEventId,
  getClaimRescindedEventId,
  getFeePaidEventId,
  getOrCreateClaim,
  getOrCreateClaimPaymentEvent,
  getOrCreateClaimRejectedEvent,
  getOrCreateClaimRescindedEvent,
  getOrCreateTransferEvent,
  getTransferEventId
} from "../functions/LucidTxERC721";
import {
  ADDRESS_ZERO,
  CLAIM_STATUS_PAID,
  CLAIM_STATUS_PENDING,
  CLAIM_STATUS_REJECTED,
  CLAIM_STATUS_REPAYING,
  CLAIM_STATUS_RESCINDED,
  CLAIM_TYPE_INVOICE,
  CLAIM_TYPE_PAYMENT,
  getIPFSHash,
  getOrCreateToken,
  getOrCreateUser
} from "../functions/common";

export function handleTransfer(event: ERC721TransferEvent): void {
  const ev = event.params;
  const transferId = getTransferEventId(event.params.tokenId, event);
  const tokenId = ev.tokenId.toString();
  const isMintEvent = ev.from.equals(Bytes.fromHexString(ADDRESS_ZERO));

  if (!isMintEvent) {
    const user_newOwner = getOrCreateUser(ev.to);
    const transferEvent = getOrCreateTransferEvent(transferId);

    transferEvent.tokenId = tokenId;
    transferEvent.from = ev.from;
    transferEvent.to = ev.to;
    transferEvent.claim = tokenId;
    transferEvent.eventName = "Transfer";
    transferEvent.blockNumber = event.block.number;
    transferEvent.transactionHash = event.transaction.hash;
    transferEvent.logIndex = event.logIndex;
    transferEvent.timestamp = event.block.timestamp;
    transferEvent.save();

    const claim = getOrCreateClaim(tokenId);
    claim.isTransferred = true;
    claim.creditor = user_newOwner.id;
    claim.lastUpdatedBlockNumber = event.block.number;
    claim.lastUpdatedTimestamp = event.block.timestamp;
    claim.save();
  }
}

export function handleFeePaid(event: FeePaid): void {
  const ev = event.params;
  const feePaidEventId = getFeePaidEventId(event.params.tokenId, event);
  const tokenId = ev.tokenId.toString();
  const feePaidEvent = new FeePaidEvent(feePaidEventId);

  feePaidEvent.id = feePaidEventId;
  feePaidEvent.lucidManager = ev.lucidManager;
  feePaidEvent.claim = tokenId;
  feePaidEvent.collectionAddress = ev.collectionAddress;
  feePaidEvent.paymentAmount = ev.paymentAmount;
  feePaidEvent.transactionFee = ev.transactionFee;
  feePaidEvent.eventName = "FeePaid";
  feePaidEvent.blockNumber = event.block.number;
  feePaidEvent.transactionHash = event.transaction.hash;
  feePaidEvent.logIndex = event.logIndex;
  feePaidEvent.timestamp = event.block.timestamp;
  feePaidEvent.save();
}

export function handleClaimRescinded(event: ClaimRescinded): void {
  const ev = event.params;
  const tokenId = ev.tokenId.toString();
  const claimRescindedEventId = getClaimRescindedEventId(event.params.tokenId, event);

  const claimRescindedEvent = getOrCreateClaimRescindedEvent(claimRescindedEventId);
  claimRescindedEvent.lucidManager = ev.lucidManager;
  claimRescindedEvent.claim = tokenId;
  claimRescindedEvent.eventName = "ClaimRescinded";
  claimRescindedEvent.blockNumber = event.block.number;
  claimRescindedEvent.transactionHash = event.transaction.hash;
  claimRescindedEvent.logIndex = event.logIndex;
  claimRescindedEvent.timestamp = event.block.timestamp;
  claimRescindedEvent.save();

  const claim = getOrCreateClaim(tokenId);
  claim.lastUpdatedBlockNumber = event.block.number;
  claim.lastUpdatedTimestamp = event.block.timestamp;
  claim.status = CLAIM_STATUS_RESCINDED;
  claim.save();
}

export function handleClaimRejected(event: ClaimRejected): void {
  const ev = event.params;
  const tokenId = ev.tokenId.toString();
  const claimRejectedEventId = getClaimRejectedEventId(event.params.tokenId, event);

  const claimRejectedEvent = getOrCreateClaimRejectedEvent(claimRejectedEventId);
  claimRejectedEvent.managerAddress = ev.lucidManager;
  claimRejectedEvent.claim = tokenId;
  claimRejectedEvent.eventName = "ClaimRejected";
  claimRejectedEvent.blockNumber = event.block.number;
  claimRejectedEvent.transactionHash = event.transaction.hash;
  claimRejectedEvent.logIndex = event.logIndex;
  claimRejectedEvent.timestamp = event.block.timestamp;
  claimRejectedEvent.save();

  const claim = getOrCreateClaim(tokenId);
  claim.lastUpdatedBlockNumber = event.block.number;
  claim.lastUpdatedTimestamp = event.block.timestamp;
  claim.status = CLAIM_STATUS_REJECTED;
  claim.save();
}

export function handleClaimPayment(event: ClaimPayment): void {
  const ev = event.params;
  const claimPaymentEventId = getClaimPaymentEventId(event.params.tokenId, event);
  const claimPaymentEvent = getOrCreateClaimPaymentEvent(claimPaymentEventId);

  claimPaymentEvent.lucidManager = ev.lucidManager;
  claimPaymentEvent.claim = ev.tokenId.toString();
  claimPaymentEvent.debtor = ev.debtor;
  claimPaymentEvent.paidBy = ev.paidBy;
  claimPaymentEvent.paymentAmount = ev.paymentAmount;
  claimPaymentEvent.eventName = "ClaimPayment";
  claimPaymentEvent.blockNumber = event.block.number;
  claimPaymentEvent.transactionHash = event.transaction.hash;
  claimPaymentEvent.logIndex = event.logIndex;
  claimPaymentEvent.timestamp = event.block.timestamp;
  claimPaymentEvent.save();
  //TODO: fix repaying event sourcing issues
  const claim = getOrCreateClaim(ev.tokenId.toString());
  const totalPaidAmount = claim.paidAmount.plus(ev.paymentAmount);
  const isClaimPaid = totalPaidAmount.equals(claim.amount);

  claim.paidAmount = totalPaidAmount;
  claim.status = isClaimPaid ? CLAIM_STATUS_PAID : CLAIM_STATUS_REPAYING;
  claim.lastUpdatedBlockNumber = event.block.number;
  claim.lastUpdatedTimestamp = event.block.timestamp;
  claim.save();
}

export function handleLucidManagerSetEvent(event: LucidManagerSet): void {
  const ev = event.params;
  const lucidManagerSetEvent = createLucidManagerSet(event);
  lucidManagerSetEvent.prevLucidManager = ev.prevLucidManager;
  lucidManagerSetEvent.newLucidManager = ev.newLucidManager;
  lucidManagerSetEvent.eventName = "LucidManagerSet";
  lucidManagerSetEvent.blockNumber = event.block.number;
  lucidManagerSetEvent.transactionHash = event.transaction.hash;
  lucidManagerSetEvent.logIndex = event.logIndex;
  lucidManagerSetEvent.timestamp = event.block.timestamp;

  lucidManagerSetEvent.save();
}

export function handleClaimCreated(event: ClaimCreated): void {
  const ev = event.params;
  const token = getOrCreateToken(ev.claim.claimToken);
  const ipfsHash = getIPFSHash(ev.claim.attachment);

  const tokenId = ev.tokenId.toString();
  const claim = getOrCreateClaim(tokenId);
  const user_creditor = getOrCreateUser(ev.creditor);
  const user_debtor = getOrCreateUser(ev.debtor);
  const user_creator = getOrCreateUser(ev.origin);

  claim.tokenId = tokenId;
  claim.ipfsHash = ipfsHash;
  claim.creator = user_creator.id;
  claim.creditor = user_creditor.id;
  claim.debtor = user_debtor.id;
  claim.amount = ev.claim.claimAmount;
  claim.paidAmount = ev.claim.paidAmount;
  claim.isTransferred = false;
  claim.description = ev.description;
  claim.created = event.block.timestamp;
  claim.dueBy = ev.claim.dueBy;
  claim.claimType = ev.origin.equals(ev.creditor) ? CLAIM_TYPE_INVOICE : CLAIM_TYPE_PAYMENT;
  claim.token = token.id;
  claim.status = CLAIM_STATUS_PENDING;
  claim.transactionHash = event.transaction.hash;
  claim.lastUpdatedBlockNumber = event.block.number;
  claim.lastUpdatedTimestamp = event.block.timestamp;
  claim.lucidClaimAddress = event.address;

  claim.save();

  const claimCreatedEventId = getClaimCreatedEventId(ev.tokenId, event);
  const claimCreatedEvent = new ClaimCreatedEvent(claimCreatedEventId);
  claimCreatedEvent.claim = claim.id;
  claimCreatedEvent.lucidManager = ev.lucidManager;
  claimCreatedEvent.parent = ev.parent;
  claimCreatedEvent.creator = ev.origin;
  claimCreatedEvent.debtor = ev.claim.debtor;
  claimCreatedEvent.creditor = ev.creditor;
  claimCreatedEvent.claimToken = token.id;
  claimCreatedEvent.description = ev.description;
  claimCreatedEvent.timestamp = ev.blocktime;
  claimCreatedEvent.ipfsHash = ipfsHash;
  claimCreatedEvent.amount = ev.claim.claimAmount;
  claimCreatedEvent.dueBy = ev.claim.dueBy;

  claimCreatedEvent.eventName = "ClaimCreated";
  claimCreatedEvent.blockNumber = event.block.number;
  claimCreatedEvent.transactionHash = event.transaction.hash;
  claimCreatedEvent.logIndex = event.logIndex;
  claimCreatedEvent.timestamp = event.block.timestamp;
  claimCreatedEvent.save();

  user_creditor.claims = user_creditor.claims ? user_creditor.claims.concat([claim.id]) : [claim.id];
  user_debtor.claims = user_debtor.claims ? user_debtor.claims.concat([claim.id]) : [claim.id];
  user_creator.claims = user_creator.claims ? user_creator.claims.concat([claim.id]) : [claim.id];

  user_creditor.save();
  user_debtor.save();
  user_creator.save();
}
