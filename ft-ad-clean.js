/*
 * Financial Times Ad Cleaner
 * Quantumult X
 *
 * Removes likely advertising objects from JSON API responses.
 * Non-JSON responses are returned without modification.
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
    const REMOVE = Symbol("remove");

    const advertisingKeyPattern =
      /^(?:ad|ads|advert|adverts|advertisement|advertisements|advertising|adData|adInfo|adConfig|adSlots?|adUnits?|commercial|commercials|commercialSlots?|sponsoredContent)$/i;

    const advertisingBooleanPattern =
      /^(?:showAds|showAdverts|adsEnabled|advertsEnabled|advertisingEnabled|displayAds|enableAds|enableAdvertising|hasAds)$/i;

    const advertisingValuePattern =
      /(?:^|[-_\s])(?:ad|ads|advert|adverts|advertisement|advertising|commercial|sponsored)(?:$|[-_\s])/i;

    const classificationFields = [
      "type",
      "kind",
      "name",
      "role",
      "slot",
      "slotName",
      "slotType",
      "component",
      "componentName",
      "componentType",
      "contentType",
      "layout",
      "layoutType",
      "template",
      "templateName",
      "module",
      "moduleType"
    ];

    function isAdvertisingObject(value) {
      if (
        value === null ||
        typeof value !== "object" ||
        Array.isArray(value)
      ) {
        return false;
      }

      const booleanFlags = [
        "isAd",
        "isAdvert",
        "isAdvertisement",
        "isAdvertising",
        "isCommercial",
        "isSponsored"
      ];

      for (const flag of booleanFlags) {
        if (value[flag] === true) {
          return true;
        }
      }

      for (const field of classificationFields) {
        const fieldValue = value[field];

        if (
          typeof fieldValue === "string" &&
          advertisingValuePattern.test(fieldValue)
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
        if (isAdvertisingObject(value)) {
          return REMOVE;
        }

        const result = {};

        for (const [key, childValue] of Object.entries(value)) {
          if (advertisingKeyPattern.test(key)) {
            continue;
          }

          if (advertisingBooleanPattern.test(key)) {
            result[key] = false;
            continue;
          }

          const cleanedValue = clean(childValue);

          if (cleanedValue !== REMOVE) {
            result[key] = cleanedValue;
          }
        }

        return result;
      }

      return value;
    }

    const cleanedData = clean(data);

    $done({
      body: JSON.stringify(
        cleanedData === REMOVE ? {} : cleanedData
      )
    });
  } catch (error) {
    console.log(
      `[FT Ad Cleaner] Response left unchanged: ${error.message}`
    );

    $done({});
  }
}