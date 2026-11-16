# WasteWise AI · v2.0

**A complete redesign of the waste-segregation experience** for a college Solid Waste Management presentation. This is a static, responsive web application with an optional Google Gemini serverless vision endpoint and a browser-side CLIP alternative. No mock predictions or filename inference are used in production.

## What works

- Drag-and-drop / photo-picker / camera capture; JPG, PNG, WebP, 5 MB upload limit.
- Preview, resize, loading state, friendly error messages, scan again.
- **Real model pathways:** Gemini 2.5 Flash multimodal visual analysis (server-side `GEMINI_API_KEY`), or pretrained `Xenova/clip-vit-base-patch32` in the browser through Hugging Face Transformers.js.
- Six educational waste classes: wet, dry/recyclable, dry/residual, hazardous/special care, e-waste, sanitary. Human-written item-specific disposal advice.
- Manual correction of the item and of paper/cardboard contamination; alternative visual possibilities when available.
- Interactive How AI Works pipeline, six category guides, three educational examples, source-segregation context.
- No database, npm dependencies, persistent uploads, or fabricated confidence percentages.

## Quick start

Requirements: Node.js 20+.

```bash
npm run dev
```

Open **http://localhost:3000**. For a functional cloud classifier, create `.env` from `.env.example` and set the `GEMINI_API_KEY` in your process environment before starting the server. The lightweight dev server deliberately does not auto-load `.env` files; in PowerShell you can run `$env:GEMINI_API_KEY="YOUR_KEY"; npm run dev` or load it using your preferred secure environment manager. Never commit the key.

**On-device AI** does not need a server key; its first use downloads CLIP model files from Hugging Face and WebAssembly runtime assets via jsDelivr. A decent connection, several hundred MB of bandwidth, and sufficient device memory may be necessary. Offline first-run inference cannot work. If downloads, WebAssembly, or model loading fail, the app shows an error; it never returns a dummy classification.

## Deploy to the SAME Vercel project without prematurely replacing the current website

1. Replace the source in the **existing GitHub repository** `raghawiz/wastewise-ai` on a **new branch** such as `wastewise-v2`. Keep `index.html`, `api/`, `lib/`, `js/`, `styles.css`, `assets/`, `package.json` and `vercel.json` at repository root.
2. In the **existing Vercel project**, verify the connected Git repository is the same and set **Framework Preset = Other** with **Root Directory = `./`**. Clear any custom build command or output directory inherited from the old application. No build output directory is required for the static root, and `api/*.js` are deployed as serverless functions.
3. Set the **server-only** environment variable `GEMINI_API_KEY` (Google AI Studio) in Vercel Project Settings → Environment Variables for Preview and Production. Never prefix it with `NEXT_PUBLIC_` or `VITE_`. Optionally set `GEMINI_MODEL=gemini-2.5-flash`. Cloud AI requires paid API quota and may incur usage charges; pricing/quotas depend on provider and account.
4. Open a GitHub pull request from the new branch. Let Vercel create a **preview deployment**. Validate image upload, real inference on at least six real photos, unclear/multi-object cases, provider downtime, mobile, and disposal advice on that preview.
5. **Only after** successful testing, merge the PR into the existing production branch. The Vercel project/domain remains the same if its original Git connection and domain alias have not changed. Verify the public URL after deployment.

If your Vercel project currently points at an old app directory, correct the Root Directory before deploying. If it is not Git-linked, import this source into that project using the Vercel CLI with the correct project scope rather than creating an unrelated new project.

## Production architecture

```text
Browser: HTML + responsive CSS + native ES modules
   ├─ Preview / resize photograph to JPEG
   ├─ On-device path: Transformers.js → OpenAI CLIP → rank candidate texts
   │   └─ conservative abstention gate; label as RELATIVE similarity
   └─ Cloud path: POST /api/analyze → validate JPEG/PNG/WebP bytes
       └─ serverless Gemini 2.5 Flash vision → structured JSON
           └─ allowlisted 38 item keys / ambiguity, multiple, not-waste states

Either model output → reviewed item taxonomy → six-category map
                    → specific safe disposal + official stream context
                    → manual correction option
```

`api/analyze.js` is server-side. `GEMINI_API_KEY` stays in its runtime environment and never gets sent to the browser. Google receives images only when the user selects **Cloud AI**. **On-device** analysis runs the model locally, after it fetches the public model from Hugging Face. No photos or results are stored in this app.

The Gemini endpoint accepts JSON with `image: "data:image/jpeg;base64,..."` and returns an item, category and disposal advice derived from the reviewed taxonomy. The UI reads `GET /api/health` to see whether cloud AI has been configured. Validation includes byte signatures, sizes and MIME type, not file extensions. Deployment should add an appropriate Vercel Firewall rate limit to control unauthenticated API costs.

## Why six categories when the law uses four streams?

India's **Solid Waste Management Rules, 2026**, effective 1 April 2026, require household source segregation into **wet, dry, sanitary, and special care** streams. WasteWise presents **six educational decisions** to make recyclable vs non-recyclable dry waste clearer, and highlight **e-waste** separately because electronic waste has separate authorised collection rules. Local authorities differ in bin colours and what collection services accept. E-waste, batteries and some hazardous or biomedical items have separate applicable laws; do not generalise one set of bins to every town.

Sources: [CPCB official portal](https://www.swm.cpcb.gov.in/), [Government of India PIB explanation](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2219676&lang=2&reg=48), [official gazette](https://swm.cpcb.gov.in/images/solid-waste-management-rules-2026.pdf).

## Limitations and honest confidence

- **CLIP** uses zero-shot similarity to 40-ish candidate text prompts, not a waste-specialist supervised model. Candidate-set softmax is **not calibrated confidence**. The app has conservative (heuristic, not validated) similarity and margin thresholds to abstain. It cannot reliably infer unseen items, inspect material codes, distinguish a clean from contaminated object, or detect multiple waste objects.
- **Gemini** has stronger open-vocabulary vision, but may misrecognise objects; its boolean `uncertain` value is generated, not statistically calibrated. No confidence percentage is displayed. The language model may also be inconsistent about subtle contamination.
- This implementation has no measured precision/recall on a labeled waste image test set. Manual correction is essential, and local guidance may vary. Do not present inference as infallible or as a legally binding disposal rule.
- There is no persistent feedback collection, training on submitted photos or object bounding-box detection. Photography should focus on one waste item at a time.
- Model training/finetuning is not part of this v1; inference uses pretrained models.

## Tests

```bash
npm test
npm run build
```

Tests verify taxonomy, item-specific guidance, ambiguous/multi-item handling, byte validation, model-response parsing, and an injected *mock* model for API contracts. The automated Playwright interface smoke checks test the upload-preview and correction flows with simulated response data. **These tests are not a substitute for actual inference.** See `TEST_REPORT.md` for outcomes and missing live-model checks.

## Tech decisions

The app deliberately uses **native modern HTML/CSS/JavaScript rather than Next.js**: no hydration, build pipeline, node_modules, runtime framework, or framework costs. This is appropriate for a college demonstration and makes the project easy to deploy to Vercel. Only the optional Gemini service runs as a serverless function. For a larger product, replace the native layer with React/Next.js, add a protected rate-limited backend, and evaluate a fine-tuned waste dataset and multiple-object detector.
