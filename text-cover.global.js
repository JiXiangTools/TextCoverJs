/**
 * TextCoverJs v1.0.0
 *
 * Add editable text boxes over an existing rendered HTML element.
 *
 * Usage:
 *   const overlay = createTextOverlay(document.getElementById("image"), entities, "https://example.com/font.woff2", {
 *     coordinateSpace: "natural"
 *   });
 *
 *   overlay.update(nextEntities);
 *   overlay.destroy();
 */

const TEXT_COVER_VERSION = "1.0.0";

const DEFAULT_FONT_STACK = [
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  '"Noto Sans"',
  '"Noto Sans CJK SC"',
  '"Microsoft YaHei"',
  '"PingFang SC"',
  "Arial",
  "sans-serif"
].join(", ");

const Direction = {
  TOP_TO_BOTTOM: "top-to-bottom",
  RIGHT_TO_LEFT: "right-to-left",
  LEFT_TO_RIGHT: "left-to-right"
};

const ExpandMode = {
  FIXED_HEIGHT_GROW_WIDTH: "fixed-height-grow-width",
  FIXED_WIDTH_GROW_HEIGHT: "fixed-width-grow-height",
  FREE_EXPAND: "free-expand",
  NO_EXPAND: "no-expand"
};

const LANGUAGE_OPTIONS = [
  ["en", "English"],
  ["zh-CN", "简体中文"],
  ["zh-TW", "繁體中文"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["ru", "Русский"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["it", "Italiano"],
  ["ar", "العربية"]
];

const PANEL_TEXT = {
  en: {
    panelTitle: "Text block",
    language: "Language:",
    textDirection: "Text direction",
    expandDirection: "Expansion",
    fontSize: "Font size",
    fontUrl: "Font URL",
    addText: "Add text box",
    undo: "Undo",
    redo: "Redo",
    save: "Save",
    download: "Download",
    textColor: "Text color",
    italic: "Italic",
    bold: "Bold",
    underline: "Underline",
    editable: "Editable",
    movable: "Movable",
    resizable: "Resizable",
    auto: "Auto",
    dirLtr: "Left to right",
    dirRtl: "Right to left",
    dirTtb: "Top to bottom",
    expandHeight: "Fixed width, grow height",
    expandWidth: "Fixed height, grow width",
    expandFree: "Free expand",
    expandNone: "No expansion",
    apply: "Apply",
    delete: "Delete",
    saveSuccess: "Saved"
  },
  "zh-CN": {
    panelTitle: "文本块参数",
    language: "语言:",
    textDirection: "文字方向",
    expandDirection: "扩展方向",
    fontSize: "文字大小",
    fontUrl: "字体链接",
    addText: "新增文本框",
    undo: "撤销",
    redo: "取消撤销",
    save: "保存",
    download: "下载",
    textColor: "文字颜色",
    italic: "斜体",
    bold: "加粗",
    underline: "下划线",
    editable: "可编辑",
    movable: "可移动",
    resizable: "可拉伸",
    auto: "自适应",
    dirLtr: "自左向右",
    dirRtl: "自右向左",
    dirTtb: "自上而下",
    expandHeight: "宽度不变扩展高度",
    expandWidth: "高度不变扩展宽度",
    expandFree: "全部自由扩展",
    expandNone: "全部不可扩展",
    apply: "应用",
    delete: "删除",
    saveSuccess: "保存成功"
  },
  "zh-TW": {
    panelTitle: "文字區塊參數",
    language: "語言:",
    textDirection: "文字方向",
    expandDirection: "擴展方向",
    fontSize: "文字大小",
    fontUrl: "字型連結",
    addText: "新增文字框",
    undo: "復原",
    redo: "取消復原",
    save: "儲存",
    download: "下載",
    textColor: "文字顏色",
    italic: "斜體",
    bold: "粗體",
    underline: "底線",
    editable: "可編輯",
    movable: "可移動",
    resizable: "可拉伸",
    auto: "自適應",
    dirLtr: "由左至右",
    dirRtl: "由右至左",
    dirTtb: "由上至下",
    expandHeight: "寬度不變擴展高度",
    expandWidth: "高度不變擴展寬度",
    expandFree: "全部自由擴展",
    expandNone: "全部不可擴展",
    apply: "套用",
    delete: "刪除",
    saveSuccess: "儲存成功"
  },
  ja: {
    panelTitle: "テキストブロック",
    language: "言語:",
    textDirection: "文字方向",
    expandDirection: "拡張方向",
    fontSize: "文字サイズ",
    fontUrl: "フォントURL",
    addText: "テキスト追加",
    undo: "元に戻す",
    redo: "やり直す",
    save: "保存",
    download: "ダウンロード",
    textColor: "文字色",
    italic: "斜体",
    bold: "太字",
    underline: "下線",
    editable: "編集可",
    movable: "移動可",
    resizable: "リサイズ可",
    auto: "自動",
    dirLtr: "左から右",
    dirRtl: "右から左",
    dirTtb: "上から下",
    expandHeight: "幅固定で高さ拡張",
    expandWidth: "高さ固定で幅拡張",
    expandFree: "自由拡張",
    expandNone: "拡張なし",
    apply: "適用",
    delete: "削除",
    saveSuccess: "保存しました"
  },
  ko: {
    panelTitle: "텍스트 블록",
    language: "언어:",
    textDirection: "텍스트 방향",
    expandDirection: "확장 방향",
    fontSize: "글자 크기",
    fontUrl: "폰트 URL",
    addText: "텍스트 추가",
    undo: "실행 취소",
    redo: "다시 실행",
    save: "저장",
    download: "다운로드",
    textColor: "글자 색상",
    italic: "기울임",
    bold: "굵게",
    underline: "밑줄",
    editable: "편집 가능",
    movable: "이동 가능",
    resizable: "크기 조절",
    auto: "자동",
    dirLtr: "왼쪽에서 오른쪽",
    dirRtl: "오른쪽에서 왼쪽",
    dirTtb: "위에서 아래",
    expandHeight: "너비 고정, 높이 확장",
    expandWidth: "높이 고정, 너비 확장",
    expandFree: "자유 확장",
    expandNone: "확장 안 함",
    apply: "적용",
    delete: "삭제",
    saveSuccess: "저장됨"
  },
  ru: {
    panelTitle: "Текстовый блок",
    language: "Язык:",
    textDirection: "Направление",
    expandDirection: "Расширение",
    fontSize: "Размер шрифта",
    fontUrl: "URL шрифта",
    addText: "Добавить текст",
    undo: "Отменить",
    redo: "Повторить",
    save: "Сохранить",
    download: "Скачать",
    textColor: "Цвет текста",
    italic: "Курсив",
    bold: "Жирный",
    underline: "Подчеркнутый",
    editable: "Редактируемый",
    movable: "Перемещаемый",
    resizable: "Изменяемый",
    auto: "Авто",
    dirLtr: "Слева направо",
    dirRtl: "Справа налево",
    dirTtb: "Сверху вниз",
    expandHeight: "Фикс. ширина, рост высоты",
    expandWidth: "Фикс. высота, рост ширины",
    expandFree: "Свободное расширение",
    expandNone: "Без расширения",
    apply: "Применить",
    delete: "Удалить",
    saveSuccess: "Сохранено"
  },
  fr: {
    panelTitle: "Bloc de texte",
    language: "Langue:",
    textDirection: "Direction",
    expandDirection: "Extension",
    fontSize: "Taille",
    fontUrl: "URL de police",
    addText: "Ajouter un texte",
    undo: "Annuler",
    redo: "Rétablir",
    save: "Enregistrer",
    download: "Télécharger",
    textColor: "Couleur",
    italic: "Italique",
    bold: "Gras",
    underline: "Souligné",
    editable: "Modifiable",
    movable: "Déplaçable",
    resizable: "Redimensionnable",
    auto: "Auto",
    dirLtr: "Gauche à droite",
    dirRtl: "Droite à gauche",
    dirTtb: "Haut en bas",
    expandHeight: "Largeur fixe, hauteur auto",
    expandWidth: "Hauteur fixe, largeur auto",
    expandFree: "Extension libre",
    expandNone: "Aucune extension",
    apply: "Appliquer",
    delete: "Supprimer",
    saveSuccess: "Enregistré"
  },
  de: {
    panelTitle: "Textblock",
    language: "Sprache:",
    textDirection: "Textrichtung",
    expandDirection: "Erweiterung",
    fontSize: "Schriftgröße",
    fontUrl: "Schrift-URL",
    addText: "Text hinzufügen",
    undo: "Rückgängig",
    redo: "Wiederholen",
    save: "Speichern",
    download: "Herunterladen",
    textColor: "Textfarbe",
    italic: "Kursiv",
    bold: "Fett",
    underline: "Unterstrichen",
    editable: "Bearbeitbar",
    movable: "Verschiebbar",
    resizable: "Größenänderbar",
    auto: "Auto",
    dirLtr: "Links nach rechts",
    dirRtl: "Rechts nach links",
    dirTtb: "Oben nach unten",
    expandHeight: "Breite fix, Höhe wächst",
    expandWidth: "Höhe fix, Breite wächst",
    expandFree: "Frei erweitern",
    expandNone: "Nicht erweitern",
    apply: "Anwenden",
    delete: "Löschen",
    saveSuccess: "Gespeichert"
  },
  it: {
    panelTitle: "Blocco di testo",
    language: "Lingua:",
    textDirection: "Direzione",
    expandDirection: "Espansione",
    fontSize: "Dimensione",
    fontUrl: "URL font",
    addText: "Aggiungi testo",
    undo: "Annulla",
    redo: "Ripristina",
    save: "Salva",
    download: "Scarica",
    textColor: "Colore testo",
    italic: "Corsivo",
    bold: "Grassetto",
    underline: "Sottolineato",
    editable: "Modificabile",
    movable: "Spostabile",
    resizable: "Ridimensionabile",
    auto: "Auto",
    dirLtr: "Da sinistra a destra",
    dirRtl: "Da destra a sinistra",
    dirTtb: "Dall'alto in basso",
    expandHeight: "Larghezza fissa, altezza auto",
    expandWidth: "Altezza fissa, larghezza auto",
    expandFree: "Espansione libera",
    expandNone: "Nessuna espansione",
    apply: "Applica",
    delete: "Elimina",
    saveSuccess: "Salvato"
  },
  ar: {
    panelTitle: "كتلة نص",
    language: "اللغة:",
    textDirection: "اتجاه النص",
    expandDirection: "التوسيع",
    fontSize: "حجم الخط",
    fontUrl: "رابط الخط",
    addText: "إضافة مربع نص",
    undo: "تراجع",
    redo: "إعادة",
    save: "حفظ",
    download: "تنزيل",
    textColor: "لون النص",
    italic: "مائل",
    bold: "عريض",
    underline: "تحته خط",
    editable: "قابل للتحرير",
    movable: "قابل للتحريك",
    resizable: "قابل لتغيير الحجم",
    auto: "تلقائي",
    dirLtr: "من اليسار إلى اليمين",
    dirRtl: "من اليمين إلى اليسار",
    dirTtb: "من الأعلى إلى الأسفل",
    expandHeight: "عرض ثابت، ارتفاع متغير",
    expandWidth: "ارتفاع ثابت، عرض متغير",
    expandFree: "توسيع حر",
    expandNone: "بدون توسيع",
    apply: "تطبيق",
    delete: "حذف",
    saveSuccess: "تم الحفظ"
  }
};

let overlaySeq = 0;
const loadedFontFaces = new Map();

function createTextOverlay(targetElement, entities = [], fontUrlOrOptions = undefined, options = undefined) {
  if (!targetElement || targetElement.nodeType !== 1) {
    throw new TypeError("createTextOverlay(targetElement, entities, fontUrl, options): targetElement must be an HTMLElement.");
  }

  const overlayArgs = normalizeOverlayArguments(fontUrlOrOptions, options);
  const config = {
    coordinateSpace: "rendered",
    sourceWidth: undefined,
    sourceHeight: undefined,
    zIndex: 9999,
    className: "",
    clipToTarget: false,
    editableClassName: "text-overlay-box--editable",
    editingClassName: "text-overlay-box--editing",
    parameterPanel: true,
    parameterPanelClassName: "text-overlay-parameter-panel",
    toolbar: true,
    toolbarClassName: "text-overlay-toolbar",
    language: undefined,
    fontUrl: undefined,
    onTextChange: undefined,
    onEntityChange: undefined,
    onSave: undefined,
    ...overlayArgs.options
  };
  if (overlayArgs.hasFontUrl) {
    config.fontUrl = overlayArgs.fontUrl;
  }

  ensureParameterPanelStyles();

  const overlayId = `text-overlay-${++overlaySeq}`;
  config.entityIdPrefix = `${overlayId}-entity`;
  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.className = ["text-overlay-layer", config.className].filter(Boolean).join(" ");
  overlay.dataset.targetOverlayFor = targetElement.id || targetElement.tagName.toLowerCase();
  Object.assign(overlay.style, {
    position: "absolute",
    boxSizing: "border-box",
    pointerEvents: "none",
    overflow: config.clipToTarget ? "hidden" : "visible",
    zIndex: String(config.zIndex),
    left: "0px",
    top: "0px",
    width: "0px",
    height: "0px"
  });

  document.body.appendChild(overlay);

  let currentEntities = assignSequentialEntityIds(normalizeEntities(entities));
  let currentLanguage = normalizeLanguage(config.language ?? currentEntities[0]?.language);
  let currentFontUrl = normalizeFontUrl(config.fontUrl);
  config.fontUrl = currentFontUrl || undefined;
  let resizeObserver = null;
  let destroyed = false;
  let rafId = 0;
  let parameterPanel = null;
  let activeEntityIndex = null;
  let lastSnapshot = snapshotEntities(currentEntities, currentFontUrl);
  const undoStack = [];
  const redoStack = [];
  const toolbar = config.toolbar ? buildToolbar() : null;

  if (toolbar) {
    document.body.appendChild(toolbar);
  }

  const scheduleRender = () => {
    if (destroyed || rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      render();
    });
  };

  const onWindowChange = () => scheduleRender();
  const onDocumentPointerDown = (event) => {
    if (!parameterPanel || shouldKeepParameterPanelOpen(event)) return;
    hideParameterPanel();
  };
  window.addEventListener("scroll", onWindowChange, true);
  window.addEventListener("resize", onWindowChange);
  document.addEventListener("pointerdown", onDocumentPointerDown, true);

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(scheduleRender);
    resizeObserver.observe(targetElement);
  }

  function render() {
    if (destroyed) return;

    const targetRect = targetElement.getBoundingClientRect();
    const pageLeft = targetRect.left + window.scrollX;
    const pageTop = targetRect.top + window.scrollY;

    Object.assign(overlay.style, {
      left: `${pageLeft}px`,
      top: `${pageTop}px`,
      width: `${targetRect.width}px`,
      height: `${targetRect.height}px`
    });

    if (toolbar) {
      Object.assign(toolbar.style, {
        left: `${pageLeft + targetRect.width + 8}px`,
        top: `${pageTop}px`,
        zIndex: String(Number(config.zIndex || 9999) + 2)
      });
      syncToolbarState();
    }

    overlay.replaceChildren();

    const scale = getCoordinateScale(targetElement, targetRect, config);
    currentEntities.forEach((entity, index) => {
      const box = buildTextBox(entity, index, scale, config, {
        scheduleRender,
        showParameterPanel,
        notifyEntityChange,
        refreshParameterPanel
      });
      overlay.appendChild(box);
    });

    if (parameterPanel && activeEntityIndex != null) {
      const activeBox = overlay.querySelector(`[data-index="${activeEntityIndex}"]`);
      if (activeBox) positionParameterPanel(parameterPanel, activeBox);
    }
  }

  function update(nextEntities, nextFontUrlOrOptions = undefined, nextOptions = undefined) {
    const updateArgs = normalizeOverlayArguments(nextFontUrlOrOptions, nextOptions);
    Object.assign(config, updateArgs.options);
    if (updateArgs.hasFontUrl) {
      config.fontUrl = updateArgs.fontUrl;
    }
    currentEntities = assignSequentialEntityIds(normalizeEntities(nextEntities));
    currentLanguage = normalizeLanguage(config.language ?? currentEntities[0]?.language ?? currentLanguage);
    currentFontUrl = normalizeFontUrl(config.fontUrl ?? currentFontUrl);
    config.fontUrl = currentFontUrl || undefined;
    lastSnapshot = snapshotEntities(currentEntities, currentFontUrl);
    undoStack.length = 0;
    redoStack.length = 0;
    scheduleRender();
  }

  function getEntities() {
    return currentEntities.map((entity) => structuredCloneSafe(entity));
  }

  function getFontUrl() {
    return currentFontUrl;
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (rafId) window.cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onWindowChange, true);
    window.removeEventListener("resize", onWindowChange);
    document.removeEventListener("pointerdown", onDocumentPointerDown, true);
    if (resizeObserver) resizeObserver.disconnect();
    hideParameterPanel();
    overlay.remove();
    toolbar?.remove();
  }

  function showParameterPanel(entity, index, anchorBox) {
    if (!config.parameterPanel) return;
    hideParameterPanel();
    activeEntityIndex = index;
    currentLanguage = normalizeLanguage(entity.language ?? currentLanguage);
    syncToolbarState();
    parameterPanel = buildParameterPanel(entity, index, getParameterPanelContext());
    document.body.appendChild(parameterPanel);
    positionParameterPanel(parameterPanel, anchorBox);
  }

  function refreshParameterPanel(entity, index) {
    if (!parameterPanel || activeEntityIndex !== index) return;
    const activeBox = overlay.querySelector(`[data-index="${index}"]`);
    if (!activeBox) return;
    parameterPanel.remove();
    parameterPanel = buildParameterPanel(entity, index, getParameterPanelContext());
    document.body.appendChild(parameterPanel);
    positionParameterPanel(parameterPanel, activeBox);
  }

  function getParameterPanelContext() {
    return {
      config,
      language: currentLanguage,
      scheduleRender,
      notifyEntityChange,
      hideParameterPanel,
      refreshParameterPanel,
      deleteEntity
    };
  }

  function hideParameterPanel() {
    parameterPanel?.remove();
    parameterPanel = null;
    activeEntityIndex = null;
  }

  function shouldKeepParameterPanelOpen(event) {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    if (parameterPanel && (path.includes(parameterPanel) || parameterPanel.contains(event.target))) {
      return true;
    }

    const activeBox = activeEntityIndex != null
      ? overlay.querySelector(`[data-index="${activeEntityIndex}"]`)
      : null;
    return !!activeBox && (path.includes(activeBox) || activeBox.contains(event.target));
  }

  function notifyEntityChange(entity, index) {
    recordHistory();
    config.onEntityChange?.({
      id: entity.id,
      index,
      entity: structuredCloneSafe(entity)
    });
    syncToolbarState();
  }

  function deleteEntity(index) {
    if (index == null || !currentEntities[index]) return;
    const [removedEntity] = currentEntities.splice(index, 1);
    assignSequentialEntityIds(currentEntities);
    recordHistory();
    hideParameterPanel();
    overlay.dispatchEvent(new CustomEvent("text-overlay-delete", {
      detail: {
        id: removedEntity.id,
        index,
        entity: structuredCloneSafe(removedEntity)
      }
    }));
    scheduleRender();
    syncToolbarState();
  }

  function recordHistory() {
    const currentSnapshot = snapshotEntities(currentEntities, currentFontUrl);
    if (currentSnapshot === lastSnapshot) return;
    undoStack.push(lastSnapshot);
    if (undoStack.length > 100) undoStack.shift();
    redoStack.length = 0;
    lastSnapshot = currentSnapshot;
  }

  function restoreSnapshot(snapshot) {
    const restored = parseSnapshot(snapshot);
    currentEntities = assignSequentialEntityIds(normalizeEntities(restored.entities));
    currentFontUrl = normalizeFontUrl(restored.fontUrl);
    config.fontUrl = currentFontUrl || undefined;
    lastSnapshot = snapshotEntities(currentEntities, currentFontUrl);
    hideParameterPanel();
    scheduleRender();
    syncToolbarState();
  }

  function undo() {
    if (!undoStack.length) return;
    redoStack.push(snapshotEntities(currentEntities, currentFontUrl));
    restoreSnapshot(undoStack.pop());
  }

  function redo() {
    if (!redoStack.length) return;
    undoStack.push(snapshotEntities(currentEntities, currentFontUrl));
    restoreSnapshot(redoStack.pop());
  }

  function addTextEntity() {
    const targetRect = targetElement.getBoundingClientRect();
    const scale = getCoordinateScale(targetElement, targetRect, config);
    const width = Math.min(220, Math.max(120, targetRect.width * 0.34));
    const height = Math.min(80, Math.max(48, targetRect.height * 0.12));
    const x = Math.max(12, (targetRect.width - width) / 2);
    const y = Math.max(12, (targetRect.height - height) / 2);
    const toSource = (point) => ({
      x: point.x / Math.max(scale.x, 0.0001),
      y: point.y / Math.max(scale.y, 0.0001)
    });
    const entity = normalizeEntities([{
      points: {
        topLeft: toSource({ x, y }),
        topRight: toSource({ x: x + width, y }),
        bottomLeft: toSource({ x, y: y + height }),
        bottomRight: toSource({ x: x + width, y: y + height })
      },
      direction: Direction.LEFT_TO_RIGHT,
      expandDirection: ExpandMode.NO_EXPAND,
      text: "New text",
      fontSize: 24,
      color: "#111111",
      editable: true,
      movable: true,
      resizable: true,
      language: currentLanguage
    }])[0];
    currentEntities.push(entity);
    assignSequentialEntityIds(currentEntities);
    activeEntityIndex = currentEntities.length - 1;
    recordHistory();
    scheduleRender();
    window.requestAnimationFrame(() => {
      const activeBox = overlay.querySelector(`[data-index="${activeEntityIndex}"]`);
      if (activeBox) showParameterPanel(entity, activeEntityIndex, activeBox);
    });
  }

  function setLanguage(language) {
    currentLanguage = normalizeLanguage(language);
    const index = activeEntityIndex;
    if (index != null && currentEntities[index]) {
      currentEntities[index].language = currentLanguage;
      applyLanguageDefaults(currentEntities[index]);
      recordHistory();
      refreshParameterPanel(currentEntities[index], index);
    } else {
      config.language = currentLanguage;
      currentEntities.forEach((entity) => {
        entity.language = currentLanguage;
        applyLanguageDefaults(entity);
      });
      recordHistory();
    }
    scheduleRender();
    syncToolbarState();
  }

  function setFontUrl(fontUrl) {
    currentFontUrl = normalizeFontUrl(fontUrl);
    config.fontUrl = currentFontUrl || undefined;
    recordHistory();
    if (activeEntityIndex != null && currentEntities[activeEntityIndex]) {
      refreshParameterPanel(currentEntities[activeEntityIndex], activeEntityIndex);
    }
    scheduleRender();
    syncToolbarState();
  }

  function saveOverlay() {
    const payload = {
      id: overlayId,
      savedAt: new Date().toISOString(),
      fontUrl: currentFontUrl,
      entities: getEntities()
    };
    try {
      window.localStorage?.setItem(`textOverlay:${overlayId}`, JSON.stringify(payload));
    } catch {
      // localStorage can be disabled; onSave and event still expose the payload.
    }
    config.onSave?.(payload);
    overlay.dispatchEvent(new CustomEvent("text-overlay-save", { detail: payload }));
    flashToolbarButton("save");
    showToolbarToast(panelTextForLanguage(currentLanguage, "saveSuccess"));
  }

  function buildToolbar() {
    const bar = document.createElement("div");
    bar.className = config.toolbarClassName;
    bar.dataset.overlayId = overlayId;
    Object.assign(bar.style, {
      position: "absolute"
    });

    const languageButton = createToolbarButton("language", toolbarIcon("language"), getLanguageLabel(currentLanguage));
    const languageMenu = document.createElement("div");
    languageMenu.className = "text-overlay-toolbar-menu";
    languageMenu.hidden = true;

    const fontButton = createToolbarButton("font", toolbarIcon("font"), panelTextForLanguage(currentLanguage, "fontUrl"));
    const fontMenu = document.createElement("div");
    fontMenu.className = "text-overlay-toolbar-menu text-overlay-toolbar-menu--font";
    fontMenu.hidden = true;
    const fontField = document.createElement("label");
    fontField.className = "text-overlay-toolbar-field";
    const fontLabel = document.createElement("span");
    fontLabel.dataset.role = "toolbar-font-label";
    fontLabel.textContent = panelTextForLanguage(currentLanguage, "fontUrl");
    const fontInput = document.createElement("input");
    fontInput.type = "url";
    fontInput.value = getActiveFontUrl();
    fontInput.placeholder = "https://example.com/font.woff2";
    fontInput.dataset.role = "toolbar-font-url";
    fontField.append(fontLabel, fontInput);
    const fontApply = document.createElement("button");
    fontApply.type = "button";
    fontApply.className = "text-overlay-toolbar-menu-item text-overlay-toolbar-apply";
    fontApply.dataset.role = "toolbar-font-apply";
    fontApply.textContent = panelTextForLanguage(currentLanguage, "apply");
    fontApply.addEventListener("click", (event) => {
      event.stopPropagation();
      setFontUrl(fontInput.value);
      fontMenu.hidden = true;
    });
    fontInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      setFontUrl(fontInput.value);
      fontMenu.hidden = true;
    });
    fontMenu.append(fontField, fontApply);

    const downloadButton = createToolbarButton("download", toolbarIcon("download"), toolbarLabel("download"));
    const downloadMenu = document.createElement("div");
    downloadMenu.className = "text-overlay-toolbar-menu";
    downloadMenu.hidden = true;

    const closeMenus = (except = null) => {
      if (except !== languageMenu) languageMenu.hidden = true;
      if (except !== fontMenu) fontMenu.hidden = true;
      if (except !== downloadMenu) downloadMenu.hidden = true;
    };

    LANGUAGE_OPTIONS.forEach(([code, label]) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "text-overlay-toolbar-menu-item";
      option.textContent = label;
      option.dataset.language = code;
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        languageMenu.hidden = true;
        setLanguage(code);
      });
      languageMenu.append(option);
    });
    languageButton.addEventListener("click", (event) => {
      event.stopPropagation();
      languageMenu.hidden = !languageMenu.hidden;
      closeMenus(languageMenu.hidden ? null : languageMenu);
    });

    fontButton.addEventListener("click", (event) => {
      event.stopPropagation();
      fontInput.value = getActiveFontUrl();
      fontMenu.hidden = !fontMenu.hidden;
      closeMenus(fontMenu.hidden ? null : fontMenu);
      if (!fontMenu.hidden) {
        fontInput.focus();
        fontInput.select();
      }
    });

    const addButton = createToolbarButton("add", toolbarIcon("add"), toolbarLabel("addText"));
    addButton.addEventListener("click", addTextEntity);

    const undoButton = createToolbarButton("undo", toolbarIcon("undo"), toolbarLabel("undo"));
    undoButton.addEventListener("click", undo);

    const redoButton = createToolbarButton("redo", toolbarIcon("redo"), toolbarLabel("redo"));
    redoButton.addEventListener("click", redo);

    const saveButton = createToolbarButton("save", toolbarIcon("save"), toolbarLabel("save"));
    saveButton.addEventListener("click", saveOverlay);

    [
      ["webp", "WEBP"],
      ["jpeg", "JPEG"],
      ["png", "PNG"]
    ].forEach(([format, label]) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "text-overlay-toolbar-menu-item";
      option.textContent = label;
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        downloadMenu.hidden = true;
        downloadOverlay(format);
      });
      downloadMenu.append(option);
    });
    downloadButton.addEventListener("click", (event) => {
      event.stopPropagation();
      downloadMenu.hidden = !downloadMenu.hidden;
      closeMenus(downloadMenu.hidden ? null : downloadMenu);
    });

    [
      [languageButton, languageMenu],
      [fontButton, fontMenu],
      [addButton],
      [undoButton],
      [redoButton],
      [saveButton],
      [downloadButton, downloadMenu]
    ].forEach(([button, menu]) => {
      const item = document.createElement("div");
      item.className = "text-overlay-toolbar-item";
      item.append(button);
      if (menu) item.append(menu);
      bar.append(item);
    });

    return bar;
  }

  function getActiveFontUrl() {
    return currentFontUrl;
  }

  function toolbarLabel(key) {
    return panelTextForLanguage(currentLanguage, key);
  }

  function createToolbarButton(action, icon, title) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "text-overlay-toolbar-button";
    button.dataset.action = action;
    button.title = title;
    button.setAttribute("aria-label", title);
    button.innerHTML = icon;
    return button;
  }

  function syncToolbarState() {
    if (!toolbar) return;
    const languageButton = toolbar.querySelector('[data-action="language"]');
    if (languageButton) {
      languageButton.title = getLanguageLabel(currentLanguage);
      languageButton.setAttribute("aria-label", getLanguageLabel(currentLanguage));
    }
    toolbar.querySelectorAll("[data-language]").forEach((option) => {
      const isActive = option.dataset.language === currentLanguage;
      option.classList.toggle("text-overlay-toolbar-menu-item--active", isActive);
      option.setAttribute("aria-current", isActive ? "true" : "false");
    });
    const fontButton = toolbar.querySelector('[data-action="font"]');
    if (fontButton) {
      const label = panelTextForLanguage(currentLanguage, "fontUrl");
      fontButton.title = label;
      fontButton.setAttribute("aria-label", label);
    }
    const fontLabel = toolbar.querySelector('[data-role="toolbar-font-label"]');
    if (fontLabel) fontLabel.textContent = panelTextForLanguage(currentLanguage, "fontUrl");
    const fontInput = toolbar.querySelector('[data-role="toolbar-font-url"]');
    if (fontInput && document.activeElement !== fontInput) {
      fontInput.value = getActiveFontUrl();
    }
    const fontApply = toolbar.querySelector('[data-role="toolbar-font-apply"]');
    if (fontApply) fontApply.textContent = panelTextForLanguage(currentLanguage, "apply");
    syncToolbarButtonLabel("add", toolbarLabel("addText"));
    syncToolbarButtonLabel("undo", toolbarLabel("undo"));
    syncToolbarButtonLabel("redo", toolbarLabel("redo"));
    syncToolbarButtonLabel("save", toolbarLabel("save"));
    syncToolbarButtonLabel("download", toolbarLabel("download"));
    const undoButton = toolbar.querySelector('[data-action="undo"]');
    const redoButton = toolbar.querySelector('[data-action="redo"]');
    if (undoButton) undoButton.disabled = undoStack.length === 0;
    if (redoButton) redoButton.disabled = redoStack.length === 0;
  }

  function syncToolbarButtonLabel(action, label) {
    const button = toolbar.querySelector(`[data-action="${action}"]`);
    if (!button) return;
    button.title = label;
    button.setAttribute("aria-label", label);
  }

  function flashToolbarButton(action) {
    const button = toolbar?.querySelector(`[data-action="${action}"]`);
    if (!button) return;
    button.classList.add("text-overlay-toolbar-button--active");
    window.setTimeout(() => button.classList.remove("text-overlay-toolbar-button--active"), 650);
  }

  function showToolbarToast(message) {
    if (!toolbar) return;
    let toast = toolbar.querySelector(".text-overlay-toolbar-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "text-overlay-toolbar-toast";
      toolbar.append(toast);
    }
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToolbarToast.timer);
    showToolbarToast.timer = window.setTimeout(() => {
      toast.hidden = true;
    }, 1600);
  }

  async function downloadOverlay(format) {
    try {
      const blob = await renderOverlayImage(targetElement, overlay, currentEntities, config, format);
      const extension = format === "jpeg" ? "jpg" : format;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `text-overlay-${Date.now()}.${extension}`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      overlay.dispatchEvent(new CustomEvent("text-overlay-download-error", { detail: { error } }));
      throw error;
    }
  }

  render();

  return {
    id: overlayId,
    element: overlay,
    update,
    destroy,
    getEntities,
    getFontUrl
  };
}

