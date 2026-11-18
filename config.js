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

// Svenska alfabetet (index + 1 = siffra, A=1 ... Ö=29)
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

function saveProgress(page, unlockedDigitsCount) {
  try {
    localStorage.setItem("escape_current_page", page);
    const prev = parseInt(localStorage.getItem("escape_unlocked_digits") || "0", 10);
    if (typeof unlockedDigitsCount === "number" && unlockedDigitsCount > prev) {
      localStorage.setItem("escape_unlocked_digits", String(unlockedDigitsCount));
    }
  } catch (e) {}
}

function renderHUD(label, unlockedDigitsCount) {
  const hudEl = document.getElementById("hud");
  if (!hudEl) return;

  let stored = 0;
  try {
    stored = parseInt(localStorage.getItem("escape_unlocked_digits") || "0", 10);
  } catch (e) {}
  const unlocked = Math.max(unlockedDigitsCount || 0, stored);

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
