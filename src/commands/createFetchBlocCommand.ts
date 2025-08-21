import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { ExtensionContext, commands, Uri, window } from "vscode";

import { toCamelCase, toPascalCase, toSnakeCase } from "../utils/stringUtil";

export function registerCreateFetchBlocCommand(context: ExtensionContext) {
  let disposable = commands.registerCommand(
    "extension.createFetchBloc",
    async (uri: Uri) => {
      if (uri && uri.fsPath) {
        const blocFolderName = await window.showInputBox({
          prompt: "Enter the name for the BLoC",
          placeHolder: "bloc_name",
        });
        if (!blocFolderName) {
          window.showWarningMessage("No BLoC name was provided.");
          return;
        }

        const snakeCaseFolderName = toSnakeCase(blocFolderName);
        const camelCaseFolderName = toCamelCase(blocFolderName);
        const pascalCaseFolderName = toPascalCase(blocFolderName);

        const blocPath = join(uri.fsPath, snakeCaseFolderName);
        if (!existsSync(blocPath)) mkdirSync(blocPath);

        const createFile = (filePath: string, content: string) =>
          writeFileSync(filePath, content);

        createFile(
          join(blocPath, `${snakeCaseFolderName}_bloc.dart`),
          `
import 'dart:async';

import 'package:app_shared/bloc.dart';
import 'package:bloc/bloc.dart';
import 'package:bloc_concurrency/bloc_concurrency.dart' as bloc_concurrency;
import 'package:meta/meta.dart';

part '${snakeCaseFolderName}_event.dart';
part '${snakeCaseFolderName}_state.dart';

class ${pascalCaseFolderName}Bloc extends Bloc<${pascalCaseFolderName}Event, ${pascalCaseFolderName}State> {
  ${pascalCaseFolderName}Bloc({required Repository repository, ${pascalCaseFolderName}State? initialState})
    : _repository = repository,
      super(initialState ?? const ${pascalCaseFolderName}$Idle(null)) {
    on<${pascalCaseFolderName}Event>(
      (event, emit) => switch (event) {
        ${pascalCaseFolderName}Fetched() => _fetched(event, emit),
        ${pascalCaseFolderName}Refreshed() => _fetched(event, emit, shouldRefresh: true),
      }, 
      transformer: bloc_concurrency.sequential()
    );
  }

  final Repository _repository;

  Future<void> _fetched(
    ${pascalCaseFolderName}Event event,
    Emitter<${pascalCaseFolderName}State> emit, {
    bool shouldRefresh = false,
  }) async {
    try {
      emit(${pascalCaseFolderName}$Processing(state.data));

      final data = await _repository.fetch${pascalCaseFolderName}(
        id: event.id,
        shouldRefresh: shouldRefresh,
      );
      emit(${pascalCaseFolderName}$Success(data));
    } catch (error, stackTrace) {
      addError(error, stackTrace);

      emit(${pascalCaseFolderName}$Failure(state.data, error: error));
    } finally {
      emit(${pascalCaseFolderName}$Idle(state.data));
    }
  }
}`
        );
        createFile(
          join(blocPath, `${snakeCaseFolderName}_event.dart`),
          `
part of '${snakeCaseFolderName}_bloc.dart';

/// {@template ${snakeCaseFolderName}_event}
/// ${pascalCaseFolderName}Event.
/// {@endtemplate}
@immutable
sealed class ${pascalCaseFolderName}Event {
  /// {@macro ${snakeCaseFolderName}_event}
  const ${pascalCaseFolderName}Event(this.id);

  final String id;
}

/// {@macro ${snakeCaseFolderName}_event}
final class ${pascalCaseFolderName}Fetched extends ${pascalCaseFolderName}Event {
  /// {@macro ${snakeCaseFolderName}_event}
  const ${pascalCaseFolderName}Fetched(super.id);
}

/// {@macro ${snakeCaseFolderName}_event}
final class ${pascalCaseFolderName}Refreshed extends ${pascalCaseFolderName}Event {
  /// {@macro ${snakeCaseFolderName}_event}
  const ${pascalCaseFolderName}Refreshed(super.id);
}`
        );
        createFile(
          join(blocPath, `${snakeCaseFolderName}_state.dart`),
          `
part of '${snakeCaseFolderName}_bloc.dart';

/// {@template ${snakeCaseFolderName}_state}
/// ${pascalCaseFolderName}State.
/// {@endtemplate}
@immutable
sealed class ${pascalCaseFolderName}State extends BlocStateData<?> {
  /// {@macro ${snakeCaseFolderName}_state}
  const ${pascalCaseFolderName}State(super.data, {super.error});

  @override
  bool get hasData => data != null;

  @override
  bool get hasError => error != null;

  bool get isProcessing => this is ${pascalCaseFolderName}$Processing;

  bool get isIdle => !isProcessing;

  bool get isSuccess => this is ${pascalCaseFolderName}$Success;

  bool get isFailure => this is ${pascalCaseFolderName}$Failure;
}

/// {@macro ${snakeCaseFolderName}_state}
final class ${pascalCaseFolderName}$Idle extends ${pascalCaseFolderName}State {
  /// {@macro ${snakeCaseFolderName}_state}
  const ${pascalCaseFolderName}$Idle(super.data, {super.error});
}

/// {@macro ${snakeCaseFolderName}_state}
final class ${pascalCaseFolderName}$Processing extends ${pascalCaseFolderName}State {
  /// {@macro ${snakeCaseFolderName}_state}
  const ${pascalCaseFolderName}$Processing(super.data, {super.error});
}

/// {@macro ${snakeCaseFolderName}_state}
final class ${pascalCaseFolderName}$Success extends ${pascalCaseFolderName}State {
  /// {@macro ${snakeCaseFolderName}_state}
  const ${pascalCaseFolderName}$Success(super.data, {super.error});
}

/// {@macro ${snakeCaseFolderName}_state}
final class ${pascalCaseFolderName}$Failure extends ${pascalCaseFolderName}State {
  /// {@macro ${snakeCaseFolderName}_state}
  const ${pascalCaseFolderName}$Failure(super.data, {super.error});
}`
        );

        window.showInformationMessage(
          `The "${blocFolderName}"'s files have been created.`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
