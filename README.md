# TextCoverJs

Add editable, movable, resizable, and rotatable text boxes on top of an existing rendered HTML element.

Simplified Chinese documentation is available in [README.zh-CN.md](./README.zh-CN.md).

## What It Does

TextCoverJs is a browser-only script for placing text overlays on images or other rendered elements. It keeps the overlay aligned when the page scrolls, resizes, or when the target element changes size.

It is useful for image annotation, cover text editing, poster tools, OCR correction views, and lightweight browser-based text layout tools.

Main features:

- Position text boxes from four corner points.
- Support left-to-right, right-to-left, and top-to-bottom text.
- Edit text by double-clicking a text box.
- Move, resize, and rotate text boxes when enabled.
- Use a floating parameter panel for text style, direction, language, expansion, and deletion.
- Use a toolbar for language switching, font upload, undo, redo, save, apply-to-all, and image download.
- Download the target image plus overlays as `webp`, `jpeg`, or `png`.
- Upload local font files from the toolbar.
- Load fonts programmatically with `fontUrl`.
- Listen to text, entity, save, font, delete, and download events.

## Files

| File | Purpose |
| --- | --- |
| `text-cover.global.js` | Main browser script. It exposes global APIs on `window`. |
| `text-overlay-demo.html` | Online demo page. It uses a version query string for cache control. |
| `text-overlay-demo-local.html` | Local demo page. It loads the local script directly. |
| `text-cover-demo.js` | Demo data and sample overlay initialization. |
| `font/` | Optional bundled font assets and font documentation. |

## Quick Start

Add the script to an HTML page:

```html
<img id="cover" src="./cover.jpg" alt="Cover" />

<script src="./text-cover.global.js"></script>
<script>
  const image = document.getElementById("cover");

  const entities = [
    {
      points: [
        [80, 60],
        [420, 60],
        [80, 120],
        [420, 120]
      ],
      text: "Editable title",
      direction: "left-to-right",
      fontSize: 32,
      color: "#111827",
      bold: true,
      editable: true,
      movable: true,
      resizable: true
    }
  ];

  window.addEventListener("load", () => {
    window.overlay = createTextOverlay(image, entities, {
      coordinateSpace: "natural",
      language: "en"
    });
  });
</script>
```

