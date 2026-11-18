// ============================================================================
// KONFIGURATION FÖR HELA VINKÄLLAR-ESCAPE ROOMET
// Ändra dina koder och hemliga ord här på ett enda ställe!
// ============================================================================

const VAULT_CONFIG = {
  // Hänglåsets tre siffror (från Akt 1, Akt 2 och Akt 3)
  digit1: 4,
  digit2: 7,
  digit3: 2,

  // Hemligt 6-bokstavsord för gipslådans skrapklur (6 unika bokstäver, A-Ö)
  // Bokstavens plats i svenska alfabetet (A=1 ... Ö=29) blir skruvnumren.
  // Exempel: "GIPSET" -> 7, 9, 16, 19, 5, 20
  gipsWord: "GIPSET"
};

// Alias ifall någon av de tidigare sidorna läser CONFIG
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
// FRAMSTEG & HUD-HANTERING (Matchar index.html exakt)
// ============================================================================

const STORAGE_KEY = "vinkallaren_escape_progress_v3";

function saveProgress(page, unlockedDigitsCount) {
  try {
    const count = typeof unlockedDigitsCount === "number" ? unlockedDigitsCount : 0;
    const payload = JSON.stringify({
      page: page,
      unlockedDigits: count,
      unlocked: count,
      timestamp: Date.now()
    });
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (e) {}
}

function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function loadProgress() {
  return getProgress();
}

function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

function clearProgress() {
  resetProgress();
}

function resetEscapeProgress() {
  resetProgress();
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
