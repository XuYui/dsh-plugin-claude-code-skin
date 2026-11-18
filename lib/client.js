window.__ModuleLoader__.load({
	id: "dsh-plugin-claude-code-skin",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const CSS = "/* ==========================================================================\n   Claude-style skin for the DeepSeek Harness web GUI\n   --------------------------------------------------------------------------\n   Every rule is anchored to `html[data-dsh-cc-skin]`, an attribute the plugin's\n   browser half sets while it is mounted. Removing the plugin removes the\n   attribute, and the stock DSH theme returns with no residue.\n\n   Structure:\n     1. Palettes            – light (the reference look) and its dark mirror\n     2. Token remap         – `--dsw-*` values re-pointed at the palette\n     3. Shell               – sidebar, header, view tabs\n     4. Conversation        – bubbles, markdown, thinking, tool cards, turn tail\n     5. Composer            – the rounded input card and its status line\n     6. Right sidebar       – environment / context / outputs / changes\n     7. Overlays            – menus, dialogs, chips, buttons\n     8. Hero                – greeting and the usage overview card\n   ========================================================================== */\n\n/* ==========================================================================\n   1. Palettes\n   ========================================================================== */\n\nhtml[data-dsh-cc-skin] {\n  /* --- light: the reference screenshots ---------------------------------- */\n  --cc-bg: #fcfcf8;\n  --cc-panel: #f9f9f5;\n  --cc-elev: #ffffff;\n  --cc-inset: #f6f5f0;\n  --cc-card: #f8f7f3;\n  --cc-tile: #f1f0eb;\n  --cc-hover: #f0efe9;\n  --cc-active: #eceae3;\n  --cc-bubble: #f2f0ea;\n  --cc-badge: #eeede8;\n  --cc-text: #1f1e1b;\n  --cc-text-2: #6c6a62;\n  --cc-text-3: #98968d;\n  --cc-line: #e9e7e0;\n  --cc-line-soft: #f1efe9;\n  --cc-line-strong: #dcd9d1;\n  --cc-tabbar: #f1efe9;\n  --cc-accent: #4a6cf7;\n  --cc-accent-soft: #eef1fe;\n  --cc-heat-0: #eceae4;\n  --cc-heat-1: #c7d3fb;\n  --cc-heat-2: #93aaf7;\n  --cc-heat-3: #4a6cf7;\n  --cc-shadow: 0 1px 2px rgba(28, 27, 24, 0.05);\n  --cc-shadow-lg: 0 12px 32px rgba(28, 27, 24, 0.12);\n  --cc-radius-card: 12px;\n  --cc-radius-control: 8px;\n  --cc-radius-input: 18px;\n  --cc-sans: -apple-system, BlinkMacSystemFont, \"Segoe UI Variable Text\", \"Segoe UI\",\n    Inter, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei UI\", \"Microsoft YaHei\",\n    system-ui, sans-serif;\n  --cc-serif: \"Iowan Old Style\", \"Palatino Linotype\", Palatino, \"Book Antiqua\",\n    Georgia, \"Songti SC\", SimSun, \"Times New Roman\", serif;\n  --cc-mono: \"SF Mono\", \"Cascadia Mono\", \"JetBrains Mono\", Menlo, Consolas,\n    \"DejaVu Sans Mono\", \"Liberation Mono\", \"PingFang SC\", \"Microsoft YaHei\", monospace;\n}\n\nhtml[data-dsh-cc-skin] body[data-ds-dark-theme] {\n  /* --- dark: the same layout on a warm charcoal ------------------------- */\n  --cc-bg: #262624;\n  --cc-panel: #1f1e1d;\n  --cc-elev: #30302e;\n  --cc-inset: #2b2a28;\n  --cc-card: #2b2a28;\n  --cc-tile: #33322e;\n  --cc-hover: #34332f;\n  --cc-active: #3b3a35;\n  --cc-bubble: #35342f;\n  --cc-badge: #3a3935;\n  --cc-text: #f3f1ea;\n  --cc-text-2: #b6b3a8;\n  --cc-text-3: #8a877d;\n  --cc-line: #3b3a35;\n  --cc-line-soft: #33322e;\n  --cc-line-strong: #4a4944;\n  --cc-tabbar: #33322e;\n  --cc-accent: #93aaf7;\n  --cc-accent-soft: #2f3550;\n  --cc-heat-0: #33322e;\n  --cc-heat-1: #3d4a7a;\n  --cc-heat-2: #5f74c4;\n  --cc-heat-3: #93aaf7;\n  --cc-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);\n  --cc-shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.45);\n}\n\n/* ==========================================================================\n   2. Token remap\n   ========================================================================== */\n\nhtml[data-dsh-cc-skin] body {\n  --dsw-alias-bg-base: var(--cc-bg) !important;\n  --dsw-alias-bg-layer-1: var(--cc-elev) !important;\n  --dsw-alias-bg-layer-2: var(--cc-elev) !important;\n  --dsw-alias-bg-layer-3: var(--cc-hover) !important;\n  --dsw-alias-bg-overlay: var(--cc-elev) !important;\n  --dsw-specific-sidebar-fill: var(--cc-panel) !important;\n  --dsw-specific-bubble: var(--cc-bubble) !important;\n  --dsw-specific-bubble-highlight: var(--cc-hover) !important;\n  --dsw-specific-menu: var(--cc-elev) !important;\n  --dsw-specific-input-major: var(--cc-elev) !important;\n  --dsw-specific-selector: var(--cc-inset) !important;\n  --dsw-specific-tip: var(--cc-elev) !important;\n  --dsw-alias-settings-card-fill: var(--cc-elev) !important;\n  --dsw-alias-settings-card-stroke: var(--cc-line) !important;\n  --dsw-alias-menu-surface-fill: var(--cc-elev) !important;\n  --dsw-alias-menu-group-header-fill: var(--cc-panel) !important;\n  --dsw-alias-turn-trigger-bg: var(--cc-elev) !important;\n  --dsw-alias-turn-trigger-bg-hover: var(--cc-hover) !important;\n  --dsw-alias-toast-bg: var(--cc-elev) !important;\n  --dsw-alias-toast-label: var(--cc-text) !important;\n  --dsw-alias-tooltip-bg: var(--cc-text) !important;\n  --dsw-alias-tooltip-key-bg: #ffffff26 !important;\n\n  --dsw-alias-label-primary: var(--cc-text) !important;\n  --dsw-alias-label-primary-bluish: var(--cc-text) !important;\n  --dsw-alias-label-secondary: var(--cc-text-2) !important;\n  --dsw-alias-label-tertiary: var(--cc-text-2) !important;\n  --dsw-alias-label-caption: var(--cc-text-3) !important;\n  --dsw-alias-label-dimmed: var(--cc-text-3) !important;\n  --dsw-alias-label-primary-dimmed: var(--cc-text-2) !important;\n  --dsw-alias-label-shimmer: var(--cc-text-3) !important;\n  --dsw-alias-label-deep-diving: var(--cc-text-2) !important;\n  --dsw-alias-label-deep-diving-shimmer: var(--cc-accent) !important;\n  --dsw-alias-menu-icon: var(--cc-text-2) !important;\n\n  --dsw-alias-border-l1: var(--cc-line-soft) !important;\n  --dsw-alias-border-l2: var(--cc-line) !important;\n  --dsw-alias-border-l3: var(--cc-line) !important;\n  --dsw-alias-border-l4: var(--cc-line-strong) !important;\n  --dsw-alias-border-l2-darkmode-thin: var(--cc-line) !important;\n\n  --dsw-alias-brand-primary: var(--cc-text) !important;\n  --dsw-alias-brand-text: var(--cc-text) !important;\n  --dsw-alias-link: var(--cc-accent) !important;\n\n  --dsw-alias-interactive-bg-hover: var(--cc-hover) !important;\n  --dsw-alias-interactive-bg-hover-solid: var(--cc-hover) !important;\n  --dsw-alias-interactive-bg-hover-accent: var(--cc-accent-soft) !important;\n  --dsw-alias-interactive-bg-active: var(--cc-active) !important;\n\n  --dsw-alias-markdown-code-block: var(--cc-inset) !important;\n  --dsw-alias-markdown-code-block-banner: var(--cc-card) !important;\n  --dsw-alias-markdown-inline-code: var(--cc-inset) !important;\n  --dsw-alias-markdown-code-segment-selected: var(--cc-elev) !important;\n  --dsw-alias-markdown-code-segment-unselected: transparent !important;\n\n  --dsw-alias-button-primary-dimmed: var(--cc-text-3) !important;\n  --dsw-alias-button-ghost-active-fill: var(--cc-hover) !important;\n  --dsw-alias-button-ghost-active-hover: var(--cc-active) !important;\n  --dsw-alias-button-ghost-active-border: var(--cc-line) !important;\n  --dsw-alias-button-tool-bar-hover: var(--cc-hover) !important;\n\n  --dsw-alias-scrollbar-bg-l1: transparent !important;\n  --dsw-alias-scrollbar-bg-l2: transparent !important;\n  --dsw-alias-scrollbar-hover-l1: var(--cc-line-strong) !important;\n  --dsw-alias-scrollbar-hover-l2: var(--cc-line-strong) !important;\n\n  --dsw-shadow-lv1: var(--cc-shadow) !important;\n  --dsw-elevation-stroke-color: var(--cc-line) !important;\n  --dsw-elevation-panel: var(--cc-shadow) !important;\n  --dsw-elevation-prominent: var(--cc-shadow-lg) !important;\n  --dsw-elevation-soft: var(--cc-shadow) !important;\n\n  background-color: var(--cc-bg) !important;\n  color: var(--cc-text) !important;\n  font-family: var(--cc-sans) !important;\n  font-size: 14px !important;\n  -webkit-font-smoothing: antialiased;\n}\n\n/* ==========================================================================\n   3. Shell\n   ========================================================================== */\n\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] > *,\nhtml[data-dsh-cc-skin] body [class*=\"sidebarCol\"] {\n  background: var(--cc-panel) !important;\n  border-right: 1px solid var(--cc-line) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] {\n  font-size: 13px !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] button {\n  border-radius: var(--cc-radius-control) !important;\n  color: var(--cc-text-2) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] button:hover {\n  background: var(--cc-hover) !important;\n  color: var(--cc-text) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] :is(h1, h2, h3, [class*=\"groupLabel\"], [class*=\"sectionTitle\"], [class*=\"workspacesLabel\"]) {\n  color: var(--cc-text-3) !important;\n  font-size: 12px !important;\n  font-weight: 500 !important;\n  letter-spacing: 0.01em !important;\n  text-transform: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] [role=\"treeitem\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] [data-row-key] {\n  border-radius: var(--cc-radius-control) !important;\n  font-size: 13px !important;\n  color: var(--cc-text-2) !important;\n  min-height: 28px !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] [role=\"treeitem\"]:hover,\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] [data-row-key]:hover {\n  background: var(--cc-hover) !important;\n  color: var(--cc-text) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] [role=\"treeitem\"][aria-selected=\"true\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] [role=\"treeitem\"][data-active=\"true\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] [class*=\"sessionRow\"][class*=\"selected\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] [class*=\"sessionRow\"][class*=\"Active\"] {\n  background: var(--cc-active) !important;\n  color: var(--cc-text) !important;\n  box-shadow: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] :is([class*=\"time\"], [class*=\"Time\"], [class*=\"meta\"]) {\n  color: var(--cc-text-3) !important;\n  font-size: 11px !important;\n}\n\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.header\"],\nhtml[data-dsh-cc-skin] body header {\n  background: var(--cc-bg) !important;\n  border-bottom: 1px solid var(--cc-line-soft) !important;\n}\nhtml[data-dsh-cc-skin] body [data-conversation-header-leading],\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.session.header\"] {\n  color: var(--cc-text) !important;\n  font-size: 13.5px !important;\n  font-weight: 500 !important;\n}\nhtml[data-dsh-cc-skin] body [data-conversation-header-leading] button,\nhtml[data-dsh-cc-skin] body [data-conversation-header-corner] button,\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.header\"] button {\n  color: var(--cc-text-2) !important;\n  border-radius: var(--cc-radius-control) !important;\n}\nhtml[data-dsh-cc-skin] body [role=\"tablist\"] button {\n  background: transparent !important;\n  color: var(--cc-text-3) !important;\n  font-size: 13px !important;\n  border-radius: 0 !important;\n  box-shadow: inset 0 -2px 0 transparent !important;\n}\nhtml[data-dsh-cc-skin] body [role=\"tablist\"] button[aria-selected=\"true\"] {\n  color: var(--cc-text) !important;\n  box-shadow: inset 0 -2px 0 var(--cc-text) !important;\n}\n\n/* ==========================================================================\n   4. Conversation\n   ========================================================================== */\n\nhtml[data-dsh-cc-skin] body [data-chat-flow] {\n  font-size: 14px !important;\n  line-height: 1.7 !important;\n}\n\n/* User turn: the soft right-aligned bubble. */\nhtml[data-dsh-cc-skin] body [data-chat-flow-kind=\"user\"] [class*=\"bubble\"] {\n  background: var(--cc-bubble) !important;\n  border: 0 !important;\n  border-radius: 14px !important;\n  padding: 10px 14px !important;\n  box-shadow: none !important;\n  color: var(--cc-text) !important;\n  font-size: 14px !important;\n  line-height: 1.65 !important;\n}\nhtml[data-dsh-cc-skin] body [data-chat-flow-kind=\"user\"] [class*=\"_actions\"] {\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\nhtml[data-dsh-cc-skin] body [data-chat-flow-kind=\"user\"]:hover [class*=\"_actions\"] {\n  opacity: 1;\n}\nhtml[data-dsh-cc-skin] body [data-chat-flow-kind=\"user\"] :is([class*=\"timeStart\"], [class*=\"timeEnd\"]) {\n  color: var(--cc-text-3) !important;\n  font-size: 11px !important;\n}\n\n/* Assistant text. */\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] {\n  color: var(--cc-text) !important;\n  font-size: 14px !important;\n  line-height: 1.72 !important;\n  font-family: var(--cc-sans) !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] :is(h1, h2, h3, h4) {\n  color: var(--cc-text) !important;\n  font-family: var(--cc-sans) !important;\n  font-weight: 600 !important;\n  letter-spacing: -0.01em !important;\n  margin: 1.2em 0 0.5em !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] h1 {\n  font-size: 18px !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] h2 {\n  font-size: 16px !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] h3 {\n  font-size: 15px !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] :is(ul, ol) {\n  padding-left: 1.5em !important;\n  margin: 0.55em 0 !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] li {\n  margin: 0.2em 0 !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] li::marker {\n  color: var(--cc-text-3) !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] a {\n  color: var(--cc-accent) !important;\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] :not(pre) > code {\n  background: var(--cc-inset) !important;\n  border: 1px solid var(--cc-line) !important;\n  border-radius: 5px !important;\n  padding: 0.1em 0.35em !important;\n  font-family: var(--cc-mono) !important;\n  font-size: 12.5px !important;\n  color: var(--cc-text) !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] pre {\n  background: var(--cc-inset) !important;\n  border: 1px solid var(--cc-line) !important;\n  border-radius: 10px !important;\n  box-shadow: none !important;\n  padding: 12px 14px !important;\n  font-size: 12.5px !important;\n  line-height: 1.6 !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] pre code {\n  background: transparent !important;\n  border: 0 !important;\n  font-family: var(--cc-mono) !important;\n  font-size: 12.5px !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] blockquote {\n  border-left: 2px solid var(--cc-line-strong) !important;\n  background: transparent !important;\n  color: var(--cc-text-2) !important;\n  padding: 0 0 0 14px !important;\n  margin: 0.8em 0 !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] :is(th, td) {\n  border: 1px solid var(--cc-line) !important;\n  padding: 6px 12px !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] th {\n  background: var(--cc-card) !important;\n  font-weight: 600 !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_markdown_\"] hr {\n  border: 0 !important;\n  border-top: 1px solid var(--cc-line) !important;\n  margin: 1.2em 0 !important;\n}\n\n/* Thinking / process rows: a quiet label over an indented run. */\nhtml[data-dsh-cc-skin] body [data-step-process] > div > [class*=\"_title\"],\nhtml[data-dsh-cc-skin] body [data-step-process] [data-disclosure-header] {\n  background: transparent !important;\n  border: 0 !important;\n  padding: 2px 0 !important;\n  font-size: 13px !important;\n  color: var(--cc-text-3) !important;\n}\nhtml[data-dsh-cc-skin] body [data-step-process] [class*=\"_label\"] {\n  color: var(--cc-text-3) !important;\n  font-style: normal !important;\n}\nhtml[data-dsh-cc-skin] body [data-step-process-body] {\n  border-left: 2px solid var(--cc-line) !important;\n  border-radius: 0 !important;\n  margin: 2px 0 8px 4px !important;\n  padding: 2px 0 2px 14px !important;\n  background: transparent !important;\n  box-shadow: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-step-process] > div > [class*=\"_body\"] {\n  background: transparent !important;\n  border-radius: 0 !important;\n  box-shadow: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-step-process] [class*=\"activityIcon\"],\nhtml[data-dsh-cc-skin] body [data-step-process] [data-step-process-icon] {\n  color: var(--cc-text-3) !important;\n}\n\n/* Tool calls: a card per call, the command and its output on inset surfaces. */\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] > [data-tool] {\n  border: 1px solid var(--cc-line) !important;\n  border-radius: var(--cc-radius-card) !important;\n  background: transparent !important;\n  box-shadow: none !important;\n  padding: 2px !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [data-disclosure-row] {\n  border-radius: 8px !important;\n  min-height: 30px !important;\n  padding: 2px 6px !important;\n  color: var(--cc-text) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [data-disclosure-row]:hover {\n  background: var(--cc-hover) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"_title_\"] {\n  color: var(--cc-text) !important;\n  font-size: 13px !important;\n  font-weight: 500 !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"_summary\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"fileLink\"] {\n  color: var(--cc-text-2) !important;\n  font-size: 12.5px !important;\n  font-family: var(--cc-mono) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"_leading_\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"chevron\"] {\n  color: var(--cc-text-3) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"bodyWrap\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"terminalBody\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"ioCard\"] {\n  margin: 2px 0 0 !important;\n  border: 0 !important;\n  border-radius: 8px !important;\n  background: var(--cc-inset) !important;\n  box-shadow: none !important;\n  padding: 8px 10px !important;\n  font-family: var(--cc-mono) !important;\n  font-size: 12px !important;\n  color: var(--cc-text-2) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"_promptLine_\"] {\n  font-family: var(--cc-mono) !important;\n  font-size: 12px !important;\n  color: var(--cc-text) !important;\n  gap: 6px !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"_cwd_\"] {\n  color: var(--cc-text-3) !important;\n  font-size: 11px !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"_command_\"] {\n  font-family: var(--cc-mono) !important;\n  font-size: 12px !important;\n  color: var(--cc-text) !important;\n  white-space: pre-wrap !important;\n  word-break: break-word !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"_line_\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] pre {\n  font-family: var(--cc-mono) !important;\n  font-size: 12px !important;\n  line-height: 1.6 !important;\n  color: var(--cc-text-2) !important;\n  background: transparent !important;\n  border: 0 !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"_copyButton_\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"inspectButton\"] {\n  color: var(--cc-text-3) !important;\n  font-size: 11px !important;\n  background: transparent !important;\n  border: 0 !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] [class*=\"ioLabel\"] {\n  color: var(--cc-text-3) !important;\n  font-size: 11px !important;\n  letter-spacing: 0.02em;\n  text-transform: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"tool.call.toolview\"] img {\n  border-radius: 8px !important;\n  border: 1px solid var(--cc-line) !important;\n}\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"] {\n  background: transparent !important;\n  border: 0 !important;\n}\n\n/* Running indicator. */\nhtml[data-dsh-cc-skin] body [data-chat-running] {\n  color: var(--cc-text-3) !important;\n  font-size: 13px !important;\n}\nhtml[data-dsh-cc-skin] body [data-chat-running] [class*=\"runningDivider\"] {\n  background: var(--cc-line) !important;\n}\n\n/* Turn tail: the changed-files / delivery cards. */\nhtml[data-dsh-cc-skin] body [class*=\"deliverable\"] [class*=\"_card\"],\nhtml[data-dsh-cc-skin] body [class*=\"changeCard\"],\nhtml[data-dsh-cc-skin] body [class*=\"turnTail\"] > * {\n  background: transparent !important;\n  border: 1px solid var(--cc-line) !important;\n  border-radius: var(--cc-radius-card) !important;\n  box-shadow: none !important;\n}\n\n/* ==========================================================================\n   5. Composer\n   ========================================================================== */\n\nhtml[data-dsh-cc-skin] body [data-composer-card] {\n  background: var(--cc-elev) !important;\n  border: 1px solid var(--cc-line) !important;\n  border-radius: var(--cc-radius-input) !important;\n  box-shadow: var(--cc-shadow) !important;\n  padding: 6px 2px 2px !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-card]:focus-within {\n  border-color: var(--cc-line-strong) !important;\n  box-shadow: var(--cc-shadow) !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-input],\nhtml[data-dsh-cc-skin] body [data-composer-placeholder] {\n  color: var(--cc-text) !important;\n  font-family: var(--cc-sans) !important;\n  font-size: 14px !important;\n  line-height: 1.6 !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-placeholder] {\n  color: var(--cc-text-3) !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-card] [class*=\"_row\"] {\n  border-top: 0 !important;\n  padding: 4px 8px 6px !important;\n  margin-top: 0 !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-card] [class*=\"_row\"] button {\n  border-radius: var(--cc-radius-control) !important;\n  color: var(--cc-text-2) !important;\n  font-size: 12.5px !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-card] [class*=\"_row\"] button:hover {\n  background: var(--cc-hover) !important;\n  color: var(--cc-text) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.input.model\"] button,\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.input.model\"] [class*=\"triggerLabel\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.input.permission\"] button {\n  color: var(--cc-text-2) !important;\n  font-size: 12.5px !important;\n  text-transform: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-card] [class*=\"_trailing\"] > div > button,\nhtml[data-dsh-cc-skin] body [data-composer-card] button[aria-label*=\"发送\"],\nhtml[data-dsh-cc-skin] body [data-composer-card] button[aria-label*=\"停止\"] {\n  border-radius: 999px !important;\n  box-shadow: none !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_add_\"] {\n  color: var(--cc-text-2) !important;\n  border-radius: 999px !important;\n}\n/* The status line under the box stays quiet. */\nhtml[data-dsh-cc-skin] body [data-composer-dock] {\n  font-size: 11.5px !important;\n  color: var(--cc-text-3) !important;\n  gap: 2px !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-dock] [class*=\"_pill\"] {\n  background: transparent !important;\n  border: 0 !important;\n  border-radius: 0 !important;\n  padding: 0 6px !important;\n  font-size: 11.5px !important;\n  color: var(--cc-text-3) !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-dock] [class*=\"_pill\"]:hover {\n  color: var(--cc-text-2) !important;\n  background: transparent !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-dock] svg {\n  display: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-dock] * {\n  font-size: 11.5px !important;\n}\n\n/* Workspace / preset chips above the composer. */\nhtml[data-dsh-cc-skin] body [class*=\"heroWorkspaceRow\"] button,\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.hero.agentPreset\"] button,\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.hero.options\"] button {\n  border: 1px solid var(--cc-line) !important;\n  border-radius: 999px !important;\n  background: var(--cc-elev) !important;\n  color: var(--cc-text-2) !important;\n  font-size: 12px !important;\n  padding: 3px 10px !important;\n  height: auto !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"heroWorkspaceRow\"] button:hover {\n  background: var(--cc-hover) !important;\n  color: var(--cc-text) !important;\n}\n\n/* ==========================================================================\n   6. Right sidebar\n   ========================================================================== */\n\nhtml[data-dsh-cc-skin] body [data-sidebar-right-panel],\nhtml[data-dsh-cc-skin] body [data-slot=\"rightbar\"] > * {\n  background: var(--cc-panel) !important;\n  border-left: 1px solid var(--cc-line) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"rightbar\"],\nhtml[data-dsh-cc-skin] body [data-slot=\"rightbar.session\"] {\n  font-size: 13px !important;\n  color: var(--cc-text-2) !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"rightbar\"] :is(h1, h2, h3, h4, [class*=\"sectionTitle\"], [class*=\"panelTitle\"]) {\n  color: var(--cc-text) !important;\n  font-size: 13px !important;\n  font-weight: 600 !important;\n  letter-spacing: 0 !important;\n  text-transform: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"rightbar\"] button {\n  border-radius: var(--cc-radius-control) !important;\n  color: var(--cc-text-2) !important;\n  font-size: 12.5px !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"rightbar\"] button:hover {\n  background: var(--cc-hover) !important;\n  color: var(--cc-text) !important;\n}\n\n/* ==========================================================================\n   7. Overlays\n   ========================================================================== */\n\nhtml[data-dsh-cc-skin] body :is([role=\"menu\"], [role=\"listbox\"], [class*=\"MenuSurface\"]) {\n  background: var(--cc-elev) !important;\n  border: 1px solid var(--cc-line) !important;\n  border-radius: 10px !important;\n  box-shadow: var(--cc-shadow-lg) !important;\n  padding: 4px !important;\n}\nhtml[data-dsh-cc-skin] body :is([role=\"menuitem\"], [role=\"option\"]) {\n  border-radius: 6px !important;\n  font-size: 13px !important;\n  color: var(--cc-text-2) !important;\n}\nhtml[data-dsh-cc-skin] body :is([role=\"menuitem\"], [role=\"option\"]):hover,\nhtml[data-dsh-cc-skin] body [role=\"option\"][aria-selected=\"true\"] {\n  background: var(--cc-hover) !important;\n  color: var(--cc-text) !important;\n}\nhtml[data-dsh-cc-skin] body [role=\"dialog\"] {\n  background: var(--cc-elev) !important;\n  border: 1px solid var(--cc-line) !important;\n  border-radius: 14px !important;\n  box-shadow: var(--cc-shadow-lg) !important;\n}\nhtml[data-dsh-cc-skin] body [role=\"dialog\"] :is(h1, h2, h3) {\n  color: var(--cc-text) !important;\n  font-size: 15px !important;\n  font-weight: 600 !important;\n  letter-spacing: -0.01em !important;\n}\nhtml[data-dsh-cc-skin] body [role=\"dialog\"] :is(p, li) {\n  color: var(--cc-text-2) !important;\n  font-size: 13px !important;\n  line-height: 1.7 !important;\n}\nhtml[data-dsh-cc-skin] body [class*=\"_tag_\"],\nhtml[data-dsh-cc-skin] body [class*=\"chip\"],\nhtml[data-dsh-cc-skin] body [class*=\"pill\"] {\n  border-radius: 999px !important;\n  background: var(--cc-badge) !important;\n  border: 0 !important;\n  color: var(--cc-text-2) !important;\n  font-size: 11px !important;\n  text-transform: none !important;\n  letter-spacing: 0 !important;\n}\nhtml[data-dsh-cc-skin] body button {\n  border-radius: var(--cc-radius-control) !important;\n  box-shadow: none !important;\n}\nhtml[data-dsh-cc-skin] body :is(kbd, [class*=\"keycap\"]) {\n  background: var(--cc-inset) !important;\n  border: 1px solid var(--cc-line) !important;\n  border-radius: 5px !important;\n  box-shadow: none !important;\n  color: var(--cc-text-2) !important;\n  font-size: 10.5px !important;\n}\n\n/* ==========================================================================\n   8. Hero: greeting and the usage overview card\n   ========================================================================== */\n\n/* The stock headline is replaced by the greeting our block renders. */\nhtml[data-dsh-cc-skin] body :has(> [data-cc-hero]) > [class*=\"headline\"] {\n  display: none !important;\n}\n\nhtml[data-dsh-cc-skin] .cc-hero {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  gap: 0;\n  padding: 4px 0 0;\n}\n\nhtml[data-dsh-cc-skin] .cc-greeting {\n  margin: 0;\n  color: var(--cc-text);\n  font-family: var(--cc-serif);\n  font-size: 27px;\n  font-weight: 400;\n  letter-spacing: -0.01em;\n  line-height: 1.25;\n  text-align: center;\n}\n\nhtml[data-dsh-cc-skin] .cc-sub {\n  margin: 8px 0 0;\n  color: var(--cc-text-2);\n  font-family: var(--cc-sans);\n  font-size: 13.5px;\n  text-align: center;\n}\n\nhtml[data-dsh-cc-skin] .cc-card {\n  width: min(660px, calc(100% - 8px));\n  margin-top: 22px;\n  padding: 14px;\n  border: 1px solid var(--cc-line);\n  border-radius: var(--cc-radius-card);\n  background: var(--cc-card);\n  box-shadow: var(--cc-shadow);\n  font-family: var(--cc-sans);\n  box-sizing: border-box;\n}\n\nhtml[data-dsh-cc-skin] .cc-card-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  margin-bottom: 10px;\n}\n\nhtml[data-dsh-cc-skin] .cc-tabs {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  padding: 2px;\n  border-radius: 8px;\n  background: var(--cc-tabbar);\n}\n\nhtml[data-dsh-cc-skin] .cc-tabs-end {\n  background: transparent;\n  padding: 0;\n}\n\nhtml[data-dsh-cc-skin] .cc-seg {\n  appearance: none;\n  border: 0;\n  background: transparent;\n  color: var(--cc-text-2);\n  font-family: var(--cc-sans);\n  font-size: 12px;\n  line-height: 1;\n  padding: 5px 10px;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: background-color 120ms ease, color 120ms ease;\n}\n\nhtml[data-dsh-cc-skin] .cc-seg:hover {\n  color: var(--cc-text);\n}\n\nhtml[data-dsh-cc-skin] .cc-seg.is-on {\n  background: var(--cc-elev);\n  color: var(--cc-text);\n  box-shadow: var(--cc-shadow);\n}\n\nhtml[data-dsh-cc-skin] .cc-grid {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 6px;\n  min-height: 92px;\n}\n\nhtml[data-dsh-cc-skin] .cc-tile {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 9px 10px;\n  border-radius: 8px;\n  background: var(--cc-tile);\n}\n\nhtml[data-dsh-cc-skin] .cc-tile-k {\n  color: var(--cc-text-3);\n  font-size: 11px;\n  line-height: 1.2;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nhtml[data-dsh-cc-skin] .cc-tile-v {\n  color: var(--cc-text);\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 1.25;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nhtml[data-dsh-cc-skin] .cc-models {\n  grid-column: 1 / -1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\nhtml[data-dsh-cc-skin] .cc-model-row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  gap: 12px;\n  align-items: center;\n  padding: 7px 10px;\n  border-radius: 8px;\n  background: var(--cc-tile);\n  font-size: 12.5px;\n}\n\nhtml[data-dsh-cc-skin] .cc-model-name {\n  color: var(--cc-text);\n  font-weight: 500;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\nhtml[data-dsh-cc-skin] .cc-model-meta,\nhtml[data-dsh-cc-skin] .cc-model-tokens {\n  color: var(--cc-text-3);\n  font-variant-numeric: tabular-nums;\n}\n\nhtml[data-dsh-cc-skin] .cc-empty {\n  grid-column: 1 / -1;\n  margin: 0;\n  padding: 28px 10px;\n  color: var(--cc-text-3);\n  font-size: 12.5px;\n  text-align: center;\n}\n\nhtml[data-dsh-cc-skin] .cc-heat {\n  display: grid;\n  grid-auto-flow: column;\n  grid-template-rows: repeat(7, 10px);\n  gap: 3px;\n  margin-top: 12px;\n  overflow: hidden;\n}\n\nhtml[data-dsh-cc-skin] .cc-heat-cell {\n  width: 10px;\n  height: 10px;\n  border-radius: 2px;\n  background: var(--cc-heat-0);\n}\n\nhtml[data-dsh-cc-skin] .cc-heat-cell.is-1 {\n  background: var(--cc-heat-1);\n}\nhtml[data-dsh-cc-skin] .cc-heat-cell.is-2 {\n  background: var(--cc-heat-2);\n}\nhtml[data-dsh-cc-skin] .cc-heat-cell.is-3 {\n  background: var(--cc-heat-3);\n}\n\n/* A ring rather than a colour change: the cell still has to read as its level.\n   The ring is inset because the grid is `overflow: hidden` — an outline drawn\n   outside the box is clipped for the cells on the grid's outer edge. */\nhtml[data-dsh-cc-skin] .cc-heat-cell:hover,\nhtml[data-dsh-cc-skin] .cc-heat-cell:focus-visible {\n  outline: none;\n  box-shadow: inset 0 0 0 1px var(--cc-text-3);\n}\n\nhtml[data-dsh-cc-skin] .cc-heat-cell[tabindex]:hover,\nhtml[data-dsh-cc-skin] .cc-heat-cell[tabindex]:focus-visible {\n  box-shadow: inset 0 0 0 1px var(--cc-text);\n  cursor: pointer;\n}\n\n/* The per-day readout. One node for the whole grid, parked on <body> and\n   positioned by script, so it escapes the card's clipping and the heat grid's\n   `overflow: hidden`. */\nhtml[data-dsh-cc-skin] .cc-heat-tip {\n  position: fixed;\n  z-index: 9999;\n  display: none;\n  box-sizing: border-box;\n  padding: 7px 9px;\n  border: 1px solid var(--cc-line);\n  border-radius: 8px;\n  background: var(--cc-elev);\n  color: var(--cc-text);\n  box-shadow: var(--cc-shadow-lg);\n  font-family: var(--cc-sans);\n  font-size: 12px;\n  line-height: 1.45;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n  pointer-events: none;\n}\n\nhtml[data-dsh-cc-skin] .cc-heat-tip.is-on {\n  display: block;\n}\n\nhtml[data-dsh-cc-skin] .cc-heat-tip > * {\n  display: block;\n}\n\nhtml[data-dsh-cc-skin] .cc-heat-tip-day {\n  color: var(--cc-text-3);\n  font-size: 11px;\n}\n\nhtml[data-dsh-cc-skin] .cc-heat-tip-tokens {\n  margin-top: 1px;\n  font-size: 13px;\n  font-weight: 600;\n}\n\nhtml[data-dsh-cc-skin] .cc-heat-tip-meta,\nhtml[data-dsh-cc-skin] .cc-heat-tip-none {\n  margin-top: 1px;\n  color: var(--cc-text-3);\n  font-size: 11px;\n}\n\nhtml[data-dsh-cc-skin] .cc-foot {\n  margin: 12px 0 0;\n  color: var(--cc-text-3);\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n/* --------------------------------------------------------------------------\n   Final touch-ups that belong with the shell rather than the card\n   -------------------------------------------------------------------------- */\n\n/* Flat sidebar action: the stock primary button is a bordered box, which reads\n   as a second frame inside the column. */\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] button[class*=\"newSession\"] {\n  background: transparent !important;\n  border: 1px solid transparent !important;\n  color: var(--cc-text) !important;\n  font-weight: 500 !important;\n  justify-content: flex-start !important;\n  box-shadow: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-slot=\"sidebar\"] button[class*=\"newSession\"]:hover {\n  background: var(--cc-hover) !important;\n}\n\n/* The hero composer keeps the card width, not the column width. */\nhtml[data-dsh-cc-skin] body [class*=\"composerHero\"] {\n  width: min(760px, calc(100% - 32px)) !important;\n  margin-left: auto !important;\n  margin-right: auto !important;\n}\n\n/* The release badge on the model label is product chrome, not part of the look. */\nhtml[data-dsh-cc-skin] body [data-slot=\"conversation.input.model.label\"] [class*=\"_tag_\"] {\n  display: none !important;\n}\n\n/* The send control: a neutral filled circle instead of the blue accent. */\nhtml[data-dsh-cc-skin] body [data-composer-card] button[class*=\"primary\"] {\n  background: var(--cc-text) !important;\n  background-image: none !important;\n  border: 0 !important;\n  color: var(--cc-bg) !important;\n  border-radius: 999px !important;\n  box-shadow: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-composer-card] button[class*=\"primary\"]:hover {\n  background: var(--cc-text-2) !important;\n}\n\n/* Reasoning previews are quiet text, never a card. */\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"],\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"] * {\n  background: transparent !important;\n  box-shadow: none !important;\n}\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"],\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"] > *,\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"] [class*=\"_root_\"] {\n  border: 0 !important;\n  border-radius: 0 !important;\n}\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"] [data-disclosure-row] {\n  border-left: 2px solid var(--cc-line) !important;\n  border-radius: 0 !important;\n  padding-left: 12px !important;\n  color: var(--cc-text-3) !important;\n  font-size: 13px !important;\n}\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"] [class*=\"_title_\"] {\n  color: var(--cc-text-3) !important;\n  font-style: normal !important;\n}\nhtml[data-dsh-cc-skin] body [data-variant=\"think\"] button {\n  background: transparent !important;\n  border: 0 !important;\n  color: var(--cc-text-3) !important;\n}\n\n/* The chosen range keeps a hairline, as in the reference. */\nhtml[data-dsh-cc-skin] .cc-seg.is-on {\n  box-shadow: inset 0 0 0 1px var(--cc-line), var(--cc-shadow);\n}\n\n/* Heat cells keep their square ratio while the grid fills the card. */\nhtml[data-dsh-cc-skin] .cc-heat {\n  grid-template-rows: repeat(7, auto);\n  grid-auto-columns: 1fr;\n  gap: 3px;\n}\nhtml[data-dsh-cc-skin] .cc-heat-cell {\n  width: 100%;\n  height: auto;\n  aspect-ratio: 1;\n}\n\n/* A collapsed right sidebar must not keep its width. The stock panel keeps its\n   inline width while the shell marks it collapsed (aria-hidden), which leaves a\n   full-width empty box on screen with its own controls pushed out of view. */\nhtml[data-dsh-cc-skin] body [data-rightbar-collapsed=\"true\"] [data-sidebar-right-panel] {\n  display: none !important;\n}\n\n/* ==========================================================================\n   9. Motion preferences\n   ========================================================================== */\n\n@media (prefers-reduced-motion: reduce) {\n  html[data-dsh-cc-skin] .cc-seg {\n    transition: none;\n  }\n}\n";
		/**
		 * Browser half of dsh-plugin-claude-code-skin.
		 *
		 * Two jobs:
		 *   1. paint the skin: one plugin-owned stylesheet scoped by
		 *      `html[data-dsh-cc-skin]`, plus the hero surface the stock shell leaves
		 *      empty (greeting + usage overview card);
		 *   2. read the usage summary this package's host half serves at
		 *      `/claude-code-skin/usage` and render it.
		 *
		 * The build step wraps this file together with src/skin.css into the lazy-CJS
		 * bundle the client module system expects: running the bundle only registers a
		 * factory, and `apply` runs when the plugin materializes.
		 */

		const PLUGIN_ID = "dsh-plugin-claude-code-skin";
		const STYLE_KEY = `${PLUGIN_ID}/skin.css`;
		const ROOT_ATTRIBUTE = "data-dsh-cc-skin";
		const USAGE_URL = "claude-code-skin/usage";
		const GATSBY_TOKENS = 120_000;
		const HEAT_DAYS = 287;

		/**
		 * Mount the skin. `ctx.effect` re-runs on reload and disposes on unload, so
		 * disabling the plugin returns the GUI to the stock theme without a refresh.
		 * @param ctx - client plugin context.
		 */
		function apply(ctx) {
		  ctx.effect(() => {
		    const root = document.documentElement;
		    const previous = root.getAttribute(ROOT_ATTRIBUTE);
		    root.setAttribute(ROOT_ATTRIBUTE, "");

		    for (const stale of document.querySelectorAll(`style[data-plugin-css="${STYLE_KEY}"]`)) stale.remove();
		    const style = document.createElement("style");
		    style.dataset.plugin = PLUGIN_ID;
		    style.dataset.pluginCss = STYLE_KEY;
		    style.textContent = CSS;
		    document.head.appendChild(style);

		    const disposeHero = mountHero();
		    const disposeTitle = decorateTitle();

		    return () => {
		      disposeHero();
		      disposeTitle();
		      style.remove();
		      if (previous === null) root.removeAttribute(ROOT_ATTRIBUTE);
		      else root.setAttribute(ROOT_ATTRIBUTE, previous);
		    };
		  }, `${PLUGIN_ID}: skin stylesheet`);
		}

		/** No service is required: the skin paints the DOM and reads one local route. */
		const inject = [];

		/**
		 * Keep the Claude Code mark on the window title while the skin is mounted.
		 * @returns disposer restoring the plain title.
		 */
		function decorateTitle() {
		  const paint = () => {
		    const current = document.title;
		    if (current.length > 0 && !current.startsWith("✻")) document.title = `✻ ${current}`;
		  };
		  paint();
		  const observer = new MutationObserver(paint);
		  const title = document.querySelector("title");
		  if (title) observer.observe(title, { childList: true, characterData: true, subtree: true });
		  return () => {
		    observer.disconnect();
		    document.title = document.title.replace(/^✻\s*/u, "");
		  };
		}

		/* -------------------------------------------------------------------------- */
		/* hero surface                                                               */
		/* -------------------------------------------------------------------------- */

		const HERO_ATTR = "data-cc-hero";

		/**
		 * Build one element with a class, optional text, and attributes.
		 * @param {string} tag - tag name.
		 * @param {string} className - class list.
		 * @param {string} [text] - text content.
		 * @returns {HTMLElement} the element.
		 */
		function h(tag, className, text) {
		  const node = document.createElement(tag);
		  if (className !== "") node.className = className;
		  if (text !== undefined) node.textContent = text;
		  return node;
		}

		function compact(value) {
		  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
		  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
		}

		const EXACT = new Intl.NumberFormat("en-US");
		const DAY_FORMAT = new Intl.DateTimeFormat("en-US", {
		  weekday: "short",
		  month: "short",
		  day: "numeric",
		  year: "numeric",
		});

		/** Grouped digits: a tooltip has room to show the exact number. */
		function exact(value) {
		  return Number.isFinite(value) ? EXACT.format(value) : "—";
		}

		function plural(count, word) {
		  return `${String(count)} ${word}${count === 1 ? "" : "s"}`;
		}

		/** `2026-11-18` → `Wed, Nov 18, 2026`; falls back to the raw key. */
		function dayLabel(key) {
		  const ms = Date.parse(`${String(key)}T00:00:00`);
		  return Number.isFinite(ms) ? DAY_FORMAT.format(ms) : String(key);
		}

		function dayKey(ms) {
		  const date = new Date(ms);
		  return `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		}

		function streakOf(days) {
		  if (days.length === 0) return { current: 0, longest: 0 };
		  const sorted = [...days].sort();
		  let longest = 1;
		  let run = 1;
		  for (let index = 1; index < sorted.length; index += 1) {
		    const previous = Date.parse(`${sorted[index - 1]}T00:00:00`);
		    const current = Date.parse(`${sorted[index]}T00:00:00`);
		    if (current - previous === 86_400_000) {
		      run += 1;
		      longest = Math.max(longest, run);
		    } else run = 1;
		  }
		  const today = dayKey(Date.now());
		  const yesterday = dayKey(Date.now() - 86_400_000);
		  const last = sorted[sorted.length - 1];
		  if (last !== today && last !== yesterday) return { current: 0, longest };
		  let current = 1;
		  for (let index = sorted.length - 1; index > 0; index -= 1) {
		    const gap = Date.parse(`${sorted[index]}T00:00:00`) - Date.parse(`${sorted[index - 1]}T00:00:00`);
		    if (gap !== 86_400_000) break;
		    current += 1;
		  }
		  return { current, longest };
		}

		function hourLabel(hour) {
		  if (hour === null || hour === undefined) return "—";
		  if (hour === 0) return "12AM";
		  if (hour < 12) return `${String(hour)}AM`;
		  if (hour === 12) return "12PM";
		  return `${String(hour - 12)}PM`;
		}

		function accountName() {
		  // The account control lives in the shell's settings launcher row.
		  const launcher = document.querySelector('[data-slot="settings.launcher"]');
		  const scopes = launcher === null ? [document.querySelector('[data-slot="sidebar"]')] : [launcher];
		  for (const scope of scopes) {
		    if (scope === null) continue;
		    const raw = (scope.textContent ?? "").trim();
		    const name = raw.split(/[·•|]/u)[0].trim();
		    if (name.length > 0 && name.length < 40) return name;
		  }
		  return "";
		}

		/**
		 * Own the hero surface: wait for the stock hero, keep our block inside it, and
		 * paint the greeting plus the usage overview.
		 * @returns disposer removing the block and listeners.
		 */
		function mountHero() {
		  /** @type {HTMLElement|null} */
		  let host = null;
		  /** @type {HTMLElement|null} */
		  let block = null;
		  /** @type {{ tab: "overview"|"models", range: "all"|"30d"|"7d" }} */
		  const state = { tab: "overview", range: "all" };
		  /** @type {object|null} */
		  let usage = null;
		  let loading = false;
		  let disposed = false;
		  /** @type {HTMLElement|null} one tooltip for the whole card, parked on <body>. */
		  let tip = null;

		  const heroHost = () => {
		    const mark = document.querySelector('[data-slot="conversation.hero.brand.mark"]');
		    if (mark === null) return null;
		    const headline = mark.closest('[class*="headline"]') ?? mark.parentElement;
		    const stack = headline?.parentElement ?? null;
		    if (stack === null) return null;
		    const body = [...stack.children].find((child) => child !== headline);
		    if (body === undefined || body === null) return null;
		    body.setAttribute(HERO_ATTR, "");
		    return body;
		  };

		  const load = () => {
		    if (loading) return;
		    loading = true;
		    fetch(new URL(USAGE_URL, document.baseURI), { credentials: "same-origin", cache: "no-store" })
		      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${String(response.status)}`))))
		      .then((payload) => {
		        if (disposed) return;
		        usage = payload;
		        loading = false;
		        render();
		      })
		      .catch(() => {
		        if (disposed) return;
		        usage = null;
		        loading = false;
		        render();
		      });
		  };

		  const windowRows = () => {
		    const rows = Array.isArray(usage?.sessions) ? usage.sessions : [];
		    if (state.range === "all") return rows;
		    const days = state.range === "7d" ? 7 : 30;
		    const from = Date.now() - days * 86_400_000;
		    return rows.filter((row) => Number(row.createdAt) >= from);
		  };

		  const summaryOf = (rows) => {
		    const days = new Set();
		    const byHour = new Map();
		    const byModel = new Map();
		    let messages = 0;
		    let tokens = 0;
		    let cacheRead = 0;
		    for (const row of rows) {
		      messages += Number(row.messages ?? 0);
		      tokens += Number(row.tokens ?? 0);
		      cacheRead += Number(row.cacheReadTokens ?? 0);
		      days.add(dayKey(Number(row.createdAt)));
		      const hour = new Date(Number(row.createdAt)).getHours();
		      byHour.set(hour, (byHour.get(hour) ?? 0) + 1);
		      if (typeof row.model === "string" && row.model.length > 0) {
		        const entry = byModel.get(row.model) ?? { model: row.model, sessions: 0, tokens: 0 };
		        entry.sessions += 1;
		        entry.tokens += Number(row.tokens ?? 0);
		        byModel.set(row.model, entry);
		      }
		    }
		    const streak = streakOf([...days]);
		    let peakHour = null;
		    let peak = 0;
		    for (const [hour, count] of byHour) {
		      if (count > peak || (count === peak && peakHour !== null && hour < peakHour)) {
		        peakHour = hour;
		        peak = count;
		      }
		    }
		    let favorite = null;
		    let favoriteCount = 0;
		    let models = [];
		    for (const entry of byModel.values()) {
		      if (entry.sessions > favoriteCount) {
		        favorite = entry.model;
		        favoriteCount = entry.sessions;
		      }
		      models.push(entry);
		    }
		    models = models.sort((a, b) => b.tokens - a.tokens);
		    return {
		      sessions: rows.length,
		      messages,
		      tokens,
		      cacheRead,
		      activeDays: days.size,
		      currentStreak: streak.current,
		      longestStreak: streak.longest,
		      peakHour,
		      favorite,
		      models,
		      days,
		    };
		  };

		  const segment = (label, active, onClick) => {
		    const button = h("button", `cc-seg${active ? " is-on" : ""}`, label);
		    button.type = "button";
		    button.addEventListener("click", (event) => {
		      event.preventDefault();
		      onClick();
		      render();
		    });
		    return button;
		  };

		  const buildSkeleton = () => {
		    const wrapper = h("div", "cc-hero");
		    wrapper.setAttribute("data-cc-hero-block", "");

		    const name = accountName();
		    const greeting = h("h1", "cc-greeting", name.length > 0 ? `What's up next, ${name}?` : "What's up next?");
		    const subtitle = h("p", "cc-sub", "Start a new session below");
		    const card = h("section", "cc-card");
		    card.setAttribute("aria-label", "Usage overview");
		    wrapper.append(greeting, subtitle, card);
		    return { wrapper, card };
		  };

		  const renderTiles = (grid, summary) => {
		    const tiles = [
		      ["Sessions", String(summary.sessions)],
		      ["Messages", String(summary.messages)],
		      ["Total tokens", compact(summary.tokens)],
		      ["Active days", String(summary.activeDays)],
		      ["Current streak", `${String(summary.currentStreak)}d`],
		      ["Longest streak", `${String(summary.longestStreak)}d`],
		      ["Peak hour", hourLabel(summary.peakHour)],
		      ["Favorite model", summary.favorite === null ? "—" : summary.favorite],
		    ];
		    grid.replaceChildren(
		      ...tiles.map(([key, value]) => {
		        const tile = h("div", "cc-tile");
		        tile.append(h("span", "cc-tile-k", key), h("span", "cc-tile-v", value));
		        return tile;
		      }),
		    );
		  };

		  const renderModels = (grid, summary) => {
		    if (summary.models.length === 0) {
		      grid.replaceChildren(h("p", "cc-empty", "No model usage recorded in this range."));
		      return;
		    }
		    const list = h("div", "cc-models");
		    for (const entry of summary.models.slice(0, 6)) {
		      const row = h("div", "cc-model-row");
		      row.append(
		        h("span", "cc-model-name", entry.model),
		        h("span", "cc-model-meta", `${String(entry.sessions)} sessions`),
		        h("span", "cc-model-tokens", compact(entry.tokens)),
		      );
		      list.append(row);
		    }
		    grid.replaceChildren(list);
		  };

		  const hideTip = () => {
		    if (tip !== null) tip.classList.remove("is-on");
		  };

		  /**
		   * Place the tooltip above the hovered cell, below it when the card sits near
		   * the top of the viewport, and inside the viewport horizontally.
		   * @param {HTMLElement} cell - the heat cell under the pointer or focus.
		   */
		  const showTip = (cell) => {
		    if (tip === null || !tip.isConnected) {
		      tip = h("div", "cc-heat-tip");
		      tip.setAttribute("aria-hidden", "true");
		      document.body.append(tip);
		    }
		    const sessions = Number(cell.dataset.sessions ?? 0);
		    const messages = Number(cell.dataset.messages ?? 0);
		    const tokens = Number(cell.dataset.tokens ?? 0);
		    const lines = [h("span", "cc-heat-tip-day", dayLabel(cell.dataset.day ?? ""))];
		    if (sessions === 0) {
		      lines.push(h("span", "cc-heat-tip-none", "No sessions recorded"));
		    } else {
		      const meta = messages > 0 ? `${plural(sessions, "session")} · ${plural(messages, "message")}` : plural(sessions, "session");
		      lines.push(h("strong", "cc-heat-tip-tokens", `${exact(tokens)} tokens`));
		      lines.push(h("span", "cc-heat-tip-meta", meta));
		    }
		    tip.replaceChildren(...lines);

		    tip.classList.add("is-on");
		    tip.style.visibility = "hidden";
		    tip.style.left = "-9999px";
		    tip.style.top = "0px";
		    const box = tip.getBoundingClientRect();
		    const rect = cell.getBoundingClientRect();
		    const margin = 8;
		    const gap = 6;
		    const limit = Math.max(margin, window.innerWidth - box.width - margin);
		    const left = Math.min(Math.max(margin, rect.left + rect.width / 2 - box.width / 2), limit);
		    let top = rect.top - box.height - gap;
		    if (top < margin) top = rect.bottom + gap;
		    top = Math.min(top, window.innerHeight - box.height - margin);
		    tip.style.left = `${String(Math.round(left))}px`;
		    tip.style.top = `${String(Math.round(Math.max(margin, top)))}px`;
		    tip.style.visibility = "";
		  };

		  const bindHeat = (container) => {
		    const cellOf = (target) => (target instanceof Element ? target.closest(".cc-heat-cell") : null);
		    container.addEventListener("mouseover", (event) => {
		      const cell = cellOf(event.target);
		      if (cell !== null && container.contains(cell)) showTip(cell);
		    });
		    container.addEventListener("mouseleave", hideTip);
		    container.addEventListener("focusin", (event) => {
		      const cell = cellOf(event.target);
		      if (cell !== null) showTip(cell);
		    });
		    container.addEventListener("focusout", hideTip);
		  };

		  const renderHeat = (container, rows) => {
		    const days = new Map();
		    for (const row of rows) {
		      const key = dayKey(Number(row.createdAt));
		      const entry = days.get(key) ?? { sessions: 0, messages: 0, tokens: 0 };
		      entry.sessions += 1;
		      entry.messages += Number(row.messages ?? 0);
		      entry.tokens += Number(row.tokens ?? 0);
		      days.set(key, entry);
		    }
		    const cells = [];
		    const today = new Date();
		    today.setHours(0, 0, 0, 0);
		    for (let offset = HEAT_DAYS - 1; offset >= 0; offset -= 1) {
		      const date = new Date(today.getTime() - offset * 86_400_000);
		      const key = dayKey(date.getTime());
		      const entry = days.get(key);
		      const count = entry?.sessions ?? 0;
		      const tokens = entry?.tokens ?? 0;
		      const messages = entry?.messages ?? 0;
		      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
		      const cell = h("span", `cc-heat-cell is-${String(level)}`);
		      cell.dataset.day = key;
		      cell.dataset.sessions = String(count);
		      cell.dataset.messages = String(messages);
		      cell.dataset.tokens = String(tokens);
		      if (count === 0) {
		        cell.setAttribute("aria-hidden", "true");
		      } else {
		        // Empty days carry no data, so only days with sessions enter the tab
		        // order. Both hover and focus open the same tooltip.
		        cell.tabIndex = 0;
		        cell.setAttribute("role", "img");
		        cell.setAttribute(
		          "aria-label",
		          `${dayLabel(key)}: ${exact(tokens)} tokens, ${plural(count, "session")}, ${plural(messages, "message")}`,
		        );
		      }
		      cells.push(cell);
		    }
		    container.replaceChildren(...cells);
		    bindHeat(container);
		  };

		  const renderFooter = (foot, summary) => {
		    if (usage === null) {
		      foot.textContent = "Usage summary unavailable — the host route could not be read.";
		      return;
		    }
		    const cached = summary.cacheRead;
		    const cacheNote = cached > 0 ? ` ${compact(cached)} tokens were served from the prompt cache.` : "";
		    if (summary.tokens >= GATSBY_TOKENS) {
		      const multiple = Math.round((summary.tokens / GATSBY_TOKENS) * 10) / 10;
		      foot.textContent = `Well past one Great Gatsby (=120K tokens): ${String(multiple)}× the novel.${cacheNote}`;
		      return;
		    }
		    const percent = Math.round((summary.tokens / GATSBY_TOKENS) * 100);
		    foot.textContent = `Not quite one Great Gatsby (=120K tokens) yet — ${String(percent)}% of the way there.${cacheNote}`;
		  };

		  function render() {
		    try {
		      paint();
		    } catch (error) {
		      window.__ccSkinError = String((error && error.stack) || error);
		    }
		  }

		  function paint() {
		    if (block === null || disposed) return;
		    const card = block.querySelector(".cc-card");
		    if (card === null) return;
		    hideTip();
		    const rows = windowRows();
		    const summary = summaryOf(rows);

		    const top = h("header", "cc-card-top");
		    const tabs = h("div", "cc-tabs");
		    tabs.append(
		      segment("Overview", state.tab === "overview", () => {
		        state.tab = "overview";
		      }),
		      segment("Models", state.tab === "models", () => {
		        state.tab = "models";
		      }),
		    );
		    const ranges = h("div", "cc-tabs cc-tabs-end");
		    ranges.append(
		      segment("All", state.range === "all", () => {
		        state.range = "all";
		      }),
		      segment("30d", state.range === "30d", () => {
		        state.range = "30d";
		      }),
		      segment("7d", state.range === "7d", () => {
		        state.range = "7d";
		      }),
		    );
		    top.append(tabs, ranges);

		    const grid = h("div", "cc-grid");
		    if (state.tab === "overview") renderTiles(grid, summary);
		    else renderModels(grid, summary);

		    const heat = h("div", "cc-heat");
		    heat.setAttribute("role", "group");
		    heat.setAttribute("aria-label", `Daily usage over the last ${String(HEAT_DAYS)} days`);
		    renderHeat(heat, rows);

		    const foot = h("p", "cc-foot");
		    renderFooter(foot, summary);

		    card.replaceChildren(top, grid, heat, foot);
		  }

		  const updateGreeting = () => {
		    if (block === null) return;
		    const greeting = block.querySelector(".cc-greeting");
		    if (greeting === null) return;
		    const name = accountName();
		    const text = name.length > 0 ? `What's up next, ${name}?` : "What's up next?";
		    if (greeting.textContent !== text) greeting.textContent = text;
		  };

		  const ensure = () => {
		    if (disposed) return;
		    const next = heroHost();
		    if (next === null) {
		      if (block !== null) {
		        block.remove();
		        block = null;
		        host = null;
		        hideTip();
		      }
		      return;
		    }
		    if (host === next && block !== null && block.isConnected) {
		      updateGreeting();
		      return;
		    }
		    host = next;
		    const built = buildSkeleton();
		    block = built.wrapper;
		    host.replaceChildren(block);
		    render();
		    load();
		  };

		  const onKeyDown = (event) => {
		    if (event.key === "Escape") hideTip();
		  };
		  const dismissTip = () => hideTip();
		  window.addEventListener("scroll", dismissTip, { capture: true, passive: true });
		  window.addEventListener("resize", dismissTip);
		  window.addEventListener("keydown", onKeyDown);

		  const timer = window.setInterval(ensure, 400);
		  const observer = new MutationObserver(ensure);
		  observer.observe(document.body, { childList: true, subtree: true });
		  ensure();

		  return () => {
		    disposed = true;
		    window.clearInterval(timer);
		    window.removeEventListener("scroll", dismissTip, { capture: true });
		    window.removeEventListener("resize", dismissTip);
		    window.removeEventListener("keydown", onKeyDown);
		    observer.disconnect();
		    block?.remove();
		    block = null;
		    host?.removeAttribute(HERO_ATTR);
		    host = null;
		    tip?.remove();
		    tip = null;
		  };
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
