import { BigInt, log } from "@graphprotocol/graph-ts";
import { assert, test } from "matchstick-as/assembly/index";
import {
  handleLucidTokenChanged,
  handleCollectorChanged,
  handleFeeChanged,
  handleFeeThresholdChanged,
  handleOwnerChanged,
  handleReducedFeeChanged
} from "../src/mappings/LucidManager";
import {
  newLucidTokenChangedEvent,
  newCollectorChangedEvent,
  newFeeChangedEvent,
  newFeeThresholdChangedEvent,
  newOwnerChangedEvent,
  newReducedFeeChangedEvent
} from "./functions/LucidManager.testtools";
import { ADDRESS_1, ADDRESS_2, afterEach, DESCRIPTION_BYTES, MOCK_BULLA_TOKEN_ADDRESS, MOCK_MANAGER_ADDRESS, MOCK_WETH_ADDRESS, setupContracts } from "./helpers";

const managerAddress = MOCK_MANAGER_ADDRESS;

test("it handles FeeChanged events", () => {
  setupContracts();

  const feeChangedEvent = newFeeChangedEvent();
  handleFeeChanged(feeChangedEvent);

  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "feeBasisPoints", feeChangedEvent.params.newFee.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedBlockNumber", feeChangedEvent.block.number.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedTimestamp", feeChangedEvent.block.timestamp.toString());

  log.info("✅ should handle the FeeChanged event and update LucidManager", []);

  afterEach();
});

test("it handles CollectorChanged event", () => {
  setupContracts();

  const collectorChangedEvent = newCollectorChangedEvent();
  handleCollectorChanged(collectorChangedEvent);

  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "feeCollectionAddress", collectorChangedEvent.params.newCollector.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedBlockNumber", collectorChangedEvent.block.number.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedTimestamp", collectorChangedEvent.block.timestamp.toString());

  log.info("✅ should handle the CollectorChanged event and update LucidManager", []);

  afterEach();
});

test("it handles OwnerChanged event", () => {
  setupContracts();

  const ownerChangedEvent = newOwnerChangedEvent();
  handleOwnerChanged(ownerChangedEvent);

  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "owner", ownerChangedEvent.params.newOwner.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedBlockNumber", ownerChangedEvent.block.number.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedTimestamp", ownerChangedEvent.block.timestamp.toString());

  log.info("✅ should handle the OwnerChanged event and update LucidManager", []);

  afterEach();
});

test("it handles LucidTokenChanged event", () => {
  setupContracts();

  const lucidTokenChangedEvent = newLucidTokenChangedEvent();
  handleLucidTokenChanged(lucidTokenChangedEvent);

  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lucidToken", lucidTokenChangedEvent.params.newLucidToken.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedBlockNumber", lucidTokenChangedEvent.block.number.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedTimestamp", lucidTokenChangedEvent.block.timestamp.toString());

  log.info("✅ should handle the LucidTokenChanged event and update LucidManager", []);

  afterEach();
});

test("it handles FeeThresholdChanged event", () => {
  setupContracts();

  const feeThresholdChangedEvent = newFeeThresholdChangedEvent();
  handleFeeThresholdChanged(feeThresholdChangedEvent);

  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lucidTokenThreshold", feeThresholdChangedEvent.params.newFeeThreshold.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedBlockNumber", feeThresholdChangedEvent.block.number.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedTimestamp", feeThresholdChangedEvent.block.timestamp.toString());

  log.info("✅ should handle the FeeThresholdChanged event and update LucidManager", []);

  afterEach();
});

test("it handles ReducedFeeChanged event", () => {
  setupContracts();

  const reducedFeeChangedEvent = newReducedFeeChangedEvent();
  handleReducedFeeChanged(reducedFeeChangedEvent);

  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "reducedFeeBasisPoints", reducedFeeChangedEvent.params.newFee.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedBlockNumber", reducedFeeChangedEvent.block.number.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lastUpdatedTimestamp", reducedFeeChangedEvent.block.timestamp.toString());

  log.info("✅ should handle the ReducedFeeChanged event and update LucidManager", []);

  afterEach();
});

