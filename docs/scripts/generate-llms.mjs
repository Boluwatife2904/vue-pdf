/**
 * Generates public/llms.txt — the whole documentation site as one markdown
 * file, so agents can consume it in a single fetch. Run via `pnpm docs:llms`.
 *
 * The docs are Vue SFCs rather than markdown, so each page is converted:
 * prose from the <template>, code samples resolved from the `const` they are
 * bound to in <script setup>, and <DocsPropsTable> rows rendered as tables.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const docsDir = path.resolve(dirname, '..');
const pagesDir = path.join(docsDir, 'pages');

const SITE = 'https://vue-pdf.sanusi.dev';

/** Nav order, mirroring layouts/default.vue so the output reads top to bottom. */
const ORDER = [
  ['Getting Started', ['index', 'installation', 'quick-start']],
  [
    'Core Concepts',
    [
      'guide/document-pages',
      'guide/styling',
      'guide/tailwind',
      'guide/fonts',
      'guide/images',
      'guide/forms',
      'guide/math-diagrams',
      'guide/advanced',
    ],
  ],
  [
    'Components',
    [
      'api/document', 'api/page', 'api/view', 'api/text', 'api/link',
      'api/image', 'api/note', 'api/canvas', 'api/svg', 'api/image-background',
    ],
  ],
  [
    'Form Components',
    ['api/text-input', 'api/checkbox', 'api/select', 'api/list', 'api/field-set'],
  ],
  [
    'Browser API',
    ['api/use-pdf', 'api/pdf-viewer', 'api/pdf-download-link', 'api/blob-provider'],
  ],
  [
    'Node API',
    ['api/pdf-function', 'api/render-to-file', 'api/render-to-buffer', 'api/render-to-stream'],
  ],
  [
    'Examples',
    [
      'examples/basic', 'examples/text-styling', 'examples/images',
      'examples/svg', 'examples/layout', 'examples/forms',
    ],
  ],
];

const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

const splitBlocks = (source) => {
  const script = source.match(/<script setup[^>]*>([\s\S]*?)<\/script>/);
  const template = source.match(/<template>([\s\S]*)<\/template>/);
  return { script: script?.[1] ?? '', template: template?.[1] ?? '' };
};

/** Collects `const name = \`...\`` template literals so :code="name" resolves. */
const collectConsts = (script) => {
  const out = {};
  const re = /const\s+(\w+)\s*=\s*`([\s\S]*?)`\s*(?:\n|$)/g;
  let m;
  while ((m = re.exec(script))) out[m[1]] = m[2];
  return out;
};

const seoOf = (script) => {
  const page = script.match(/usePageSeo\(\s*["'`]([\s\S]*?)["'`]\s*,\s*["'`]([\s\S]*?)["'`]/);
  if (page) return { title: page[1].trim(), description: page[2].trim() };

  // The home page uses useSeoMeta directly rather than the usePageSeo helper.
  const title = script.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1];
  const description = script.match(/const description\s*=\s*["'`]([\s\S]*?)["'`]/)?.[1];
  return title ? { title: title.trim(), description: description?.trim() } : null;
};

/** Renders a <DocsPropsTable :rows="[...]"> as a markdown table. */
const propsTable = (rowsLiteral) => {
  const rows = [];
  const re = /\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(rowsLiteral))) {
    const cell = (key) => {
      const v = m[1].match(
        new RegExp(`${key}\\s*:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`),
      );
      return (v?.[1] ?? v?.[2] ?? '').replace(/\\'/g, "'").replace(/\\"/g, '"');
    };
    const name = cell('name');
    if (!name) continue;
    rows.push([
      cell('required') || /required:\s*true/.test(m[1]) ? `${name} (required)` : name,
      cell('type'),
      cell('default') || '—',
      cell('description'),
    ]);
  }
  if (!rows.length) return '';
  return [
    '| Prop | Type | Default | Description |',
    '| --- | --- | --- | --- |',
    ...rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`),
    '',
  ].join('\n');
};

const templateToMarkdown = (template, consts) => {
  let src = template;
  const out = [];

  // Placeholders keep block-level content out of the inline tag stripping.
  const blocks = [];
  const hold = (text) => {
    blocks.push(text);
    return `\n@@BLOCK${blocks.length - 1}@@\n`;
  };

  src = src.replace(
    /<DocsPropsTable[^>]*:rows="\s*\[([\s\S]*?)\]\s*"[^>]*\/?>/g,
    (_, rows) => hold(propsTable(rows)),
  );

  src = src.replace(
    /<DocsCodeBlock([^>]*?)(?:\/>|>[\s\S]*?<\/DocsCodeBlock>)/g,
    (tag, attrs) => {
      const lang = attrs.match(/lang="([^"]*)"/)?.[1] ?? '';
      const file = attrs.match(/filename="([^"]*)"/)?.[1];
      const byRef = attrs.match(/:code="(\w+)"/)?.[1];
      const inline = attrs.match(/:code="`([\s\S]*?)`"/)?.[1];
      const plain = attrs.match(/\bcode="([^"]*)"/)?.[1];
      const body = byRef ? consts[byRef] : (inline ?? plain);
      if (body == null) return '';
      const head = file ? `${lang} [${file}]` : lang;
      return hold(`\`\`\`${head}\n${decode(body).trim()}\n\`\`\`\n`);
    },
  );

  src = src
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, (_, t) => hold(`## ${inline(t)}`))
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (_, t) => hold(`### ${inline(t)}`))
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (_, t) => hold(`#### ${inline(t)}`))
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, t) => hold(`- ${inline(t)}`))
    .replace(
      /<div class="callout[^"]*"[^>]*>([\s\S]*?)<\/div>/g,
      (_, t) => hold(`> ${inline(t)}`),
    )
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (_, t) => hold(inline(t)));

  for (const part of src.split(/\n/)) {
    const m = part.match(/@@BLOCK(\d+)@@/);
    if (m) out.push(blocks[Number(m[1])]);
  }

  return out.filter((s) => s && s.trim()).join('\n\n');
};