Use the local demo for development:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/text-overlay-demo-local.html
```

## Loading From GitHub Pages

For the hosted demo, use:

```text
https://jixiangtools.github.io/TextCoverJs/text-overlay-demo.html
```

The online demo currently references:

```html
<script src="./text-cover.global.js?v=1.0.5"></script>
```

For a release-pinned script URL through jsDelivr, use:

```html
<script src="https://cdn.jsdelivr.net/gh/JiXiangTools/TextCoverJs@v1.0.5/text-cover.global.js"></script>
```

## Public API

The script exposes these globals:

```js
createTextOverlay(targetElement, entities, fontUrlOrOptions, options)
removeTextOverlay(overlayController)
TextOverlayDirection
TextOverlayExpandMode
```

### `createTextOverlay`

```js
const overlay = createTextOverlay(targetElement, entities, options);
```

or:

```js
const overlay = createTextOverlay(targetElement, entities, fontUrl, options);
```

Arguments:

| Argument | Type | Description |
| --- | --- | --- |
| `targetElement` | `HTMLElement` | Element to cover, usually an `img`. |
| `entities` | `Array` | Text box definitions. |
| `fontUrlOrOptions` | `string \| object` | Optional font URL, or the options object when no separate font URL is needed. |
| `options` | `object` | Optional configuration when the third argument is a font URL. |

Returned controller:

```js
overlay.id
overlay.element
overlay.update(nextEntities, nextFontUrlOrOptions, nextOptions)
overlay.destroy()
overlay.getEntities()
overlay.getFontUrl()
overlay.getToolbarSettings()
overlay.applyToolbarSettings(settings)
```

Use `removeTextOverlay(overlay)` as a convenience wrapper around `overlay.destroy()`.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `coordinateSpace` | `"rendered"` | Use `"rendered"` coordinates or `"natural"` coordinates. |
| `sourceWidth` | `undefined` | Source coordinate width override. |
| `sourceHeight` | `undefined` | Source coordinate height override. |
| `zIndex` | `9999` | Overlay layer z-index. |
| `className` | `""` | Extra class for the overlay layer. |
| `clipToTarget` | `false` | Clip overlay content to the target bounds. |
| `editableClassName` | `"text-overlay-box--editable"` | Class used for editable boxes. |
| `editingClassName` | `"text-overlay-box--editing"` | Class used while text is being edited. |
| `parameterPanel` | `true` | Show the floating parameter panel. |
| `parameterPanelClassName` | `"text-overlay-parameter-panel"` | Parameter panel class. |
| `toolbar` | `true` | Show the floating toolbar. |
| `toolbarClassName` | `"text-overlay-toolbar"` | Toolbar class. |
| `language` | `undefined` | Initial UI and entity language. |
| `fontUrl` | `undefined` | Programmatic font URL. |
| `onTextChange` | `undefined` | Called after text editing ends. |
| `onEntityChange` | `undefined` | Called after an entity changes. |
| `onSave` | `undefined` | Called when the toolbar save button is used. |

Coordinate modes:

- `"rendered"` means entity points are measured in the target element's displayed size.
- `"natural"` means entity points are measured in the image or video natural size. For ordinary images this uses `naturalWidth` and `naturalHeight`.

## Entity Format

Each text box is an entity.

```js
{
  id: "title",
  points: {
    topLeft: { x: 80, y: 60 },
    topRight: { x: 420, y: 60 },
    bottomLeft: { x: 80, y: 120 },
    bottomRight: { x: 420, y: 120 }
  },
  text: "Editable title",
  direction: "left-to-right",
  expandDirection: "fixed-width-grow-height",
  fontSize: 32,
  fontSizeAuto: false,
  language: "en",
  color: "#111827",
  background: "transparent",
  opacity: 1,
  bold: true,
  italic: false,
  underline: false,
  editable: true,
  movable: true,
  resizable: true,
  align: "center",
  verticalAlign: "center",
  lineHeight: 1.2,
  letterSpacing: 0,
  data: { source: "custom metadata" }
}
```

`points` can also be an array in this order:

```js
points: [
  [topLeftX, topLeftY],
  [topRightX, topRightY],
  [bottomLeftX, bottomLeftY],
  [bottomRightX, bottomRightY]
]
```

Accepted aliases:

- `coords` or `coordinates` can be used instead of `points`.
- `content` can be used instead of `text`.
- `size` can be used instead of `fontSize`.
- `textColor` can be used instead of `color`.
- `lang` can be used instead of `language`.
- `textDirection` can be used instead of `direction`.
- `autoFontSize` can be used instead of `fontSizeAuto`.
- `draggable` can be used instead of `movable`.

## Text Direction

Use one of:

```js
TextOverlayDirection.LEFT_TO_RIGHT // "left-to-right"
TextOverlayDirection.RIGHT_TO_LEFT // "right-to-left"
TextOverlayDirection.TOP_TO_BOTTOM // "top-to-bottom"
```

String aliases are accepted:

- Left to right: `"left-to-right"`, `"ltr"`, `"lr"`
- Right to left: `"right-to-left"`, `"rtl"`, `"rl"`
- Top to bottom: `"top-to-bottom"`, `"vertical"`, `"ttb"`, `"tb"`

When `language` is `"ar"` and the entity is not vertical, the direction defaults to right-to-left.

## Expansion Modes

Use one of:

```js
TextOverlayExpandMode.FIXED_HEIGHT_GROW_WIDTH // "fixed-height-grow-width"
TextOverlayExpandMode.FIXED_WIDTH_GROW_HEIGHT // "fixed-width-grow-height"
TextOverlayExpandMode.FREE_EXPAND             // "free-expand"
TextOverlayExpandMode.NO_EXPAND               // "no-expand"
```

Default expansion:

- Vertical text defaults to `"fixed-height-grow-width"`.
- Other directions default to `"fixed-width-grow-height"`.
- When `fontSizeAuto` is enabled, expansion is forced to `"no-expand"`.

## Editing Behavior

For an entity to be editable, set:

```js
editable: true
```

User interactions:

- Double-click a text box to edit its text.
- Press `Esc` to exit editing.
- Press `Ctrl+Enter` or `Cmd+Enter` to exit editing.
- Drag movable text boxes when `movable` is true.
- Resize and rotate text boxes when `resizable` is true.
- Open the parameter panel by interacting with an editable/resizable box.
- Use the toolbar to add text, undo, redo, save, apply settings to all overlays, upload a font, and download an image.

## Fonts

There are two font workflows.

### User Upload

The toolbar includes an upload control for local font files:

```text
.ttf, .otf, .woff, .woff2
```

Uploaded fonts use browser object URLs and are valid for the current page session.

### Programmatic Font URL

You can pass a font URL in code:

```js
const overlay = createTextOverlay(image, entities, {
  fontUrl: "https://cdn.jsdelivr.net/gh/JiXiangTools/TextCoverJs@v1.0.5/font/notosanssc/NotoSansSC[wght].ttf"
});
```

or:

```js
const overlay = createTextOverlay(image, entities, "https://example.com/font.woff2", {
  coordinateSpace: "natural"
});
```

Remote fonts must allow browser loading. The script fetches remote font files with CORS. URLs from `raw.githubusercontent.com` are automatically converted to jsDelivr URLs before loading.

Bundled font documentation is in [font/README.md](./font/README.md).

## Events And Callbacks

Callbacks:

```js
createTextOverlay(image, entities, {
  onTextChange(detail) {
    console.log("text changed", detail);
  },
  onEntityChange(detail) {
    console.log("entity changed", detail);
  },
  onSave(payload) {
    console.log("saved", payload);
  }
});
```

Callback payload examples:

```js
// onTextChange
{ id, index, text, entity }

