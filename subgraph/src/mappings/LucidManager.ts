import { FeeChanged, CollectorChanged, OwnerChanged, LucidTokenChanged, FeeThresholdChanged, ReducedFeeChanged } from "../../generated/LucidManager/LucidManager";
import { getOrCreateLucidManager, getOrCreateToken, getOrCreateUser } from "../functions/common";

export function handleFeeChanged(event: FeeChanged): void {
  const ev = event.params;
  const lucidManager = getOrCreateLucidManager(event);
  lucidManager.feeBasisPoints = ev.newFee.toI32();
  lucidManager.lastUpdatedBlockNumber = event.block.number;
  lucidManager.lastUpdatedTimestamp = event.block.timestamp;

  lucidManager.save();
}

export function handleCollectorChanged(event: CollectorChanged): void {
  const ev = event.params;
  const lucidManager = getOrCreateLucidManager(event);
  const user = getOrCreateUser(ev.newCollector);

  lucidManager.feeCollectionAddress = user.id;
  lucidManager.lastUpdatedBlockNumber = event.block.number;
  lucidManager.lastUpdatedTimestamp = event.block.timestamp;

  lucidManager.save();
}

export function handleOwnerChanged(event: OwnerChanged): void {
  const ev = event.params;
  const lucidManager = getOrCreateLucidManager(event);

  lucidManager.owner = ev.newOwner;
  lucidManager.lastUpdatedBlockNumber = event.block.number;
  lucidManager.lastUpdatedTimestamp = event.block.timestamp;

  lucidManager.save();
}

export function handleLucidTokenChanged(event: LucidTokenChanged): void {
  const ev = event.params;
  const token = getOrCreateToken(ev.newLucidToken);
  const lucidManager = getOrCreateLucidManager(event);

  lucidManager.lucidToken = token.id;
  lucidManager.lastUpdatedBlockNumber = event.block.number;
  lucidManager.lastUpdatedTimestamp = event.block.timestamp;

  lucidManager.save();
}

export function handleFeeThresholdChanged(event: FeeThresholdChanged): void {
  const ev = event.params;
  const lucidManager = getOrCreateLucidManager(event);

  lucidManager.lucidTokenThreshold = ev.newFeeThreshold.toI32();
  lucidManager.lastUpdatedBlockNumber = event.block.number;
  lucidManager.lastUpdatedTimestamp = event.block.timestamp;

  lucidManager.save();
}

export function handleReducedFeeChanged(event: ReducedFeeChanged): void {
  const ev = event.params;
  const lucidManager = getOrCreateLucidManager(event);

  lucidManager.reducedFeeBasisPoints = ev.newFee.toI32();
  lucidManager.lastUpdatedBlockNumber = event.block.number;
  lucidManager.lastUpdatedTimestamp = event.block.timestamp;

  lucidManager.save();
}
