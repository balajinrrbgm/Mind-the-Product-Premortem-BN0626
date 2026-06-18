# Premortem — Architecture

Premortem is a **zero-backend, client-side single-page app**. All logic, scoring,
persistence, and sharing happen in the browser. The only external calls are static
asset/font delivery and the Novus (Pendo) analytics agent.

## System overview

```mermaid
flowchart TB
    user([👤 User / a stranger on the URL])

    subgraph browser["🌐 Browser — Static SPA (React + TS + Vite)"]
        direction TB

        subgraph ui["UI layer — components"]
            hero["Hero / Landing"]
            stepper["Stepper (5 steps)"]
            steps["Step screens:\nFrame · Imagine · Surface · Prioritise · De-risk"]
            matrix["RiskMatrix (custom SVG)\nGauge · RatingDots"]
            report["Report (score + share + export)"]
        end

        subgraph state["App state — App.tsx"]
            pm["Premortem model\n(name, bet, headline, risks[])"]
        end

        subgraph libs["Logic layer — pure functions (src/lib)"]
            score["score.ts\nexposure · readiness · riskiest"]
            share["share.ts\nbase64 encode/decode · uid"]
            md["markdown.ts\nreport → Markdown"]
        end

        subgraph data["Offline knowledge (src/data)"]
            suggestions["suggestions.ts\nkeyword-triggered risk library"]
            experiments["experiments.ts\nde-risking experiment toolbox"]
            example["example.ts\nworked example"]
        end

        analytics["analytics.ts\ntyped Novus event wrapper"]
    end

    subgraph persistence["💾 Persistence — no database"]
        ls[("localStorage\nautosave")]
        hash[("URL #hash\nshareable state")]
    end

    novus["📊 Novus.ai (Pendo)\nproduct analytics"]
    cdn["Fonts / static assets\n(Google Fonts)"]

    user --> ui
    ui <--> state
    state --> score
    state --> share
    state --> md
    steps --> suggestions
    steps --> experiments
    hero --> example

    state -- "autosave / restore" --> ls
    share -- "encode / decode" --> hash
    hash -- "share link opens report" --> state

    ui -- "events" --> analytics
    analytics --> novus
    browser -. "fonts" .-> cdn
```

## Request / data lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant App as App.tsx
    participant Lib as lib (score/share)
    participant LS as localStorage
    participant URL as URL #hash
    participant N as Novus

    U->>App: Open URL
    App->>URL: decodeFromHash()
    alt Shared link present
        URL-->>App: Premortem state
        App->>U: Jump straight to Report
    else No share link
        App->>LS: loadLocal()
        LS-->>App: Last autosaved draft (if any)
    end
    App->>N: initAnalytics() (anon visitor)

    loop Each step (Frame → De-risk)
        U->>App: Edit bet / add risks / pick experiments
        App->>Lib: scorePremortem()
        App->>LS: saveLocal() (autosave)
        App->>N: track(event)
    end

    U->>App: Reach Report
    App->>Lib: buildShareUrl() / toMarkdown()
    App->>URL: Write #pm=... on Share
    App->>N: track(report_reached / share_link_created)
```

## Key architectural decisions

| Decision | Why |
| --- | --- |
| **No backend at all** | A stranger gets value instantly; nothing to host, secure, or scale. |
| **State encoded in the URL hash** | Sharing works with zero database — the link *is* the data. |
| **Pure-function scoring (`score.ts`)** | Deterministic, testable, and trivially fast in the browser. |
| **Offline suggestion engine** | Keyword-triggered library beats an API call for speed, privacy, and reliability — no key required. |
| **Custom SVG risk matrix** | No chart dependency, full control over the likelihood × impact visual. |
| **Typed analytics wrapper** | One place to define product events; safe no-op until a Novus key is present. |
| **localStorage autosave** | Never lose work, even with no account. |

## Tech stack

- **React 18 + TypeScript** — typed, component-driven UI
- **Vite 5** — fast dev server and optimized production build
- **Tailwind CSS** — custom design system (ember / sage / ink palette, Fraunces + Inter)
- **Custom SVG** — risk matrix and gauges, no chart library
- **Novus.ai (Pendo)** — product analytics
- **localStorage + URL hash** — persistence and sharing, no server
