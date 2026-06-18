# 字体资源

这个目录收集了一组常用开源字体，适合在 `text-overlay-demo.html` 或其他网页中直接引用。

英文默认文档见 [README.md](./README.md)。

## 使用方式

在 HTML 中引入：

```html
<link rel="stylesheet" href="./font/fonts.css">
```

然后在 CSS 中使用：

```css
.title {
  font-family: "Noto Sans SC", "Roboto", sans-serif;
}

.code {
  font-family: "JetBrains Mono", "Fira Code", monospace;
}
```

## 字体清单

| 字体 | 文件 | 适用场景 |
| --- | --- | --- |
| Roboto | `roboto/Roboto[wdth,wght].ttf`, `roboto/Roboto-Italic[wdth,wght].ttf` | Android/Material 风格、通用英文 UI |
| Open Sans | `opensans/OpenSans[wdth,wght].ttf`, `opensans/OpenSans-Italic[wdth,wght].ttf` | 通用网页正文、表单、说明文本 |
| Montserrat | `montserrat/Montserrat[wght].ttf`, `montserrat/Montserrat-Italic[wght].ttf` | 标题、海报、现代品牌感排版 |
| Poppins | `poppins/Poppins-Regular.ttf`, `poppins/Poppins-Bold.ttf`, `poppins/Poppins-Italic.ttf` | 圆润几何风格 UI 和标题 |
| Oswald | `oswald/Oswald[wght].ttf` | 窄体标题、封面文字、强调信息 |
| Playfair Display | `playfairdisplay/PlayfairDisplay[wght].ttf`, `playfairdisplay/PlayfairDisplay-Italic[wght].ttf` | 高对比衬线标题、杂志感排版 |
| Source Sans 3 | `sourcesans3/SourceSans3[wght].ttf`, `sourcesans3/SourceSans3-Italic[wght].ttf` | 干净的界面文本和正文 |
| Fira Code | `firacode/FiraCode[wght].ttf` | 代码、等宽文本、带连字的编程字体 |
| JetBrains Mono | `jetbrainsmono/JetBrainsMono[wght].ttf`, `jetbrainsmono/JetBrainsMono-Italic[wght].ttf` | 代码、编辑器、等宽信息 |
| Noto Sans SC | `notosanssc/NotoSansSC[wght].ttf` | 简体中文无衬线正文和 UI |
| Noto Serif SC | `notoserifsc/NotoSerifSC[wght].ttf` | 简体中文衬线正文和标题 |
| SimHei | `simhei/SimHei.ttf` | 简体中文黑体文本，以及兼容按 SimHei 设计的版式 |

## 来源和许可证

本目录大部分字体来自 Google Fonts 官方仓库：

- https://github.com/google/fonts

这些字体子目录里都保留了对应的 `OFL.txt` 许可证文件。

`simhei/SimHei.ttf` 从本机 `~/Downloads/SimHei.ttf` 复制而来。公开再分发前，请确认你拥有相应授权。
