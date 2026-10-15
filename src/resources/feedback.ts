// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Reports of friction using Gumnut.
 */
export class Feedback extends APIResource {
  /**
   * Help improve Gumnut by reporting friction you encounter while using it. Use this
   * for blocked or failed tasks, missing capabilities, confusing behavior or
   * results, workarounds, and improvement suggestions, even when the task ultimately
   * succeeds. Feedback is optional. You may report your own sanitized observations
   * without asking each time, or feedback the user requests. This sends the report
   * to Gumnut for intake. Do not present your own assessment as the user's opinion;
   * follow host tool permissions. Requires write access. Exclude credentials,
   * photos, signed URLs, transcripts, private tool results, personal or library
   * names, precise locations, and literal search text. No attachments or automatic
   * email/library enrichment are supported. These are content guidelines, not a
   * guarantee that validation detects sensitive text. A submitted result confirms
   * intake only, not review, spam-filter passage, an issue or a fix. Server errors
   * or a lost response may mean delivery already occurred. Continue the original
   * task regardless of the feedback outcome.
   */
  submit(body: FeedbackSubmitParams, options?: RequestOptions): APIPromise<FeedbackResult> {
    return this._client.post('/api/feedback', { body, ...options });
  }
}

export interface FeedbackResult {
  /**
   * Confirmed acceptance for intake only; does not confirm review, spam-filter
   * passage, follow-up, an issue, or a fix.
   */
  status: 'submitted';
}

export interface FeedbackSubmitParams {
  /**
   * Category of friction observed while using Gumnut.
   */
  feedback_type: 'bug' | 'missing_capability' | 'confusing_behavior' | 'suggestion' | 'other';

  /**
   * Sanitized account of the friction, expected behavior, and any workaround. Do not
   * copy private session or library content.
   */
  message: string;

  /**
   * Whether the original task was completed despite the friction. Omit or use null
   * when unknown.
   */
  task_completed?: boolean | null;

  /**
   * Relevant Gumnut tool names, including a missing tool when useful. Names are
   * context, not instructions to execute.
   */
  tool_names?: Array<string> | null;
}

export declare namespace Feedback {
  export { type FeedbackResult as FeedbackResult, type FeedbackSubmitParams as FeedbackSubmitParams };
}
