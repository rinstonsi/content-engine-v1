import { SportsDataProvider } from '../../../../application/ports/outbound/SportsDataProvider.js';

export class MultisportProvider extends SportsDataProvider {
  constructor({ baseUrl, clientId, defaultTz = '0000', timeoutMs = 10000 }) {
    super();
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.defaultTz = defaultTz;
    this.timeoutMs = timeoutMs;
  }

  async fetchFixtures(params) {
    const {
      sport,
      league = 0,
      timezone,
      language = '',
      gamestate = 4,
    } = params;

    const url = new URL('default.aspx', this.baseUrl);
    url.searchParams.set('methodtype', '3');
    url.searchParams.set('client', String(params.client_id || this.clientId));
    url.searchParams.set('sport', String(sport));
    url.searchParams.set('league', String(league));
    url.searchParams.set('timezone', String(timezone || this.defaultTz));
    url.searchParams.set('language', language);
    url.searchParams.set('gamestate', String(gamestate));

    // Debug request details
    try {
      const maskedClient = this.clientId
        ? `${String(this.clientId).slice(0, 2)}***${String(this.clientId).slice(-2)}`
        : '';
      console.log('[Multisport] Request URL:', url.toString());
      console.log('[Multisport] Params:', {
        sport: String(sport),
        league: String(league),
        timezone: String(timezone || this.defaultTz),
        language,
        gamestate: String(gamestate),
        timeoutMs: this.timeoutMs,
        clientId: maskedClient,
      });
    } catch (e) {}

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);
    let res;
    try {
      res = await fetch(url.toString(), { signal: controller.signal });
    } catch (err) {
      clearTimeout(id);
      console.error('[Multisport] Network error:', err?.message);
      throw new Error(`Multisport network error: ${err?.message || 'unknown'}`);
    }
    clearTimeout(id);

    console.log('[Multisport] Response status:', res.status, res.statusText);
    console.log(
      '[Multisport] Content-Type:',
      res.headers?.get?.('content-type')
    );

    const rawText = await res.text();
    console.log('[Multisport] Raw body sample:', rawText.slice(0, 500));

    if (!res.ok) {
      try {
        const maybeErr = JSON.parse(rawText);
        const providerErr =
          maybeErr?.error ||
          maybeErr?.Error ||
          maybeErr?.message ||
          maybeErr?.Message;
        if (providerErr) {
          console.error('[Multisport] Provider error:', providerErr);
          throw new Error(`Multisport API error: ${providerErr}`);
        }
      } catch (e) {}
      throw new Error(`Multisport API error: ${res.status} ${res.statusText}`);
    }
    let raw;
    try {
      raw = JSON.parse(rawText);
    } catch (e) {
      throw new Error('Multisport API returned non-JSON response');
    }

    // Return provider JSON with the request URL used
    return {
      requestUrl: url.toString(),
      response: raw,
    };
  }
}
