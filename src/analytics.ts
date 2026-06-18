/**
 * Thin, type-safe wrapper around the Novus (Pendo) agent loaded in index.html.
 *
 * Novus is the required analytics layer for the World Product Day hackathon.
 * Until a real Novus API key is pasted into index.html the agent is a no-op
 * queue, so every call here is safe in local dev and in production.
 */

interface PendoAgent {
  initialize?: (opts: unknown) => void;
  track?: (event: string, props?: Record<string, unknown>) => void;
  isReady?: () => boolean;
}

declare global {
  interface Window {
    pendo?: PendoAgent;
  }
}

const VISITOR_KEY = 'premortem.visitor.v1';

function anonId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = 'anon-' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon-session';
  }
}

let initialized = false;

/** Initialise an anonymous Novus visitor once per session. */
export function initAnalytics(): void {
  if (initialized) return;
  initialized = true;
  try {
    window.pendo?.initialize?.({
      visitor: { id: anonId() },
      account: { id: 'world-product-day' },
    });
  } catch {
    /* never let analytics break the app */
  }
}

/** Send a custom product event to Novus. */
export function track(event: string, props: Record<string, unknown> = {}): void {
  try {
    window.pendo?.track?.(event, { app: 'premortem', ...props });
  } catch {
    /* swallow */
  }
}

/** Named events used across the product, kept in one place for consistency. */
export const Events = {
  startPremortem: 'premortem_started',
  loadedExample: 'example_loaded',
  stepViewed: 'step_viewed',
  riskAdded: 'risk_added',
  riskRemoved: 'risk_removed',
  suggestionUsed: 'suggestion_used',
  experimentPicked: 'experiment_picked',
  riskiestStarred: 'riskiest_starred',
  reportReached: 'report_reached',
  shareCreated: 'share_link_created',
  markdownCopied: 'markdown_copied',
  reportPrinted: 'report_printed',
  reset: 'premortem_reset',
} as const;
