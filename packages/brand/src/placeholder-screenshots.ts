import { c, wrapSvg } from './placeholder-generator';

// --- Shared Screenshot Helpers ---

function windowChrome(w: number): string {
  const barH = 36;
  return [
    `<rect width="${w}" height="${barH}" rx="8" fill="#f1f5f9" />`,
    `<rect y="${barH - 8}" width="${w}" height="8" fill="#f1f5f9" />`,
    `<circle cx="18" cy="${barH / 2}" r="5" fill="#ef4444" opacity="0.6" />`,
    `<circle cx="36" cy="${barH / 2}" r="5" fill="#eab308" opacity="0.6" />`,
    `<circle cx="54" cy="${barH / 2}" r="5" fill="#22c55e" opacity="0.6" />`,
    `<rect x="80" y="10" width="${w * 0.3}" height="16" rx="8" fill="#e2e8f0" />`,
  ].join('');
}

function navBar(y: number, w: number, accent: string): string {
  const h = 48;
  return [
    `<rect x="0" y="${y}" width="${w}" height="${h}" fill="${accent}" />`,
    `<rect x="16" y="${y + 14}" width="80" height="20" rx="4" fill="white" opacity="0.3" />`,
    `<rect x="${w - 200}" y="${y + 16}" width="40" height="16" rx="3" fill="white" opacity="0.2" />`,
    `<rect x="${w - 150}" y="${y + 16}" width="40" height="16" rx="3" fill="white" opacity="0.2" />`,
    `<rect x="${w - 90}" y="${y + 16}" width="60" height="16" rx="8" fill="white" opacity="0.3" />`,
    `<circle cx="${w - 24}" cy="${y + h / 2}" r="12" fill="white" opacity="0.25" />`,
  ].join('');
}

function sidebar(x: number, y: number, sideW: number, h: number, accent: string, itemCount = 6): string {
  const itemH = 32;
  const gap = 8;
  const rows = Array.from({ length: itemCount }, (_, i) => {
    const iy = y + 16 + i * (itemH + gap);
    const active = i === 0;
    return [
      active ? `<rect x="${x + 8}" y="${iy}" width="${sideW - 16}" height="${itemH}" rx="6" fill="${accent}" opacity="0.15" />` : '',
      `<rect x="${x + 16}" y="${iy + 8}" width="16" height="16" rx="3" fill="${accent}" opacity="${active ? 0.7 : 0.2}" />`,
      `<rect x="${x + 40}" y="${iy + 10}" width="${sideW * 0.5}" height="12" rx="3" fill="${accent}" opacity="${active ? 0.5 : 0.15}" />`,
    ].join('');
  });
  return [
    `<rect x="${x}" y="${y}" width="${sideW}" height="${h}" fill="#f8fafc" />`,
    `<line x1="${x + sideW}" y1="${y}" x2="${x + sideW}" y2="${y + h}" stroke="#e2e8f0" stroke-width="1" />`,
    ...rows,
  ].join('');
}

function metricCard(x: number, y: number, cardW: number, cardH: number, color: string): string {
  return [
    `<rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="8" fill="white" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${x + 12}" y="${y + 12}" width="${cardW * 0.5}" height="10" rx="3" fill="#94a3b8" opacity="0.4" />`,
    `<rect x="${x + 12}" y="${y + 30}" width="${cardW * 0.35}" height="18" rx="3" fill="${color}" opacity="0.6" />`,
    `<rect x="${x + 12}" y="${y + 56}" width="${cardW * 0.7}" height="6" rx="3" fill="${color}" opacity="0.15" />`,
  ].join('');
}

// --- Screenshot Builders ---

