import type { GeolocationProvider, Coordinates } from '@8848digital/catalyst';

/**
 * Native implementation of the core {@link GeolocationProvider} seam.
 *
 * Not implemented in this template. Unlike the web provider (which uses the
 * browser `navigator.geolocation` API), no native GPS read ships here. Wire a
 * real device read before using any feature that depends on location, then keep
 * it registered in `bootstrap.ts` via `setGeolocationProvider`. Until then this
 * throws so callers fail loudly instead of receiving fake coordinates.
 */
export const nativeGeolocationProvider: GeolocationProvider = {
  async getCurrentPosition(): Promise<Coordinates> {
    throw new Error('Native geolocation is not implemented in this template.');
  },
};