// onEntityChange
{ id, index, entity }

// onSave
{ id, savedAt, fontUrl, entities }
```

DOM events are dispatched on `overlay.element`:

| Event | Detail |
| --- | --- |
| `text-overlay-save` | `{ id, savedAt, fontUrl, entities }` |
| `text-overlay-delete` | `{ id, index, entity }` |
| `text-overlay-font-change` | `{ fontUrl, uploadedFontName }` |
| `text-overlay-font-upload-error` | `{ fontUrl, uploadedFontName, error }` |
| `text-overlay-apply-all` | `{ id, appliedTo, settings }` |
| `text-overlay-download-error` | `{ error }` |

Example:

```js
overlay.element.addEventListener("text-overlay-save", (event) => {
  console.log(event.detail.entities);
});
```

## Saving And Restoring

The toolbar save button stores the payload in `localStorage` under:

```text
textOverlay:<overlayId>
```

It also calls `onSave(payload)` and dispatches `text-overlay-save`.

To persist data to your own backend, use `onSave`:

```js
const overlay = createTextOverlay(image, entities, {
  onSave(payload) {
    fetch("/api/save-overlay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
});
```

To restore saved entities:

```js
overlay.update(savedPayload.entities, {
  fontUrl: savedPayload.fontUrl,
  coordinateSpace: "natural"
});
```

## Downloading Images

The toolbar download menu supports:

- `WEBP`
- `JPEG`
- `PNG`

The generated file contains the target element and the current text overlays.

For best output:

- Wait for the target image to load before creating the overlay.
- Use CORS-enabled images if the target image is remote.
- Use CORS-enabled fonts or uploaded local fonts.

## Multiple Overlays

You can create multiple overlays on the same page:

```js
const overlayA = createTextOverlay(imageA, entitiesA);
const overlayB = createTextOverlay(imageB, entitiesB);
```

The toolbar's apply-to-all action copies current toolbar settings such as language and font to all active overlay controllers.

## Cleanup

Destroy an overlay when its target is removed:

```js
overlay.destroy();
```

or:

```js
removeTextOverlay(overlay);
```

This removes DOM nodes, event listeners, observers, toolbar, parameter panel, and uploaded font object URLs.

## Browser Requirements

TextCoverJs expects modern browser APIs:

- `FontFace`
- `ResizeObserver`
- `Canvas`
- `Blob`
- `URL.createObjectURL`
- `CustomEvent`

It has no build step and no runtime npm dependency.

## Development

Run the local demo with any static file server:

```bash
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/text-overlay-demo-local.html
```

Run a syntax check:

```bash
node --check text-cover.global.js
```

## Notes

- The script is intended for browser use and attaches APIs to `window`.
- The project currently does not publish an npm package.
- The font directory includes open-source fonts plus `SimHei.ttf`. Check font licenses before redistribution.
