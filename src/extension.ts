import { ExtensionContext } from "vscode";
import { registerCreateFeatureCommand } from "./commands/createFeatureCommand";

export function activate(context: ExtensionContext) {
  registerCreateFeatureCommand(context);
}

export function deactivate() {}
