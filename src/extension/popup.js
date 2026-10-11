const $ = (id) => document.getElementById(id);

chrome.storage.local.get('apiKey').then(({ apiKey }) => {
  if (apiKey) $('status').textContent = 'Anahtar kayıtlı.';
});

$('save').addEventListener('click', async () => {
  const value = $('key').value.trim();
  if (!value) return;
  await chrome.storage.local.set({ apiKey: value });
  $('key').value = '';
  $('status').textContent = 'Anahtar kaydedildi.';
});

$('analyze').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'start-analysis' }, { frameId: 0 });
    window.close();
  } catch {
    $('status').textContent = 'Bu sayfada çalışamıyorum. Sayfayı yenileyip tekrar deneyin (chrome:// sayfaları desteklenmez).';
  }
});
