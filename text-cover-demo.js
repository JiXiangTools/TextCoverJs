const svgToDataUri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const backgrounds = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <defs>
      <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#dbeafe"/>
        <stop offset="0.58" stop-color="#f8fafc"/>
        <stop offset="1" stop-color="#cbd5e1"/>
      </linearGradient>
    </defs>
    <rect width="960" height="540" fill="url(#sky)"/>
    <circle cx="805" cy="96" r="54" fill="#facc15"/>
    <path d="M0 410 C180 330 330 460 500 360 C650 275 785 355 960 300 L960 540 L0 540Z" fill="#86efac"/>
    <rect x="92" y="196" width="112" height="214" fill="#64748b"/>
    <rect x="236" y="136" width="132" height="274" fill="#475569"/>
    <rect x="402" y="214" width="126" height="196" fill="#334155"/>
    <rect x="588" y="164" width="180" height="246" fill="#1e293b"/>
    <g fill="#f8fafc" opacity="0.78">
      <rect x="116" y="228" width="20" height="28"/><rect x="160" y="228" width="20" height="28"/>
      <rect x="268" y="174" width="24" height="30"/><rect x="314" y="174" width="24" height="30"/>
      <rect x="430" y="248" width="22" height="28"/><rect x="476" y="248" width="22" height="28"/>
      <rect x="628" y="202" width="28" height="34"/><rect x="698" y="202" width="28" height="34"/>
    </g>
    <path d="M70 456 H890" stroke="#111827" stroke-opacity="0.22" stroke-width="8"/>
  </svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <rect width="960" height="540" fill="#f8fafc"/>
    <rect x="48" y="48" width="864" height="444" rx="22" fill="#e0f2fe" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="236" cy="272" r="142" fill="#fb7185"/>
    <circle cx="236" cy="272" r="92" fill="#fecdd3"/>
    <rect x="454" y="126" width="316" height="64" rx="12" fill="#0f172a"/>
    <rect x="454" y="224" width="380" height="30" rx="10" fill="#38bdf8"/>
    <rect x="454" y="280" width="318" height="30" rx="10" fill="#a7f3d0"/>
    <rect x="454" y="336" width="246" height="30" rx="10" fill="#fde68a"/>
    <path d="M122 424 C230 380 312 438 402 392" fill="none" stroke="#0f172a" stroke-opacity="0.22" stroke-width="14" stroke-linecap="round"/>
    <path d="M760 116 L836 116 L836 192" fill="none" stroke="#0f172a" stroke-opacity="0.24" stroke-width="8"/>
  </svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <rect width="960" height="540" fill="#ecfccb"/>
    <path d="M0 116 L180 92 L320 154 L478 92 L660 128 L960 82 L960 540 L0 540Z" fill="#d9f99d"/>
    <path d="M62 458 C160 358 250 386 338 286 C438 172 594 212 700 112 C772 44 850 52 922 28" fill="none" stroke="#38bdf8" stroke-width="38" stroke-linecap="round"/>
    <path d="M60 458 C160 358 250 386 338 286 C438 172 594 212 700 112 C772 44 850 52 922 28" fill="none" stroke="#0ea5e9" stroke-width="8" stroke-linecap="round"/>
    <path d="M130 88 L288 208 L182 318 L330 474" fill="none" stroke="#475569" stroke-opacity="0.5" stroke-width="20" stroke-linecap="round"/>
    <path d="M460 500 L542 360 L674 334 L840 190" fill="none" stroke="#475569" stroke-opacity="0.5" stroke-width="20" stroke-linecap="round"/>
    <g fill="#f97316">
      <circle cx="216" cy="214" r="20"/><circle cx="552" cy="362" r="20"/><circle cx="730" cy="128" r="20"/>
    </g>
    <g fill="#14532d" opacity="0.75">
      <rect x="96" y="354" width="96" height="56" rx="10"/><rect x="650" y="396" width="140" height="64" rx="10"/>
    </g>
  </svg>`
];

["image-1", "image-2", "image-3"].forEach((id, index) => {
  document.getElementById(id).src = svgToDataUri(backgrounds[index]);
});

const overlays = [
  {
    target: "image-1",
    entities: [
      {
        points: [[108, 82], [462, 82], [108, 132], [462, 132]],
        direction: "left-to-right",
        text: "CITY MORNING",
        fontSize: 34,
        bold: true,
        color: "#111827",
        editable: true
      },
      {
        points: [[590, 82], [650, 82], [590, 386], [650, 386]],
        direction: "top-to-bottom",
        text: "竖排测试文字",
        fontSize: 28,
        color: "#7c2d12",
        editable: true
      },
      {
        points: [[136, 430], [520, 398], [142, 486], [526, 454]],
        direction: "left-to-right",
        text: "Drag and resize this caption.",
        fontSize: 24,
        italic: true,
        color: "#1d4ed8",
        editable: true
      },
      {
        points: [[662, 418], [884, 418], [662, 462], [884, 462]],
        direction: "right-to-left",
        text: "RIGHT TO LEFT",
        fontSize: 22,
        underline: true,
        color: "#0f172a",
        editable: false
      }
    ]
  },
  {
    target: "image-2",
    entities: [
      {
        points: [[454, 132], [768, 132], [454, 188], [768, 188]],
        direction: "left-to-right",
        text: "Product Title",
        fontSize: 32,
        bold: true,
        color: "#ffffff",
        editable: true
      },
      {
        points: [[98, 394], [388, 394], [98, 454], [388, 454]],
        direction: "left-to-right",
        expandDirection: "fixed-width-grow-height",
        text: "Double click to inspect parameters.",
        fontSize: 22,
        color: "#111827",
        editable: true
      },
      {
        points: [[456, 224], [826, 224], [456, 258], [826, 258]],
        direction: "left-to-right",
        text: "Multiple boxes on the second image",
        fontSize: 20,
        color: "#075985",
        editable: true
      },
      {
        points: [[456, 338], [702, 338], [456, 374], [702, 374]],
        direction: "left-to-right",
        text: "No expansion",
        expandDirection: "no-expand",
        fontSize: 24,
        bold: true,
        color: "#78350f",
        editable: true
      }
    ]
  },
  {
    target: "image-3",
    entities: [
      {
        points: [[96, 52], [356, 52], [96, 100], [356, 100]],
        direction: "left-to-right",
        text: "Route Plan",
        fontSize: 34,
        bold: true,
        color: "#14532d",
        editable: true
      },
      {
        points: [[190, 184], [336, 184], [190, 226], [336, 226]],
        direction: "left-to-right",
        text: "Point 1",
        fontSize: 22,
        color: "#9a3412",
        editable: true
      },
      {
        points: [[526, 332], [682, 332], [526, 374], [682, 374]],
        direction: "left-to-right",
        text: "Point 2",
        fontSize: 22,
        color: "#9a3412",
        editable: true
      },
      {
        points: [[710, 96], [868, 96], [710, 138], [868, 138]],
        direction: "left-to-right",
        text: "Point 3",
        fontSize: 22,
        color: "#9a3412",
        editable: true
      },
      {
        points: [[646, 396], [792, 396], [646, 456], [792, 456]],
        direction: "top-to-bottom",
        text: "地图备注",
        fontSize: 24,
        color: "#ffffff",
        editable: true
      }
    ]
  }
];

const createDemoOverlay = ({ target, entities }) => {
  const image = document.getElementById(target);
  createTextOverlay(image, entities, "", {
    coordinateSpace: "rendered"
  });
};

window.addEventListener("load", () => {
  overlays.forEach(createDemoOverlay);
});
