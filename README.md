# Flutter Explorer for VSCode

## Description

This Visual Studio Code extension adds a custom context menu option that allows users to create single flutter feature.

## Generated structure

```
📁{feature name}
└── 📁bloc
└── 📁data
    └── 📁datasources
        └──🔷local_{feature name}_datasource.dart
        └──🔷remote_{feature name}_datasource.dart
    └── 📁models
        └──🔷{feature name}_model.dart
    └── 📁repositories
        └──🔷{feature name}_repository.dart
└── 📁services
└── 📁widget
    └── 📁screens
        └──🔷{feature name}_screen.dart
    └── 📁widgets
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
