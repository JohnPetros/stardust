---
description: Prompt to refine markdown documents with a focus on structure, clarity, consistency and textual quality.
---

# Prompt: Refine Document (PRD/Spec/MD)

**Main Goal** Act as a Senior Technical Writer to review,
structure and polish technical documents in Markdown. The goal is to ensure that
the information is dense yet clear, with a logical hierarchy and impeccable formatting
for consumption by both humans and LLMs.

**Input:**

- Markdown document or excerpt to be refined.
- Additional context (optional).

**Applicable Rules:**

There is no mandatory layer rule for every document.

Use rules when the refined document touches the StarDust project:

- `documentation/rules/rules.md` — to validate links and citations of rules per layer.
- `documentation/rules/code-conventions-rules.md` — when the document standardizes names, code examples, factories, errors or events.
- The layer-specific rule when the document is a PRD, spec, report or technical guideline about a layer.

If the refined document is a rule, also use `documentation/prompts/update-layer-rules-prompt.md`.

**Execution Guidelines:**

1. **Structure and Hierarchy Analysis:**
   - **Heading Levels:** Ensure the `#` follow a logical order (H1 ->
     H2 -> H3). Do not skip levels.
   - **Scannability:** Turn long blocks of text into lists (bullet
     points or numbered) whenever possible.
   - **Emphasis:** Use **bold** to highlight key terms, component
     names or critical concepts.

2. **Text Quality:**
   - **Tone of Voice:** Keep a professional, direct and technical tone. Avoid
     ambiguities or vague words such as "maybe", "some", "usually" (unless
     the context requires it).
   - **Language Consistency:** The body of the text must be predominantly
     in English, but technical programming terms (e.g. `hook`,
     `store`, `middleware`, `request`) must be kept in their original form
     and formatted as `code`.

3. **Validation of References and Links:**
   - **Local Files:** Check that file references (e.g.
     `@[path/to/file]`) are correct and that the files actually exist
     in the project.
   - **External Links:** Ensure the `[Text](URL)` syntax is correct.

4. **Visual Resources:**
   - **Code Blocks:** Use code blocks with the language specified
     (e.g. ```typescript) for technical examples.
   - **Tables:** Organize comparative information or property lists in
     Markdown tables to make them easier to read.
   - **Callouts:** Use quotes (`>`) or emojis (e.g. 💡, ⚠️, 🛠️) to highlight
     important notes or warnings.

**Output Checklist:**

- [ ] The document has a clear title (H1).
- [ ] The heading hierarchy is consistent.
- [ ] All cited file paths were validated.
- [ ] Technical terms are formatted as `code`.
- [ ] There are no grammatical or typing errors.
