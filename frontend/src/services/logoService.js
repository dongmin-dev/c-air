import koreanAirLogo from "../koreanair.png";
import asianaLogo from "../asiana.png";
import deltaLogo from "../delta.png";
import baLogo from "../ba.png";
import defaultLogo from "../CAIR-Logo-blue.png"; // A fallback logo

// Create a map of airline names to their imported logo images
const logoMap = {
  KoreanAir: koreanAirLogo,
  Asiana: asianaLogo,
  Delta: deltaLogo,
  "British Airways": baLogo,
};

/**
 * Returns the correct logo for a given airline name.
 * @param {string} airlineName The name of the airline.
 * @returns The imported logo image, or a default logo if not found.
 */
export const getAirlineLogo = (airlineName) => {
  return logoMap[airlineName] || defaultLogo;
};
