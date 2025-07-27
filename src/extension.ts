import { ExtensionContext } from "vscode";
import { registerCreateFeatureCommand } from "./commands/createFeatureCommand";
import { registerCreateDevolutionFeatureCommand } from "./commands/createDevolutionFeatureCommand";
import { registerCreateDevolutionScreenCommand } from "./commands/createDevolutionScreenCommand";

export function activate(context: ExtensionContext) {
  registerCreateFeatureCommand(context);
  registerCreateDevolutionFeatureCommand(context);
  registerCreateDevolutionScreenCommand(context);
}

export function deactivate() {}
