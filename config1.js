// ============================================================================
// KONFIGURATION FÖR HELA VINKÄLLAR-ESCAPE ROOMET
// ============================================================================

const VAULT_CONFIG = {
  // Hänglåsets tre siffror (från Akt 1, Akt 2 och Akt 3)
  digit1: 4,
  digit2: 7,
  digit3: 2,

  // Hemligt 6-bokstavsord för gipslådans skrapklur (6 unika bokstäver, A-Ö)
  gipsWord: "GIPSET"
};

// Alias ifall någon av de ursprungliga sidorna läser CONFIG istället för VAULT_CONFIG
const CONFIG = {
  digit1: VAULT_CONFIG.digit1,
  digit2: VAULT_CONFIG.digit2,
  digit3: VAULT_CONFIG.digit3,
  digits: [VAULT_CONFIG.digit1, VAULT_CONFIG.digit2, VAULT_CONFIG.digit3],
  gipsWord: VAULT_CONFIG.gipsWord
};

const SWEDISH_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";

function wordToScrewNumbers(word) {
  const clean = String(word || "GIPSET").toUpperCase().replace(/[^A-ZÅÄÖ]/g, "");
  return clean.split("").map(ch => {
    const idx = SWEDISH_ALPHABET.indexOf(ch);
    return idx >= 0 ? idx + 1 : 0;
  }).filter(n => n > 0);
}

// ============================================================================
// FRAMSTEG & HUD-HANTERING
// ============================================================================

const PROGRESS_KEY = "vinkallaren_progress";

function saveProgress(page, unlockedDigitsCount) {
  try {
    const count = typeof unlockedDigitsCount === "number" ? unlockedDigitsCount : 0;
    const data = JSON.stringify({
      page: page,
      unlockedDigits: count,
      unlocked: count,
      timestamp: Date.now()
    });
    localStorage.setItem(PROGRESS_KEY, data);
    localStorage.setItem("escape_current_page", page);
    localStorage.setItem("escape_unlocked_digits", String(count));
  } catch (e) {}
}

function getProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    const page = localStorage.getItem("escape_current_page");
    const unlocked = parseInt(localStorage.getItem("escape_unlocked_digits") || "0", 10);
    if (page) {
      return { page: page, unlockedDigits: unlocked, unlocked: unlocked };
    }
  } catch (e) {}
  return null;
}

function loadProgress() {
  return getProgress();
}

function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem("escape_current_page");
    localStorage.removeItem("escape_unlocked_digits");
  } catch (e) {}
}

function resetEscapeProgress() {
  clearProgress();
}

function renderHUD(label, unlockedDigitsCount) {
  const hudEl = document.getElementById("hud");
  if (!hudEl) return;

  const unlocked = typeof unlockedDigitsCount === "number" ? unlockedDigitsCount : 0;

  const d1 = unlocked >= 1 ? VAULT_CONFIG.digit1 : "?";
  const d2 = unlocked >= 2 ? VAULT_CONFIG.digit2 : "?";
  const d3 = unlocked >= 3 ? VAULT_CONFIG.digit3 : "?";

  hudEl.innerHTML =
    '<span class="hud-act">' + label + '</span>' +
    '<div class="hud-digits">' +
      '<span class="digit-box' + (unlocked >= 1 ? ' unlocked' : '') + '">' + d1 + '</span>' +
      '<span class="digit-box' + (unlocked >= 2 ? ' unlocked' : '') + '">' + d2 + '</span>' +
      '<span class="digit-box' + (unlocked >= 3 ? ' unlocked' : '') + '">' + d3 + '</span>' +
    '</div>';
}
