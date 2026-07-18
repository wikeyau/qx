/*
 * Meta Threads Ad Cleaner for Quantumult X
 *
 * Removes feed objects that contain explicit advertising
 * or sponsored-content markers.
 *
 * Non-JSON responses are returned unchanged.
 */

const originalBody =
  typeof $response !== "undefined" &&
  typeof $response.body === "string"
    ? $response.body
    : "";

if (!originalBody) {
  $done({});
} else {
  try {
    const payload = JSON.parse(originalBody);
    const REMOVE = "__QX_THREADS_REMOVE__";

    const TRUE_FLAGS = new Set([
      "is_ad",
      "isAd",
      "is_sponsored",
      "isSponsored",
      "is_advertisement",
      "isAdvertisement",
      "is_commercial",
      "isCommercial",
      "injected_ad",
      "is_injected_ad"
    ]);

    const HARD_AD_KEYS = new Set([
      "ad_id",
      "adId",
      "ad_metadata",
      "adMetadata",
      "ad_client_token",
      "adClientToken",
      "ads_tracking_token",
      "adsTrackingToken",
      "sponsored_label_info",
      "sponsoredLabelInfo",
      "sponsored_label",
      "sponsoredLabel",
      "ad_demotion_control",
      "adDemotionControl",
      "ad_disclaimer",
      "adDisclaimer",
      "threads_ad_info",
      "threadsAdInfo"
    ]);

    const TYPE_KEYS = new Set([
      "type",
      "item_type",
      "itemType",
      "media_type_name",
      "mediaTypeName",
      "content_type",
      "contentType",
      "product_type",
      "productType",
      "__typename",
      "typename"
    ]);

    const AD_TYPE_PATTERN =
      /^(?:ad|ads|advert|advertisement|sponsored|sponsored_post|sponsored_media|threads_ad|feed_ad|commercial)$/i;

    const SPONSORED_TEXT_PATTERN =
      /^(?:sponsored|paid partnership|advertisement)$/i;

    function hasMeaningfulValue(value) {
      if (
        value === null ||
        value === undefined ||
        value === false
      ) {
        return false;
      }

      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (typeof value === "object") {
        return Object.keys(value).length > 0;
      }

      return true;
    }

    function isAdObject(value) {
      if (
        value === null ||
        typeof value !== "object" ||
        Array.isArray(value)
      ) {
        return false;
      }

      for (const key of Object.keys(value)) {
        if (
          TRUE_FLAGS.has(key) &&
          value[key] === true
        ) {
          return true;
        }

        if (
          HARD_AD_KEYS.has(key) &&
          hasMeaningfulValue(value[key])
        ) {
          return true;
        }

        if (
          TYPE_KEYS.has(key) &&
          typeof value[key] === "string" &&
          AD_TYPE_PATTERN.test(value[key].trim())
        ) {
          return true;
        }
      }

      const labelCandidates = [
        value.label,
        value.display_label,
        value.displayLabel,
        value.social_context,
        value.socialContext,
        value.header,
        value.subtitle
      ];

      for (const candidate of labelCandidates) {
        if (
          typeof candidate === "string" &&
          SPONSORED_TEXT_PATTERN.test(candidate.trim())
        ) {
          return true;
        }
      }

      return false;
    }

    function clean(value) {
      if (Array.isArray(value)) {
        return value
          .map((item) => clean(item))
          .filter((item) => item !== REMOVE);
      }

      if (
        value !== null &&
        typeof value === "object"
      ) {
        if (isAdObject(value)) {
          return REMOVE;
        }

        const result = {};

        for (const [key, child] of Object.entries(value)) {
          const cleanedChild = clean(child);

          if (cleanedChild !== REMOVE) {
            result[key] = cleanedChild;
          }
        }

        return result;
      }

      return value;
    }

    const cleanedPayload = clean(payload);

    $done({
      body: JSON.stringify(
        cleanedPayload === REMOVE ? {} : cleanedPayload
      )
    });
  } catch (error) {
    console.log(
      "[Threads Ad Cleaner] Response left unchanged: " +
        String(
          error && error.message
            ? error.message
            : error
        )
    );

    $done({});
  }
}