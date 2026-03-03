import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TOC = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'logo-generator', label: 'Logo Generator' },
  { id: 'favicon-generator', label: 'Favicon Generator' },
  { id: 'tips', label: 'Tips' },
  { id: 'faq', label: 'FAQ' },
];

function Section({
  id,
  title,
  children,
  muted,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section id={id} className={`py-16 px-4 scroll-mt-20 ${muted ? 'bg-muted/50' : ''}`}>
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="flex-1">
      {/* Header */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Everything you need to know about using QuickBrand to generate brand assets.
          </p>
          <nav className="flex flex-wrap gap-2">
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-medium px-3 py-1.5 rounded-md border hover:bg-muted transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Getting Started */}
      <Section id="getting-started" title="Getting Started" muted>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. Enter your company name</h3>
            <p className="text-muted-foreground">
              Head to the{' '}
              <Link to="/create" className="text-primary underline underline-offset-4">
                Create
              </Link>{' '}
              page and type your brand or company name. QuickBrand will search for relevant icons
              based on the words in your name, pick from 15 curated display fonts, and generate
              color palettes — then combine them into 30 unique logo variations.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">2. Browse and customize</h3>
            <p className="text-muted-foreground">
              Scroll through the grid and click any logo to select it. From there you can swap the
              icon (search from 200,000+ icons on Iconify), change the font, or tweak individual
              letter colors. The preview updates in real time — you'll see your logo in both
              horizontal and vertical layouts on light and dark backgrounds.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">3. Export your assets</h3>
            <p className="text-muted-foreground">
              When you're happy with your logo, hit Export. You'll get SVG files for every layout
              and color mode combination, plus a full favicon bundle with PNG, ICO, SVG, and
              manifest.json — all ready to drop into your project. Download files individually or
              grab everything as a ZIP.
            </p>
          </div>
        </div>
      </Section>

      {/* Logo Generator */}
      <Section id="logo-generator" title="Logo Generator">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How variations are generated</h3>
            <p className="text-muted-foreground">
              QuickBrand generates 30 logo variations by combining icons, fonts, and color
              palettes. Icons are sourced from Iconify based on your company name. Fonts are
              drawn from a curated set of 15 display-ready Google Fonts. Color palettes come from
              12 templates (Ocean, Sunset, Forest, Berry, and more), each in both multicolor
              and monochrome variants.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Layouts</h3>
            <p className="text-muted-foreground">
              Every logo can be exported in two layouts. <strong>Horizontal</strong> places the
              icon to the left of the company name — great for headers and navigation bars.{' '}
              <strong>Vertical</strong> stacks the icon above the name — ideal for app icons,
              social profiles, and compact spaces.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Color modes</h3>
            <p className="text-muted-foreground">
              Exports are available in both light and dark mode. Dark mode versions automatically
              lighten your palette colors so they stay vibrant against dark backgrounds. You get
              4 SVG files total: horizontal light, horizontal dark, vertical light, vertical dark.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Self-contained SVGs</h3>
            <p className="text-muted-foreground">
              Exported SVGs convert all text to vector paths using opentype.js. This means your
              logo renders correctly everywhere — no font files required, no web font loading, no
              broken text. The SVGs are fully self-contained and scale to any size without quality
              loss.
            </p>
          </div>
        </div>
      </Section>

      {/* Favicon Generator */}
      <Section id="favicon-generator" title="Favicon Generator" muted>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            The Favicon tab on the Export page generates a complete favicon bundle from your
            logo's icon and brand color. Everything is rendered client-side — no server needed.
          </p>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">What's in the bundle</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium">File</th>
                    <th className="text-left px-4 py-2 font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">favicon.svg</td>
                    <td className="px-4 py-2">Modern browsers, scales perfectly</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">favicon.ico</td>
                    <td className="px-4 py-2">Legacy browsers, contains 16/32/48px</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">favicon-16.png</td>
                    <td className="px-4 py-2">Browser tab (standard)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">favicon-32.png</td>
                    <td className="px-4 py-2">Browser tab (retina)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">favicon-48.png</td>
                    <td className="px-4 py-2">Windows site pinning</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">apple-touch-icon.png</td>
                    <td className="px-4 py-2">iOS home screen (180px)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">favicon-192.png</td>
                    <td className="px-4 py-2">Android home screen / PWA</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">favicon-512.png</td>
                    <td className="px-4 py-2">PWA splash screen</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">manifest.json</td>
                    <td className="px-4 py-2">PWA manifest with icon references</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Using the favicons</h3>
            <p className="text-muted-foreground">
              Copy the HTML snippet from the export page and paste it into your{' '}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;head&gt;</code> tag.
              Drop the downloaded files into your public directory. The snippet references all the
              right files with correct sizes and MIME types.
            </p>
          </div>
        </div>
      </Section>

      {/* Tips */}
      <Section id="tips" title="Tips">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Choosing an icon</h3>
            <p className="text-muted-foreground">
              Simple, filled icons work best at small sizes. Avoid icons with thin lines or fine
              details — they won't be legible as favicons. Search for concepts related to your
              brand rather than literal representations. Abstract shapes often make stronger logos
              than literal ones.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Multicolor vs monochrome</h3>
            <p className="text-muted-foreground">
              Multicolor palettes make logos feel playful and modern (think Google).
              Monochrome palettes feel more professional and clean. If your brand name is long,
              monochrome tends to look better since many colors on many letters can feel busy.
              Short names (3-5 characters) work great with multicolor.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Fine-tuning colors</h3>
            <p className="text-muted-foreground">
              Start with a preset palette, then use the per-letter color pickers to adjust
              individual letters. The icon color is independent — try making it contrast with
              the text for visual separation. You can also click preset palettes to reset and
              try different combinations quickly.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">SVG vs PNG</h3>
            <p className="text-muted-foreground">
              Use SVG logos everywhere you can — they scale to any size without quality loss and
              have smaller file sizes. The PNG favicons are only needed because some browsers and
              platforms don't support SVG favicons yet. For your actual logo on websites, docs,
              and presentations, always use the SVG.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" title="FAQ" muted>
        <div className="space-y-6">
          {[
            {
              q: 'Is QuickBrand free?',
              a: 'Yes, completely free. No accounts, no paywalls, no limits. Everything runs in your browser.',
            },
            {
              q: 'Where do the icons come from?',
              a: 'Icons are sourced from Iconify, which aggregates over 200,000 open-source icons from collections like Material Design, Phosphor, Tabler, Lucide, and many more.',
            },
            {
              q: 'Can I use these logos commercially?',
              a: 'Yes. The fonts are from Google Fonts (open-source licenses). The icons from Iconify are from open-source collections — most use Apache 2.0 or MIT licenses that allow commercial use. Check the specific icon collection\'s license if you need to be certain.',
            },
            {
              q: 'Do I need to credit anyone?',
              a: 'For most use cases, no. Google Fonts and most Iconify icon sets don\'t require attribution for usage. Some icon collections may have specific attribution requirements — check the icon set\'s license page on Iconify for details.',
            },
            {
              q: 'Do all browsers support SVG favicons?',
              a: 'All modern browsers (Chrome, Firefox, Edge, Safari 15+) support SVG favicons. That\'s why the bundle also includes PNG and ICO fallbacks — older browsers and some platforms will use those instead.',
            },
            {
              q: 'Is any data sent to a server?',
              a: 'No. Everything runs client-side in your browser. The only external requests are to Google Fonts (for font loading) and Iconify (for icon search and SVG data). Your company name and designs never leave your machine.',
            },
            {
              q: 'Can I edit the SVGs after downloading?',
              a: 'Absolutely. The exported SVGs are clean, standard SVG files. Open them in Figma, Illustrator, Inkscape, or any text editor. Since text is converted to paths, you can manipulate individual letter shapes directly.',
            },
          ].map((item) => (
            <div key={item.q} className="space-y-1">
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-muted-foreground text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <Button asChild size="lg">
            <Link to="/create">Create Your Logo</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