export function buildScreenshotDashboard(w: number, h: number, colors: string[]): string {
  const chromeH = 36;
  const navH = 48;
  const sideW = 220;
  const contentTop = chromeH + navH;
  const contentH = h - contentTop;
  const mainX = sideW;
  const mainW = w - sideW;
  const cardW = (mainW - 80) / 4;
  const cardH = 80;
  const cardY = contentTop + 20;

  // Chart area
  const chartX = mainX + 20;
  const chartY = cardY + cardH + 20;
  const chartW = mainW - 40;
  const chartH = contentH - cardH - 80;
  const barCount = 8;
  const barW = chartW * 0.07;
  const barGap = (chartW - barCount * barW) / (barCount + 1);
  const barHeights = [0.5, 0.7, 0.45, 0.85, 0.6, 0.75, 0.4, 0.65];
  const bars = barHeights.map((ratio, i) => {
    const bh = (chartH - 40) * ratio;
    const bx = chartX + barGap + i * (barW + barGap);
    const by = chartY + chartH - 20 - bh;
    return `<rect x="${bx}" y="${by}" width="${barW}" height="${bh}" rx="3" fill="${c(colors, i % 3)}" opacity="0.5" />`;
  });

  const body = [
    `<rect width="${w}" height="${h}" rx="8" fill="#f9fafb" />`,
    windowChrome(w),
    navBar(chromeH, w, c(colors, 0)),
    sidebar(0, contentTop, sideW, contentH, c(colors, 0)),
    // 4 metric cards
    ...Array.from({ length: 4 }, (_, i) =>
      metricCard(mainX + 20 + i * (cardW + 13), cardY, cardW, cardH, c(colors, i % 2)),
    ),
    // Chart container
    `<rect x="${chartX}" y="${chartY}" width="${chartW}" height="${chartH}" rx="8" fill="white" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${chartX + 16}" y="${chartY + 12}" width="120" height="12" rx="3" fill="#94a3b8" opacity="0.3" />`,
    ...bars,
  ].join('');
  return wrapSvg(w, h, '', body);
}

export function buildScreenshotTable(w: number, h: number, colors: string[]): string {
  const chromeH = 36;
  const navH = 48;
  const toolbarH = 56;
  const contentTop = chromeH + navH;
  const tableTop = contentTop + toolbarH;
  const rowH = 44;
  const headerH = 40;
  const colWidths = [0.05, 0.22, 0.18, 0.15, 0.12, 0.15, 0.13];
  const pad = 24;

  // Table header
  const headerCells = colWidths.map((cw, i) => {
    let x = pad;
    for (let j = 0; j < i; j++) x += w * colWidths[j];
    return `<rect x="${x + 8}" y="${tableTop + 12}" width="${w * cw * 0.7}" height="14" rx="3" fill="#64748b" opacity="0.3" />`;
  });

  // Table rows
  const rowCount = Math.floor((h - tableTop - headerH - 50) / rowH);
  const rows = Array.from({ length: rowCount }, (_, r) => {
    const ry = tableTop + headerH + r * rowH;
    const cells = colWidths.map((cw, ci) => {
      let x = pad;
      for (let j = 0; j < ci; j++) x += w * colWidths[j];
      if (ci === 0) return `<rect x="${x + 12}" y="${ry + 14}" width="16" height="16" rx="3" fill="${c(colors, 0)}" opacity="0.15" />`;
      const widthRatio = 0.3 + Math.abs(Math.sin(r * 3 + ci * 7)) * 0.5;
      return `<rect x="${x + 8}" y="${ry + 16}" width="${w * cw * widthRatio}" height="12" rx="3" fill="#94a3b8" opacity="0.2" />`;
    });
    return [
      r % 2 === 0 ? `<rect x="${pad}" y="${ry}" width="${w - pad * 2}" height="${rowH}" fill="#f8fafc" />` : '',
      `<line x1="${pad}" y1="${ry + rowH}" x2="${w - pad}" y2="${ry + rowH}" stroke="#e2e8f0" stroke-width="0.5" />`,
      ...cells,
    ].join('');
  });

  const body = [
    `<rect width="${w}" height="${h}" rx="8" fill="white" />`,
    windowChrome(w),
    navBar(chromeH, w, c(colors, 0)),
    // Toolbar
    `<rect x="0" y="${contentTop}" width="${w}" height="${toolbarH}" fill="white" />`,
    `<line x1="0" y1="${contentTop + toolbarH}" x2="${w}" y2="${contentTop + toolbarH}" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${pad}" y="${contentTop + 14}" width="200" height="28" rx="6" fill="white" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${pad + 10}" y="${contentTop + 20}" width="14" height="14" rx="2" fill="#94a3b8" opacity="0.3" />`,
    `<rect x="${pad + 220}" y="${contentTop + 14}" width="80" height="28" rx="6" fill="white" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${w - pad - 100}" y="${contentTop + 14}" width="100" height="28" rx="6" fill="${c(colors, 0)}" opacity="0.8" />`,
    `<rect x="${w - pad - 80}" y="${contentTop + 22}" width="60" height="12" rx="3" fill="white" opacity="0.5" />`,
    // Table header
    `<rect x="${pad}" y="${tableTop}" width="${w - pad * 2}" height="${headerH}" fill="#f1f5f9" rx="6" />`,
    ...headerCells,
    // Rows
    ...rows,
    // Pagination
    `<rect x="${w / 2 - 60}" y="${h - 50}" width="120" height="28" rx="14" fill="#f1f5f9" />`,
    ...Array.from({ length: 5 }, (_, i) =>
      `<circle cx="${w / 2 - 32 + i * 16}" cy="${h - 36}" r="4" fill="${i === 0 ? c(colors, 0) : '#cbd5e1'}" opacity="${i === 0 ? 0.7 : 0.4}" />`,
    ),
  ].join('');
  return wrapSvg(w, h, '', body);
}

