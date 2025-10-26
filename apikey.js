import axios from "axios";

/**
 * Controleert de DeepL API-key en haalt resterende vertaalquota op.
 * 
 * @param {string} apiKey - DeepL API key van gebruiker (Free of Pro)
 * @returns {Promise<number>} - aantal resterende tekens tot maandquotum
 */
export async function checkapikey(apiKey) {
  if (!apiKey) {
    console.error("❌ Geen API-sleutel opgegeven!");
    return 0;
  }

  try {
    // Automatisch juiste endpoint kiezen (FREE of PRO)
    const apiBase = apiKey.includes(":fx") || apiKey.startsWith("fx")
      ? "https://api-free.deepl.com/v2/usage"
      : "https://api.deepl.com/v2/usage";

    const response = await axios.get(apiBase, {
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
      },
      timeout: 10000,
    });

    // DeepL geeft character_count en character_limit
    const used = response.data.character_count || 0;
    const limit = response.data.character_limit || 0;
    const remaining = limit - used;

    console.log(`✅ DeepL quota: ${used.toLocaleString()} / ${limit.toLocaleString()} gebruikt`);
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    if (error.response?.status === 403) {
      console.error("❌ Ongeldige of verlopen DeepL API-sleutel.");
    } else {
      console.error("⚠️  Fout bij het opvragen van DeepL-gebruik:", error.message);
    }
    return 0;
  }
}
