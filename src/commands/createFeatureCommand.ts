import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { ExtensionContext, commands, Uri, window } from "vscode";

import { toCamelCase, toPascalCase, toSnakeCase } from "../utils/stringUtil";

export function registerCreateFeatureCommand(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    "extension.createSpecificFolder",
    async (uri: Uri) => {
      if (uri && uri.fsPath) {
        const featureFolderName = await window.showInputBox({
          prompt: "Enter the name for the root parent folder",
          placeHolder: "feature_name",
        });
        if (!featureFolderName) {
          window.showWarningMessage("No folder name was provided.");
          return;
        }

        const snakeCaseFeatureName = toSnakeCase(featureFolderName);
        const camelCaseFeatureName = toCamelCase(featureFolderName);
        const pascalCaseFeatureName = toPascalCase(featureFolderName);

        const featurePath = join(uri.fsPath, snakeCaseFeatureName);
        if (!existsSync(featurePath)) mkdirSync(featurePath);

        const blocPath = join(featurePath, "bloc");
        const dataPath = join(featurePath, "data");
        const servicePath = join(featurePath, "service");
        const widgetPath = join(featurePath, "widget");
        mkdirSync(blocPath);
        mkdirSync(dataPath);
        mkdirSync(servicePath);
        mkdirSync(widgetPath);

        const datasourcePath = join(dataPath, "datasource");
        mkdirSync(datasourcePath);

        const repositoryPath = join(dataPath, "repository");
        mkdirSync(repositoryPath);

        const tablePath = join(dataPath, "table");
        mkdirSync(tablePath);

        const modelPath = join(dataPath, "model");
        mkdirSync(modelPath);

        const screenPath = join(widgetPath, "screen");
        mkdirSync(screenPath);

        const decompositedWidgetPath = join(widgetPath, "widget");
        mkdirSync(decompositedWidgetPath);

        const createFile = (filePath: string, content: string) =>
          writeFileSync(filePath, content);

        createFile(
          join(
            datasourcePath,
            `remote_${snakeCaseFeatureName}_datasource.dart`
          ),
          `
/// {@template remote_${snakeCaseFeatureName}_datasource}
/// Remote${pascalCaseFeatureName}Datasource.
/// {@endtemplate}
abstract interface class Remote${pascalCaseFeatureName}Datasource {}

/// {@macro remote_${snakeCaseFeatureName}_datasource}
final class Remote${pascalCaseFeatureName}DatasourceImpl implements Remote${pascalCaseFeatureName}Datasource {
	/// {@macro remote_${snakeCaseFeatureName}_datasource}
	const Remote${pascalCaseFeatureName}DatasourceImpl(
		IRestClient restClient,
	) : _restClient = restClient;

	final IRestClient _restClient;
}
`
        );
        createFile(
          join(datasourcePath, `local_${snakeCaseFeatureName}_datasource.dart`),
          `
/// {@template local_${snakeCaseFeatureName}_datasource}
/// Local${pascalCaseFeatureName}Datasource.
/// {@endtemplate}
abstract interface class Local${pascalCaseFeatureName}Datasource {}

/// {@macro local_${snakeCaseFeatureName}_datasource}
final class Local${pascalCaseFeatureName}DatasourceImpl implements Local${pascalCaseFeatureName}Datasource {
	/// {@macro local_${snakeCaseFeatureName}_datasource}
	const Local${pascalCaseFeatureName}DatasourceImpl();
}
`
        );
        createFile(
          join(repositoryPath, `${snakeCaseFeatureName}_repository.dart`),
          `
/// {@template ${snakeCaseFeatureName}_repository}
/// ${pascalCaseFeatureName}Repository.
/// {@endtemplate}
abstract interface class ${pascalCaseFeatureName}Repository {
}

/// {@macro ${snakeCaseFeatureName}_repository}
final class ${pascalCaseFeatureName}RepositoryImpl implements ${pascalCaseFeatureName}Repository {
  /// {@macro ${snakeCaseFeatureName}_repository}
  const ${pascalCaseFeatureName}RepositoryImpl(
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
          join(modelPath, `${snakeCaseFeatureName}_model.dart`),
          `
/// {@template ${snakeCaseFeatureName}_model}
/// ${pascalCaseFeatureName}Model.
/// {@endtemplate}
final class ${pascalCaseFeatureName}Model  {
  /// {@macro ${snakeCaseFeatureName}_model}
  const ${pascalCaseFeatureName}Model();
}
  `
        );
        createFile(
          join(screenPath, `${snakeCaseFeatureName}_screen.dart`),
          `
import 'package:flutter/material.dart';

/// {@template ${snakeCaseFeatureName}_screen}
/// ${pascalCaseFeatureName}Screen widget.
/// {@endtemplate}
class ${pascalCaseFeatureName}Screen extends StatelessWidget {
  /// {@macro ${snakeCaseFeatureName}_screen}
  const ${pascalCaseFeatureName}Screen({super.key});

  /// Screen route
  static const name = AppRoute.${camelCaseFeatureName};

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
