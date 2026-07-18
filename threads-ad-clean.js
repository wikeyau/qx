/*
 * Threads Ad Cleaner for Quantumult X
 *
 * Targets:
 * /api/v1/feed/text_post_app_timeline/
 *
 * This version removes the entire feed entry when an advertising
 * marker appears anywhere inside that entry.
 */

const body =
  typeof $response !== "undefined" &&
  typeof $response.body === "string"
    ? $response.body
    : "";

if (!body) {
  $done({});
} else {
  try {
    const data = JSON.parse(body);

    let removedCount = 0;

    const TRUE_AD_FLAGS = new Set([
      "is_ad",
      "isAd",
      "is_ads",
      "isAds",
      "is_sponsored",
      "isSponsored",
      "is_advertisement",
      "isAdvertisement",
      "is_commercial",
      "isCommercial",
      "is_injected",
      "isInjected",
      "injected_ad",
      "injectedAd",
      "is_injected_ad",
      "isInjectedAd"
    ]);

    const AD_KEYS = new Set([
      "ad_id",
      "adId",
      "ad_pk",
      "adPk",
      "ad_metadata",
      "adMetadata",
      "ad_info",
      "adInfo",
      "ad_client_token",
      "adClientToken",
      "ads_tracking_token",
      "adsTrackingToken",
      "ad_tracking_token",
      "adTrackingToken",
      "sponsored_label",
      "sponsoredLabel",
      "sponsored_label_info",
      "sponsoredLabelInfo",
      "sponsor_tags",
      "sponsorTags",
      "ad_disclaimer",
      "adDisclaimer",
      "ad_demotion_control",
      "adDemotionControl",
      "threads_ad_info",
      "threadsAdInfo",
      "commerciality_status",
      "commercialityStatus",
      "commercial_content_type",
      "commercialContentType",
      "boosted_status",
      "boostedStatus"
    ]);

    const TYPE_KEYS = new Set([
      "type",
      "item_type",
      "itemType",
      "content_type",
      "contentType",
      "product_type",
      "productType",
      "module_type",
      "moduleType",
      "layout_type",
      "layoutType",
      "__typename",
      "typename"
    ]);

    const LABEL_KEYS = new Set([
      "label",
      "display_label",
      "displayLabel",
      "social_context",
      "socialContext",
      "header",
      "subtitle"
    ]);

    const AD_TYPE_PATTERN =
      /^(?:ad|ads|advert|advertisement|sponsored|sponsored_post|sponsored_media|feed_ad|threads_ad|commercial|promoted)$/i;

    const AD_LABEL_PATTERN =
      /^(?:sponsored|advertisement|promoted|paid partnership)$/i;

    function hasValue(value) {
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

    function containsAdMarker(value, depth = 0) {
      if (depth > 15 || value === null || value === undefined) {
        return false;
      }

      if (Array.isArray(value)) {
        return value.some((item) =>
          containsAdMarker(item, depth + 1)
        );
      }

      if (typeof value !== "object") {
        return false;
      }

      for (const [key, child] of Object.entries(value)) {
        if (
          TRUE_AD_FLAGS.has(key) &&
          child === true
        ) {
          return true;
        }

        if (
          AD_KEYS.has(key) &&
          hasValue(child)
        ) {
          return true;
        }

        if (
          TYPE_KEYS.has(key) &&
          typeof child === "string" &&
          AD_TYPE_PATTERN.test(child.trim())
        ) {
          return true;
        }

        if (
          LABEL_KEYS.has(key) &&
          typeof child === "string" &&
          AD_LABEL_PATTERN.test(child.trim())
        ) {
          return true;
        }
      }

      for (const child of Object.values(value)) {
        if (containsAdMarker(child, depth + 1)) {
          return true;
        }
      }

      return false;
    }

    function clean(value) {
      if (Array.isArray(value)) {
        const result = [];

        for (const item of value) {
          if (containsAdMarker(item)) {
            removedCount++;
            continue;
          }

          result.push(clean(item));
        }

        return result;
      }

      if (value !== null && typeof value === "object") {
        const result = {};

        for (const [key, child] of Object.entries(value)) {
          result[key] = clean(child);
        }

        return result;
      }

      return value;
    }

    const cleanedData = clean(data);

    console.log(
      "[Threads Ad Cleaner] URL: " + $request.url
    );

    console.log(
      "[Threads Ad Cleaner] Removed entries: " +
        removedCount
    );

    /*
     * Temporary diagnostic notification.
     * Remove this block once you confirm that the script executes.
     */
    const notificationKey =
      "threads-ad-clean-last-notification";

    const now = Date.now();

    const lastNotification =
      Number(
        $prefs.valueForKey(notificationKey) || "0"
      );

    if (now - lastNotification > 300000) {
      $notify(
        "Threads Ad Cleaner",
        "Timeline response matched",
        "Removed " + removedCount + " suspected ad entries."
      );

      $prefs.setValueForKey(
        String(now),
        notificationKey
      );
    }

    $done({
      body: JSON.stringify(cleanedData)
    });
  } catch (error) {
    console.log(
      "[Threads Ad Cleaner] Error: " +
        String(
          error && error.message
            ? error.message
            : error
        )
    );

    $done({});
  }
}