/**
 * Strips inline tags, keeping code spans and link text.
 *
 * Entities are decoded *last*: docs write `<code>&lt;Document&gt;</code>`, and
 * decoding first would turn that into a real tag that tag-stripping then eats.
 */
function inline(html) {
  return html
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, (_, t) => `\`${t.trim()}\``)
    .replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/g, '**$1**')
    .replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/g, '*$1*')
    .replace(/<NuxtLink[^>]*to="([^"]*)"[^>]*>([\s\S]*?)<\/NuxtLink>/g, `[$2](${SITE}$1)`)
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

const renderPage = (route) => {
  const file = path.join(pagesDir, `${route}.vue`);
  if (!fs.existsSync(file)) return null;

  const source = fs.readFileSync(file, 'utf8');
  const { script, template } = splitBlocks(source);
  const consts = collectConsts(script);
  const seo = seoOf(script);

  const body = templateToMarkdown(template, consts);
  if (!body.trim()) return null;

  const slug = route === 'index' ? '' : `/${route}`;
  const title = seo?.title ?? route;

  const head = [`## ${title}`, '', `Source: ${SITE}${slug}`];
  if (seo?.description) head.push('', `> ${seo.description}`);

  // The page's own <h1> became an h2 above; drop the duplicate.
  const withoutDupTitle = body.replace(/^## .*\n\n?/, '');

  return {
    title,
    slug,
    description: seo?.description ?? '',
    markdown: [...head, '', withoutDupTitle].join('\n'),
  };
};

const SUMMARY = `> Create PDF documents using Vue components — a Vue 3 renderer for the browser
> and the server, ported from react-pdf. Flexbox layout via Yoga, a full text
> engine with hyphenation and bidi, SVG, images, fillable AcroForm fields, and
> Tailwind-style utilities.`;

const PREAMBLE = `Install: \`npm install @vuepdf/renderer\` (Nuxt: add \`@vuepdf/nuxt\` to \`modules\`).
Docs: ${SITE} · Repository: https://github.com/Boluwatife2904/vue-pdf

Packages: @vuepdf/renderer (core), @vuepdf/nuxt (Nuxt module),
@vuepdf/math (LaTeX), @vuepdf/mermaid (diagrams).`;

const groups = [];
let pages = 0;

for (const [group, routes] of ORDER) {
  const rendered = routes.map(renderPage).filter(Boolean);
  if (!rendered.length) continue;
  pages += rendered.length;
  groups.push([group, rendered]);
}

const publicDir = path.join(docsDir, 'public');
fs.mkdirSync(publicDir, { recursive: true });

// llms.txt — the index form from llmstxt.org: title, summary, linked sections.
const index = [
  '# vue-pdf',
  '',
  SUMMARY,
  '',
  PREAMBLE,
  '',
  '## Documentation Sets',
  '',
  `- [Complete documentation](${SITE}/llms-full.txt): every page below, inlined as markdown in a single file.`,
  '',
  ...groups.flatMap(([group, items]) => [
    `## ${group}`,
    '',
    ...items.map(
      (p) => `- [${p.title}](${SITE}${p.slug})${p.description ? `: ${p.description}` : ''}`,
    ),
    '',
  ]),
].join('\n');

// llms-full.txt — the same pages with their full content inlined.
const full = [
  '# vue-pdf',
  '',
  SUMMARY,
  '',
  PREAMBLE,
  '',
  'This file contains the full documentation as markdown.',
  '',
  groups
    .map(([group, items]) => `# ${group}\n\n${items.map((p) => p.markdown).join('\n\n---\n\n')}`)
    .join('\n\n---\n\n'),
  '',
].join('\n');

fs.writeFileSync(path.join(publicDir, 'llms.txt'), index);
fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), full);

const kb = (s) => `${(s.length / 1024).toFixed(1)} kB`;
console.log(`llms.txt      — index, ${pages} pages, ${kb(index)}`);
console.log(`llms-full.txt — full content, ${full.split('\n').length} lines, ${kb(full)}`);
