# WasteWise AI v2.0 — test report (17 November 2026)

## Executed and passed

| Check | Method | Actual outcome |
|---|---|---|
| Waste taxonomy | Node built-in test runner | Six distinct categories; 38 allowed items; safe advice mappings verified |
| Item mapping | Node tests | Banana peel = wet; bottle = recyclable; battery = hazardous; phone = e-waste; diaper = sanitary |
| Contamination | Node tests | Food-soiled cardboard maps to dry residual rather than clean-paper recycling |
| Abstention | Node tests | Unrecognised, uncertain, multi-item, and non-waste states do not invent a confident result |
| Image validator | Node tests | PNG signatures accepted, fraudulent MIME/signatures rejected |
| Server model parsing | Node tests | Empty and invalid JSON responses produce honest error states |
| API contract | Node tests with an *injected stub vision provider* | Server creates category and guidance from returned item key without reading filename |
| Missing cloud key | Node tests and GET /api/health | Cloud availability false; rejects Gemini call without a secret |
| Static build integrity | `npm run build` and JS syntax checks | All seven required source assets present; no syntax errors |
| Layout at 1440 px and 390 px | Headless Chromium with inline content/styles/scripts because browser navigation was blocked by sandbox policy | Both rendered; no horizontal overflow; six category cards visible |
| Upload preview | Playwright DOM test using an artificial JPG file | Preview visible and scan button enabled |
| Result and manual correction | Playwright DOM test with **mocked backend response** | PET bottle result displayed; manual correction to banana peel changed category to wet |
| Scan again / navigation | Playwright DOM test | Scan again cleared result; mobile menu opened |
| Script errors | Playwright DOM test | No uncaught errors in these tests |

**Node tests: 10 passed, 0 failed.**

## Not executed — do not claim pass

- **Actual model inference on genuine photographs:** not executed. This environment cannot fetch Hugging Face model weights/assets from the browser, and there is no `GEMINI_API_KEY` set in the target Vercel project. There is no measured accuracy or category confusion matrix.
- **Real Vercel preview build and actual hosted mobile browser checks:** not executed. Local static build/source checks and inline HTML screenshots are *not* an end-to-end hosted deployment test.
- **Stress, quota, latency, and cost:** no measurements. CLIP download size and inference speed depend on model/CDN/browser; Gemini provider rates/quotas may change.
- **Security production validation:** no WAF or persistent distributed rate limiting configured.

## Actual Vercel inspection

- Confirmed the existing Vercel project is `wastewise-ai`, associated with GitHub `raghawiz/wastewise-ai` and domain `wastewise-ai-jade.vercel.app`.
- The **existing production deployment** reports `READY` and `https://wastewise-ai-jade.vercel.app/` responded `HTTP 200` with its **old page**. This is not the newly generated app.
- The Vercel project currently has **no environment variables**, so Gemini cloud vision is not yet configured.
- No new code was pushed to GitHub; no new Vercel preview or production deployment was created; the existing live site was deliberately left untouched.

## Required release gate before replacing production

1. Upload this source to a `wastewise-v2` Git branch of the existing repository.
2. Set server-only `GEMINI_API_KEY` on the existing Vercel project if cloud vision is desired.
3. Open the Vercel preview and test **six real waste photographs** (wet, recyclable, residual, battery, e-waste, sanitary). Record the model outputs and errors, not only the expected labels.
4. Include uncertain, mixed-items, blurry, and non-waste images; verify the advice and manual correction.
5. Verify the public preview across desktop and mobile, check Vercel functions and logs, and set WAF rate limits.
6. Only then merge or promote the verified release to retain the same production URL.
