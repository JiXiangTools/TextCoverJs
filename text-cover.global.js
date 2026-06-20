/**
 * TextCoverJs
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
    applyAll: "Apply all",
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
    confirmDelete: "Delete this text block?",
    saveSuccess: "Saved",
    applyAllSuccess: "Applied to all",
    fontLoading: "Loading...",
    fontLoadSuccess: "Font applied",
    fontLoadError: "Font failed to load",
    uploadFont: "Upload font file",
    uploadedFont: "Uploaded:",
    noUploadedFont: "No uploaded font"
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
    applyAll: "全部应用",
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
    confirmDelete: "确定删除这个文本框吗？",
    saveSuccess: "保存成功",
    applyAllSuccess: "已应用到全部",
    fontLoading: "加载中...",
    fontLoadSuccess: "字体已应用",
    fontLoadError: "字体加载失败",
    uploadFont: "上传字体文件",
    uploadedFont: "已上传:",
    noUploadedFont: "未上传字体"
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
    applyAll: "全部套用",
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
    confirmDelete: "確定刪除這個文字框嗎？",
    saveSuccess: "儲存成功",
    applyAllSuccess: "已套用至全部",
    fontLoading: "載入中...",
    fontLoadSuccess: "字型已套用",
    fontLoadError: "字型載入失敗",
    uploadFont: "上傳字型檔",
    uploadedFont: "已上傳:",
    noUploadedFont: "未上傳字型"
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
    applyAll: "すべてに適用",
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
    confirmDelete: "このテキストボックスを削除しますか？",
    saveSuccess: "保存しました",
    applyAllSuccess: "すべてに適用しました",
    fontLoading: "読み込み中...",
    fontLoadSuccess: "フォントを適用しました",
    fontLoadError: "フォントの読み込みに失敗しました",
    uploadFont: "フォントファイルをアップロード",
    uploadedFont: "アップロード済み:",
    noUploadedFont: "フォント未アップロード"
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
    applyAll: "전체 적용",
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
    confirmDelete: "이 텍스트 상자를 삭제할까요?",
    saveSuccess: "저장됨",
    applyAllSuccess: "전체에 적용됨",
    fontLoading: "불러오는 중...",
    fontLoadSuccess: "폰트가 적용됨",
    fontLoadError: "폰트 불러오기 실패",
    uploadFont: "폰트 파일 업로드",
    uploadedFont: "업로드됨:",
    noUploadedFont: "업로드된 폰트 없음"
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
    applyAll: "Применить ко всем",
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
    confirmDelete: "Удалить этот текстовый блок?",
    saveSuccess: "Сохранено",
    applyAllSuccess: "Применено ко всем",
    fontLoading: "Загрузка...",
    fontLoadSuccess: "Шрифт применен",
    fontLoadError: "Не удалось загрузить шрифт",
    uploadFont: "Загрузить файл шрифта",
    uploadedFont: "Загружено:",
    noUploadedFont: "Шрифт не загружен"
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
    applyAll: "Tout appliquer",
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
    confirmDelete: "Supprimer ce bloc de texte ?",
    saveSuccess: "Enregistré",
    applyAllSuccess: "Appliqué à tous",
    fontLoading: "Chargement...",
    fontLoadSuccess: "Police appliquée",
    fontLoadError: "Échec du chargement de la police",
    uploadFont: "Importer un fichier de police",
    uploadedFont: "Importé:",
    noUploadedFont: "Aucune police importée"
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
    applyAll: "Auf alle anwenden",
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
    confirmDelete: "Diesen Textblock löschen?",
    saveSuccess: "Gespeichert",
    applyAllSuccess: "Auf alle angewendet",
    fontLoading: "Wird geladen...",
    fontLoadSuccess: "Schrift angewendet",
    fontLoadError: "Schrift konnte nicht geladen werden",
    uploadFont: "Schriftdatei hochladen",
    uploadedFont: "Hochgeladen:",
    noUploadedFont: "Keine Schrift hochgeladen"
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
    applyAll: "Applica a tutti",
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
    confirmDelete: "Eliminare questo blocco di testo?",
    saveSuccess: "Salvato",
    applyAllSuccess: "Applicato a tutti",
    fontLoading: "Caricamento...",
    fontLoadSuccess: "Font applicato",
    fontLoadError: "Caricamento font non riuscito",
    uploadFont: "Carica file font",
    uploadedFont: "Caricato:",
    noUploadedFont: "Nessun font caricato"
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
    applyAll: "تطبيق على الكل",
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
    confirmDelete: "هل تريد حذف مربع النص هذا؟",
    saveSuccess: "تم الحفظ",
    applyAllSuccess: "تم التطبيق على الكل",
    fontLoading: "جار التحميل...",
    fontLoadSuccess: "تم تطبيق الخط",
    fontLoadError: "فشل تحميل الخط",
    uploadFont: "رفع ملف خط",
    uploadedFont: "تم الرفع:",
    noUploadedFont: "لم يتم رفع خط"
  }
};

let overlaySeq = 0;
const loadedFontFaces = new Map();
const textOverlayControllers = new Set();

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
  let currentUploadedFontName = "";
  const uploadedFontUrls = new Map();
  config.fontUrl = currentFontUrl || undefined;
  let resizeObserver = null;
  let destroyed = false;
  let rafId = 0;
  let parameterPanel = null;
  let parameterPanelManualPosition = null;
  let activeEntityIndex = null;
  let controller = null;
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

    if (parameterPanel && activeEntityIndex != null && !parameterPanelManualPosition) {
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
    uploadedFontUrls.forEach((_, url) => URL.revokeObjectURL(url));
    uploadedFontUrls.clear();
    if (controller) textOverlayControllers.delete(controller);
    overlay.remove();
    toolbar?.remove();
  }

  function showParameterPanel(entity, index, anchorBox) {
    if (!config.parameterPanel) return;
    hideParameterPanel();
    activeEntityIndex = index;
    currentLanguage = normalizeLanguage(entity.language ?? currentLanguage);
    syncToolbarState();
    parameterPanelManualPosition = null;
    parameterPanel = buildParameterPanel(entity, index, getParameterPanelContext());
    document.body.appendChild(parameterPanel);
    attachParameterPanelDrag(parameterPanel, {
      onMove: (position) => {
        parameterPanelManualPosition = position;
      }
    });
    positionParameterPanel(parameterPanel, anchorBox);
  }

  function refreshParameterPanel(entity, index) {
    if (!parameterPanel || activeEntityIndex !== index) return;
    const activeBox = overlay.querySelector(`[data-index="${index}"]`);
    if (!activeBox) return;
    const previousManualPosition = parameterPanelManualPosition;
    parameterPanel.remove();
    parameterPanel = buildParameterPanel(entity, index, getParameterPanelContext());
    document.body.appendChild(parameterPanel);
    attachParameterPanelDrag(parameterPanel, {
      onMove: (position) => {
        parameterPanelManualPosition = position;
      }
    });
    if (previousManualPosition) {
      parameterPanelManualPosition = constrainPanelPosition(parameterPanel, previousManualPosition);
      applyPanelPosition(parameterPanel, parameterPanelManualPosition);
    } else {
      positionParameterPanel(parameterPanel, activeBox);
    }
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
    parameterPanelManualPosition = null;
    activeEntityIndex = null;
  }

  function shouldKeepParameterPanelOpen(event) {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    if (parameterPanel && (path.includes(parameterPanel) || parameterPanel.contains(event.target))) {
      return true;
    }
    if (toolbar && (path.includes(toolbar) || toolbar.contains(event.target))) {
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
    currentUploadedFontName = uploadedFontUrls.get(currentFontUrl) ?? "";
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

  async function setFontUrl(fontUrl, options = {}) {
    const nextFontUrl = normalizeFontUrl(fontUrl);
    if (options.validate && nextFontUrl) {
      await loadFontFace(nextFontUrl);
    }
    currentFontUrl = nextFontUrl;
    currentUploadedFontName = options.uploadedFontName ?? uploadedFontUrls.get(currentFontUrl) ?? "";
    config.fontUrl = currentFontUrl || undefined;
    recordHistory();
    if (activeEntityIndex != null && currentEntities[activeEntityIndex]) {
      refreshParameterPanel(currentEntities[activeEntityIndex], activeEntityIndex);
    }
    scheduleRender();
    syncToolbarState();
    overlay.dispatchEvent(new CustomEvent("text-overlay-font-change", {
      detail: { fontUrl: currentFontUrl, uploadedFontName: currentUploadedFontName }
    }));
  }

  function getToolbarSettings() {
    return {
      language: currentLanguage,
      fontUrl: currentFontUrl,
      uploadedFontName: currentUploadedFontName
    };
  }

  async function applyToolbarSettings(settings = {}) {
    currentLanguage = normalizeLanguage(settings.language ?? currentLanguage);
    config.language = currentLanguage;
    currentEntities.forEach((entity) => {
      entity.language = currentLanguage;
      applyLanguageDefaults(entity);
    });
    recordHistory();
    await setFontUrl(settings.fontUrl ?? "", {
      uploadedFontName: settings.uploadedFontName ?? ""
    });
    if (activeEntityIndex != null && currentEntities[activeEntityIndex]) {
      refreshParameterPanel(currentEntities[activeEntityIndex], activeEntityIndex);
    }
    scheduleRender();
    syncToolbarState();
  }

  async function applyToolbarSettingsToAll() {
    const settings = getToolbarSettings();
    const controllers = [...textOverlayControllers];
    await Promise.all(controllers.map((item) => item.applyToolbarSettings(settings)));
    flashToolbarButton("applyAll");
    showToolbarToast(panelTextForLanguage(currentLanguage, "applyAllSuccess"));
    overlay.dispatchEvent(new CustomEvent("text-overlay-apply-all", {
      detail: {
        id: overlayId,
        appliedTo: controllers.map((item) => item.id),
        settings: { ...settings }
      }
    }));
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

    const fontButton = createToolbarButton("font", toolbarIcon("font"), panelTextForLanguage(currentLanguage, "uploadFont"));
    const fontMenu = document.createElement("div");
    fontMenu.className = "text-overlay-toolbar-menu text-overlay-toolbar-menu--font";
    fontMenu.hidden = true;
    const fontUpload = document.createElement("button");
    fontUpload.type = "button";
    fontUpload.className = "text-overlay-toolbar-menu-item text-overlay-toolbar-apply";
    fontUpload.dataset.role = "toolbar-font-upload";
    fontUpload.textContent = panelTextForLanguage(currentLanguage, "uploadFont");
    const fontFileInput = document.createElement("input");
    fontFileInput.type = "file";
    fontFileInput.accept = ".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2";
    fontFileInput.hidden = true;
    const fontStatus = document.createElement("div");
    fontStatus.className = "text-overlay-toolbar-font-status";
    fontStatus.dataset.role = "toolbar-font-status";
    fontStatus.textContent = getUploadedFontStatus();
    const applyUploadedFontFile = async (file) => {
      if (!file) return;
      const uploadedUrl = URL.createObjectURL(file);
      uploadedFontUrls.set(uploadedUrl, file.name);
      fontUpload.disabled = true;
      fontUpload.textContent = panelTextForLanguage(currentLanguage, "fontLoading");
      try {
        await setFontUrl(uploadedUrl, { validate: true, uploadedFontName: file.name });
        showToolbarToast(panelTextForLanguage(currentLanguage, "fontLoadSuccess"));
        fontMenu.hidden = true;
      } catch (error) {
        uploadedFontUrls.delete(uploadedUrl);
        URL.revokeObjectURL(uploadedUrl);
        console.warn("Failed to load uploaded text overlay font:", error);
        overlay.dispatchEvent(new CustomEvent("text-overlay-font-error", {
          detail: { fontUrl: uploadedUrl, uploadedFontName: file.name, error }
        }));
        showToolbarToast(panelTextForLanguage(currentLanguage, "fontLoadError"), "error");
      } finally {
        fontFileInput.value = "";
        fontUpload.disabled = false;
        fontUpload.textContent = panelTextForLanguage(currentLanguage, "uploadFont");
        syncToolbarState();
      }
    };
    fontUpload.addEventListener("click", (event) => {
      event.stopPropagation();
      fontFileInput.click();
    });
    fontFileInput.addEventListener("change", () => {
      applyUploadedFontFile(fontFileInput.files?.[0]);
    });
    fontMenu.append(fontUpload, fontFileInput, fontStatus);

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
      fontMenu.hidden = !fontMenu.hidden;
      closeMenus(fontMenu.hidden ? null : fontMenu);
    });

    const addButton = createToolbarButton("add", toolbarIcon("add"), toolbarLabel("addText"));
    addButton.addEventListener("click", addTextEntity);

    const undoButton = createToolbarButton("undo", toolbarIcon("undo"), toolbarLabel("undo"));
    undoButton.addEventListener("click", undo);

    const redoButton = createToolbarButton("redo", toolbarIcon("redo"), toolbarLabel("redo"));
    redoButton.addEventListener("click", redo);

    const applyAllButton = createToolbarButton("applyAll", toolbarIcon("applyAll"), toolbarLabel("applyAll"));
    applyAllButton.addEventListener("click", async () => {
      applyAllButton.disabled = true;
      try {
        await applyToolbarSettingsToAll();
      } finally {
        applyAllButton.disabled = false;
      }
    });

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
      [applyAllButton],
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

  function getUploadedFontStatus() {
    if (!currentUploadedFontName) {
      return panelTextForLanguage(currentLanguage, "noUploadedFont");
    }
    return `${panelTextForLanguage(currentLanguage, "uploadedFont")} ${currentUploadedFontName}`;
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
      const label = panelTextForLanguage(currentLanguage, "uploadFont");
      fontButton.title = label;
      fontButton.setAttribute("aria-label", label);
    }
    const fontUpload = toolbar.querySelector('[data-role="toolbar-font-upload"]');
    if (fontUpload) fontUpload.textContent = panelTextForLanguage(currentLanguage, "uploadFont");
    const fontStatus = toolbar.querySelector('[data-role="toolbar-font-status"]');
    if (fontStatus) fontStatus.textContent = getUploadedFontStatus();
    syncToolbarButtonLabel("add", toolbarLabel("addText"));
    syncToolbarButtonLabel("undo", toolbarLabel("undo"));
    syncToolbarButtonLabel("redo", toolbarLabel("redo"));
    syncToolbarButtonLabel("applyAll", toolbarLabel("applyAll"));
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

  function showToolbarToast(message, type = "success") {
    if (!toolbar) return;
    let toast = toolbar.querySelector(".text-overlay-toolbar-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "text-overlay-toolbar-toast";
      toolbar.append(toast);
    }
    toast.textContent = message;
    toast.dataset.type = type;
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

  controller = {
    id: overlayId,
    element: overlay,
    update,
    destroy,
    getEntities,
    getFontUrl,
    getToolbarSettings,
    applyToolbarSettings
  };
  textOverlayControllers.add(controller);

  render();

  return controller;
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
    applyAll: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10H7zM3 12h4M17 12h4M12 3v4M12 17v4"/><path d="m9.5 12 1.8 1.8 3.4-4"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14"/></svg>'
  };
  return icons[name] ?? "";
}

async function renderOverlayImage(targetElement, overlayElement, entities, config, format) {
  await ensureConfiguredFontLoaded(config);
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

  if (entity.direction === Direction.TOP_TO_BOTTOM) {
    drawVerticalCanvasText(ctx, entity.text, metrics, fontSize, lineHeight);
  } else {
    drawHorizontalCanvasText(ctx, entity.text, metrics, lineHeight, entity.direction);
  }
  ctx.restore();
}

function drawHorizontalCanvasText(ctx, text, metrics, lineHeight, direction) {
  const lines = wrapCanvasText(ctx, text, Math.max(metrics.width, 1));
  lines.forEach((line, index) => {
    const lineDirection = getLineDirection(line, direction);
    ctx.direction = lineDirection === Direction.RIGHT_TO_LEFT ? "rtl" : "ltr";
    const x = lineDirection === Direction.RIGHT_TO_LEFT ? metrics.width : 0;
    ctx.fillText(line, x, index * lineHeight);
  });
}

function getLineDirection(text, fallbackDirection) {
  const content = String(text);
  if (/[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/u.test(content)) {
    return Direction.RIGHT_TO_LEFT;
  }
  if (/[A-Za-z\u00C0-\u024F\u0370-\u052F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/u.test(content)) {
    return Direction.LEFT_TO_RIGHT;
  }
  return fallbackDirection === Direction.RIGHT_TO_LEFT ? Direction.RIGHT_TO_LEFT : Direction.LEFT_TO_RIGHT;
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
    unicodeBidi: "plaintext",
    textAlign: entity.align ?? (entity.direction === Direction.RIGHT_TO_LEFT ? "right" : "left"),
    display: "flex",
    alignItems: normalizeVerticalAlign(entity.verticalAlign),
    justifyContent: entity.align === "center" ? "center" : entity.direction === Direction.RIGHT_TO_LEFT ? "flex-end" : "flex-start"
  });

  applyDirectionStyles(box, entity.direction);
  applyExpansionStyles(box, entity.expandDirection, metrics);

  if (config.fontUrl) {
    const needsRenderAfterLoad = !loadedFontFaces.get(config.fontUrl)?.loaded;
    loadFontFace(config.fontUrl)
      .then((loadedFamily) => {
        if (box.isConnected && loadedFamily) {
          box.style.fontFamily = `"${loadedFamily}", ${DEFAULT_FONT_STACK}`;
        }
        if (box.isConnected && needsRenderAfterLoad) {
          context.scheduleRender();
        }
      })
      .catch(() => {});
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
    box.style.unicodeBidi = "normal";
    box.dir = "ltr";
    return;
  }

  box.style.writingMode = "horizontal-tb";
  box.style.textOrientation = "mixed";
  box.style.direction = direction === Direction.RIGHT_TO_LEFT ? "rtl" : "ltr";
  box.style.unicodeBidi = "plaintext";
  box.dir = direction === Direction.RIGHT_TO_LEFT ? "auto" : "ltr";
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

  const rotateHandle = document.createElement("span");
  rotateHandle.className = "text-overlay-resize-handle text-overlay-rotate-handle";
  rotateHandle.dataset.rotateHandle = "true";
  rotateHandle.contentEditable = "false";
  rotateHandle.setAttribute("aria-label", "Rotate text box");
  rotateHandle.addEventListener("pointerdown", startRotate);
  box.append(rotateHandle);

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

  function startRotate(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const startPoints = scalePoints(entity.points, scale);
    const center = renderedPointFromLocal(metrics, metrics.width / 2, metrics.height / 2);
    const start = {
      pointerId: event.pointerId,
      center,
      angle: metrics.angle,
      pointerAngle: Math.atan2(event.clientY - center.y, event.clientX - center.x),
      points: startPoints
    };
    box.setPointerCapture?.(event.pointerId);
    box.classList.add("text-overlay-box--rotating");

    const move = (moveEvent) => {
      if (moveEvent.pointerId !== start.pointerId) return;
      moveEvent.preventDefault();
      const pointerAngle = Math.atan2(moveEvent.clientY - start.center.y, moveEvent.clientX - start.center.x);
      const nextAngle = start.angle + pointerAngle - start.pointerAngle;
      setManualBoxRotation(box, metrics, start.center, nextAngle);
      box._textOverlayRotationAngle = nextAngle;
    };

    const finish = (finishEvent) => {
      if (finishEvent.pointerId !== start.pointerId) return;
      finishEvent.preventDefault();
      box.releasePointerCapture?.(finishEvent.pointerId);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", finish, true);
      document.removeEventListener("pointercancel", finish, true);
      box.classList.remove("text-overlay-box--rotating");

      const nextAngle = box._textOverlayRotationAngle ?? start.angle;
      delete box._textOverlayRotationAngle;
      if (Math.abs(nextAngle - start.angle) < 0.001) return;

      updateEntityPointsFromRotation(entity, start.points, start.center, nextAngle - start.angle, scale);
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

function setManualBoxRotation(box, metrics, center, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const localX = -metrics.width / 2;
  const localY = -metrics.height / 2;
  const origin = {
    x: center.x + localX * cos - localY * sin,
    y: center.y + localX * sin + localY * cos
  };
  box.style.transform = `translate(${origin.x}px, ${origin.y}px) rotate(${angle}rad)`;
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

function updateEntityPointsFromRotation(entity, points, center, angleDelta, scale) {
  entity.points = Object.fromEntries(
    Object.entries(points).map(([key, point]) => [
      key,
      unscalePoint(rotatePointAround(point, center, angleDelta), scale)
    ])
  );
}

function rotatePointAround(point, center, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos
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
  deleteButton.textContent = "−";
  deleteButton.title = panelText(entity, "delete");
  deleteButton.setAttribute("aria-label", panelText(entity, "delete"));
  deleteButton.addEventListener("click", () => {
    if (!window.confirm(panelText(entity, "confirmDelete"))) return;
    context.deleteEntity(index);
  });

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "text-overlay-panel-close";
  closeButton.textContent = "×";
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
  return (PANEL_TEXT[language] ?? PANEL_TEXT.en)[key] ?? PANEL_TEXT.en[key] ?? PANEL_TEXT["zh-CN"][key] ?? key;
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
  const panelWidth = panel.offsetWidth || 360;
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

  applyPanelPosition(panel, { left, top });
}

function attachParameterPanelDrag(panel, callbacks = {}) {
  const header = panel.querySelector(".text-overlay-panel-header");
  if (!header) return;

  let drag = null;
  const canStartDrag = (event) => event.button === 0 && !event.target.closest("button, input, select, textarea, label");
  const startDrag = (event, pointerId = null) => {
    event.preventDefault();
    const rect = panel.getBoundingClientRect();
    drag = {
      pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      left: parseFloat(panel.style.left) || rect.left + window.scrollX,
      top: parseFloat(panel.style.top) || rect.top + window.scrollY
    };
    panel.classList.add("text-overlay-parameter-panel--dragging");
  };
  const moveDrag = (clientX, clientY) => {
    if (!drag) return;
    const next = constrainPanelPosition(panel, {
      left: drag.left + clientX - drag.clientX,
      top: drag.top + clientY - drag.clientY
    });
    applyPanelPosition(panel, next);
    callbacks.onMove?.(next);
  };
  const clearDrag = () => {
    panel.classList.remove("text-overlay-parameter-panel--dragging");
    drag = null;
  };

  header.addEventListener("pointerdown", (event) => {
    if (!canStartDrag(event)) return;
    startDrag(event, event.pointerId);
    header.setPointerCapture?.(event.pointerId);
    const movePointer = (moveEvent) => {
      if (!drag || moveEvent.pointerId !== drag.pointerId) return;
      moveEvent.preventDefault();
      moveDrag(moveEvent.clientX, moveEvent.clientY);
    };
    const finishPointer = (finishEvent) => {
      if (!drag || finishEvent.pointerId !== drag.pointerId) return;
      finishEvent.preventDefault();
      header.releasePointerCapture?.(finishEvent.pointerId);
      document.removeEventListener("pointermove", movePointer, true);
      document.removeEventListener("pointerup", finishPointer, true);
      document.removeEventListener("pointercancel", finishPointer, true);
      clearDrag();
    };
    document.addEventListener("pointermove", movePointer, true);
    document.addEventListener("pointerup", finishPointer, true);
    document.addEventListener("pointercancel", finishPointer, true);
  });

  header.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    moveDrag(event.clientX, event.clientY);
  });

  const finishDrag = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    header.releasePointerCapture?.(event.pointerId);
    clearDrag();
  };

  header.addEventListener("pointerup", finishDrag);
  header.addEventListener("pointercancel", finishDrag);

  header.addEventListener("mousedown", (event) => {
    if (drag || !canStartDrag(event)) return;
    startDrag(event);
    const moveMouse = (moveEvent) => {
      if (!drag) return;
      moveEvent.preventDefault();
      moveDrag(moveEvent.clientX, moveEvent.clientY);
    };
    const finishMouse = (upEvent) => {
      if (!drag) return;
      upEvent.preventDefault();
      document.removeEventListener("mousemove", moveMouse, true);
      document.removeEventListener("mouseup", finishMouse, true);
      clearDrag();
    };
    document.addEventListener("mousemove", moveMouse, true);
    document.addEventListener("mouseup", finishMouse, true);
  });
}

function applyPanelPosition(panel, position) {
  panel.style.left = `${position.left}px`;
  panel.style.top = `${position.top}px`;
}

function constrainPanelPosition(panel, position) {
  const margin = 12;
  const panelWidth = panel.offsetWidth || 360;
  const panelHeight = panel.offsetHeight || 420;
  const minLeft = window.scrollX + margin;
  const minTop = window.scrollY + margin;
  const maxLeft = window.scrollX + window.innerWidth - panelWidth - margin;
  const maxTop = window.scrollY + window.innerHeight - panelHeight - margin;

  return {
    left: Math.max(minLeft, Math.min(position.left, Math.max(minLeft, maxLeft))),
    top: Math.max(minTop, Math.min(position.top, Math.max(minTop, maxTop)))
  };
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
      width: 360px;
      max-width: calc(100vw - 24px);
      max-height: calc(100vh - 24px);
      overflow: auto;
      box-sizing: border-box;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.97);
      color: #0f172a;
      box-shadow: 0 18px 42px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.08);
      font: 13px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      pointer-events: auto;
      backdrop-filter: blur(12px);
    }
    .text-overlay-parameter-panel--dragging {
      user-select: none;
      box-shadow: 0 22px 52px rgba(15, 23, 42, 0.22), 0 4px 12px rgba(15, 23, 42, 0.1);
    }
    .text-overlay-toolbar {
      display: grid;
      gap: 4px;
      padding: 5px;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.94);
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.08);
      pointer-events: auto;
      backdrop-filter: blur(12px);
    }
    .text-overlay-toolbar-item {
      position: relative;
    }
    .text-overlay-toolbar-button {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: #334155;
      cursor: pointer;
      transition: background 120ms ease, border-color 120ms ease, color 120ms ease, transform 120ms ease;
    }
    .text-overlay-toolbar-button:hover {
      border-color: #bfdbfe;
      background: #eff6ff;
      color: #1d4ed8;
    }
    .text-overlay-toolbar-button:disabled {
      opacity: 0.35;
      cursor: default;
      transform: none;
    }
    .text-overlay-toolbar-button--active {
      border-color: #86efac;
      background: #ecfdf5;
      color: #15803d;
    }
    .text-overlay-toolbar-button:focus-visible,
    .text-overlay-toolbar-menu-item:focus-visible,
    .text-overlay-panel-delete:focus-visible,
    .text-overlay-panel-close:focus-visible,
    .text-overlay-panel-field input:focus-visible,
    .text-overlay-panel-field select:focus-visible,
    .text-overlay-panel-field textarea:focus-visible,
    .text-overlay-toolbar-field input:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
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
      right: calc(100% + 8px);
      z-index: 1;
      display: grid;
      min-width: 148px;
      padding: 6px;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 16px 34px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.08);
      backdrop-filter: blur(12px);
    }
    .text-overlay-toolbar-menu--font {
      min-width: 292px;
      gap: 8px;
      padding: 10px;
    }
    .text-overlay-toolbar-menu[hidden] {
      display: none;
    }
    .text-overlay-toolbar-field {
      display: grid;
      gap: 6px;
      color: #64748b;
      font: 12px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .text-overlay-toolbar-field input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 7px 9px;
      color: #0f172a;
      background: #ffffff;
      font: 13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      transition: border-color 120ms ease, box-shadow 120ms ease;
    }
    .text-overlay-toolbar-menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: #0f172a;
      padding: 8px 10px;
      text-align: left;
      cursor: pointer;
      font: 13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      white-space: nowrap;
      transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
    }
    .text-overlay-toolbar-menu-item:hover {
      border-color: #dbeafe;
      background: #eff6ff;
    }
    .text-overlay-toolbar-menu-item--active {
      border-color: #bfdbfe;
      background: #dbeafe;
      color: #1d4ed8;
      font-weight: 650;
    }
    .text-overlay-toolbar-menu-item--active::after {
      content: "✓";
      color: #2563eb;
      font-weight: 800;
    }
    .text-overlay-toolbar-menu-item--active:hover {
      background: #bfdbfe;
    }
    .text-overlay-toolbar-apply {
      justify-content: center;
      border-color: #cbd5e1;
      background: #f8fafc;
      color: #1e293b;
      font-weight: 650;
    }
    .text-overlay-toolbar-apply:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .text-overlay-toolbar-font-status {
      overflow: hidden;
      color: #64748b;
      font: 12px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .text-overlay-toolbar-toast {
      position: absolute;
      top: 0;
      right: calc(100% + 10px);
      min-width: 76px;
      padding: 8px 10px;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      background: #f0fdf4;
      color: #166534;
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.14);
      font: 13px/1.3 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      white-space: nowrap;
      pointer-events: none;
    }
    .text-overlay-toolbar-toast[data-type="error"] {
      border-color: #fecaca;
      background: #fef2f2;
      color: #991b1b;
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
      gap: 10px;
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: rgba(248, 250, 252, 0.98);
      backdrop-filter: blur(12px);
      cursor: move;
      touch-action: none;
    }
    .text-overlay-panel-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #0f172a;
      font-size: 14px;
      font-weight: 700;
      flex: 1;
    }
    .text-overlay-panel-actions {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex: none;
      cursor: default;
    }
    .text-overlay-panel-delete,
    .text-overlay-panel-close {
      width: 28px;
      height: 28px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      font: 700 18px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
    }
    .text-overlay-panel-delete {
      border-color: #fecaca;
      background: #fef2f2;
      color: #dc2626;
    }
    .text-overlay-panel-close:hover {
      border-color: #94a3b8;
      background: #f8fafc;
      color: #0f172a;
    }
    .text-overlay-panel-delete:hover {
      border-color: #f87171;
      background: #fee2e2;
    }
    .text-overlay-panel-body {
      display: grid;
      gap: 12px;
      padding: 14px;
      background: #ffffff;
    }
    .text-overlay-panel-field {
      display: grid;
      grid-template-columns: 96px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
    }
    .text-overlay-panel-field span,
    .text-overlay-panel-point span {
      color: #64748b;
      font-size: 12px;
      font-weight: 600;
    }
    .text-overlay-panel-field input,
    .text-overlay-panel-field select,
    .text-overlay-panel-field textarea,
    .text-overlay-panel-point input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 7px 9px;
      background: #ffffff;
      color: #0f172a;
      font: inherit;
      transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
    }
    .text-overlay-panel-field input:hover,
    .text-overlay-panel-field select:hover,
    .text-overlay-panel-field textarea:hover,
    .text-overlay-panel-point input:hover,
    .text-overlay-toolbar-field input:hover {
      border-color: #94a3b8;
    }
    .text-overlay-panel-field input:disabled,
    .text-overlay-panel-field select:disabled,
    .text-overlay-panel-field textarea:disabled,
    .text-overlay-panel-point input:disabled,
    .text-overlay-toolbar-field input:disabled {
      background: #f8fafc;
      color: #94a3b8;
      cursor: not-allowed;
    }
    .text-overlay-panel-field input[type="color"] {
      height: 34px;
      padding: 3px;
      cursor: pointer;
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
      color: #475569;
      font-size: 12px;
      font-weight: 600;
    }
    .text-overlay-panel-fieldset {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .text-overlay-panel-fieldset legend {
      padding: 0 4px;
      color: #475569;
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
      padding-top: 2px;
    }
    .text-overlay-panel-checkbox {
      display: flex;
      align-items: center;
      gap: 7px;
      min-height: 30px;
      box-sizing: border-box;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 8px;
      color: #334155;
      background: #f8fafc;
      font-size: 12px;
      font-weight: 600;
    }
    .text-overlay-panel-checkbox:hover {
      border-color: #bfdbfe;
      background: #eff6ff;
    }
    .text-overlay-panel-checkbox input,
    .text-overlay-inline-checkbox input {
      accent-color: #2563eb;
    }
    .text-overlay-resize-handle {
      position: absolute;
      z-index: 3;
      box-sizing: border-box;
      border: 0;
      background: transparent;
      pointer-events: auto;
      opacity: 0;
      transition: opacity 120ms ease;
    }
    .text-overlay-resize-handle:not(.text-overlay-rotate-handle)::before,
    .text-overlay-resize-handle:not(.text-overlay-rotate-handle)::after {
      content: "";
      position: absolute;
      display: block;
    }
    .text-overlay-resize-handle--n::before,
    .text-overlay-resize-handle--e::before,
    .text-overlay-resize-handle--s::before,
    .text-overlay-resize-handle--w::before {
      border-radius: 999px;
      background: #2563eb;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.95), 0 1px 4px rgba(15, 23, 42, 0.24);
    }
    .text-overlay-box--resizable:hover .text-overlay-resize-handle,
    .text-overlay-box--resizing .text-overlay-resize-handle,
    .text-overlay-box--rotating .text-overlay-resize-handle {
      opacity: 1;
    }
    .text-overlay-box--resizable:hover,
    .text-overlay-box--resizing,
    .text-overlay-box--rotating {
      box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.9), 0 0 0 3px rgba(255, 255, 255, 0.72);
    }
    .text-overlay-box--resizing,
    .text-overlay-box--rotating {
      user-select: none;
    }
    .text-overlay-rotate-handle {
      top: 8px;
      left: 50%;
      width: 26px;
      height: 26px;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      cursor: grab;
      transform-origin: center;
      transform: translate(-50%, -50%);
      transition: filter 240ms ease;
    }
    .text-overlay-box--rotating .text-overlay-rotate-handle {
      cursor: grabbing;
    }
    .text-overlay-rotate-handle::before {
      content: "";
      position: absolute;
      inset: 0;
      background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8'/%3E%3Cpath d='M21 3v5h-5'/%3E%3C/svg%3E") center / 11px 11px no-repeat;
      filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.95)) drop-shadow(0 1px 2px rgba(15, 23, 42, 0.24));
      transform-origin: center;
      transition: filter 240ms ease;
    }
    .text-overlay-rotate-handle:hover::before,
    .text-overlay-rotate-handle:focus-visible::before,
    .text-overlay-box--rotating .text-overlay-rotate-handle::before {
      filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.95)) drop-shadow(0 2px 4px rgba(15, 23, 42, 0.28));
      transform: rotate(360deg);
      transition: filter 240ms ease, transform 520ms ease;
    }
    .text-overlay-rotate-handle::after {
      content: none;
    }
    .text-overlay-resize-handle--n {
      top: -8px;
      left: 50%;
      width: 30px;
      height: 16px;
      transform: translate(-50%, 0);
      cursor: ns-resize;
    }
    .text-overlay-resize-handle--n::before {
      top: 7px;
      left: 50%;
      width: 10px;
      height: 3px;
      transform: translateX(-50%);
    }
    .text-overlay-resize-handle--n::after {
      content: none;
    }
    .text-overlay-resize-handle--e {
      top: 50%;
      right: -8px;
      width: 16px;
      height: 30px;
      transform: translate(0, -50%);
      cursor: ew-resize;
    }
    .text-overlay-resize-handle--e::before {
      top: 50%;
      left: 7px;
      width: 3px;
      height: 10px;
      transform: translateY(-50%);
    }
    .text-overlay-resize-handle--e::after {
      content: none;
    }
    .text-overlay-resize-handle--s {
      bottom: -8px;
      left: 50%;
      width: 30px;
      height: 16px;
      transform: translate(-50%, 0);
      cursor: ns-resize;
    }
    .text-overlay-resize-handle--s::before {
      top: 6px;
      left: 50%;
      width: 10px;
      height: 3px;
      transform: translateX(-50%);
    }
    .text-overlay-resize-handle--s::after {
      content: none;
    }
    .text-overlay-resize-handle--w {
      top: 50%;
      left: -8px;
      width: 16px;
      height: 30px;
      transform: translate(0, -50%);
      cursor: ew-resize;
    }
    .text-overlay-resize-handle--w::before {
      top: 50%;
      left: 6px;
      width: 3px;
      height: 10px;
      transform: translateY(-50%);
    }
    .text-overlay-resize-handle--w::after {
      content: none;
    }
    .text-overlay-resize-handle--nw {
      top: -6px;
      left: -6px;
      width: 22px;
      height: 22px;
      cursor: nwse-resize;
    }
    .text-overlay-resize-handle--nw::before {
      top: 4px;
      left: 4px;
      width: 18px;
      height: 18px;
      border: 0;
      border-radius: 0;
      background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' fill='none' stroke='%232563eb' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='M9 2H2V9'/%3E%3C/svg%3E") center / 18px 18px no-repeat;
      box-shadow: none;
    }
    .text-overlay-resize-handle--nw::after {
      content: none;
    }
    .text-overlay-resize-handle--ne {
      top: -6px;
      right: -6px;
      width: 22px;
      height: 22px;
      cursor: nesw-resize;
    }
    .text-overlay-resize-handle--ne::before {
      top: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      border: 0;
      border-radius: 0;
      background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' fill='none' stroke='%232563eb' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='M9 2H16V9'/%3E%3C/svg%3E") center / 18px 18px no-repeat;
      box-shadow: none;
    }
    .text-overlay-resize-handle--ne::after {
      content: none;
    }
    .text-overlay-resize-handle--se {
      right: -6px;
      bottom: -6px;
      width: 22px;
      height: 22px;
      cursor: nwse-resize;
    }
    .text-overlay-resize-handle--se::before {
      right: 4px;
      bottom: 4px;
      width: 18px;
      height: 18px;
      border: 0;
      border-radius: 0;
      background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' fill='none' stroke='%232563eb' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='M16 9V16H9'/%3E%3C/svg%3E") center / 18px 18px no-repeat;
      box-shadow: none;
    }
    .text-overlay-resize-handle--se::after {
      content: none;
    }
    .text-overlay-resize-handle--sw {
      bottom: -6px;
      left: -6px;
      width: 22px;
      height: 22px;
      cursor: nesw-resize;
    }
    .text-overlay-resize-handle--sw::before {
      bottom: 4px;
      left: 4px;
      width: 18px;
      height: 18px;
      border: 0;
      border-radius: 0;
      background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' fill='none' stroke='%232563eb' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='M2 9V16H9'/%3E%3C/svg%3E") center / 18px 18px no-repeat;
      box-shadow: none;
    }
    .text-overlay-resize-handle--sw::after {
      content: none;
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
    if (cached?.loaded && cached.family) {
      return `"${cached.family}", ${DEFAULT_FONT_STACK}`;
    }
  }
  return DEFAULT_FONT_STACK;
}

async function ensureConfiguredFontLoaded(config = {}) {
  if (!config.fontUrl) return null;
  return loadFontFace(config.fontUrl);
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
  const cacheEntry = { family, loaded: false, objectUrl: "", promise: null };
  const promise = getLoadableFontSource(fontUrl, cacheEntry)
    .then((sourceUrl) => new FontFace(family, `url("${sourceUrl}") format("${getFontFaceFormat(fontUrl)}")`).load())
    .then((fontFace) => {
      document.fonts.add(fontFace);
      cacheEntry.loaded = true;
      if (document.fonts?.ready) {
        return document.fonts.ready.then(() => family);
      }
      return family;
    })
    .catch((error) => {
      if (cacheEntry.objectUrl) {
        URL.revokeObjectURL(cacheEntry.objectUrl);
      }
      loadedFontFaces.delete(fontUrl);
      throw error;
    });

  cacheEntry.promise = promise;
  loadedFontFaces.set(fontUrl, cacheEntry);
  return promise;
}

async function getLoadableFontSource(fontUrl, cacheEntry) {
  const sourceUrl = getFontFaceSourceUrl(fontUrl);
  let parsed;
  try {
    parsed = new URL(sourceUrl, document.baseURI);
  } catch {
    return sourceUrl;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return sourceUrl;
  }

  const response = await fetch(sourceUrl, { mode: "cors" });
  if (!response.ok) {
    throw new Error(`Unable to load font: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  const typedBlob = new Blob([blob], {
    type: getFontMimeType(sourceUrl, blob.type)
  });
  cacheEntry.objectUrl = URL.createObjectURL(typedBlob);
  return cacheEntry.objectUrl;
}

function getFontMimeType(fontUrl, fallback = "") {
  const cleanUrl = fontUrl.split(/[?#]/, 1)[0].toLowerCase();
  if (cleanUrl.endsWith(".woff2")) return "font/woff2";
  if (cleanUrl.endsWith(".woff")) return "font/woff";
  if (cleanUrl.endsWith(".otf")) return "font/otf";
  if (cleanUrl.endsWith(".ttf")) return "font/ttf";
  return fallback || "font/ttf";
}

function getFontFaceFormat(fontUrl) {
  const cleanUrl = fontUrl.split(/[?#]/, 1)[0].toLowerCase();
  if (cleanUrl.endsWith(".woff2")) return "woff2";
  if (cleanUrl.endsWith(".woff")) return "woff";
  if (cleanUrl.endsWith(".otf")) return "opentype";
  return "truetype";
}

function getFontFaceSourceUrl(fontUrl) {
  try {
    const url = new URL(fontUrl, document.baseURI);
    if (url.hostname !== "raw.githubusercontent.com") {
      return fontUrl;
    }

    const [, owner, repo, ref, ...pathParts] = url.pathname.split("/");
    if (!owner || !repo || !ref || !pathParts.length) {
      return fontUrl;
    }

    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${pathParts.join("/")}`;
  } catch {
    return fontUrl;
  }
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
  window.createTextOverlay = createTextOverlay;
  window.removeTextOverlay = removeTextOverlay;
  window.TextOverlayDirection = Direction;
  window.TextOverlayExpandMode = ExpandMode;
}
