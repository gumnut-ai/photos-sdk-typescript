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
   * succeeds. Do not present your own assessment as the user's opinion; follow host
   * tool permissions. Requires write access. Exclude credentials, photos, signed
   * URLs, transcripts, private tool results, personal or library names, precise
   * locations, and literal search text. A submitted result confirms intake only.
   * Server errors or a lost response may leave delivery uncertain; do not
   * automatically retry.
   */
  submit(body: FeedbackSubmitParams, options?: RequestOptions): APIPromise<FeedbackResult> {
    return this._client.post('/api/feedback', { body, maxRetries: 0, ...options });
  }
}

export interface FeedbackResult {
  status: 'submitted';
}

export interface FeedbackSubmitParams {
  feedback_type: 'bug' | 'missing_capability' | 'confusing_behavior' | 'suggestion' | 'other';

  message: string;

  task_completed?: boolean | null;

  tool_names?: Array<string> | null;
}

export declare namespace Feedback {
  export { type FeedbackResult as FeedbackResult, type FeedbackSubmitParams as FeedbackSubmitParams };
}
