# JSON-LD Schema Templates

Copy the appropriate template into your page. Replace all [BRACKETED] values.
All templates use schema.org vocabulary. Validate at https://validator.schema.org.

---

## Organization (every brand's homepage/about page)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Brand Name]",
  "url": "[https://yourdomain.com]",
  "logo": "[https://yourdomain.com/logo.png]",
  "description": "[One sentence describing the brand and its primary value]",
  "foundingDate": "[YYYY]",
  "sameAs": [
    "https://www.wikidata.org/wiki/Q[QNUMBER]",
    "https://www.linkedin.com/company/[slug]",
    "https://www.crunchbase.com/organization/[slug]"
  ]
}
```

---

## Article (blog posts, how-to guides, general content)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Page title — matches H1]",
  "description": "[Meta description — 120-160 chars]",
  "author": {
    "@type": "Person",
    "name": "[Author Full Name]",
    "jobTitle": "[Title]",
    "sameAs": "[https://www.linkedin.com/in/author-slug]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[Brand Name]",
    "url": "[https://yourdomain.com]"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "mainEntityOfPage": "[https://yourdomain.com/this-page-url]"
}
```

---

## ScholarlyArticle (research reports, data-backed content)

```json
{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "headline": "[Report Title]",
  "abstract": "[200-word public summary of findings]",
  "author": {
    "@type": "Person",
    "name": "[Researcher Name]",
    "sameAs": "https://orcid.org/[ORCID-ID]"
  },
  "publisher": {
    "@type": "ResearchOrganization",
    "name": "[Brand Name]",
    "url": "[https://yourdomain.com]"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "about": "[Topic — use a Wikipedia URL for the topic if available]",
  "funder": {
    "@type": "Organization",
    "name": "[Funding organization if applicable]"
  }
}
```

---

## FAQPage (Fast Facts pages, FAQ sections)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question exactly as a user would ask it]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Direct answer in 40-80 words. No HTML. Plain prose.]"
      }
    },
    {
      "@type": "Question",
      "name": "[Second question]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Direct answer]"
      }
    }
  ]
}
```

---

## HowTo (step-by-step guides)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[How to [Action]]",
  "description": "[One-sentence description of what this guide achieves]",
  "totalTime": "PT[N]M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "[Step 1 title]",
      "text": "[Step 1 instructions in 1-3 sentences]"
    },
    {
      "@type": "HowToStep",
      "name": "[Step 2 title]",
      "text": "[Step 2 instructions]"
    }
  ]
}
```

---

## Dataset (original data pages, survey results, statistics)

```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "[Dataset Name — e.g., Brand Name 2025 Industry Report]",
  "description": "[What data this contains, sample size, and date range]",
  "creator": {
    "@type": "Organization",
    "name": "[Brand Name]",
    "url": "[https://yourdomain.com]"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "variableMeasured": "[What is being measured — e.g., compensation, pricing, performance benchmarks]",
  "license": "[https://creativecommons.org/licenses/by/4.0/ or your license URL]",
  "url": "[https://yourdomain.com/this-dataset-url]"
}
```
