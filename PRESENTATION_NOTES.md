# WasteWise AI — College presentation speaker notes

## 45-second opening

"We all know waste should be segregated, but in daily life people are unsure which stream to use. WasteWise AI helps bridge that gap. You upload a photo or take one with your camera. A computer vision model examines the image to identify the waste item. We then map the result to appropriate waste categories and explain how and why the item should be disposed of. When the photo is uncertain, the system says so rather than pretending to know."

## How the model works (60 seconds)

1. **Image:** photograph of one clear item, taken by camera or selected from the device.
2. **Preprocessing:** the browser decodes and resizes it. This saves bandwidth; filenames are never used to classify.
3. **Computer vision:** **Gemini 2.5 Flash** can interpret the image through a server-side API when configured; alternatively, **CLIP** compares image features to candidate text descriptions entirely in the browser.
4. **Decision:** known item ID from an approved list, multiple items, non-waste, or uncertain result. We never fabricate a probability or hide a model failure.
5. **Guidance:** a separate, human-reviewed table assigns wet, dry/recyclable, dry/non-recyclable, hazardous, e-waste or sanitary disposal advice.
6. **Correction:** if the model is wrong, the user chooses the correct item. That outcome is explicitly labelled manual.

## India's 2026 rules

"India's Solid Waste Management Rules 2026 use four segregation streams at source: wet, dry, sanitary, and special care. For education, we split dry into recyclable and non-recyclable to explain contamination and recovery, while highlighting e-waste as its own special-handling category. Many battery and electronic products follow separate waste regulations. Colours and recycling capabilities vary by municipality."

## Three live demonstrations

- A clear single **banana peel** photo → wet / biodegradable → compost or separate wet collection.
- A clearly empty **PET bottle** photo → dry/recyclable where local facilities accept it → empty and rinse.
- A **battery** photo → hazardous / authorised battery collection → never put in general waste.

Repeat with a difficult or mixed-item photo to show uncertainty; do **not** claim a model is 100% accurate. It may fail or abstain.

## Likely viva questions

**Is it real AI?** Yes, when the actual model loads: a pretrained CLIP vision-text model runs in the user's browser, or Gemini vision analyzes the image via a server request. Test mode uses a mocked response only to validate the UI, never as a production prediction.

**Is the percentage accurate?** No calibrated probability is available. We purposely do not display '98% confident'. CLIP's similarity scores depend on the candidate set and are not reliable probabilities.

**What if it fails?** A clear error appears with a retry path. No fake result or fallback is fabricated.

**Why can't it sort five objects in one picture?** This version is designed for one main waste object. It does not claim multi-object localization, so it asks users for separate photos.

**Why not just use a rule-based classifier?** The visual identification uses actual pixels through a neural model; the disposal guidelines themselves are human-reviewed rules to reduce unsafe generative instructions.

**Does it replace waste collectors?** No. Local municipal rules and authorised collection centres remain authoritative. This tool is for education and better decisions at source.
