# TextCoverJs

在已有渲染元素上叠加可编辑、可移动、可缩放、可旋转的文本框。

默认英文文档见 [README.md](./README.md)。

## 功能说明

TextCoverJs 是一个浏览器端脚本，用于在图片或其他已渲染 HTML 元素上添加文本覆盖层。页面滚动、窗口缩放、目标元素尺寸变化时，覆盖层会保持对齐。

适用场景包括图片标注、封面文字编辑、海报工具、OCR 结果校正、轻量级浏览器排版工具等。

主要能力：

- 通过四个角点定位文本框。
- 支持从左到右、从右到左、从上到下三种文字方向。
- 双击文本框即可编辑文字。
- 按配置启用移动、缩放和旋转。
- 提供浮动参数面板，用于修改文字样式、方向、语言、扩展方式和删除文本框。
- 提供工具栏，用于切换语言、上传字体、撤销、重做、保存、应用到全部和下载图片。
- 支持将目标图片和文本覆盖层导出为 `webp`、`jpeg` 或 `png`。
- 支持用户从工具栏上传本地字体文件。
- 支持通过 `fontUrl` 在代码中加载字体。
- 支持监听文字变化、实体变化、保存、字体变化、删除和下载错误等事件。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `text-cover.global.js` | 主浏览器脚本，会在 `window` 上暴露全局 API。 |
| `text-overlay-demo.html` | 在线 demo 页面，使用版本号查询参数控制缓存。 |
| `text-overlay-demo-local.html` | 本地 demo 页面，直接加载本地脚本。 |
| `text-cover-demo.js` | demo 数据和示例初始化代码。 |
| `font/` | 可选字体资源和字体说明文档。 |

## 快速开始

在 HTML 页面中引入脚本：

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
      text: "可编辑标题",
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
      language: "zh-CN"
    });
  });
