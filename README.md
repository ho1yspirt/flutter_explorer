# Flutter Explorer for VSCode

## Description

This Visual Studio Code extension adds a custom context menu option that allows users to create single flutter feature.

## Generated structure

```
📁{feature name}
└── 📁bloc
└── 📁data
    └── 📁model
        └──🔷{feature name}_dependencies.dart
        └──🔷{feature name}_model.dart
    └──🔷{feature name}_local_datasource.dart
    └──🔷{feature name}_remote_datasource.dart
    └──🔷{feature name}_repository.dart
└── 📁service
└── 📁widget
    └── 📁screen
        └──🔷{feature name}_screen.dart
    └── 📁widget
    └──🔷{feature name}_scope.dart
```

## Features

- Right-click in the Explorer view and create a folder with a specified parent folder.
- Prompt for dynamic feature's folder name.

## How to Use

1. Install the extension.
2. Right-click on any folder in the Explorer.
3. Select **New Flutter Feature...**.
4. Enter a name for the root parent folder when prompted.

## Installation

- Install from the VSCode Marketplace or manually by downloading the `.vsix` file.