export function buildScreenshotChat(w: number, h: number, colors: string[]): string {
  const chromeH = 36;
  const listW = 280;
  const chatX = listW;
  const chatW = w - listW;
  const inputH = 56;

  // Conversation list
  const convCount = 8;
  const convH = 64;
  const convItems = Array.from({ length: convCount }, (_, i) => {
    const cy = chromeH + i * convH;
    const active = i === 0;
    return [
      active ? `<rect x="0" y="${cy}" width="${listW}" height="${convH}" fill="${c(colors, 0)}" opacity="0.08" />` : '',
      `<circle cx="28" cy="${cy + convH / 2}" r="18" fill="${c(colors, i % 3)}" opacity="${active ? 0.5 : 0.2}" />`,
      `<rect x="54" y="${cy + 16}" width="${listW * 0.45}" height="12" rx="3" fill="#334155" opacity="${active ? 0.5 : 0.25}" />`,
      `<rect x="54" y="${cy + 34}" width="${listW * 0.6}" height="10" rx="3" fill="#94a3b8" opacity="0.2" />`,
      `<line x1="0" y1="${cy + convH}" x2="${listW}" y2="${cy + convH}" stroke="#e2e8f0" stroke-width="0.5" />`,
    ].join('');
  });

  // Chat header
  const chatHeaderH = 56;
  const chatHeader = [
    `<rect x="${chatX}" y="${chromeH}" width="${chatW}" height="${chatHeaderH}" fill="white" />`,
    `<line x1="${chatX}" y1="${chromeH + chatHeaderH}" x2="${w}" y2="${chromeH + chatHeaderH}" stroke="#e2e8f0" stroke-width="1" />`,
    `<circle cx="${chatX + 28}" cy="${chromeH + chatHeaderH / 2}" r="16" fill="${c(colors, 0)}" opacity="0.2" />`,
    `<rect x="${chatX + 52}" y="${chromeH + 18}" width="100" height="12" rx="3" fill="#334155" opacity="0.35" />`,
    `<circle cx="${chatX + 56}" cy="${chromeH + 38}" r="4" fill="#22c55e" opacity="0.6" />`,
    `<rect x="${chatX + 66}" y="${chromeH + 34}" width="40" height="8" rx="3" fill="#94a3b8" opacity="0.2" />`,
  ].join('');

  // Messages
  const msgTop = chromeH + chatHeaderH + 16;
  const msgBottom = h - inputH - 16;
  const messages = [
    { side: 'left', y: 0, width: 0.45, lines: 2 },
    { side: 'right', y: 70, width: 0.35, lines: 1 },
    { side: 'left', y: 120, width: 0.55, lines: 3 },
    { side: 'right', y: 210, width: 0.3, lines: 1 },
    { side: 'left', y: 260, width: 0.4, lines: 2 },
    { side: 'right', y: 340, width: 0.5, lines: 2 },
  ];
  const msgSvg = messages
    .filter((m) => msgTop + m.y + m.lines * 20 + 16 < msgBottom)
    .map((m) => {
      const bubbleW = chatW * m.width;
      const bubbleH = m.lines * 20 + 16;
      const bx = m.side === 'left' ? chatX + 16 : w - 16 - bubbleW;
      const by = msgTop + m.y;
      const fill = m.side === 'right' ? c(colors, 0) : '#f1f5f9';
      const textFill = m.side === 'right' ? 'white' : '#94a3b8';
      const lines = Array.from({ length: m.lines }, (_, i) => {
        const lw = i === m.lines - 1 ? bubbleW * 0.6 : bubbleW * 0.85;
        return `<rect x="${bx + 12}" y="${by + 10 + i * 20}" width="${lw - 24}" height="10" rx="3" fill="${textFill}" opacity="0.4" />`;
      });
      return [
        `<rect x="${bx}" y="${by}" width="${bubbleW}" height="${bubbleH}" rx="12" fill="${fill}" opacity="${m.side === 'right' ? 0.85 : 1}" />`,
        ...lines,
      ].join('');
    });

  const body = [
    `<rect width="${w}" height="${h}" rx="8" fill="white" />`,
    windowChrome(w),
    // List panel bg
    `<rect x="0" y="${chromeH}" width="${listW}" height="${h - chromeH}" fill="#fafafa" />`,
    `<line x1="${listW}" y1="${chromeH}" x2="${listW}" y2="${h}" stroke="#e2e8f0" stroke-width="1" />`,
    ...convItems,
    chatHeader,
    ...msgSvg,
    // Input bar
    `<rect x="${chatX}" y="${h - inputH}" width="${chatW}" height="${inputH}" fill="white" />`,
    `<line x1="${chatX}" y1="${h - inputH}" x2="${w}" y2="${h - inputH}" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${chatX + 16}" y="${h - inputH + 14}" width="${chatW - 80}" height="28" rx="14" fill="#f1f5f9" />`,
    `<circle cx="${w - 32}" cy="${h - inputH / 2}" r="16" fill="${c(colors, 0)}" opacity="0.6" />`,
    `<rect x="${w - 40}" y="${h - inputH / 2 - 4}" width="16" height="8" rx="2" fill="white" opacity="0.5" />`,
  ].join('');
  return wrapSvg(w, h, '', body);
}

