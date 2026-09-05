import type { GeolocationProvider, Coordinates } from '@8848digital/catalyst';

/**
 * Web implementation of the core {@link GeolocationProvider} seam, backed by the
 * browser `navigator.geolocation` API. Registered once at boot in `main.tsx` via
 * `setGeolocationProvider`.
 *
 * `enableHighAccuracy: true` prefers the device GNSS/GPS sensor (works offline);
 * `maximumAge: 0` forces a fresh "where I'm standing right now" reading rather
 * than a cached one.
 */
export const webGeolocationProvider: GeolocationProvider = {
  getCurrentPosition() {
    return new Promise<Coordinates>((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('This device/browser does not support location.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => reject(new Error(geoMessage(err))),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );
    });
  },
};

/** Maps a browser geolocation error to a user-facing, actionable message. */
function geoMessage(err: GeolocationPositionError): string {
  if (err.code === err.PERMISSION_DENIED) return 'Location permission denied. Enable location to continue.';
  if (err.code === err.POSITION_UNAVAILABLE) return 'Location unavailable — no GPS fix. Move to an open area and retry.';
  if (err.code === err.TIMEOUT) return 'Getting location timed out. Please retry.';
  return 'Could not get device location.';
}
