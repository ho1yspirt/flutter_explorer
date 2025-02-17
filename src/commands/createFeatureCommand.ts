import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { ExtensionContext, commands, Uri, window } from "vscode";

import "../utils/prototypes";

export function registerCreateFeatureCommand(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    "extension.createSpecificFolder",
    async (uri: Uri) => {
      if (uri && uri.fsPath) {
        const featureFolderName = await window.showInputBox({
          prompt: "Enter the name for the root parent folder",
          placeHolder: "feature",
        });
        if (!featureFolderName) {
          window.showWarningMessage("No folder name was provided.");
          return;
        }

        const camelCaseFeatureName = featureFolderName.fromSnakeToCamelCase();
        const pascalCaseFeatureName = featureFolderName.fromSnakeToPascalCase();

        const featurePath = join(uri.fsPath, featureFolderName);
        if (!existsSync(featurePath)) mkdirSync(featurePath);

        const blocPath = join(featurePath, "bloc");
        const servicesPath = join(featurePath, "services");
        const dataPath = join(featurePath, "data");
        const widgetPath = join(featurePath, "widget");
        mkdirSync(blocPath);
        mkdirSync(servicesPath);
        mkdirSync(dataPath);
        mkdirSync(widgetPath);

        const datasources = join(dataPath, "datasources");
        mkdirSync(datasources);

        const repositories = join(dataPath, "repositories");
        mkdirSync(repositories);

        const models = join(dataPath, "models");
        mkdirSync(models);

        const screens = join(widgetPath, "screens");
        mkdirSync(screens);

        mkdirSync(join(widgetPath, "widgets"));

        const createFile = (filePath: string, content: string) =>
          writeFileSync(filePath, content);

        createFile(
          join(datasources, `remote_${featureFolderName}_datasource.dart`),
          `
import '../../../../common/component/rest_client/rest_client.dart';

/// {@template i_remote_${camelCaseFeatureName}_datasource}
///  Interface for IRemote${pascalCaseFeatureName}Datasource.
/// {@endtemplate}
abstract interface class IRemote${pascalCaseFeatureName}Datasource {}

/// {@template remote_${camelCaseFeatureName}_datasource}
/// Remote${pascalCaseFeatureName}Datasource.
/// {@endtemplate}
final class Remote${pascalCaseFeatureName}Datasource implements IRemote${pascalCaseFeatureName}Datasource {
	/// {@macro remote_${camelCaseFeatureName}_datasource}
	const Remote${pascalCaseFeatureName}Datasource(
		IRestClient restClient,
	) : _restClient = restClient;

	final IRestClient _restClient;
}
`
        );
        createFile(
          join(datasources, `local_${featureFolderName}_datasource.dart`),
          `
/// {@template i_local${camelCaseFeatureName}_datasource}
///  Interface for ILocal${pascalCaseFeatureName}Datasource.
/// {@endtemplate}
abstract interface class ILocal${pascalCaseFeatureName}Datasource {}

/// {@template local_${camelCaseFeatureName}_datasource}
/// Local${pascalCaseFeatureName}Datasource.
/// {@endtemplate}
final class Local${pascalCaseFeatureName}Datasource implements ILocal${pascalCaseFeatureName}Datasource {
	/// {@macro local_${camelCaseFeatureName}_datasource}
	const Local${pascalCaseFeatureName}Datasource();
}
`
        );
        createFile(
          join(repositories, `${featureFolderName}_repository.dart`),
          `
import '../datasources/local_${featureFolderName}_datasource.dart';
import '../datasources/remote_${featureFolderName}_datasource.dart';

/// {@template i_${camelCaseFeatureName}_repository}
///  Interface for ${pascalCaseFeatureName}Repository.
/// {@endtemplate}
abstract interface class I${pascalCaseFeatureName}Repository {
}

/// {@template ${camelCaseFeatureName}_repository}
/// ${pascalCaseFeatureName}Repository
/// {@endtemplate}
final class ${pascalCaseFeatureName}Repository implements I${pascalCaseFeatureName}Repository {
  /// {@macro ${camelCaseFeatureName}_repository}
  const ${pascalCaseFeatureName}Repository(
    ILocal${pascalCaseFeatureName}Datasource localDatasource,
    IRemote${pascalCaseFeatureName}Datasource remoteDatasource,
  ) : _localDatasource = localDatasource,
		_remoteDatasource = remoteDatasource;

  final ILocal${pascalCaseFeatureName}Datasource _localDatasource;
  final IRemote${pascalCaseFeatureName}Datasource _remoteDatasource;
}
`
        );
        createFile(
          join(models, `${featureFolderName}_model.dart`),
          `
/// {@template ${featureFolderName}_model}
/// ${pascalCaseFeatureName}Model.
/// {@endtemplate}
final class ${pascalCaseFeatureName}Model  {
  /// {@macro ${featureFolderName}_model}
  const ${pascalCaseFeatureName}Model();
}
  `
        );
        createFile(
          join(screens, `${featureFolderName}_screen.dart`),
          `
import 'package:flutter/material.dart';

/// {@template ${featureFolderName}_screen}
/// ${pascalCaseFeatureName}Screen widget.
/// {@endtemplate}
class ${pascalCaseFeatureName}Screen extends StatelessWidget {
  /// {@macro ${featureFolderName}_screen}
  const ${pascalCaseFeatureName}Screen({
    super.key, // ignore: unused_element
  });

  /// Screen route name
  static const name = '${pascalCaseFeatureName}Screen';

  @override
  Widget build(BuildContext context) => const Scaffold();
}
	`
        );

        window.showInformationMessage(
          `The "${featureFolderName}"'s folder Structure is created.`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