export function buildScreenshotEditor(w: number, h: number, colors: string[]): string {
  const chromeH = 36;
  const toolbarH = 40;
  const sideW = 200;
  const contentTop = chromeH + toolbarH;
  const contentH = h - contentTop;

  // Toolbar
  const toolbar = [
    `<rect x="0" y="${chromeH}" width="${w}" height="${toolbarH}" fill="#fafafa" />`,
    `<line x1="0" y1="${contentTop}" x2="${w}" y2="${contentTop}" stroke="#e2e8f0" stroke-width="1" />`,
    ...Array.from({ length: 6 }, (_, i) =>
      `<rect x="${16 + i * 32}" y="${chromeH + 10}" width="20" height="20" rx="4" fill="#94a3b8" opacity="0.15" />`,
    ),
    `<rect x="${w / 2 - 80}" y="${chromeH + 12}" width="160" height="16" rx="4" fill="#e2e8f0" />`,
  ].join('');

  // File tree
  const treeItems = [
    { indent: 0, w: 0.6 },
    { indent: 1, w: 0.5 },
    { indent: 1, w: 0.55 },
    { indent: 2, w: 0.4 },
    { indent: 2, w: 0.45 },
    { indent: 1, w: 0.5 },
    { indent: 0, w: 0.55 },
    { indent: 1, w: 0.6 },
    { indent: 1, w: 0.35 },
    { indent: 2, w: 0.45 },
    { indent: 0, w: 0.5 },
  ];
  const tree = treeItems.map((item, i) => {
    const iy = contentTop + 12 + i * 28;
    const ix = 12 + item.indent * 16;
    const active = i === 3;
    return [
      active ? `<rect x="0" y="${iy - 2}" width="${sideW}" height="24" fill="${c(colors, 0)}" opacity="0.1" />` : '',
      `<rect x="${ix}" y="${iy + 2}" width="14" height="14" rx="2" fill="${active ? c(colors, 0) : '#94a3b8'}" opacity="${active ? 0.6 : 0.2}" />`,
      `<rect x="${ix + 20}" y="${iy + 4}" width="${sideW * item.w - ix - 20}" height="10" rx="3" fill="${active ? c(colors, 0) : '#64748b'}" opacity="${active ? 0.5 : 0.15}" />`,
    ].join('');
  });

  // Editor lines
  const lineCount = Math.floor((contentH - 24) / 24);
  const linePads = [0, 0, 1, 1, 2, 2, 2, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 1, 2, 1, 0];
  const lineWidths = [0.6, 0.45, 0.7, 0.55, 0.4, 0.65, 0.3, 0.5, 0.75, 0.35, 0.0, 0.55, 0.6, 0.45, 0.3, 0.0, 0.7, 0.5, 0.6, 0.4, 0.55, 0.65];
  const editorX = sideW + 48; // room for line numbers
  const editorW = w - sideW - 64;
  const lines = Array.from({ length: Math.min(lineCount, lineWidths.length) }, (_, i) => {
    const ly = contentTop + 12 + i * 24;
    const lw = lineWidths[i % lineWidths.length];
    if (lw === 0) return '';
    const indent = (linePads[i % linePads.length] || 0) * 24;
    // Line number
    const lineNum = `<rect x="${sideW + 12}" y="${ly + 2}" width="20" height="10" rx="2" fill="#94a3b8" opacity="0.15" />`;
    // Code tokens (split line into 2-3 colored segments)
    const totalW = editorW * lw;
    const seg1W = totalW * 0.25;
    const seg2W = totalW * 0.45;
    const seg3W = totalW * 0.3;
    return [
      lineNum,
      `<rect x="${editorX + indent}" y="${ly + 2}" width="${seg1W}" height="10" rx="2" fill="${c(colors, i % 3)}" opacity="0.25" />`,
      `<rect x="${editorX + indent + seg1W + 6}" y="${ly + 2}" width="${seg2W}" height="10" rx="2" fill="#64748b" opacity="0.15" />`,
      seg3W > 20 ? `<rect x="${editorX + indent + seg1W + seg2W + 12}" y="${ly + 2}" width="${seg3W}" height="10" rx="2" fill="${c(colors, (i + 1) % 3)}" opacity="0.15" />` : '',
    ].join('');
  });

  const body = [
    `<rect width="${w}" height="${h}" rx="8" fill="white" />`,
    windowChrome(w),
    toolbar,
    // File tree panel
    `<rect x="0" y="${contentTop}" width="${sideW}" height="${contentH}" fill="#fafafa" />`,
    `<line x1="${sideW}" y1="${contentTop}" x2="${sideW}" y2="${h}" stroke="#e2e8f0" stroke-width="1" />`,
    ...tree,
    // Line number gutter
    `<rect x="${sideW}" y="${contentTop}" width="36" height="${contentH}" fill="#fafafa" />`,
    `<line x1="${sideW + 36}" y1="${contentTop}" x2="${sideW + 36}" y2="${h}" stroke="#f1f5f9" stroke-width="1" />`,
    ...lines,
  ].join('');
  return wrapSvg(w, h, '', body);
}

