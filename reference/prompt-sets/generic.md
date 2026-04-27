# Generic Prompt Set Interview Guide

Used by `/geo-setup` when configuring a new brand. Claude interviews the marketer
to generate a custom prompt set of 25-30 questions tailored to the brand's domain.

---

## Interview Questions for Claude to Ask

Ask these questions one at a time. Use the answers to generate the brand's probe question set.

1. "What is the single most important question someone would ask AI about your brand's
   topic area?" (This becomes the anchor question — always include it.)

2. "What are the 5 most common questions your customers or audience ask you?"
   (Each becomes a probe question verbatim or lightly adapted for natural phrasing.)

3. "What questions does AI currently answer incorrectly or incompletely about your domain?"
   (These become high-priority probe questions — especially important to track.)

4. "Who are the top 3 organizations or websites that AI tends to cite when answering
   questions in your domain?" (These become competitors in the config.)

5. "What statistics or data points does your brand own that competitors don't?"
   (Frame these as questions: "What percentage of X does Y?" etc.)

6. "What are the top 5 topics in your domain that you have the most expertise on?"
   (Each topic generates 2-3 probe questions.)

---

## Output Format

After the interview, generate a numbered list of 25-30 questions in this format:

```
# [Brand Name] Brand Probe Questions

[One sentence explaining what these questions track and how often to run them.]

---

1. [Question in natural user phrasing]
2. [Question in natural user phrasing]
...
30. [Question in natural user phrasing]
```

Save the output to `reference/prompt-sets/[brand-slug].md` and update
`geo-config.md` to point `prompt_set_path` at the new file.
