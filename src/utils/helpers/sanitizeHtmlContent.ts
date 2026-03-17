import sanitizeHtml from "sanitize-html";

export default function sanitizeHtmlContent(html: string): string {
  if (!html) return "";
  console.log(html, "   ", sanitizeHtml(html));
  return sanitizeHtml(html);
}
