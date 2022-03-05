import { LucidBudgeteerModuleDeploy } from "../../generated/LucidBudgeteerModule/LucidBudgeteerModule";
import { LucidBudgeteerGnosisModuleConfig } from "../../generated/schema";

export const getGnosisModuleConfigId = (deployEvent: LucidBudgeteerModuleDeploy): string => "GnosisSafe:" + deployEvent.params.safe.toHexString() + "-ModuleConfig";

export const getOrCreateLucidGnosisModuleConfig = (event: LucidBudgeteerModuleDeploy): LucidBudgeteerGnosisModuleConfig => {
  const lucidGnosisModuleConfigId = getGnosisModuleConfigId(event);
  let lucidGnosisModuleConfig = LucidBudgeteerGnosisModuleConfig.load(lucidGnosisModuleConfigId);

  if (lucidGnosisModuleConfig === null) {
    lucidGnosisModuleConfig = new LucidBudgeteerGnosisModuleConfig(lucidGnosisModuleConfigId);
  }

  return lucidGnosisModuleConfig!;
};
