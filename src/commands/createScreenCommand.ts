import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { ExtensionContext, commands, Uri, window } from "vscode";

import { toCamelCase, toPascalCase, toSnakeCase } from "../utils/stringUtil";

export function registerCreateScreenCommand(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    "extension.createScreen",
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

/// {@template ${snakeCaseScreenName}_screen.page}
/// ${pascalCaseScreenName}Page.
/// {@endtemplate}
final class ${pascalCaseScreenName}Page extends AppPlatformPage {
  /// {@macro ${snakeCaseScreenName}_screen.page}
  const ${pascalCaseScreenName}Page()
    : super(
        name: routeName,
        key: const ValueKey<String>(routeName),
        arguments: null,
        child: const ${pascalCaseScreenName}Screen(),
      );

  static const routeName = '${camelCaseScreenName}';
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
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
  }

  @override
  void didUpdateWidget(covariant ${pascalCaseScreenName}Screen oldWidget) {
    super.didUpdateWidget(oldWidget);
  }

  @override
  void dispose() {
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
