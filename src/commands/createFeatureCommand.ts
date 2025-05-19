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
          join(dataPath, `${snakeCaseFeatureName}_local_datasource.dart`),
          `
/// {@template ${snakeCaseFeatureName}_local_datasource}
/// ${pascalCaseFeatureName}LocalDatasource.
/// {@endtemplate}
abstract interface class ${pascalCaseFeatureName}LocalDatasource {}

/// {@macro ${snakeCaseFeatureName}_local_datasource}
final class ${pascalCaseFeatureName}LocalDatasourceImpl implements ${pascalCaseFeatureName}LocalDatasource {
	/// {@macro ${snakeCaseFeatureName}_local_datasource}
	const ${pascalCaseFeatureName}LocalDatasourceImpl();
}`
        );
        createFile(
          join(dataPath, `${snakeCaseFeatureName}_remote_datasource.dart`),
          `
/// {@template ${snakeCaseFeatureName}_remote_datasource}
/// ${pascalCaseFeatureName}RemoteDatasource.
/// {@endtemplate}
abstract interface class ${pascalCaseFeatureName}RemoteDatasource {}

/// {@macro ${snakeCaseFeatureName}_remote_datasource}
final class ${pascalCaseFeatureName}RemoteDatasourceImpl implements ${pascalCaseFeatureName}RemoteDatasource {
	/// {@macro ${snakeCaseFeatureName}_remote_datasource}
	const ${pascalCaseFeatureName}RemoteDatasourceImpl(
		RestClient restClient,
	) : _restClient = restClient;

	final IRestClient _restClient;
}`
        );
        createFile(
          join(dataPath, `${snakeCaseFeatureName}_repository.dart`),
          `
/// {@template ${snakeCaseFeatureName}_repository}
/// ${pascalCaseFeatureName}Repository.
/// {@endtemplate}
abstract interface class ${pascalCaseFeatureName}Repository {}

/// {@macro ${snakeCaseFeatureName}_repository}
final class ${pascalCaseFeatureName}RepositoryImpl implements ${pascalCaseFeatureName}Repository {
  /// {@macro ${snakeCaseFeatureName}_repository}
  const ${pascalCaseFeatureName}RepositoryImpl(
    ${pascalCaseFeatureName}LocalDatasource localDatasource,
    ${pascalCaseFeatureName}RemoteDatasource remoteDatasource,
  ) : _localDatasource = localDatasource,
		_remoteDatasource = remoteDatasource;

  final ${pascalCaseFeatureName}LocalDatasource _localDatasource;
  final ${pascalCaseFeatureName}RemoteDatasource _remoteDatasource;
}`
        );
        createFile(
          join(modelPath, `${snakeCaseFeatureName}_dependencies.dart`),
          `
import 'package:flutter/material.dart';

/// {@template ${snakeCaseFeatureName}_dependencies}
/// ${pascalCaseFeatureName}Dependencies.
/// {@endtemplate}
final class ${pascalCaseFeatureName}Dependencies  {
  /// {@macro ${snakeCaseFeatureName}_dependencies}
  factory ${pascalCaseFeatureName}Dependencies.of(BuildContext context) => ${pascalCaseFeatureName}Scope.of(context);

  /// {@macro ${snakeCaseFeatureName}_dependencies}
  ${pascalCaseFeatureName}Dependencies();

  // repositories
  late final ${pascalCaseFeatureName}Repository repository;
  // blocs
}`
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
}`
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
}`
        );
        createFile(
          join(widgetPath, `${snakeCaseFeatureName}_scope.dart`),
          `
import 'package:flutter/material.dart';

/// {@template ${snakeCaseFeatureName}_scope}
/// ${pascalCaseFeatureName}Scope widget.
/// {@endtemplate}
class ${pascalCaseFeatureName}Scope extends StatelessWidget {
  /// {@macro ${snakeCaseFeatureName}_scope}
  const ${pascalCaseFeatureName}Scope({super.key, required this.dependencies, required this.child});

  final ${pascalCaseFeatureName}Dependencies dependencies;
  final Widget child;

  static ${pascalCaseFeatureName}Dependencies of(BuildContext context) =>
      _${pascalCaseFeatureName}Scope.of(context);

  @override
  Widget build(BuildContext context) =>
      _${pascalCaseFeatureName}Scope(dependencies: dependencies, child: child);
}
  
/// {@macro ${snakeCaseFeatureName}_scope}
class _${pascalCaseFeatureName}Scope extends InheritedWidget {
  /// {@macro ${snakeCaseFeatureName}_scope}
  const _${pascalCaseFeatureName}Scope({
    super.key, // ignore: unused_element_parameter
    required this.dependencies, 
    required super.child,
  });

  final ${pascalCaseFeatureName}Dependencies dependencies;

  // dart format off
  static _${pascalCaseFeatureName}Scope? _maybeOf(BuildContext context) =>
    context.getElementForInheritedWidgetOfExactType<_${pascalCaseFeatureName}Scope>()
      ?.widget as _${pascalCaseFeatureName}Scope?;
  // dart format on

  static Never _notFoundInheritedWidgetOfExactType() =>
      throw ArgumentError('Out of scope');

  static _${pascalCaseFeatureName}Scope _of(BuildContext context) =>
      _maybeOf(context) ?? _notFoundInheritedWidgetOfExactType();

  static ${pascalCaseFeatureName}Dependencies of(BuildContext context) =>
      _of(context).dependencies;

  @override
  bool updateShouldNotify(_${pascalCaseFeatureName}Scope oldWidget) => false;
}`
        );

        window.showInformationMessage(
          `The "${featureFolderName}"'s folder Structure is created.`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
