import type { Mcp, Tool } from '@stardust/core/global/interfaces'

const documentationComponentsGuide = `## Documentation Components Guide

This guide describes the components available for writing documentation on the platform, including usage examples and best practices.

---

## ⛔ Global Rules: Read Before Writing Any Documentation

### 1. Never nest text blocks
It is strictly forbidden to place one text block component inside another. Never place \`Text\`, \`Alert\`, \`Quote\`, or \`Code\` inside another \`Text\`, \`Alert\`, \`Quote\`, or \`Code\`.

### 2. Never use bold with **...**
It is strictly forbidden to use \`**...**\` inside any text block component such as \`Text\`, \`Alert\`, or \`Quote\`. This includes any attempt to emphasize terms, titles, or keywords inside these blocks. To highlight a term inside a block, use inline code with single backticks.

\`\`\`mdx
<Text>
  The returned value is always of type **text**.  ❌ WRONG
</Text>

<Text>
  The returned value is always of type \`text\`.   ✅ CORRECT
</Text>
\`\`\`

### 3. Never use Code for short references
To reference code inside a text paragraph, use inline code with single backticks instead of the \`Code\` component.

---

### Text

<Text>
  The \`Text\` component is the main block used to write paragraphs and descriptions. Use it to introduce concepts, explain behavior, and provide context for examples.
</Text>

**When to use:**
- Introductions and general explanations
- Descriptions of concepts and behaviors
- Context before or after code examples

**Example:**

\`\`\`mdx
<Text>
  Variables are structures that store a value in memory, and that value can change during program execution.
</Text>
\`\`\`

**Example of what NOT to do:**

\`\`\`mdx
<Text>
  Explanation about variables.
  <Alert>
    This is invalid!        ❌ block inside block
  </Alert>
</Text>

<Text>
  The returned value is always of type **text**.  ❌ bold is forbidden
</Text>
\`\`\`

---

### Alert

<Text>
  The \`Alert\` component is used to highlight important information, warnings, or observations that the reader should not ignore.
</Text>

**When to use:**
- Warnings about unexpected behavior
- Restrictions or limitations of a feature
- Critical observations about proper usage

**Example:**

\`\`\`mdx
<Alert>
  The value returned by \`leia()\` is always of type \`text\`. To use it as a number, apply conversion functions.
</Alert>
\`\`\`

---

### Quote

<Text>
  The \`Quote\` component is used to highlight definitions, rules, tips, or relevant statements.
</Text>

**When to use:**
- Short and direct definitions
- Language rules and conventions
- Tips and best practices
- Behavior summaries

**Example:**

\`\`\`mdx
<Quote>
  \`==\` → Equal to
</Quote>

<Quote>
  \`!=\` → Different from
</Quote>
\`\`\`

---

### Code

<Text>
  The \`Code\` component is used to display code blocks.
</Text>

**When to use:**
- Syntax examples
- Language declarations and expressions
- Illustrations of behavior and results

**Example:**

\`\`\`mdx
<Code>
var nome = 'Ítalo'
escreva("Olá, \${nome}!")
// Result: Olá, Ítalo!
</Code>
\`\`\`

---

### Combining components

<Text>
  Components should be combined to create a natural reading flow: introduce the concept with \`Text\`, highlight rules with \`Quote\` or \`Alert\`, and illustrate with \`Code\`.
</Text>

**Recommended structure example:**

\`\`\`mdx
<Text>
  The \`para\` loop iterates through a sequence based on three expressions: initializer, condition, and step.
</Text>

<Alert>
  Any of the three parts may be left blank.
</Alert>

<Quote>
  If the condition is omitted, the loop becomes infinite.
</Quote>

<Code>
para (var i = 0; i < 3; i++) {
  escreva(i)
}
// Result:
// 0
// 1
// 2
</Code>
\`\`\`

---

### Quick summary

| Component | Main usage |
|---|---|
| \`Text\` | Paragraphs, explanations, and context |
| \`Alert\` | Warnings, restrictions, and important observations |
| \`Quote\` | Definitions, rules, tips, and best practices |
| \`Code\` | Code examples |`

export class GetMdxBlocksGuideTool implements Tool {
  async handle(_: Mcp) {
    return {
      guide: documentationComponentsGuide,
    }
  }
}