test("it handles initialization and updates to the LucidManager", () => {
  setupContracts();

  const tokenThreshold = 2; // msg.sender needs 2 tokens to unlock a reduced fee
  const feeBPS = 10;
  const reducedFeeBPS = 5;
  const collectionAddress = ADDRESS_1;
  const owner = ADDRESS_1;

  /** simulation of constructor events and a setup of the lucid token */
  const feeChangedEvent = newFeeChangedEvent(feeBPS);
  const collectorChangedEvent = newCollectorChangedEvent(collectionAddress);
  const ownerChangedEvent = newOwnerChangedEvent(owner);

  handleFeeChanged(feeChangedEvent);
  handleCollectorChanged(collectorChangedEvent);
  handleOwnerChanged(ownerChangedEvent);

  /** simulate setting up the LucidManager configuration */
  const lucidTokenChangedEvent = newLucidTokenChangedEvent();
  const reduceFeeEvent = newReducedFeeChangedEvent(reducedFeeBPS);
  const reducedFeeTokenThresholdEvent = newFeeThresholdChangedEvent(tokenThreshold);

  handleLucidTokenChanged(lucidTokenChangedEvent);
  handleReducedFeeChanged(reduceFeeEvent);
  handleFeeThresholdChanged(reducedFeeTokenThresholdEvent);

  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "address", managerAddress.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "owner", owner.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "description", DESCRIPTION_BYTES.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lucidToken", MOCK_BULLA_TOKEN_ADDRESS.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "feeCollectionAddress", collectionAddress.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "feeBasisPoints", feeBPS.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "reducedFeeBasisPoints", reducedFeeBPS.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lucidTokenThreshold", tokenThreshold.toString());
  log.info("✅ should handle the complete setup of the LucidManager entity", []);

  // completely update the LucidManager properties
  const new_owner = ADDRESS_2;
  const new_lucidTokenAddress = MOCK_WETH_ADDRESS;
  const new_collectionAddress = ADDRESS_2;
  const new_feeBPS = 15;
  const new_reducedFeeBPS = 2;
  const new_tokenThreshold = 10;

  // simulation of the constructor event and a setup of the lucid token
  const new_ownerChangedEvent = newOwnerChangedEvent(new_owner);
  const new_lucidTokenChangedEvent = newLucidTokenChangedEvent(new_lucidTokenAddress);
  const new_collectorChangedEvent = newCollectorChangedEvent(new_collectionAddress);
  const new_feeChangedEvent = newFeeChangedEvent(new_feeBPS);
  // change the discount token to WETH
  const new_reduceFeeEvent = newReducedFeeChangedEvent(new_reducedFeeBPS);
  const new_reducedFeeTokenThresholdEvent = newFeeThresholdChangedEvent(new_tokenThreshold);

  const expectedTimestamp = new_reducedFeeTokenThresholdEvent.block.timestamp.plus(BigInt.fromU32(10000));
  const expectedBlockNumber = new_reducedFeeTokenThresholdEvent.block.number.plus(BigInt.fromU32(20));

  new_reducedFeeTokenThresholdEvent.block.timestamp = expectedTimestamp;
  new_reducedFeeTokenThresholdEvent.block.number = expectedBlockNumber;

  handleOwnerChanged(new_ownerChangedEvent);
  handleLucidTokenChanged(new_lucidTokenChangedEvent);
  handleCollectorChanged(new_collectorChangedEvent);
  handleFeeChanged(new_feeChangedEvent);
  handleReducedFeeChanged(new_reduceFeeEvent);
  handleFeeThresholdChanged(new_reducedFeeTokenThresholdEvent);

  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "address", managerAddress.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "owner", new_owner.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "description", DESCRIPTION_BYTES.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lucidToken", new_lucidTokenAddress.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "feeCollectionAddress", new_collectionAddress.toHexString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "feeBasisPoints", new_feeBPS.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "reducedFeeBasisPoints", new_reducedFeeBPS.toString());
  assert.fieldEquals("LucidManager", managerAddress.toHexString(), "lucidTokenThreshold", new_tokenThreshold.toString());
  log.info("✅ should handle a complete update to all mutable LucidManager options", []);

  afterEach();
});

export { handleLucidTokenChanged, handleCollectorChanged, handleFeeChanged, handleFeeThresholdChanged, handleOwnerChanged, handleReducedFeeChanged };
