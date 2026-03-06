export default function McpSection() {
  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        FetchKit ships an MCP (Model Context Protocol) server so AI assistants like Claude, Cursor,
        and Windsurf can generate brand assets natively as tool calls — no HTTP requests needed.
      </p>

      {/* Setup */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Setup</h3>
        <p className="text-muted-foreground text-sm">
          Add FetchKit to your MCP client config (e.g. Claude Desktop, Cursor, or claude_desktop_config.json):
        </p>
        <div className="border rounded-lg bg-muted/30 p-4 font-mono text-sm text-muted-foreground overflow-x-auto">
          <pre>{`{
  "mcpServers": {
    "fetchkit": {
      "command": "npx",
      "args": ["@fetchkit/mcp"]
    }
  }
}`}</pre>
        </div>
        <p className="text-muted-foreground text-sm">
          The server uses stdio transport. Once configured, the tools below are available to your AI assistant.
        </p>
      </div>

      {/* Tools */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Available Tools</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-2 font-medium">Tool</th>
                <th className="text-left px-4 py-2 font-medium">Description</th>
                <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Key Inputs</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                {
                  name: 'generate_brand_logos',
                  description: 'Generate logo variations for a company',
                  inputs: 'companyName, count',
                },
                {
                  name: 'export_brand_svg',
                  description: 'Build production SVG with text-to-paths',
                  inputs: 'config, layout, mode',
                },
                {
                  name: 'generate_design_tokens',
                  description: 'Generate CSS, Tailwind, and JSON tokens',
                  inputs: 'colors, font',
                },
                {
                  name: 'generate_semantic_palette',
                  description: 'Generate a full color palette from a seed color or brand name',
                  inputs: 'seedColor or brandName, harmony',
                },
                {
                  name: 'generate_favicon',
                  description: 'Generate favicon SVG, HTML snippet, and manifest',
                  inputs: 'iconId, iconColor, companyName',
                },
                {
                  name: 'generate_placeholder',
                  description: 'Generate SVG placeholder images for mockups',
                  inputs: 'category, colors, width, height',
                },
                {
                  name: 'search_icons',
                  description: 'Search 200k+ icons from the Iconify database',
                  inputs: 'query, limit',
                },
                {
                  name: 'generate_legal_document',
                  description: 'Generate a single legal document (privacy policy, ToS, etc.)',
                  inputs: 'type, companyName, websiteUrl, contactEmail',
                },
                {
                  name: 'generate_legal_bundle',
                  description: 'Generate multiple legal documents at once',
                  inputs: 'types[], companyName, websiteUrl, contactEmail',
                },
              ].map((tool) => (
                <tr key={tool.name} className="border-b last:border-0">
                  <td className="px-4 py-2 font-mono text-xs text-foreground whitespace-nowrap">{tool.name}</td>
                  <td className="px-4 py-2 text-xs">{tool.description}</td>
                  <td className="px-4 py-2 text-xs font-mono hidden sm:table-cell">{tool.inputs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow Example */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Example Workflow</h3>
        <p className="text-muted-foreground text-sm">
          A typical agent workflow: generate logos, pick one, export production SVGs, and generate design tokens.
        </p>
        <div className="border rounded-lg bg-muted/30 p-4 font-mono text-sm text-muted-foreground overflow-x-auto">
          <pre>{`1. generate_brand_logos({ companyName: "Nexus", count: 10 })
   → Returns 10 logo variations with different icon/font/color combos

2. export_brand_svg({ config: variations[0].config, layout: "horizontal", mode: "light" })
   → Returns production-ready SVG (text converted to paths, no font deps)

3. generate_design_tokens({ colors: variations[0].config.colors, font: variations[0].config.font })
   → Returns CSS variables, Tailwind config, and JSON tokens

4. generate_favicon({ iconId: "mdi:rocket", iconColor: "#6366f1", companyName: "Nexus" })
   → Returns favicon SVG, HTML snippet, and web manifest`}</pre>
        </div>
      </div>
    </div>
  );
}
