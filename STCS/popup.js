document.addEventListener('DOMContentLoaded', function() {
    const gameSearchToggle = document.getElementById('gameSearchToggle');
    const emulatorToggle = document.getElementById('emulatorToggle');
    const workshopToggle = document.getElementById('workshopToggle');

    chrome.storage.sync.get(['enabledButtons'], function(result) {
        const enabledButtons = result.enabledButtons || {
            gameSearch: true,
            emulator: true,
            workshop: true
        };

        gameSearchToggle.checked = enabledButtons.gameSearch;
        emulatorToggle.checked = enabledButtons.emulator;
        workshopToggle.checked = enabledButtons.workshop;
    });

    function saveSettings() {
        const enabledButtons = {
            gameSearch: gameSearchToggle.checked,
            emulator: emulatorToggle.checked,
            workshop: workshopToggle.checked
        };

        chrome.storage.sync.set({ enabledButtons: enabledButtons });
    }

    gameSearchToggle.addEventListener('change', saveSettings);
    emulatorToggle.addEventListener('change', saveSettings);
    workshopToggle.addEventListener('change', saveSettings);
});