export function buildScreenshotSettings(w: number, h: number, colors: string[]): string {
  const chromeH = 36;
  const navH = 48;
  const sideW = 200;
  const contentTop = chromeH + navH;
  const contentH = h - contentTop;
  const mainX = sideW;
  const mainW = w - sideW;

  // Settings sidebar sections
  const sections = ['Profile', 'Account', 'Billing', 'Notifications', 'Security', 'Integrations'];
  const sideItems = sections.map((_, i) => {
    const iy = contentTop + 16 + i * 40;
    const active = i === 0;
    return [
      active ? `<rect x="4" y="${iy}" width="${sideW - 8}" height="32" rx="6" fill="${c(colors, 0)}" opacity="0.12" />` : '',
      `<rect x="16" y="${iy + 10}" width="${sideW * 0.6}" height="12" rx="3" fill="${active ? c(colors, 0) : '#64748b'}" opacity="${active ? 0.6 : 0.2}" />`,
    ].join('');
  });

  // Form fields
  const formX = mainX + 40;
  const formW = mainW - 80;
  const fields = [
    { label: 0.15, inputW: 0.6, y: 0 },
    { label: 0.12, inputW: 0.6, y: 80 },
    { label: 0.18, inputW: 0.4, y: 160 },
    { label: 0.1, inputW: 0.8, y: 240 },
  ];
  const formFields = fields.map((f) => {
    const fy = contentTop + 40 + f.y;
    return [
      `<rect x="${formX}" y="${fy}" width="${formW * f.label}" height="12" rx="3" fill="#334155" opacity="0.3" />`,
      `<rect x="${formX}" y="${fy + 20}" width="${formW * f.inputW}" height="36" rx="6" fill="white" stroke="#e2e8f0" stroke-width="1" />`,
      `<rect x="${formX + 12}" y="${fy + 32}" width="${formW * f.inputW * 0.5}" height="12" rx="3" fill="#94a3b8" opacity="0.15" />`,
    ].join('');
  });

  // Toggle
  const toggleY = contentTop + 40 + 320;
  const toggle = [
    `<rect x="${formX}" y="${toggleY}" width="${formW * 0.2}" height="12" rx="3" fill="#334155" opacity="0.3" />`,
    `<rect x="${formX}" y="${toggleY + 22}" width="44" height="24" rx="12" fill="${c(colors, 0)}" opacity="0.6" />`,
    `<circle cx="${formX + 32}" cy="${toggleY + 34}" r="9" fill="white" />`,
    `<rect x="${formX + 56}" y="${toggleY + 26}" width="${formW * 0.35}" height="10" rx="3" fill="#94a3b8" opacity="0.2" />`,
  ].join('');

  // Buttons
  const btnY = h - 70;
  const buttons = [
    `<rect x="${formX}" y="${btnY}" width="100" height="36" rx="6" fill="${c(colors, 0)}" opacity="0.85" />`,
    `<rect x="${formX + 20}" y="${btnY + 12}" width="60" height="12" rx="3" fill="white" opacity="0.6" />`,
    `<rect x="${formX + 120}" y="${btnY}" width="80" height="36" rx="6" fill="white" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${formX + 140}" y="${btnY + 12}" width="40" height="12" rx="3" fill="#64748b" opacity="0.25" />`,
  ].join('');

  const body = [
    `<rect width="${w}" height="${h}" rx="8" fill="#f9fafb" />`,
    windowChrome(w),
    navBar(chromeH, w, c(colors, 0)),
    // Settings sidebar
    `<rect x="0" y="${contentTop}" width="${sideW}" height="${contentH}" fill="white" />`,
    `<line x1="${sideW}" y1="${contentTop}" x2="${sideW}" y2="${h}" stroke="#e2e8f0" stroke-width="1" />`,
    ...sideItems,
    // Page title
    `<rect x="${formX}" y="${contentTop + 16}" width="160" height="16" rx="4" fill="#1e293b" opacity="0.3" />`,
    // Form area bg
    `<rect x="${mainX}" y="${contentTop}" width="${mainW}" height="${contentH}" fill="#f9fafb" />`,
    `<rect x="${formX}" y="${contentTop + 16}" width="160" height="16" rx="4" fill="#1e293b" opacity="0.3" />`,
    ...formFields,
    toggle,
    buttons,
  ].join('');
  return wrapSvg(w, h, '', body);
}

