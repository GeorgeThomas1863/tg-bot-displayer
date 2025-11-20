//from claude for checking PIC URLs
export const checkPicURL = async (url) => {
  try {
    const urlObj = new URL(url);

    // Must be http or https
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }
  } catch (e) {
    console.log(`INVALID URL: ${url}`);
    return false;
  }

  // Check if URL ends with a valid image extension
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const urlLower = url.toLowerCase();
  const hasValidExtension = validExtensions.some((ext) => urlLower.endsWith(ext));

  // Also check for query parameters (e.g., image.jpg?size=large)
  const urlWithoutQuery = urlLower.split("?")[0];
  const hasValidExtensionBeforeQuery = validExtensions.some((ext) => urlWithoutQuery.endsWith(ext));

  return hasValidExtension || hasValidExtensionBeforeQuery;
};