function removeTextOverlay(overlayController) {
  overlayController?.destroy?.();
}

function normalizeOverlayArguments(fontUrlOrOptions, options) {
  if (options === undefined && isPlainObject(fontUrlOrOptions)) {
    return {
      hasFontUrl: false,
      fontUrl: "",
      options: fontUrlOrOptions
    };
  }

  if (options !== undefined && !isPlainObject(options)) {
    throw new TypeError("options must be an object.");
  }

  return {
    hasFontUrl: fontUrlOrOptions !== undefined,
    fontUrl: normalizeFontUrl(fontUrlOrOptions),
    options: options ?? {}
  };
}

function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function normalizeFontUrl(value) {
  if (value == null) return "";
  return String(value).trim();
}

function snapshotEntities(entities, fontUrl = "") {
  return JSON.stringify({
    fontUrl: normalizeFontUrl(fontUrl),
    entities: entities.map((entity) => {
      const clone = structuredCloneSafe(entity);
      delete clone.computedFontSize;
      return clone;
    })
  });
}

function parseSnapshot(snapshot) {
  const parsed = JSON.parse(snapshot);
  if (Array.isArray(parsed)) {
    return { fontUrl: "", entities: parsed };
  }
  return {
    fontUrl: parsed?.fontUrl ?? "",
    entities: Array.isArray(parsed?.entities) ? parsed.entities : []
  };
}

