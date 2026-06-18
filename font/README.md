# Font Assets

This directory contains a set of commonly used open source fonts that can be referenced directly from `text-overlay-demo.html` or other web pages.

Simplified Chinese documentation is available in [README.zh-CN.md](./README.zh-CN.md).

## Usage

Include the stylesheet in HTML:

```html
<link rel="stylesheet" href="./font/fonts.css">
```

Then use the font families in CSS:

```css
.title {
  font-family: "Noto Sans SC", "Roboto", sans-serif;
}

.code {
  font-family: "JetBrains Mono", "Fira Code", monospace;
}
```

## Font List

| Font | Files | Best for |
| --- | --- | --- |
| Roboto | `roboto/Roboto[wdth,wght].ttf`, `roboto/Roboto-Italic[wdth,wght].ttf` | Android/Material-style interfaces and general Latin UI text |
| Open Sans | `opensans/OpenSans[wdth,wght].ttf`, `opensans/OpenSans-Italic[wdth,wght].ttf` | Web body text, forms, and supporting copy |
| Montserrat | `montserrat/Montserrat[wght].ttf`, `montserrat/Montserrat-Italic[wght].ttf` | Headings, posters, and modern brand-style typography |
| Poppins | `poppins/Poppins-Regular.ttf`, `poppins/Poppins-Bold.ttf`, `poppins/Poppins-Italic.ttf` | Rounded geometric UI text and headings |
| Oswald | `oswald/Oswald[wght].ttf` | Condensed headings, cover text, and emphasized labels |
| Playfair Display | `playfairdisplay/PlayfairDisplay[wght].ttf`, `playfairdisplay/PlayfairDisplay-Italic[wght].ttf` | High-contrast serif headlines and editorial-style layouts |
| Source Sans 3 | `sourcesans3/SourceSans3[wght].ttf`, `sourcesans3/SourceSans3-Italic[wght].ttf` | Clean interface text and body copy |
| Fira Code | `firacode/FiraCode[wght].ttf` | Code, monospace text, and programming typography with ligatures |
| JetBrains Mono | `jetbrainsmono/JetBrainsMono[wght].ttf`, `jetbrainsmono/JetBrainsMono-Italic[wght].ttf` | Code, editor UI, and monospace data |
| Noto Sans SC | `notosanssc/NotoSansSC[wght].ttf` | Simplified Chinese sans-serif body text and UI |
| Noto Serif SC | `notoserifsc/NotoSerifSC[wght].ttf` | Simplified Chinese serif body text and headings |
| SimHei | `simhei/SimHei.ttf` | Simplified Chinese blackface text and compatibility with layouts designed around SimHei |

## Source and License

Most fonts in this directory are from the official Google Fonts repository:

- https://github.com/google/fonts

Those font subdirectories keep their corresponding `OFL.txt` license files.

`simhei/SimHei.ttf` was copied from the local `~/Downloads/SimHei.ttf` file. Confirm that you have the required rights before redistributing it publicly.
