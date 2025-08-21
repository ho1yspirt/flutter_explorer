import { ExtensionContext } from "vscode";
import { registerCreateBlocCommand } from "./commands/createBlocCommand";
import { registerCreateFetchBlocCommand } from "./commands/createFetchBlocCommand";
import { registerCreateFeatureCommand } from "./commands/createFeatureCommand";
import { registerCreateScreenCommand } from "./commands/createScreenCommand";

export function activate(context: ExtensionContext) {
  registerCreateBlocCommand(context);
  registerCreateFeatureCommand(context);
  registerCreateFetchBlocCommand(context);
  registerCreateScreenCommand(context);
}

export function deactivate() {}
