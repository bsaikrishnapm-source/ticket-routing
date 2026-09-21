# Triage Console — product walkthrough

## Implemented user value

A configurable confidence threshold, authored urgency override, per-ticket decision reasons, evaluation counts, and local human-confirmed assignments.

## Five-minute review

Compare original baseline against override at 0.90; inspect T18; use 0.95; confirm a human-selected queue and download evidence.

Choose **Save comparison snapshot** to retain up to five result snapshots in the current tab. **Download evidence JSON** exports the current result and captured snapshots. Refreshing clears all session state. Exports describe synthetic data and local actions only.

## Architecture

| File | Responsibility |
| --- | --- |
| demo/index.html | Page structure, local script references and evidence boundary |
| demo/style.css | Responsive workspace, focus styles and readable tables |
| demo/data.js | Bundled synthetic fixture data; no network requests |
| demo/engine.js | Pure decision functions and in-memory workflow state |
| demo/app.js | Labeled controls, local actions, result rendering and downloads |
| test_demo.cjs | Node built-in behavioral tests against the decision engine |

The UI inserts scenario text through textContent. CSV exports, where present, quote fields and neutralize formula-like leading characters. No external libraries, trackers, authentication credentials or model endpoints are used.

## Product scope and trade-offs

The urgency override is a keyword policy, not a trained classifier. It is authored against synthetic scenarios and is not independently validated. Negated phrases can over-escalate and unseen wording can be missed. Truth labels are used only for evaluation, never routing. All queue assignments are local simulations.

## Review criteria

A reviewer should be able to explain the decision, change an assumption, inspect a failure path and export the evidence. A successful prototype test demonstrates only the declared fixture behavior; it does not establish production readiness.

## Run verification

Requires Node.js 18 or newer for the built-in test runner (the demo itself requires only a browser).

```bash
node --test test_demo.cjs
```

Expected: 7 passing decision tests. The existing Python entry point remains available in the main README.

## Accessibility design

Controls use visible labels, keyboard focus outlines and native buttons/selects. Error text uses an alert region; metric updates and snapshot counts use polite live regions. A skip link targets scenario controls. Tables scroll inside the result panel on narrow displays. Browser rendering and assistive-technology testing have not been completed in this environment.

## Data and retention

Use synthetic records only. Demo decisions and logs live in memory, with no localStorage or remote persistence. Downloading evidence explicitly writes a file through the user's browser. Clearing a buffer or refreshing does not delete a previously downloaded export.
