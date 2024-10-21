import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createSpecificFolder",
    async (uri: vscode.Uri) => {
      if (uri && uri.fsPath) {
        const featureFolderName = await vscode.window.showInputBox({
          prompt: "Enter the name for the root parent folder",
          placeHolder: "feature",
        });

        if (!featureFolderName) {
          vscode.window.showWarningMessage("No folder name was provided.");
          return;
        }

        const feature = path.join(uri.fsPath, featureFolderName);
        if (!fs.existsSync(feature)) fs.mkdirSync(feature);

        const bloc = path.join(feature, "bloc");
        const services = path.join(feature, "services");
        const data = path.join(feature, "data");
        const widget = path.join(feature, "widget");
        fs.mkdirSync(bloc);
        fs.mkdirSync(services);
        fs.mkdirSync(data);
        fs.mkdirSync(widget);

        const datasources = path.join(data, "datasources");
        fs.mkdirSync(datasources);

        const local = path.join(datasources, "local");
        const remote = path.join(datasources, "remote");
        fs.mkdirSync(local);
        fs.mkdirSync(remote);

        const repositories = path.join(data, "repositories");
        fs.mkdirSync(repositories);

        const models = path.join(data, "models");
        fs.mkdirSync(models);

        const screens = path.join(widget, "screens");
        fs.mkdirSync(screens);

        fs.mkdirSync(path.join(widget, "widgets"));

        const createFile = (filePath: string, content: string) =>
          fs.writeFileSync(filePath, content);

        const capitalize = (str: string) =>
          str.charAt(0).toUpperCase() + str.slice(1);

        const downcaseFeatureName = featureFolderName;
        const upcaseFeatureName = capitalize(featureFolderName);

        createFile(
          path.join(datasources, `${featureFolderName}_datasource.dart`),
          `
/// {@template i_${downcaseFeatureName}_datasource}
///  Interface for I${upcaseFeatureName}Datasource.
/// {@endtemplate}
abstract interface class I${upcaseFeatureName}Datasource {}
`
        );
        createFile(
          path.join(remote, `remote_${featureFolderName}_datasource.dart`),
          `
import '../../../../../core/components/rest_client/rest_client.dart';
import '../${featureFolderName}_datasource.dart';

/// {@template remote_${downcaseFeatureName}_datasource}
/// Remote${upcaseFeatureName}Datasource.
/// {@endtemplate}
final class Remote${upcaseFeatureName}Datasource implements I${upcaseFeatureName}Datasource {
	/// {@macro remote_${downcaseFeatureName}_datasource}
	const Remote${upcaseFeatureName}Datasource(
		IRestClient restClient,
	) : _restClient = restClient;

	final IRestClient _restClient;
}
`
        );
        createFile(
          path.join(local, `local_${featureFolderName}_datasource.dart`),
          `
import '../${featureFolderName}_datasource.dart';

/// {@template local_${downcaseFeatureName}_datasource}
/// Local${upcaseFeatureName}Datasource.
/// {@endtemplate}
final class Local${upcaseFeatureName}Datasource implements I${upcaseFeatureName}Datasource {
	/// {@macro local_${downcaseFeatureName}_datasource}
	const ${upcaseFeatureName}();
}
`
        );
        createFile(
          path.join(repositories, `${featureFolderName}_repository.dart`),
          `
import '../datasources/${featureFolderName}_datasource.dart';

/// {@template ${downcaseFeatureName}_repository}
///  Interface for ${upcaseFeatureName}Repository.
/// {@endtemplate}
abstract interface class I${upcaseFeatureName}Repository {
}

/// {@template ${downcaseFeatureName}_repository}
/// ${upcaseFeatureName}Repository
/// {@endtemplate}
final class ${upcaseFeatureName}Repository implements I${upcaseFeatureName}Repository {
  /// {@macro ${downcaseFeatureName}_repository}
  const ${upcaseFeatureName}Repository(
    I${upcaseFeatureName}Datasource local${upcaseFeatureName}Datasource,
    I${upcaseFeatureName}Datasource remote${upcaseFeatureName}Datasource,
  ) : _local${upcaseFeatureName}Datasource = local${upcaseFeatureName}Datasource,
		_remote${upcaseFeatureName}Datasource = remote${upcaseFeatureName}Datasource;

  final I${upcaseFeatureName}Datasource _local${upcaseFeatureName}Datasource;
  final I${upcaseFeatureName}Datasource _remote${upcaseFeatureName}Datasource;
}
`
        );
        createFile(
          path.join(models, `${featureFolderName}_model.dart`),
          `
/// {@template ${featureFolderName}_model}
/// ${upcaseFeatureName}Model.
/// {@endtemplate}
final class ${upcaseFeatureName}Model  {
  /// {@macro ${featureFolderName}_model}
  const ${upcaseFeatureName}Model();
}
  `
        );
        createFile(
          path.join(screens, `${featureFolderName}_screen.dart`),
          `
import 'package:flutter/material.dart';

/// {@template ${featureFolderName}_screen}
/// ${upcaseFeatureName}Screen widget.
/// {@endtemplate}
class ${upcaseFeatureName}Screen extends StatelessWidget {
  /// {@macro ${featureFolderName}_screen}
  const ${upcaseFeatureName}Screen({
    super.key, // ignore: unused_element
  });

  /// Screen route name
  static const name = '${upcaseFeatureName}Screen';

  @override
  Widget build(BuildContext context) => const Scaffold();
}
	`
        );

        vscode.window.showInformationMessage(
          `The "${featureFolderName}"'s folder Structure is created.`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
