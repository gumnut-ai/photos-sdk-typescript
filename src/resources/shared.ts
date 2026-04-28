// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * A single image variant with its URL, MIME type, and target width.
 */
export interface AssetVariant {
  /**
   * MIME type of the served image
   */
  mimetype: string;

  /**
   * URL to fetch this image variant
   */
  url: string;

  /**
   * Target width in pixels (null if unknown)
   */
  width?: number | null;
}