function toolbarIcon(name) {
  const icons = {
    language: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.2 2.4 3.4 5.4 3.4 9s-1.2 6.6-3.4 9M12 3c-2.2 2.4-3.4 5.4-3.4 9s1.2 6.6 3.4 9"/></svg>',
    font: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 11 5h2l6 14M8 14h8"/></svg>',
    add: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    undo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7H4v5M4 7l5 5M20 17a7 7 0 0 0-11.8-5"/></svg>',
    redo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 7h5v5M20 7l-5 5M4 17a7 7 0 0 1 11.8-5"/></svg>',
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h12l2 2v14H5zM8 4v6h8V4M8 20v-6h8v6"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14"/></svg>'
  };
  return icons[name] ?? "";
}

async function renderOverlayImage(targetElement, overlayElement, entities, config, format) {
  const targetRect = targetElement.getBoundingClientRect();
  const width = Math.max(1, Math.round(targetRect.width));
  const height = Math.max(1, Math.round(targetRect.height));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const ctx = canvas.getContext("2d");
  ctx.scale(pixelRatio, pixelRatio);

  try {
    await drawDomSnapshot(ctx, targetElement, overlayElement, width, height);
  } catch {
    await drawTargetElement(ctx, targetElement, width, height);
    const scale = getCoordinateScale(targetElement, targetRect, config);
    entities.forEach((entity) => drawEntityToCanvas(ctx, entity, scale, config));
  }

  const mime = format === "jpeg" ? "image/jpeg" : `image/${format}`;
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error(`Unable to export ${mime}.`));
    }, mime, format === "jpeg" ? 0.92 : undefined);
  });
  return blob;
}

