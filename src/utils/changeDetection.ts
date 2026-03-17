export interface PolicyChange {
  id: string;
  type: "addition" | "deletion" | "update";
  field: string;
  oldValue?: string;
  newValue?: string;
  htmlContent?: string;
  oldHtmlContent?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
}

interface HtmlBlock {
  tag: string;
  textContent: string;
  htmlContent: string;
  heading: string;
}

const BLOCK_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6",
  "P", "UL", "OL", "TABLE", "BLOCKQUOTE", "PRE", "HR", "DIV",
]);

function isHeading(tag: string): boolean {
  return /^H[1-6]$/.test(tag);
}

function parseHtmlToBlocks(html: string): HtmlBlock[] {
  if (!html.trim()) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: HtmlBlock[] = [];
  let currentHeading = "";

  const children = doc.body.children;
  for (let i = 0; i < children.length; i++) {
    const el = children[i] as HTMLElement;
    const tag = el.tagName;

    if (!BLOCK_TAGS.has(tag)) continue;

    const text = (el.textContent || "").trim();
    if (!text && tag !== "HR") continue;

    if (isHeading(tag)) {
      currentHeading = text;
    }

    blocks.push({
      tag,
      textContent: text,
      htmlContent: el.outerHTML,
      heading: currentHeading,
    });
  }

  return blocks;
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function generateId(): string {
  return `chg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function labelForBlock(block: HtmlBlock, index: number): string {
  if (isHeading(block.tag)) return block.textContent;
  if (block.heading) return block.heading;
  return `Paragraph ${index + 1}`;
}

export function detectChanges(oldHtml: string, newHtml: string): PolicyChange[] {
  const oldBlocks = parseHtmlToBlocks(oldHtml);
  const newBlocks = parseHtmlToBlocks(newHtml);
  const changes: PolicyChange[] = [];

  if (oldBlocks.length === 0) {
    return newBlocks.map((block, i) => ({
      id: generateId(),
      type: "addition" as const,
      field: labelForBlock(block, i),
      newValue: block.textContent,
      htmlContent: block.htmlContent,
      status: "pending" as const,
    }));
  }

  const oldUsed = new Set<number>();
  const newUsed = new Set<number>();

  const oldByHeading = new Map<string, number[]>();
  oldBlocks.forEach((b, i) => {
    const key = normalizeText(b.textContent);
    if (!oldByHeading.has(key)) oldByHeading.set(key, []);
    oldByHeading.get(key)!.push(i);
  });

  for (let ni = 0; ni < newBlocks.length; ni++) {
    const nb = newBlocks[ni];
    const key = normalizeText(nb.textContent);
    const candidates = oldByHeading.get(key);
    if (candidates) {
      const oi = candidates.find((idx) => !oldUsed.has(idx));
      if (oi !== undefined) {
        oldUsed.add(oi);
        newUsed.add(ni);
      }
    }
  }

  const unmatchedOld = oldBlocks
    .map((b, i) => ({ block: b, index: i }))
    .filter(({ index }) => !oldUsed.has(index));
  const unmatchedNew = newBlocks
    .map((b, i) => ({ block: b, index: i }))
    .filter(({ index }) => !newUsed.has(index));

  const oldHeadingMap = new Map<string, { block: HtmlBlock; index: number }[]>();
  for (const item of unmatchedOld) {
    const h = item.block.heading || `__pos_${item.index}`;
    if (!oldHeadingMap.has(h)) oldHeadingMap.set(h, []);
    oldHeadingMap.get(h)!.push(item);
  }

  const pairedOld = new Set<number>();
  const pairedNew = new Set<number>();

  for (const newItem of unmatchedNew) {
    const h = newItem.block.heading || `__pos_${newItem.index}`;
    const candidates = oldHeadingMap.get(h);
    if (!candidates) continue;

    const match = candidates.find(
      (c) => !pairedOld.has(c.index) && c.block.tag === newItem.block.tag
    );
    if (match) {
      pairedOld.add(match.index);
      pairedNew.add(newItem.index);
      changes.push({
        id: generateId(),
        type: "update",
        field: labelForBlock(newItem.block, newItem.index),
        oldValue: match.block.textContent,
        newValue: newItem.block.textContent,
        htmlContent: newItem.block.htmlContent,
        oldHtmlContent: match.block.htmlContent,
        status: "pending",
      });
    }
  }

  for (const item of unmatchedOld) {
    if (pairedOld.has(item.index)) continue;
    changes.push({
      id: generateId(),
      type: "deletion",
      field: labelForBlock(item.block, item.index),
      oldValue: item.block.textContent,
      oldHtmlContent: item.block.htmlContent,
      status: "pending",
    });
  }

  for (const item of unmatchedNew) {
    if (pairedNew.has(item.index)) continue;
    changes.push({
      id: generateId(),
      type: "addition",
      field: labelForBlock(item.block, item.index),
      newValue: item.block.textContent,
      htmlContent: item.block.htmlContent,
      status: "pending",
    });
  }

  changes.sort((a, b) => {
    const order = { addition: 1, update: 0, deletion: 2 };
    return order[a.type] - order[b.type];
  });

  return changes;
}
