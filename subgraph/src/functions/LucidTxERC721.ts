import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { LucidManagerSet } from "../../generated/LucidTxERC721/LucidTxERC721";
import {
  Claim,
  ClaimPaymentEvent,
  ClaimRejectedEvent,
  ClaimRescindedEvent,
  FeePaidEvent,
  LucidManagerSetEvent,
  TransferEvent as ERC721TransferEvent
} from "../../generated/schema";

export const getTransferEventId = (tokenId: BigInt, event: ethereum.Event): string =>
  "Transfer-" + tokenId.toString() + "-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getFeePaidEventId = (tokenId: BigInt, event: ethereum.Event): string =>
  "FeePaid-" + tokenId.toString() + "-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getClaimRejectedEventId = (tokenId: BigInt, event: ethereum.Event): string =>
  "ClaimRejected-" + tokenId.toString() + "-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getClaimRescindedEventId = (tokenId: BigInt, event: ethereum.Event): string =>
  "ClaimRescinded-" + tokenId.toString() + "-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getClaimPaymentEventId = (tokenId: BigInt, event: ethereum.Event): string =>
  "ClaimPayment-" + tokenId.toString() + "-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getClaimCreatedEventId = (tokenId: BigInt, event: ethereum.Event): string =>
  "ClaimCreatedEvent-" + tokenId.toString() + "-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getLucidManagerSetId = (event: ethereum.Event): string => "LucidManagerSet-" + event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

export const getOrCreateFeePaidEvent = (feePaidId: string): FeePaidEvent => {
  let feePaidEvent = FeePaidEvent.load(feePaidId);
  if (feePaidEvent) feePaidEvent = new FeePaidEvent(feePaidId);

  return feePaidEvent!;
};

export const getOrCreateTransferEvent = (transferId: string): ERC721TransferEvent => {
  let transferEvent = ERC721TransferEvent.load(transferId);
  if (!transferEvent) transferEvent = new ERC721TransferEvent(transferId);

  return transferEvent!;
};

export const getOrCreateClaimRescindedEvent = (claimRescindedId: string): ClaimRescindedEvent => {
  let claimRescindedEvent = ClaimRescindedEvent.load(claimRescindedId);
  if (!claimRescindedEvent) claimRescindedEvent = new ClaimRescindedEvent(claimRescindedId);

  return claimRescindedEvent!;
};

export const getOrCreateClaimRejectedEvent = (claimRejectedId: string): ClaimRejectedEvent => {
  let claimRejectedEvent = ClaimRejectedEvent.load(claimRejectedId);
  if (!claimRejectedEvent) claimRejectedEvent = new ClaimRejectedEvent(claimRejectedId);

  return claimRejectedEvent!;
};

export const getOrCreateClaimPaymentEvent = (claimPaymentId: string): ClaimPaymentEvent => {
  let claimPaymentEvent = ClaimPaymentEvent.load(claimPaymentId);
  if (!claimPaymentEvent) claimPaymentEvent = new ClaimPaymentEvent(claimPaymentId);

  return claimPaymentEvent!;
};

export const getOrCreateClaim = (claimId: string): Claim => {
  let claim = Claim.load(claimId);
  if (!claim) claim = new Claim(claimId);

  return claim!;
};

export const createLucidManagerSet = (lucidManagerSetEvent: LucidManagerSet): LucidManagerSetEvent =>
  new LucidManagerSetEvent(getLucidManagerSetId(lucidManagerSetEvent));