async function drawDomSnapshot(ctx, targetElement, overlayElement, width, height) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  Object.assign(wrapper.style, {
    position: "relative",
    width: `${width}px`,
    height: `${height}px`,
    overflow: "hidden",
    margin: "0",
    background: "#ffffff"
  });

  const targetClone = targetElement.cloneNode(true);
  targetClone.removeAttribute("id");
  copyComputedBoxStyles(targetElement, targetClone);
  Object.assign(targetClone.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: `${width}px`,
    height: `${height}px`,
    margin: "0",
    transform: "none"
  });

  const overlayClone = overlayElement.cloneNode(true);
  overlayClone.removeAttribute("id");
  copyOverlayComputedStyles(overlayElement, overlayClone);
  Object.assign(overlayClone.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: `${width}px`,
    height: `${height}px`,
    margin: "0",
    transform: "none",
    pointerEvents: "none",
    zIndex: "2"
  });
  overlayClone.querySelectorAll(".text-overlay-resize-handle").forEach((handle) => handle.remove());
  overlayClone.querySelectorAll(".text-overlay-box").forEach((box) => {
    box.classList.remove("text-overlay-box--editing", "text-overlay-box--resizing");
    box.removeAttribute("contenteditable");
    box.removeAttribute("tabindex");
    box.style.pointerEvents = "none";
    box.style.cursor = "default";
  });

  wrapper.append(targetClone, overlayClone);
  const serialized = new XMLSerializer().serializeToString(wrapper);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${serialized}</foreignObject></svg>`;
  const image = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  ctx.drawImage(image, 0, 0, width, height);
}

function copyComputedBoxStyles(source, clone) {
  const computed = getComputedStyle(source);
  [
    "boxSizing",
    "background",
    "backgroundColor",
    "backgroundImage",
    "backgroundSize",
    "backgroundPosition",
    "backgroundRepeat",
    "backgroundOrigin",
    "backgroundClip",
    "border",
    "borderRadius",
    "opacity",
    "overflow"
  ].forEach((property) => {
    clone.style[property] = computed[property];
  });
}

function copyOverlayComputedStyles(source, clone) {
  copyComputedBoxStyles(source, clone);
  const sourceBoxes = [...source.querySelectorAll(".text-overlay-box")];
  const cloneBoxes = [...clone.querySelectorAll(".text-overlay-box")];
  cloneBoxes.forEach((cloneBox, index) => {
    const sourceBox = sourceBoxes[index];
    if (sourceBox) copyComputedTextStyles(sourceBox, cloneBox);
  });
}

function copyComputedTextStyles(source, clone) {
  const computed = getComputedStyle(source);
  [
    "position",
    "boxSizing",
    "left",
    "top",
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "padding",
    "margin",
    "border",
    "outline",
    "background",
    "color",
    "opacity",
    "fontFamily",
    "fontSize",
    "fontStyle",
    "fontWeight",
    "textDecoration",
    "lineHeight",
    "letterSpacing",
    "whiteSpace",
    "overflowWrap",
    "wordBreak",
    "textAlign",
    "display",
    "alignItems",
    "justifyContent",
    "writingMode",
    "textOrientation",
    "direction",
    "transform",
    "transformOrigin",
    "overflow"
  ].forEach((property) => {
    clone.style[property] = computed[property];
  });
}

async function drawTargetElement(ctx, targetElement, width, height) {
  const computed = getComputedStyle(targetElement);
  ctx.save();
  ctx.fillStyle = computed.backgroundColor && computed.backgroundColor !== "rgba(0, 0, 0, 0)"
    ? computed.backgroundColor
    : "#ffffff";
  ctx.fillRect(0, 0, width, height);

  if (targetElement instanceof HTMLImageElement && targetElement.complete) {
    ctx.drawImage(targetElement, 0, 0, width, height);
  } else if (targetElement instanceof HTMLCanvasElement) {
    ctx.drawImage(targetElement, 0, 0, width, height);
  } else if (targetElement instanceof HTMLVideoElement && targetElement.readyState >= 2) {
    ctx.drawImage(targetElement, 0, 0, width, height);
  } else {
    await drawCssBackgroundImage(ctx, targetElement, computed, width, height);
  }
  ctx.restore();
}

async function drawCssBackgroundImage(ctx, targetElement, computed, width, height) {
  const urls = extractCssBackgroundUrls(computed.backgroundImage);
  if (!urls.length) return;

  for (const url of urls.reverse()) {
    const image = await loadImage(resolveCssUrl(url, targetElement.ownerDocument));
    drawBackgroundImage(ctx, image, width, height, computed);
  }
}

function extractCssBackgroundUrls(backgroundImage) {
  if (!backgroundImage || backgroundImage === "none") return [];
  const urls = [];
  const pattern = /url\((?:"([^"]+)"|'([^']+)'|([^^)]+))\)/g;
  let match;
  while ((match = pattern.exec(backgroundImage))) {
    urls.push((match[1] ?? match[2] ?? match[3] ?? "").trim());
  }
  return urls;
}

function resolveCssUrl(url, ownerDocument) {
  return new URL(url, ownerDocument.baseURI).href;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load background image: ${url}`));
    image.src = url;
  });
}

function drawBackgroundImage(ctx, image, width, height, computed) {
  const sizing = getBackgroundDrawRect(image, width, height, computed.backgroundSize, computed.backgroundPosition);
  ctx.drawImage(image, sizing.sx, sizing.sy, sizing.sw, sizing.sh, sizing.dx, sizing.dy, sizing.dw, sizing.dh);
}

function getBackgroundDrawRect(image, width, height, backgroundSize, backgroundPosition) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;

  if (backgroundSize.includes("contain")) {
    if (imageRatio > boxRatio) {
      drawWidth = width;
      drawHeight = width / imageRatio;
    } else {
      drawHeight = height;
      drawWidth = height * imageRatio;
    }
  } else if (backgroundSize.includes("cover") || backgroundSize === "auto" || backgroundSize === "auto auto") {
    if (imageRatio > boxRatio) {
      drawHeight = height;
      drawWidth = height * imageRatio;
    } else {
      drawWidth = width;
      drawHeight = width / imageRatio;
    }
  } else {
    const [sizeX, sizeY] = backgroundSize.split(/\s+/);
    drawWidth = parseBackgroundLength(sizeX, width, image.naturalWidth);
    drawHeight = parseBackgroundLength(sizeY ?? "auto", height, image.naturalHeight);
    if (sizeY === "auto") drawHeight = drawWidth / imageRatio;
    if (sizeX === "auto") drawWidth = drawHeight * imageRatio;
  }

  const [positionX = "50%", positionY = "50%"] = backgroundPosition.split(/\s+/);
  const dx = parseBackgroundPosition(positionX, width, drawWidth);
  const dy = parseBackgroundPosition(positionY, height, drawHeight);
  return {
    sx: 0,
    sy: 0,
    sw: image.naturalWidth,
    sh: image.naturalHeight,
    dx,
    dy,
    dw: drawWidth,
    dh: drawHeight
  };
}

