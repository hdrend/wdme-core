# WDME Core

WDME Core is a modular TypeScript engine for building node-based web editors.

The core provides a generic object tree, events, attributes, serialization and a plugin system. It is designed to be lightweight, extensible and independent from any UI framework.

## Features

- Node-based object tree
- Event system
- Dynamic attributes
- JSON serialization
- Node registry
- Plugin API
- TypeScript

## Non-Goals

WDME Core does not provide:

- Rendering
- HTML generation
- CSS
- GUI
- JavaScript execution
- Code editor
- Package manager

These features belong to applications built on top of the core.

## Example

```ts
const project = new WDMEProject("Project");
const folder = new WDMEFolder("Folder");

project.AddChild(folder);

const api = new WDMECoreAPI();

const data = api.Serialize(project);
```

## Status

Current version: **2026.3a**

WDME Core is currently in early alpha. The API may change between releases.

## License

MIT
