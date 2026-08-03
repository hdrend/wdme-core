# WDME Core

WDME Core is a modular TypeScript engine for building node-based web editors.

The core provides a generic object tree, events, attributes, serialization and a plugin system. It is designed to be lightweight, extensible and independent from any UI framework.

## Features

- Node-based object tree
- Event system
- attributes
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

---

# **RU:**

# WDME Core

WDME Core это модульный TypeScript движок созданный для разработки веб-редакторов.

Ядро предоставляет дерево объектов на основе Node, систему событий, атрибуты, механизмы сериализации и систему плагинов. Оно спроектировано так, чтобы быть легковесным, расширяемым и независимым от каких-либо UI-фреймворков.

## Особенности

- Дерево объектов основанное на Node
- Система событий
- Аттрибуты
- Сериализация/Десериализация JSON
- Реестр типов Node
- API плагинов
- TypeScript

## Не является целью

WDME Core не предоставляет

- Рендеринг
- HTML генерация
- CSS
- GUI
- Исполнение JavaScript
- Встроенный визуальный редактор кода
- Менеджер пакетов

Эти функции относятся к приложениям, созданным на основе ядра.

## Пример

```ts
const project = new WDMEProject("Project");
const folder = new WDMEFolder("Folder");

project.AddChild(folder);

const api = new WDMECoreAPI();

const data = api.Serialize(project);
```

## Статус

Текущая версия: **2026.3a**

WDME Core в ранней альфе. API может меняться между версиями

## Лицензия

MIT

