import { BigInt } from "@graphprotocol/graph-ts";
import { assert, log, test } from "matchstick-as";
import { getGnosisModuleConfigId } from "../src/functions/lucidBudgeteerModule";
import { handlelucidBudgeteerModuleDeploy } from "../src/mappings/lucidBudgeteerModule";
import { newlucidBudgeteerModuleDeployEvent } from "./functions/lucidBudgeteerModule.testtools";
import { afterEach, MOCK_SAFE_ADDRESS, setupContracts } from "./helpers";

test("it handles lucidBudgeteerModuleDeploy events", () => {
  setupContracts();

  const safeAddress = MOCK_SAFE_ADDRESS;
  const version = "0.1";
  const lucidBudgeteerModuleDeployedEvent = newlucidBudgeteerModuleDeployEvent(version, safeAddress);
  const lucidGnosisModuleConfigId = getGnosisModuleConfigId(lucidBudgeteerModuleDeployedEvent);
  handlelucidBudgeteerModuleDeploy(lucidBudgeteerModuleDeployedEvent);

  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "moduleAddress", lucidBudgeteerModuleDeployedEvent.params.moduleAddress.toHexString());
  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "safeAddress", safeAddress.toHexString());
  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "version", version);
  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "installationTimestamp", lucidBudgeteerModuleDeployedEvent.block.timestamp.toString());

  log.info("✅ should handle the lucidBudgeteerModuleDeploy event and create a lucidBudgeteerGnosisModuleConfig", []);

  //** simulate an update to the module (redeploy) */
  const newVersion = "0.2";
  const currentUnixTimestamp = BigInt.fromI32(1000);
  const lucidBudgeteerModuleUpdateEvent = newlucidBudgeteerModuleDeployEvent(newVersion);
  lucidBudgeteerModuleUpdateEvent.block.timestamp = currentUnixTimestamp;

  handlelucidBudgeteerModuleDeploy(lucidBudgeteerModuleUpdateEvent);

  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "moduleAddress", lucidBudgeteerModuleUpdateEvent.params.moduleAddress.toHexString());
  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "prevModuleAddress", lucidBudgeteerModuleDeployedEvent.params.moduleAddress.toHexString());
  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "safeAddress", safeAddress.toHexString());
  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "version", newVersion);
  assert.fieldEquals("lucidBudgeteerGnosisModuleConfig", lucidGnosisModuleConfigId, "installationTimestamp", currentUnixTimestamp.toString());

  log.info("✅ should handle the lucidBudgeteerModuleDeploy event and update the existing lucidBudgeteerGnosisModuleConfig", []);

  afterEach();
});
