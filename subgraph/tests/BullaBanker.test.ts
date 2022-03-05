import { log, BigInt } from "@graphprotocol/graph-ts";
import { assert, logStore, test } from "matchstick-as/assembly/index";
import { getAccountTagId, getlucidBudgeteerCreatedId, getLucidTagUpdatedEventId } from "../src/functions/lucidBudgeteer";
import { CLAIM_TYPE_INVOICE } from "../src/functions/common";
import { handlelucidBudgeteerCreated, handleLucidTagUpdated } from "../src/mappings/lucidBudgeteer";
import { handleClaimCreated } from "../src/mappings/LucidTxERC721";
import { newlucidBudgeteerCreatedEvent, newLucidTagUpdatedEvent } from "./functions/lucidBudgeteer.testtools";
import { newClaimCreatedEvent } from "./functions/LucidTxERC721.testtools";
import { afterEach, DEFAULT_ACCOUNT_TAG, MOCK_BANKER_ADDRESS, MOCK_CLAIM_ADDRRESS, MOCK_MANAGER_ADDRESS, setupContracts } from "./helpers";

test("it handles LucidTagUpdated events", () => {
  setupContracts();

  const claimCreatedEvent = newClaimCreatedEvent(1, CLAIM_TYPE_INVOICE);
  handleClaimCreated(claimCreatedEvent);

  const lucidTagUpdatedEvent = newLucidTagUpdatedEvent(claimCreatedEvent.params.tokenId, claimCreatedEvent.params.origin, DEFAULT_ACCOUNT_TAG);
  lucidTagUpdatedEvent.block.timestamp = claimCreatedEvent.block.timestamp.plus(BigInt.fromI32(20));
  lucidTagUpdatedEvent.block.number = claimCreatedEvent.block.number.plus(BigInt.fromI32(20));
  const lucidTagUpdatedEventId = getLucidTagUpdatedEventId(claimCreatedEvent.params.tokenId, claimCreatedEvent);

  handleLucidTagUpdated(lucidTagUpdatedEvent);

  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "lucidManager", lucidTagUpdatedEvent.params.lucidManager.toHexString());
  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "claim", lucidTagUpdatedEvent.params.tokenId.toString());
  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "updatedBy", lucidTagUpdatedEvent.params.updatedBy.toHexString());
  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "tag", DEFAULT_ACCOUNT_TAG);
  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "eventName", "LucidTagUpdated");
  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "blockNumber", lucidTagUpdatedEvent.block.number.toString());
  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "transactionHash", lucidTagUpdatedEvent.transaction.hash.toHexString());
  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "timestamp", lucidTagUpdatedEvent.block.timestamp.toString());
  assert.fieldEquals("LucidTagUpdatedEvent", lucidTagUpdatedEventId, "logIndex", lucidTagUpdatedEvent.logIndex.toString());
  log.info("✅ should create a LucidTagUpdated event", []);

  const accountTagId = getAccountTagId(claimCreatedEvent.params.tokenId, lucidTagUpdatedEvent.params.updatedBy);

  assert.fieldEquals("AccountTag", accountTagId, "claim", lucidTagUpdatedEvent.params.tokenId.toString());
  assert.fieldEquals("AccountTag", accountTagId, "userAddress", lucidTagUpdatedEvent.params.updatedBy.toHexString());
  assert.fieldEquals("AccountTag", accountTagId, "tag", DEFAULT_ACCOUNT_TAG);
  log.info("✅ should create an AccountTag entity", []);

  assert.fieldEquals("Claim", claimCreatedEvent.params.tokenId.toString(), "lastUpdatedBlockNumber", lucidTagUpdatedEvent.block.number.toString());
  assert.fieldEquals("Claim", claimCreatedEvent.params.tokenId.toString(), "lastUpdatedTimestamp", lucidTagUpdatedEvent.block.timestamp.toString());
  log.info("✅ should update the lastUpdated fields on the claim", []);

  afterEach();
});

test("it handles lucidBudgeteerCreated events", () => {
  setupContracts();

  const lucidBudgeteerCreatedEvent = newlucidBudgeteerCreatedEvent(MOCK_MANAGER_ADDRESS, MOCK_CLAIM_ADDRRESS, MOCK_BANKER_ADDRESS);
  const lucidBudgeteerCreatedEventId = getlucidBudgeteerCreatedId(lucidBudgeteerCreatedEvent);
  handlelucidBudgeteerCreated(lucidBudgeteerCreatedEvent);

  assert.fieldEquals("lucidBudgeteerCreatedEvent", lucidBudgeteerCreatedEventId, "lucidManager", lucidBudgeteerCreatedEvent.params.lucidManager.toHexString());
  assert.fieldEquals("lucidBudgeteerCreatedEvent", lucidBudgeteerCreatedEventId, "lucidClaimERC721", lucidBudgeteerCreatedEvent.params.lucidClaimERC721.toHexString());
  assert.fieldEquals("lucidBudgeteerCreatedEvent", lucidBudgeteerCreatedEventId, "lucidBudgeteer", lucidBudgeteerCreatedEvent.params.lucidBudgeteer.toHexString());
  assert.fieldEquals("lucidBudgeteerCreatedEvent", lucidBudgeteerCreatedEventId, "eventName", "lucidBudgeteerCreated");
  assert.fieldEquals("lucidBudgeteerCreatedEvent", lucidBudgeteerCreatedEventId, "blockNumber", lucidBudgeteerCreatedEvent.block.number.toString());
  assert.fieldEquals("lucidBudgeteerCreatedEvent", lucidBudgeteerCreatedEventId, "transactionHash", lucidBudgeteerCreatedEvent.transaction.hash.toHexString());
  assert.fieldEquals("lucidBudgeteerCreatedEvent", lucidBudgeteerCreatedEventId, "timestamp", lucidBudgeteerCreatedEvent.block.timestamp.toString());
  assert.fieldEquals("lucidBudgeteerCreatedEvent", lucidBudgeteerCreatedEventId, "logIndex", lucidBudgeteerCreatedEvent.logIndex.toString());
  log.info("✅ should create a lucidBudgeteerCreated event", []);

  afterEach();
});

export { handleLucidTagUpdated, handlelucidBudgeteerCreated };