export function buildScreenshotLanding(w: number, h: number, colors: string[]): string {
  const chromeH = 36;
  const navH = 52;

  // Slim nav
  const nav = [
    `<rect x="0" y="${chromeH}" width="${w}" height="${navH}" fill="white" />`,
    `<line x1="0" y1="${chromeH + navH}" x2="${w}" y2="${chromeH + navH}" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="24" y="${chromeH + 16}" width="90" height="20" rx="4" fill="${c(colors, 0)}" opacity="0.5" />`,
    ...Array.from({ length: 4 }, (_, i) =>
      `<rect x="${w / 2 - 120 + i * 70}" y="${chromeH + 20}" width="50" height="12" rx="3" fill="#64748b" opacity="0.2" />`,
    ),
    `<rect x="${w - 140}" y="${chromeH + 14}" width="110" height="24" rx="6" fill="${c(colors, 0)}" opacity="0.8" />`,
    `<rect x="${w - 125}" y="${chromeH + 20}" width="80" height="12" rx="3" fill="white" opacity="0.5" />`,
  ].join('');

  // Hero section
  const heroTop = chromeH + navH;
  const heroH = 280;
  const hero = [
    `<rect x="0" y="${heroTop}" width="${w}" height="${heroH}" fill="#f8fafc" />`,
    // Heading
    `<rect x="${w / 2 - 200}" y="${heroTop + 50}" width="400" height="28" rx="6" fill="#1e293b" opacity="0.25" />`,
    `<rect x="${w / 2 - 140}" y="${heroTop + 90}" width="280" height="20" rx="4" fill="#1e293b" opacity="0.15" />`,
    // Subtitle
    `<rect x="${w / 2 - 180}" y="${heroTop + 124}" width="360" height="12" rx="3" fill="#64748b" opacity="0.15" />`,
    `<rect x="${w / 2 - 140}" y="${heroTop + 144}" width="280" height="12" rx="3" fill="#64748b" opacity="0.12" />`,
    // CTA buttons
    `<rect x="${w / 2 - 120}" y="${heroTop + 180}" width="110" height="40" rx="8" fill="${c(colors, 0)}" opacity="0.85" />`,
    `<rect x="${w / 2 - 95}" y="${heroTop + 194}" width="60" height="12" rx="3" fill="white" opacity="0.6" />`,
    `<rect x="${w / 2 + 10}" y="${heroTop + 180}" width="110" height="40" rx="8" fill="white" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${w / 2 + 35}" y="${heroTop + 194}" width="60" height="12" rx="3" fill="#64748b" opacity="0.25" />`,
  ].join('');

  // Feature grid (3 columns)
  const gridTop = heroTop + heroH + 20;
  const colW = (w - 120) / 3;
  const cardH = 180;
  const features = Array.from({ length: 3 }, (_, i) => {
    const cx = 40 + i * (colW + 20);
    return [
      `<rect x="${cx}" y="${gridTop}" width="${colW}" height="${cardH}" rx="10" fill="white" stroke="#e2e8f0" stroke-width="1" />`,
      // Icon circle
      `<circle cx="${cx + colW / 2}" cy="${gridTop + 36}" r="20" fill="${c(colors, i)}" opacity="0.15" />`,
      `<rect x="${cx + colW / 2 - 8}" y="${gridTop + 28}" width="16" height="16" rx="3" fill="${c(colors, i)}" opacity="0.4" />`,
      // Title
      `<rect x="${cx + colW / 2 - 50}" y="${gridTop + 72}" width="100" height="14" rx="3" fill="#1e293b" opacity="0.2" />`,
      // Text lines
      `<rect x="${cx + 20}" y="${gridTop + 100}" width="${colW - 40}" height="10" rx="3" fill="#94a3b8" opacity="0.15" />`,
      `<rect x="${cx + 30}" y="${gridTop + 118}" width="${colW - 60}" height="10" rx="3" fill="#94a3b8" opacity="0.12" />`,
      `<rect x="${cx + 24}" y="${gridTop + 136}" width="${colW - 48}" height="10" rx="3" fill="#94a3b8" opacity="0.1" />`,
    ].join('');
  });

  // Footer
  const footerH = 48;
  const footer = [
    `<rect x="0" y="${h - footerH}" width="${w}" height="${footerH}" fill="#f8fafc" />`,
    `<line x1="0" y1="${h - footerH}" x2="${w}" y2="${h - footerH}" stroke="#e2e8f0" stroke-width="1" />`,
    `<rect x="${w / 2 - 60}" y="${h - footerH + 18}" width="120" height="10" rx="3" fill="#94a3b8" opacity="0.15" />`,
  ].join('');

  const body = [
    `<rect width="${w}" height="${h}" rx="8" fill="white" />`,
    windowChrome(w),
    nav,
    hero,
    ...features,
    footer,
  ].join('');
  return wrapSvg(w, h, '', body);
}