function parseBackgroundLength(value, containerSize, naturalSize) {
  if (!value || value === "auto") return naturalSize;
  if (value.endsWith("%")) return containerSize * parseFloat(value) / 100;
  if (value.endsWith("px")) return parseFloat(value);
  const number = parseFloat(value);
  return Number.isFinite(number) ? number : naturalSize;
}

function parseBackgroundPosition(value, containerSize, drawSize) {
  if (value === "left" || value === "top") return 0;
  if (value === "right" || value === "bottom") return containerSize - drawSize;
  if (value === "center") return (containerSize - drawSize) / 2;
  if (value.endsWith("%")) return (containerSize - drawSize) * parseFloat(value) / 100;
  if (value.endsWith("px")) return parseFloat(value);
  const number = parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function drawEntityToCanvas(ctx, entity, scale, config) {
  const scaled = scalePoints(entity.points, scale);
  const metrics = measureQuad(scaled);
  const fontFamily = getFontFamily(config);
  const fontSize = entity.fontSizeAuto ? getAutoFontSize(entity, metrics, fontFamily) : entity.fontSize;
  const lineHeight = parseFloat(normalizeCssLength(entity.lineHeight, fontSize * 1.2)) || fontSize * 1.2;

  ctx.save();
  ctx.translate(metrics.x, metrics.y);
  ctx.rotate(metrics.angle);
  if (entity.expandDirection === ExpandMode.NO_EXPAND) {
    ctx.beginPath();
    ctx.rect(0, 0, metrics.width, metrics.height);
    ctx.clip();
  }
  ctx.fillStyle = entity.color || "#111111";
  ctx.font = `${entity.italic ? "italic " : ""}${entity.bold ? "700" : "400"} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "top";
  ctx.direction = entity.direction === Direction.RIGHT_TO_LEFT ? "rtl" : "ltr";

  if (entity.direction === Direction.TOP_TO_BOTTOM) {
    drawVerticalCanvasText(ctx, entity.text, metrics, fontSize, lineHeight);
  } else {
    drawHorizontalCanvasText(ctx, entity.text, metrics, lineHeight, entity.direction);
  }
  ctx.restore();
}

function drawHorizontalCanvasText(ctx, text, metrics, lineHeight, direction) {
  const lines = wrapCanvasText(ctx, text, Math.max(metrics.width, 1));
  const x = direction === Direction.RIGHT_TO_LEFT ? metrics.width : 0;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, index * lineHeight);
  });
}

function drawVerticalCanvasText(ctx, text, metrics, fontSize, lineHeight) {
  let x = Math.max(0, metrics.width - fontSize);
  let y = 0;
  [...text].forEach((char) => {
    if (char === "\n" || y + lineHeight > metrics.height) {
      x -= fontSize * 1.2;
      y = 0;
      if (char === "\n") return;
    }
    ctx.fillText(char, x, y);
    y += lineHeight;
  });
}

function wrapCanvasText(ctx, text, maxWidth) {
  const lines = [];
  String(text).split("\n").forEach((paragraph) => {
    let line = "";
    [...paragraph].forEach((char) => {
      const next = line + char;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = next;
      }
    });
    lines.push(line);
  });
  return lines;
}

function normalizeEntities(entities) {
  if (!Array.isArray(entities)) {
    throw new TypeError("entities must be an array.");
  }

  return entities.map((entity, index) => {
    const points = normalizePoints(entity.points ?? entity.coords ?? entity.coordinates ?? entity);
    const direction = normalizeDirection(entity.direction ?? entity.textDirection);
    const fontSizeAuto = toBoolean(entity.fontSizeAuto ?? entity.autoFontSize, false);
    const normalized = {
      id: entity.id ?? `entity-${index}`,
      points,
      direction,
      expandDirection: fontSizeAuto ? ExpandMode.NO_EXPAND : normalizeExpandMode(entity.expandDirection, direction),
      text: String(entity.text ?? entity.content ?? ""),
      fontSize: toPositiveNumber(entity.fontSize ?? entity.size, 16),
      fontSizeAuto,
      language: normalizeLanguage(entity.language ?? entity.lang),
      color: entity.color ?? entity.textColor ?? "#111",
      editable: toBoolean(entity.editable ?? entity.isEditable, false),
      movable: toBoolean(entity.movable ?? entity.draggable, true),
      resizable: toBoolean(entity.resizable, true),
      italic: toBoolean(entity.italic ?? entity.style?.italic, false),
      bold: toBoolean(entity.bold ?? entity.style?.bold, false),
      underline: toBoolean(entity.underline ?? entity.style?.underline, false),
      lineHeight: entity.lineHeight,
      letterSpacing: entity.letterSpacing,
      background: entity.background ?? "transparent",
      opacity: entity.opacity,
      align: entity.align,
      verticalAlign: entity.verticalAlign,
      data: entity.data
    };
    applyLanguageDefaults(normalized);
    return normalized;
  });
}

function assignSequentialEntityIds(entities) {
  entities.forEach((entity, index) => {
    entity.id = index + 1;
  });
  return entities;
}

function normalizePoints(raw) {
  const source = raw.points ?? raw;
  if (Array.isArray(source)) {
    if (source.length !== 4) {
      throw new TypeError("Each entity needs exactly four points.");
    }

    const [topLeft, topRight, bottomLeft, bottomRight] = source.map(toPoint);
    return { topLeft, topRight, bottomLeft, bottomRight };
  }

  const topLeft = toPoint(source.topLeft ?? source.lt ?? source.leftTop);
  const topRight = toPoint(source.topRight ?? source.rt ?? source.rightTop);
  const bottomLeft = toPoint(source.bottomLeft ?? source.lb ?? source.leftBottom);
  const bottomRight = toPoint(source.bottomRight ?? source.rb ?? source.rightBottom);

  return { topLeft, topRight, bottomLeft, bottomRight };
}

function toPoint(point) {
  if (!point) throw new TypeError("Point is missing.");
  if (Array.isArray(point)) {
    return { x: Number(point[0]), y: Number(point[1]) };
  }
  return { x: Number(point.x), y: Number(point.y) };
}

function normalizeDirection(direction) {
  if (!direction) return Direction.LEFT_TO_RIGHT;
  const value = String(direction).toLowerCase();

  if (["top-to-bottom", "vertical", "ttb", "tb", "上下", "自上而下"].includes(value)) {
    return Direction.TOP_TO_BOTTOM;
  }
  if (["right-to-left", "rtl", "rl", "右左", "自右向左"].includes(value)) {
    return Direction.RIGHT_TO_LEFT;
  }
  if (["left-to-right", "ltr", "lr", "左右", "自左向右"].includes(value)) {
    return Direction.LEFT_TO_RIGHT;
  }

  return Direction.LEFT_TO_RIGHT;
}

function normalizeExpandMode(expandDirection, direction) {
  if (expandDirection) {
    const value = String(expandDirection).toLowerCase();
    if (["fixed-height-grow-width", "grow-width", "width", "高度不变扩展宽度"].includes(value)) {
      return ExpandMode.FIXED_HEIGHT_GROW_WIDTH;
    }
    if (["fixed-width-grow-height", "grow-height", "height", "宽度不变扩展高度"].includes(value)) {
      return ExpandMode.FIXED_WIDTH_GROW_HEIGHT;
    }
    if (["free-expand", "free", "both", "全部自由扩展", "自由扩展"].includes(value)) {
      return ExpandMode.FREE_EXPAND;
    }
    if (["no-expand", "none", "no", "全部不可扩展", "不可扩展"].includes(value)) {
      return ExpandMode.NO_EXPAND;
    }
  }

  return normalizeDirection(direction) === Direction.TOP_TO_BOTTOM
    ? ExpandMode.FIXED_HEIGHT_GROW_WIDTH
    : ExpandMode.FIXED_WIDTH_GROW_HEIGHT;
}

function normalizeLanguage(language) {
  if (!language) return "en";
  const value = String(language);
  return LANGUAGE_OPTIONS.some(([code]) => code === value) ? value : "en";
}

function applyLanguageDefaults(entity) {
  if (entity.language === "ar" && entity.direction !== Direction.TOP_TO_BOTTOM) {
    entity.direction = Direction.RIGHT_TO_LEFT;
  }
}

function getCoordinateScale(targetElement, targetRect, config) {
  let sourceWidth = config.sourceWidth;
  let sourceHeight = config.sourceHeight;

  if (config.coordinateSpace === "natural") {
    sourceWidth ||= targetElement.naturalWidth || targetElement.videoWidth || targetElement.width || targetRect.width;
    sourceHeight ||= targetElement.naturalHeight || targetElement.videoHeight || targetElement.height || targetRect.height;
  } else {
    sourceWidth ||= targetRect.width;
    sourceHeight ||= targetRect.height;
  }

  return {
    x: targetRect.width / Math.max(sourceWidth, 1),
    y: targetRect.height / Math.max(sourceHeight, 1)
  };
}

function getAutoFontSize(entity, metrics, fontFamily) {
  if (typeof document === "undefined" || !document.body) {
    const basis = Math.min(metrics.width, metrics.height);
    return Math.max(8, Math.min(48, Math.floor(basis / 2)));
  }

  const measurer = document.createElement("div");
  measurer.textContent = entity.text || " ";
  Object.assign(measurer.style, {
    position: "absolute",
    left: "-10000px",
    top: "-10000px",
    width: `${Math.max(metrics.width, 1)}px`,
    height: `${Math.max(metrics.height, 1)}px`,
    boxSizing: "border-box",
    padding: "0",
    margin: "0",
    border: "0",
    fontFamily,
    fontStyle: entity.italic ? "italic" : "normal",
    fontWeight: entity.bold ? "700" : "400",
    letterSpacing: normalizeCssLength(entity.letterSpacing, 0),
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    visibility: "hidden",
    pointerEvents: "none"
  });
  applyDirectionStyles(measurer, entity.direction);
  document.body.append(measurer);

  let low = 6;
  let high = Math.max(8, Math.min(160, Math.floor(Math.max(metrics.width, metrics.height))));
  let best = low;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    measurer.style.fontSize = `${mid}px`;
    measurer.style.lineHeight = normalizeCssLength(entity.lineHeight, mid * 1.2);
    if (measurer.scrollWidth <= metrics.width + 1 && measurer.scrollHeight <= metrics.height + 1) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  measurer.remove();
  return Math.max(6, best);
}

function buildTextBox(entity, index, scale, config, context) {
  const scaled = scalePoints(entity.points, scale);
  const metrics = measureQuad(scaled);
  const fontFamily = getFontFamily(config);
  const renderedFontSize = entity.fontSizeAuto ? getAutoFontSize(entity, metrics, fontFamily) : entity.fontSize;
  Object.defineProperty(entity, "computedFontSize", {
    value: renderedFontSize,
    writable: true,
    configurable: true,
    enumerable: false
  });

  const box = document.createElement("div");
  box.className = [
    "text-overlay-box",
    entity.editable ? config.editableClassName : "",
    entity.movable ? "text-overlay-box--movable" : "",
    entity.resizable ? "text-overlay-box--resizable" : "",
    entity.direction === Direction.TOP_TO_BOTTOM ? "text-overlay-box--vertical" : "text-overlay-box--horizontal"
  ].filter(Boolean).join(" ");
  box.id = `${config.entityIdPrefix}-${entity.id}`;
  box.dataset.entityId = String(entity.id);
  box.dataset.index = String(index);
  box.lang = entity.language;
  box.textContent = entity.text;

  Object.assign(box.style, {
    position: "absolute",
    boxSizing: "border-box",
    left: "0px",
    top: "0px",
    transformOrigin: "0 0",
    transform: `translate(${metrics.x}px, ${metrics.y}px) rotate(${metrics.angle}rad)`,
    minWidth: `${metrics.width}px`,
    minHeight: `${metrics.height}px`,
    padding: "0",
    margin: "0",
    border: "0",
    outline: "none",
    background: entity.background,
    color: entity.color,
    opacity: entity.opacity == null ? "" : String(entity.opacity),
    fontFamily,
    fontSize: `${renderedFontSize}px`,
    fontStyle: entity.italic ? "italic" : "normal",
    fontWeight: entity.bold ? "700" : "400",
    textDecoration: entity.underline ? "underline" : "none",
    lineHeight: normalizeCssLength(entity.lineHeight, renderedFontSize * 1.2),
    letterSpacing: normalizeCssLength(entity.letterSpacing, 0),
    pointerEvents: entity.editable || entity.movable || entity.resizable ? "auto" : "none",
    cursor: entity.movable ? "move" : entity.editable ? "text" : "",
    userSelect: entity.movable ? "none" : "",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    textAlign: entity.align ?? (entity.direction === Direction.RIGHT_TO_LEFT ? "right" : "left"),
    display: "flex",
    alignItems: normalizeVerticalAlign(entity.verticalAlign),
    justifyContent: entity.align === "center" ? "center" : entity.direction === Direction.RIGHT_TO_LEFT ? "flex-end" : "flex-start"
  });

  applyDirectionStyles(box, entity.direction);
  applyExpansionStyles(box, entity.expandDirection, metrics);

  if (config.fontUrl) {
    loadFontFace(config.fontUrl).then((loadedFamily) => {
      if (box.isConnected && loadedFamily) {
        box.style.fontFamily = `"${loadedFamily}", ${DEFAULT_FONT_STACK}`;
      }
    });
  }

  if (entity.editable) {
    attachEditableBehavior(box, entity, index, config, context);
  }

  if (entity.movable) {
    attachMovableBehavior(box, entity, index, scale, metrics, context);
  }

  if (entity.resizable) {
    attachResizableBehavior(box, entity, index, scale, metrics, context);
  }

  return box;
}

function scalePoints(points, scale) {
  return Object.fromEntries(
    Object.entries(points).map(([key, point]) => [key, { x: point.x * scale.x, y: point.y * scale.y }])
  );
}

function measureQuad(points) {
  const { topLeft, topRight, bottomLeft, bottomRight } = points;
  const topWidth = distance(topLeft, topRight);
  const bottomWidth = distance(bottomLeft, bottomRight);
  const leftHeight = distance(topLeft, bottomLeft);
  const rightHeight = distance(topRight, bottomRight);
  const angle = Math.atan2(topRight.y - topLeft.y, topRight.x - topLeft.x);

  return {
    x: topLeft.x,
    y: topLeft.y,
    width: Math.max((topWidth + bottomWidth) / 2, 1),
    height: Math.max((leftHeight + rightHeight) / 2, 1),
    angle
  };
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function applyDirectionStyles(box, direction) {
  if (direction === Direction.TOP_TO_BOTTOM) {
    box.style.writingMode = "vertical-rl";
    box.style.textOrientation = "mixed";
    box.style.direction = "ltr";
    return;
  }

  box.style.writingMode = "horizontal-tb";
  box.style.textOrientation = "mixed";
  box.style.direction = direction === Direction.RIGHT_TO_LEFT ? "rtl" : "ltr";
}

function applyExpansionStyles(box, expandDirection, metrics) {
  if (expandDirection === ExpandMode.NO_EXPAND) {
    box.style.width = `${metrics.width}px`;
    box.style.height = `${metrics.height}px`;
    box.style.maxWidth = "none";
    box.style.maxHeight = "none";
    box.style.overflow = "hidden";
    return;
  }

  if (expandDirection === ExpandMode.FREE_EXPAND) {
    box.style.minWidth = `${metrics.width}px`;
    box.style.minHeight = `${metrics.height}px`;
    box.style.width = "max-content";
    box.style.height = "auto";
    box.style.maxWidth = "none";
    box.style.maxHeight = "none";
    box.style.overflow = "visible";
    return;
  }

  if (expandDirection === ExpandMode.FIXED_HEIGHT_GROW_WIDTH) {
    box.style.height = `${metrics.height}px`;
    box.style.width = "max-content";
    box.style.maxWidth = "none";
    box.style.overflow = "visible";
    return;
  }

  box.style.width = `${metrics.width}px`;
  box.style.height = "auto";
  box.style.maxHeight = "none";
  box.style.overflow = "visible";
}

function attachEditableBehavior(box, entity, index, config, context) {
  box.title = "Double click to edit and inspect parameters";
  box.tabIndex = 0;

  const startEditing = () => {
    box.contentEditable = "true";
    box.classList.add(config.editingClassName);
    box.focus();
    selectElementContents(box);
    context.showParameterPanel(entity, index, box);
  };

  const stopEditing = () => {
    box.contentEditable = "false";
    box.classList.remove(config.editingClassName);
    entity.text = box.textContent ?? "";
    config.onTextChange?.({
      id: entity.id,
      index: Number(box.dataset.index),
      text: entity.text,
      entity: structuredCloneSafe(entity)
    });
    context.notifyEntityChange(entity, index);
  };

  box.contentEditable = "false";
  box.addEventListener("dblclick", startEditing);
  box.addEventListener("blur", stopEditing);
  box.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      box.blur();
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      box.blur();
    }
  });
}

function attachMovableBehavior(box, entity, index, scale, metrics, context) {
  let dragState = null;

  box.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || box.isContentEditable) return;
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      points: structuredCloneSafe(entity.points)
    };
    box.setPointerCapture?.(event.pointerId);
  });

  box.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (!dragState.dragging && Math.hypot(dx, dy) < 3) return;

    dragState.dragging = true;
    event.preventDefault();
    box.style.transform = `translate(${metrics.x + dx}px, ${metrics.y + dy}px) rotate(${metrics.angle}rad)`;
  });

  const finishDrag = (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    box.releasePointerCapture?.(event.pointerId);
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    const wasDragging = dragState.dragging;
    dragState = null;

    if (!wasDragging) return;

    const sourceDx = dx / Math.max(scale.x, 0.0001);
    const sourceDy = dy / Math.max(scale.y, 0.0001);
    Object.keys(entity.points).forEach((key) => {
      entity.points[key].x += sourceDx;
      entity.points[key].y += sourceDy;
    });
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  };

  box.addEventListener("pointerup", finishDrag);
  box.addEventListener("pointercancel", finishDrag);
}

function attachResizableBehavior(box, entity, index, scale, metrics, context) {
  ensureParameterPanelStyles();

  const handles = [
    ["n", "top"],
    ["e", "right"],
    ["s", "bottom"],
    ["w", "left"],
    ["nw", "top-left"],
    ["ne", "top-right"],
    ["se", "bottom-right"],
    ["sw", "bottom-left"]
  ];
  handles.forEach(([direction, label]) => {
    const handle = document.createElement("span");
    handle.className = `text-overlay-resize-handle text-overlay-resize-handle--${direction}`;
    handle.dataset.resizeDirection = direction;
    handle.contentEditable = "false";
    handle.setAttribute("aria-label", `Resize ${label}`);
    handle.addEventListener("pointerdown", (event) => startResize(event, direction));
    box.append(handle);
  });

  function startResize(event, direction) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const start = {
      pointerId: event.pointerId,
      direction,
      clientX: event.clientX,
      clientY: event.clientY,
      rect: {
        x: 0,
        y: 0,
        width: metrics.width,
        height: metrics.height
      }
    };
    box.setPointerCapture?.(event.pointerId);
    box.classList.add("text-overlay-box--resizing");
    setManualBoxRect(box, metrics, start.rect, true);

    const move = (moveEvent) => {
      if (moveEvent.pointerId !== start.pointerId) return;
      moveEvent.preventDefault();
      const nextRect = resizeRectFromPointer(start, moveEvent, metrics.angle);
      setManualBoxRect(box, metrics, nextRect, true);
      box._textOverlayResizeRect = nextRect;
    };

    const finish = (finishEvent) => {
      if (finishEvent.pointerId !== start.pointerId) return;
      finishEvent.preventDefault();
      box.releasePointerCapture?.(finishEvent.pointerId);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", finish, true);
      document.removeEventListener("pointercancel", finish, true);
      box.classList.remove("text-overlay-box--resizing");

      const resizedRect = box._textOverlayResizeRect ?? start.rect;
      delete box._textOverlayResizeRect;
      const expandedRect = expandRectAfterResize(box, resizedRect, entity.expandDirection);
      updateEntityPointsFromRenderedRect(entity, metrics, expandedRect, scale);
      context.notifyEntityChange(entity, index);
      context.scheduleRender();
    };

    document.addEventListener("pointermove", move, true);
    document.addEventListener("pointerup", finish, true);
    document.addEventListener("pointercancel", finish, true);
  }
}

function resizeRectFromPointer(start, event, angle) {
  const minSize = 12;
  const dx = event.clientX - start.clientX;
  const dy = event.clientY - start.clientY;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const localDx = cos * dx + sin * dy;
  const localDy = -sin * dx + cos * dy;
  const rect = { ...start.rect };

  if (start.direction.includes("w")) {
    const nextX = Math.min(rect.x + localDx, rect.x + rect.width - minSize);
    rect.width += rect.x - nextX;
    rect.x = nextX;
  }
  if (start.direction.includes("e")) {
    rect.width = Math.max(minSize, rect.width + localDx);
  }
  if (start.direction.includes("n")) {
    const nextY = Math.min(rect.y + localDy, rect.y + rect.height - minSize);
    rect.height += rect.y - nextY;
    rect.y = nextY;
  }
  if (start.direction.includes("s")) {
    rect.height = Math.max(minSize, rect.height + localDy);
  }

  return rect;
}

function setManualBoxRect(box, metrics, rect, hideOverflow) {
  const origin = renderedPointFromLocal(metrics, rect.x, rect.y);
  box.style.transform = `translate(${origin.x}px, ${origin.y}px) rotate(${metrics.angle}rad)`;
  box.style.width = `${rect.width}px`;
  box.style.height = `${rect.height}px`;
  box.style.minWidth = "0px";
  box.style.minHeight = "0px";
  box.style.maxWidth = "none";
  box.style.maxHeight = "none";
  box.style.overflow = hideOverflow ? "hidden" : "visible";
}

function expandRectAfterResize(box, rect, expandDirection) {
  if (expandDirection === ExpandMode.NO_EXPAND) {
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;
    box.style.overflow = "hidden";
    return rect;
  }

  if (expandDirection === ExpandMode.FREE_EXPAND) {
    box.style.width = "max-content";
    box.style.height = "auto";
    box.style.overflow = "visible";
    return {
      ...rect,
      width: Math.max(rect.width, Math.ceil(box.offsetWidth), Math.ceil(box.scrollWidth)),
      height: Math.max(rect.height, Math.ceil(box.offsetHeight), Math.ceil(box.scrollHeight))
    };
  }

  if (expandDirection === ExpandMode.FIXED_HEIGHT_GROW_WIDTH) {
    box.style.height = `${rect.height}px`;
    box.style.width = "max-content";
    box.style.overflow = "visible";
    return {
      ...rect,
      width: Math.max(rect.width, Math.ceil(box.offsetWidth), Math.ceil(box.scrollWidth))
    };
  }

  box.style.width = `${rect.width}px`;
  box.style.height = "auto";
  box.style.overflow = "visible";
  return {
    ...rect,
    height: Math.max(rect.height, Math.ceil(box.offsetHeight), Math.ceil(box.scrollHeight))
  };
}

function updateEntityPointsFromRenderedRect(entity, metrics, rect, scale) {
  const topLeft = renderedPointFromLocal(metrics, rect.x, rect.y);
  const topRight = renderedPointFromLocal(metrics, rect.x + rect.width, rect.y);
  const bottomLeft = renderedPointFromLocal(metrics, rect.x, rect.y + rect.height);
  const bottomRight = renderedPointFromLocal(metrics, rect.x + rect.width, rect.y + rect.height);

  entity.points = {
    topLeft: unscalePoint(topLeft, scale),
    topRight: unscalePoint(topRight, scale),
    bottomLeft: unscalePoint(bottomLeft, scale),
    bottomRight: unscalePoint(bottomRight, scale)
  };
}

function renderedPointFromLocal(metrics, localX, localY) {
  const cos = Math.cos(metrics.angle);
  const sin = Math.sin(metrics.angle);
  return {
    x: metrics.x + localX * cos - localY * sin,
    y: metrics.y + localX * sin + localY * cos
  };
}

function unscalePoint(point, scale) {
  return {
    x: point.x / Math.max(scale.x, 0.0001),
    y: point.y / Math.max(scale.y, 0.0001)
  };
}

function buildParameterPanel(entity, index, context) {
  ensureParameterPanelStyles();

  const panel = document.createElement("div");
  panel.className = context.config.parameterPanelClassName;
  panel.dataset.entityId = String(entity.id);
  panel.dataset.index = String(index);
  panel.style.zIndex = String(Number(context.config.zIndex || 9999) + 1);

  const title = document.createElement("div");
  title.className = "text-overlay-panel-title";
  title.textContent = `${panelText(entity, "panelTitle")}: ${entity.id}`;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "text-overlay-panel-delete";
  deleteButton.textContent = "-";
  deleteButton.title = panelText(entity, "delete");
  deleteButton.setAttribute("aria-label", panelText(entity, "delete"));
  deleteButton.addEventListener("click", () => context.deleteEntity(index));

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "text-overlay-panel-close";
  closeButton.textContent = "x";
  closeButton.addEventListener("click", context.hideParameterPanel);

  const actions = document.createElement("div");
  actions.className = "text-overlay-panel-actions";
  actions.append(deleteButton, closeButton);

  const header = document.createElement("div");
  header.className = "text-overlay-panel-header";
  header.append(title, actions);
  panel.append(header);

  const body = document.createElement("div");
  body.className = "text-overlay-panel-body";

  addSelectField(
    body,
    panelText(entity, "textDirection"),
    entity.direction,
    [
      ["left-to-right", panelText(entity, "dirLtr")],
      ["right-to-left", panelText(entity, "dirRtl")],
      ["top-to-bottom", panelText(entity, "dirTtb")]
    ],
    (value) => {
      entity.direction = normalizeDirection(value);
      entity.expandDirection = entity.fontSizeAuto ? ExpandMode.NO_EXPAND : normalizeExpandMode(entity.expandDirection, entity.direction);
      context.notifyEntityChange(entity, index);
      context.scheduleRender();
    }
  );

  addSelectField(
    body,
    panelText(entity, "expandDirection"),
    entity.expandDirection,
    [
      ["fixed-width-grow-height", panelText(entity, "expandHeight")],
      ["fixed-height-grow-width", panelText(entity, "expandWidth")],
      ["free-expand", panelText(entity, "expandFree")],
      ["no-expand", panelText(entity, "expandNone")]
    ],
    (value) => {
      entity.expandDirection = normalizeExpandMode(value, entity.direction);
      context.notifyEntityChange(entity, index);
      context.scheduleRender();
    },
    { disabled: entity.fontSizeAuto }
  );

  addFontSizeField(body, entity, index, context);

  addColorField(body, panelText(entity, "textColor"), entity.color, (value) => {
    entity.color = value;
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  });

  const checks = document.createElement("div");
  checks.className = "text-overlay-panel-checks";
  addCheckboxField(checks, panelText(entity, "italic"), entity.italic, (checked) => {
    entity.italic = checked;
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  });
  addCheckboxField(checks, panelText(entity, "bold"), entity.bold, (checked) => {
    entity.bold = checked;
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  });
  addCheckboxField(checks, panelText(entity, "underline"), entity.underline, (checked) => {
    entity.underline = checked;
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  });
  addCheckboxField(checks, panelText(entity, "editable"), entity.editable, (checked) => {
    entity.editable = checked;
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  });
  addCheckboxField(checks, panelText(entity, "movable"), entity.movable, (checked) => {
    entity.movable = checked;
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  });
  addCheckboxField(checks, panelText(entity, "resizable"), entity.resizable, (checked) => {
    entity.resizable = checked;
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  });
  body.append(checks);

  panel.append(body);
  return panel;
}

function getLanguageLabel(language) {
  return LANGUAGE_OPTIONS.find(([code]) => code === language)?.[1] ?? "简体中文";
}

function panelText(entity, key) {
  return panelTextForLanguage(entity.language, key);
}

function panelTextForLanguage(language, key) {
  return (PANEL_TEXT[language] ?? PANEL_TEXT["zh-CN"])[key] ?? PANEL_TEXT["zh-CN"][key] ?? key;
}

function addFontSizeField(parent, entity, index, context) {
  const row = document.createElement("div");
  row.className = "text-overlay-panel-field text-overlay-panel-field--font-size";

  const span = document.createElement("span");
  span.textContent = panelText(entity, "fontSize");

  const controls = document.createElement("div");
  controls.className = "text-overlay-font-size-controls";

  const number = document.createElement("input");
  number.type = "number";
  number.step = "1";
  number.value = String(entity.fontSizeAuto ? entity.computedFontSize ?? entity.fontSize ?? 0 : entity.fontSize ?? 0);
  number.disabled = entity.fontSizeAuto;
  number.addEventListener("input", () => {
    const value = Number(number.value);
    if (!Number.isFinite(value)) return;
    entity.fontSize = Math.max(value, 1);
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
  });

  const autoLabel = document.createElement("label");
  autoLabel.className = "text-overlay-inline-checkbox";
  const auto = document.createElement("input");
  auto.type = "checkbox";
  auto.checked = entity.fontSizeAuto;
  auto.addEventListener("change", () => {
    entity.fontSizeAuto = auto.checked;
    if (entity.fontSizeAuto) {
      entity.expandDirection = ExpandMode.NO_EXPAND;
    }
    number.disabled = entity.fontSizeAuto;
    context.notifyEntityChange(entity, index);
    context.scheduleRender();
    window.requestAnimationFrame(() => context.refreshParameterPanel(entity, index));
  });
  autoLabel.append(auto, document.createTextNode(panelText(entity, "auto")));

  controls.append(number, autoLabel);
  row.append(span, controls);
  parent.append(row);
}

function addTextField(parent, labelText, value, onInput) {
  const control = document.createElement("input");
  control.type = "text";
  control.value = value;
  control.addEventListener("input", () => onInput(control.value));
  appendField(parent, labelText, control);
}

function addNumberField(parent, labelText, value, step, onInput) {
  const control = document.createElement("input");
  control.type = "number";
  control.step = String(step);
  control.value = String(value ?? 0);
  control.addEventListener("input", () => {
    const number = Number(control.value);
    if (Number.isFinite(number)) onInput(number);
  });
  appendField(parent, labelText, control);
}

function addColorField(parent, labelText, value, onInput) {
  const control = document.createElement("input");
  control.type = "color";
  control.value = normalizeColorInput(value);
  control.addEventListener("input", () => onInput(control.value));
  appendField(parent, labelText, control);
}

function addSelectField(parent, labelText, value, options, onChange, fieldOptions = {}) {
  const control = document.createElement("select");
  options.forEach(([optionValue, optionLabel]) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionLabel;
    control.append(option);
  });
  control.value = value;
  control.disabled = Boolean(fieldOptions.disabled);
  control.addEventListener("change", () => onChange(control.value));
  appendField(parent, labelText, control);
}

function addCheckboxField(parent, labelText, checked, onChange) {
  const label = document.createElement("label");
  label.className = "text-overlay-panel-checkbox";
  const control = document.createElement("input");
  control.type = "checkbox";
  control.checked = checked;
  control.addEventListener("change", () => onChange(control.checked));
  label.append(control, document.createTextNode(labelText));
  parent.append(label);
}

function appendField(parent, labelText, control) {
  const label = document.createElement("label");
  label.className = "text-overlay-panel-field";
  const span = document.createElement("span");
  span.textContent = labelText;
  label.append(span, control);
  parent.append(label);
}

function positionParameterPanel(panel, anchorBox) {
  const rect = anchorBox.getBoundingClientRect();
  const panelWidth = panel.offsetWidth || 340;
  const margin = 12;
  const viewportLeft = window.scrollX;
  const viewportTop = window.scrollY;
  const viewportRight = viewportLeft + window.innerWidth;
  const viewportBottom = viewportTop + window.innerHeight;

  let left = rect.right + window.scrollX + margin;
  if (left + panelWidth > viewportRight - margin) {
    left = rect.left + window.scrollX - panelWidth - margin;
  }
  left = Math.max(viewportLeft + margin, Math.min(left, viewportRight - panelWidth - margin));

  let top = rect.top + window.scrollY;
  const panelHeight = panel.offsetHeight || 420;
  if (top + panelHeight > viewportBottom - margin) {
    top = viewportBottom - panelHeight - margin;
  }
  top = Math.max(viewportTop + margin, top);

  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function normalizeColorInput(value) {
  if (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)) {
    return value;
  }
  if (typeof value === "string" && /^#[0-9a-f]{3}$/i.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return "#111111";
}

function ensureParameterPanelStyles() {
  if (document.getElementById("text-overlay-parameter-panel-style")) return;

  const style = document.createElement("style");
  style.id = "text-overlay-parameter-panel-style";
  style.textContent = `
    .text-overlay-parameter-panel {
      position: absolute;
      z-index: 10000;
      width: 340px;
      max-width: calc(100vw - 24px);
      max-height: calc(100vh - 24px);
      overflow: auto;
      box-sizing: border-box;
      border: 1px solid rgba(15, 23, 42, 0.18);
      background: rgba(255, 255, 255, 0.98);
      color: #111827;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
      font: 13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      pointer-events: auto;
    }
    .text-overlay-toolbar {
      display: grid;
      gap: 6px;
      padding: 6px;
      border: 1px solid rgba(15, 23, 42, 0.14);
      background: rgba(255, 255, 255, 0.96);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
      pointer-events: auto;
    }
    .text-overlay-toolbar-item {
      position: relative;
    }
    .text-overlay-toolbar-button {
      display: grid;
      place-items: center;
      width: 30px;
      height: 30px;
      padding: 0;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #111827;
      cursor: pointer;
    }
    .text-overlay-toolbar-button:hover {
      background: #eef2ff;
      border-color: #93c5fd;
    }
    .text-overlay-toolbar-button:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .text-overlay-toolbar-button--active {
      background: #dcfce7;
      border-color: #22c55e;
    }
    .text-overlay-toolbar-button svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .text-overlay-toolbar-menu {
      position: absolute;
      top: 0;
      left: calc(100% + 6px);
      z-index: 1;
      display: grid;
      min-width: 112px;
      padding: 4px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
    }
    .text-overlay-toolbar-menu--font {
      min-width: 240px;
      gap: 6px;
      padding: 8px;
    }
    .text-overlay-toolbar-menu[hidden] {
      display: none;
    }
    .text-overlay-toolbar-field {
      display: grid;
      gap: 5px;
      color: #4b5563;
      font: 12px/1.3 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .text-overlay-toolbar-field input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      border: 1px solid #d1d5db;
      padding: 6px 7px;
      color: #111827;
      background: #ffffff;
      font: 13px/1.3 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .text-overlay-toolbar-menu-item {
      border: 0;
      background: transparent;
      color: #111827;
      padding: 7px 9px;
      text-align: left;
      cursor: pointer;
      font: 13px/1.3 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      white-space: nowrap;
    }
    .text-overlay-toolbar-menu-item:hover {
      background: #eef2ff;
    }
    .text-overlay-toolbar-menu-item--active {
      background: #dbeafe;
      color: #1d4ed8;
      font-weight: 700;
    }
    .text-overlay-toolbar-menu-item--active:hover {
      background: #bfdbfe;
    }
    .text-overlay-toolbar-apply {
      border: 1px solid #d1d5db;
      background: #f9fafb;
      text-align: center;
    }
    .text-overlay-toolbar-toast {
      position: absolute;
      top: 0;
      left: calc(100% + 8px);
      min-width: 76px;
      padding: 7px 10px;
      border: 1px solid #bbf7d0;
      background: #f0fdf4;
      color: #166534;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
      font: 13px/1.3 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      white-space: nowrap;
      pointer-events: none;
    }
    .text-overlay-toolbar-toast[hidden] {
      display: none;
    }
    .text-overlay-panel-header {
      position: sticky;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
      background: #ffffff;
    }
    .text-overlay-panel-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 700;
      flex: 1;
    }
    .text-overlay-panel-actions {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex: none;
    }
    .text-overlay-panel-delete,
    .text-overlay-panel-close {
      width: 26px;
      height: 26px;
      border: 1px solid #d1d5db;
      background: #f9fafb;
      color: #111827;
      cursor: pointer;
    }
    .text-overlay-panel-delete {
      border-color: #fecaca;
      background: #fef2f2;
      color: #dc2626;
      font-weight: 800;
    }
    .text-overlay-panel-delete:hover {
      border-color: #f87171;
      background: #fee2e2;
    }
    .text-overlay-panel-body {
      display: grid;
      gap: 10px;
      padding: 12px;
    }
    .text-overlay-panel-field {
      display: grid;
      grid-template-columns: 82px minmax(0, 1fr);
      gap: 8px;
      align-items: center;
    }
    .text-overlay-panel-field span,
    .text-overlay-panel-point span {
      color: #4b5563;
    }
    .text-overlay-panel-field input,
    .text-overlay-panel-field select,
    .text-overlay-panel-field textarea,
    .text-overlay-panel-point input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      border: 1px solid #d1d5db;
      padding: 5px 7px;
      background: #ffffff;
      color: #111827;
      font: inherit;
    }
    .text-overlay-panel-field textarea {
      resize: vertical;
    }
    .text-overlay-font-size-controls {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
    }
    .text-overlay-inline-checkbox {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
      color: #374151;
    }
    .text-overlay-panel-fieldset {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 10px;
      border: 1px solid #e5e7eb;
    }
    .text-overlay-panel-fieldset legend {
      padding: 0 4px;
      color: #374151;
      font-weight: 700;
    }
    .text-overlay-panel-point {
      display: grid;
      grid-template-columns: 42px 1fr 1fr;
      gap: 8px;
      align-items: center;
    }
    .text-overlay-panel-checks {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .text-overlay-panel-checkbox {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .text-overlay-resize-handle {
      position: absolute;
      z-index: 2;
      box-sizing: border-box;
      width: 6px;
      height: 6px;
      border: 1px solid #2563eb;
      background: #ffffff;
      pointer-events: auto;
      opacity: 0;
    }
    .text-overlay-box--resizable:hover .text-overlay-resize-handle,
    .text-overlay-box--resizing .text-overlay-resize-handle {
      opacity: 1;
    }
    .text-overlay-box--resizing {
      box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.8);
      user-select: none;
    }
    .text-overlay-resize-handle--n {
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      cursor: ns-resize;
    }
    .text-overlay-resize-handle--e {
      top: 50%;
      right: 0;
      transform: translate(50%, -50%);
      cursor: ew-resize;
    }
    .text-overlay-resize-handle--s {
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      cursor: ns-resize;
    }
    .text-overlay-resize-handle--w {
      top: 50%;
      left: 0;
      transform: translate(-50%, -50%);
      cursor: ew-resize;
    }
    .text-overlay-resize-handle--nw {
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
      cursor: nwse-resize;
    }
    .text-overlay-resize-handle--ne {
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      cursor: nesw-resize;
    }
    .text-overlay-resize-handle--se {
      right: 0;
      bottom: 0;
      transform: translate(50%, 50%);
      cursor: nwse-resize;
    }
    .text-overlay-resize-handle--sw {
      bottom: 0;
      left: 0;
      transform: translate(-50%, 50%);
      cursor: nesw-resize;
    }
  `;
  document.head.append(style);
}

function selectElementContents(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function getFontFamily(config = {}) {
  if (config.fontUrl) {
    const cached = loadedFontFaces.get(config.fontUrl);
    if (cached?.family) {
      return `"${cached.family}", ${DEFAULT_FONT_STACK}`;
    }
  }
  return DEFAULT_FONT_STACK;
}

async function loadFontFace(fontUrl) {
  if (!fontUrl || typeof FontFace === "undefined") {
    return null;
  }

  const cached = loadedFontFaces.get(fontUrl);
  if (cached) {
    return cached.promise;
  }

  const family = `TextOverlayFont_${loadedFontFaces.size + 1}`;
  const promise = new FontFace(family, `url("${fontUrl}")`)
    .load()
    .then((fontFace) => {
      document.fonts.add(fontFace);
      return family;
    });

  loadedFontFaces.set(fontUrl, { family, promise });
  return promise;
}

function normalizeCssLength(value, fallback) {
  if (value == null || value === "") return `${fallback}px`;
  return typeof value === "number" ? `${value}px` : String(value);
}

function normalizeVerticalAlign(value) {
  if (value === "top" || value === "start") return "flex-start";
  if (value === "bottom" || value === "end") return "flex-end";
  return "center";
}

function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function toBoolean(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["false", "0", "no", "否"].includes(normalized)) return false;
    if (["true", "1", "yes", "是"].includes(normalized)) return true;
  }
  return Boolean(value);
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

if (typeof window !== "undefined") {
  createTextOverlay.version = TEXT_COVER_VERSION;
  window.createTextOverlay = createTextOverlay;
  window.removeTextOverlay = removeTextOverlay;
  window.TextOverlayDirection = Direction;
  window.TextOverlayExpandMode = ExpandMode;
  window.TextCoverVersion = TEXT_COVER_VERSION;
}
