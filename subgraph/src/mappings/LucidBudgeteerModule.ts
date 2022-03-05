import { LucidBudgeteerModuleDeploy } from "../../generated/LucidBudgeteerModule/LucidBudgeteerModule";
import { LucidBudgeteerGnosisModuleConfig } from "../../generated/schema";
import { getGnosisModuleConfigId } from "../functions/LucidBudgeteerModule";
import { getOrCreateUser } from "../functions/common";

export function handlelucidBudgeteerModuleDeploy(event: LucidBudgeteerModuleDeploy): void {
  const ev = event.params;
  const safeUser = getOrCreateUser(ev.safe);

  const lucidGnosisModuleConfigId = getGnosisModuleConfigId(event);
  let gnosisModuleConfig = LucidBudgeteerGnosisModuleConfig.load(lucidGnosisModuleConfigId);

  // if the module config exists, set the previous address for the frontend to include it as a disableModule tx
  if (gnosisModuleConfig) {
    gnosisModuleConfig.prevModuleAddress = gnosisModuleConfig.moduleAddress;
  }

  if (gnosisModuleConfig === null) {
    gnosisModuleConfig = new LucidBudgeteerGnosisModuleConfig(lucidGnosisModuleConfigId);
  }

  gnosisModuleConfig.moduleAddress = ev.moduleAddress;
  gnosisModuleConfig.safeAddress = ev.safe;
  gnosisModuleConfig.safe = safeUser.id;
  gnosisModuleConfig.version = ev.version;
  gnosisModuleConfig.installationTimestamp = event.block.timestamp;
  gnosisModuleConfig.save();
}
