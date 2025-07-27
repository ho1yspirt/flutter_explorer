import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { ExtensionContext, commands, Uri, window } from "vscode";

import { toCamelCase, toPascalCase, toSnakeCase } from "../utils/stringUtil";

export function registerCreateDevolutionScreenCommand(
  context: ExtensionContext
) {
  let disposable = commands.registerCommand(
    "extension.createDevolutionScreen",
    async (uri: Uri) => {
      if (uri && uri.fsPath) {
        const screenName = await window.showInputBox({
          prompt: "Enter the name for the screen",
          placeHolder: "screen_name",
        });
        if (!screenName) {
          window.showWarningMessage("No screen name was provided.");
          return;
        }

        const snakeCaseScreenName = toSnakeCase(screenName);
        const camelCaseScreenName = toCamelCase(screenName);
        const pascalCaseScreenName = toPascalCase(screenName);

        const createFile = (filePath: string, content: string) =>
          writeFileSync(filePath, content);

        createFile(
          join(uri.fsPath, `${snakeCaseScreenName}_screen.dart`),
          `
import 'package:app_shared/navigator.dart';
import 'package:flutter/material.dart';

/// {@template ${snakeCaseScreenName}_screen.route}
/// ${pascalCaseScreenName}Route.
/// {@endtemplate}
final class ${pascalCaseScreenName}Route extends AppPlatformPage {
  /// {@macro ${snakeCaseScreenName}_screen.route}
  const ${pascalCaseScreenName}Route()
    : super(
        name: _name,
        key: const ValueKey<String>(_name),
        arguments: null,
        child: const ${pascalCaseScreenName}Screen(),
      );

  static const _name = '${camelCaseScreenName}';
}

/// {@template ${snakeCaseScreenName}_screen}
/// ${pascalCaseScreenName}Screen widget.
/// {@endtemplate}
class ${pascalCaseScreenName}Screen extends StatefulWidget {
  /// {@macro ${snakeCaseScreenName}_screen}
  const ${pascalCaseScreenName}Screen({super.key});

  @override
  State<${pascalCaseScreenName}Screen> createState() => _${pascalCaseScreenName}ScreenState();
}

/// State for widget ${pascalCaseScreenName}Screen.
class _${pascalCaseScreenName}ScreenState extends State<${pascalCaseScreenName}Screen> {
  /* #region Lifecycle */
  @override
  void initState() {
    super.initState();
    // Initial state initialization
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // The configuration of InheritedWidgets has changed
    // Also called after initState but before build
  }

  @override
  void didUpdateWidget(covariant ${pascalCaseScreenName}Screen oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Widget configuration changed
  }

  @override
  void dispose() {
    // Permanent removal of a tree stent
    super.dispose();
  }
  /* #endregion */

  @override
  Widget build(BuildContext context) => const Scaffold();
}`
        );

        window.showInformationMessage(
          `The "${screenName}"'s widget file is created.`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
