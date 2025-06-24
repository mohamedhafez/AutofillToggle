// background.js  (service worker)

// Helper — write both settings at once
async function setAutofill(enabled) {
  const opts = { value: enabled, scope: 'regular' };
  await chrome.privacy.services.autofillAddressEnabled.set(opts);
  //await chrome.privacy.services.autofillCreditCardEnabled.set(opts);

  // (optional) show a badge so you can see the state at a glance
  await chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
}

// First‑run & every browser start: force OFF
chrome.runtime.onInstalled.addListener(() => setAutofill(false));
chrome.runtime.onStartup.addListener(()  => setAutofill(false));

setAutofill(false)

// 1. Toggle when the user clicks the toolbar icon
chrome.action.onClicked.addListener(toggle);

// 2. Toggle when the keyboard command fires
chrome.commands.onCommand.addListener(cmd => {
  if (cmd === 'toggle-autofill') toggle();
});

async function toggle() {
  const { value: currentlyOn } =
      await chrome.privacy.services.autofillAddressEnabled.get({});
  await setAutofill(!currentlyOn);
}
