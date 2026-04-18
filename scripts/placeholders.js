/**
 * Fetches site placeholders from /placeholders.json.
 * Falls back gracefully if the file doesn't exist.
 * @param {string} [prefix] optional prefix for lookups
 * @returns {Promise<Record<string, string>>} key-value placeholders
 */
let placeholders;

// eslint-disable-next-line import/prefer-default-export
export async function fetchPlaceholders(prefix = 'default') {
  if (placeholders && placeholders[prefix]) return placeholders[prefix];

  placeholders = placeholders || {};
  const url = `${prefix === 'default' ? '' : prefix}/placeholders.json`;
  try {
    const resp = await fetch(url);
    if (resp.ok) {
      const json = await resp.json();
      const result = {};
      (json.data || json[':names']?.flatMap((name) => json[name]?.data) || [])
        .forEach((entry) => {
          if (entry.Key) result[entry.Key] = entry.Text || '';
        });
      placeholders[prefix] = result;
    } else {
      placeholders[prefix] = {};
    }
  } catch {
    placeholders[prefix] = {};
  }
  return placeholders[prefix];
}