</script>
```

本地开发可以启动静态服务：

```bash
python3 -m http.server 8765
```

然后打开：

```text
http://127.0.0.1:8765/text-overlay-demo-local.html
```

## GitHub Pages 在线版本

在线 demo 地址：

```text
https://jixiangtools.github.io/TextCoverJs/text-overlay-demo.html
```

当前在线 demo 引用：

```html
<script src="./text-cover.global.js?v=1.0.5"></script>
```

如果需要通过 jsDelivr 固定引用某个 release，可以使用：

```html
<script src="https://cdn.jsdelivr.net/gh/JiXiangTools/TextCoverJs@v1.0.5/text-cover.global.js"></script>
```

## 公共 API

脚本会暴露以下全局变量：

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

也可以传入单独的字体 URL：

```js
const overlay = createTextOverlay(targetElement, entities, fontUrl, options);
```

参数说明：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `targetElement` | `HTMLElement` | 要覆盖的目标元素，通常是 `img`。 |
| `entities` | `Array` | 文本框定义数组。 |
| `fontUrlOrOptions` | `string \| object` | 可选字体 URL；如果不需要单独字体 URL，也可以直接传 options。 |
| `options` | `object` | 当第三个参数是字体 URL 时使用的配置对象。 |

返回的 controller：

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

`removeTextOverlay(overlay)` 是 `overlay.destroy()` 的便捷封装。

## 配置项

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `coordinateSpace` | `"rendered"` | 使用 `"rendered"` 显示坐标，或 `"natural"` 原始坐标。 |
| `sourceWidth` | `undefined` | 源坐标宽度覆盖值。 |
| `sourceHeight` | `undefined` | 源坐标高度覆盖值。 |
| `zIndex` | `9999` | 覆盖层 z-index。 |
| `className` | `""` | 覆盖层附加 class。 |
| `clipToTarget` | `false` | 是否把覆盖层裁切到目标元素范围内。 |
| `editableClassName` | `"text-overlay-box--editable"` | 可编辑文本框 class。 |
| `editingClassName` | `"text-overlay-box--editing"` | 正在编辑时的 class。 |
| `parameterPanel` | `true` | 是否显示浮动参数面板。 |
| `parameterPanelClassName` | `"text-overlay-parameter-panel"` | 参数面板 class。 |
| `toolbar` | `true` | 是否显示浮动工具栏。 |
| `toolbarClassName` | `"text-overlay-toolbar"` | 工具栏 class。 |
| `language` | `undefined` | 初始 UI 和文本框语言。 |
| `fontUrl` | `undefined` | 代码中指定的字体 URL。 |
| `onTextChange` | `undefined` | 文本编辑结束后的回调。 |
| `onEntityChange` | `undefined` | 文本框数据变化后的回调。 |
| `onSave` | `undefined` | 点击工具栏保存按钮后的回调。 |

坐标模式：

- `"rendered"` 表示点位按目标元素当前显示尺寸计算。
- `"natural"` 表示点位按图片或视频的原始尺寸计算。普通图片会使用 `naturalWidth` 和 `naturalHeight`。

## 文本框 Entity 格式

每个文本框对应一个 entity。

```js
{
  id: "title",
  points: {
    topLeft: { x: 80, y: 60 },
    topRight: { x: 420, y: 60 },
    bottomLeft: { x: 80, y: 120 },
    bottomRight: { x: 420, y: 120 }
  },
  text: "可编辑标题",
  direction: "left-to-right",
  expandDirection: "fixed-width-grow-height",
  fontSize: 32,
  fontSizeAuto: false,
  language: "zh-CN",
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

`points` 也可以写成数组，顺序如下：

```js
points: [
  [topLeftX, topLeftY],
  [topRightX, topRightY],
  [bottomLeftX, bottomLeftY],
  [bottomRightX, bottomRightY]
]
```

支持的字段别名：

- `coords` 或 `coordinates` 可以替代 `points`。
- `content` 可以替代 `text`。
- `size` 可以替代 `fontSize`。
- `textColor` 可以替代 `color`。
- `lang` 可以替代 `language`。
- `textDirection` 可以替代 `direction`。
- `autoFontSize` 可以替代 `fontSizeAuto`。
- `draggable` 可以替代 `movable`。

## 文字方向

可使用：

```js
TextOverlayDirection.LEFT_TO_RIGHT // "left-to-right"
TextOverlayDirection.RIGHT_TO_LEFT // "right-to-left"
TextOverlayDirection.TOP_TO_BOTTOM // "top-to-bottom"
```

也支持字符串别名：

- 从左到右：`"left-to-right"`、`"ltr"`、`"lr"`
- 从右到左：`"right-to-left"`、`"rtl"`、`"rl"`
- 从上到下：`"top-to-bottom"`、`"vertical"`、`"ttb"`、`"tb"`

当 `language` 为 `"ar"` 且文本不是竖排时，方向会默认切换为从右到左。

## 扩展方式

可使用：

```js
TextOverlayExpandMode.FIXED_HEIGHT_GROW_WIDTH // "fixed-height-grow-width"
TextOverlayExpandMode.FIXED_WIDTH_GROW_HEIGHT // "fixed-width-grow-height"
TextOverlayExpandMode.FREE_EXPAND             // "free-expand"
TextOverlayExpandMode.NO_EXPAND               // "no-expand"
```

默认扩展规则：

- 竖排文本默认 `"fixed-height-grow-width"`。
- 其他方向默认 `"fixed-width-grow-height"`。
- 开启 `fontSizeAuto` 时会强制使用 `"no-expand"`。

## 编辑交互

如果希望文本框可编辑，需要设置：

```js
editable: true
```

用户交互方式：

- 双击文本框进入编辑。
- 按 `Esc` 退出编辑。
- 按 `Ctrl+Enter` 或 `Cmd+Enter` 退出编辑。
- `movable` 为 true 时可拖动文本框。
- `resizable` 为 true 时可缩放和旋转文本框。
- 与可编辑或可缩放文本框交互时会打开参数面板。
- 工具栏可用于新增文本、撤销、重做、保存、应用到全部、上传字体、下载图片。

## 字体

字体有两种使用方式。

### 用户上传

工具栏里有本地字体上传入口，支持：

```text
.ttf, .otf, .woff, .woff2
```

上传的字体会使用浏览器 object URL，只在当前页面会话内有效。

### 代码指定字体 URL

可以在代码中传入字体 URL：

```js
const overlay = createTextOverlay(image, entities, {
  fontUrl: "https://cdn.jsdelivr.net/gh/JiXiangTools/TextCoverJs@v1.0.5/font/notosanssc/NotoSansSC[wght].ttf"
});
```

或者：

```js
const overlay = createTextOverlay(image, entities, "https://example.com/font.woff2", {
  coordinateSpace: "natural"
});
```

远程字体必须允许浏览器加载。脚本会通过 CORS fetch 远程字体。`raw.githubusercontent.com` 的 URL 会在加载前自动转换为 jsDelivr URL。

字体目录说明见 [font/README.zh-CN.md](./font/README.zh-CN.md)。

## 事件和回调

回调示例：

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

回调数据示例：

```js
// onTextChange
{ id, index, text, entity }

// onEntityChange
{ id, index, entity }

// onSave
{ id, savedAt, fontUrl, entities }
```

DOM 事件会从 `overlay.element` 派发：

| 事件 | detail |
| --- | --- |
| `text-overlay-save` | `{ id, savedAt, fontUrl, entities }` |
| `text-overlay-delete` | `{ id, index, entity }` |
| `text-overlay-font-change` | `{ fontUrl, uploadedFontName }` |
| `text-overlay-font-upload-error` | `{ fontUrl, uploadedFontName, error }` |
| `text-overlay-apply-all` | `{ id, appliedTo, settings }` |
| `text-overlay-download-error` | `{ error }` |

示例：

```js
overlay.element.addEventListener("text-overlay-save", (event) => {
  console.log(event.detail.entities);
});
```

## 保存和恢复

工具栏保存按钮会把 payload 存到 `localStorage`：

```text
textOverlay:<overlayId>
```

同时也会调用 `onSave(payload)` 并派发 `text-overlay-save` 事件。

如果要保存到自己的后端，可以使用 `onSave`：

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

恢复保存的数据：

```js
overlay.update(savedPayload.entities, {
  fontUrl: savedPayload.fontUrl,
  coordinateSpace: "natural"
});
```

## 下载图片

工具栏下载菜单支持：

- `WEBP`
- `JPEG`
- `PNG`

生成的文件会包含目标元素和当前文本覆盖层。

为了获得稳定导出结果：

- 创建 overlay 前确保目标图片已加载完成。
- 如果目标图片来自远程地址，需要图片本身支持 CORS。
- 字体建议使用 CORS 可加载的远程字体，或使用用户上传的本地字体。

## 多个覆盖层

一个页面可以创建多个 overlay：

```js
const overlayA = createTextOverlay(imageA, entitiesA);
const overlayB = createTextOverlay(imageB, entitiesB);
```

工具栏的“应用到全部”会把当前工具栏设置，例如语言和字体，复制到所有活跃 overlay controller。

## 清理

当目标元素被移除时，应销毁 overlay：

```js
overlay.destroy();
```

或者：

```js
removeTextOverlay(overlay);
```

这会移除 DOM 节点、事件监听、观察器、工具栏、参数面板，以及已上传字体对应的 object URL。

## 浏览器要求

TextCoverJs 依赖现代浏览器 API：

- `FontFace`
- `ResizeObserver`
- `Canvas`
- `Blob`
- `URL.createObjectURL`
- `CustomEvent`

项目不需要构建步骤，也没有运行时 npm 依赖。

## 开发

用任意静态文件服务启动本地 demo：

```bash
python3 -m http.server 8765
```

打开：

```text
http://127.0.0.1:8765/text-overlay-demo-local.html
```

语法检查：

```bash
node --check text-cover.global.js
```

## 注意事项

- 脚本面向浏览器使用，会把 API 挂到 `window`。
- 当前项目没有发布 npm 包。
- `font/` 目录包含开源字体以及 `SimHei.ttf`。公开再分发前请确认字体授权。
