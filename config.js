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
    if (typeof unlockedDigitsCount === "number") {
      localStorage.setItem("escape_unlocked_digits", String(unlockedDigitsCount));
    }
  } catch (e) {}
}

function renderHUD(label, unlockedDigitsCount) {
  const hudEl = document.getElementById("hud");
  if (!hudEl) return;

  // Använd sidans angivna antal upplåsta siffror direkt (0 i Akt 1, 1 i Akt 2, 2 i Akt 3, 3 i Finalen)
  // så att siffrorna aldrig läcker ut i förväg på tidigare sidor.
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

// Hjälpfunktion om man vill nollställa sparat framsteg helt
function resetEscapeProgress() {
  try {
    localStorage.removeItem("escape_current_page");
    localStorage.removeItem("escape_unlocked_digits");
  } catch (e) {}
}
