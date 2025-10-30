window.addEventListener('load', function() {
    chrome.storage.sync.get(['enabledButtons'], function(result) {
        const enabledButtons = result.enabledButtons || {
            steam: true
        };

        if (!enabledButtons.steam) return;

        const titleElement = document.querySelector('.workshopItemTitle');
        if (!titleElement) return;
        
        const modName = titleElement.textContent.trim();
        
        const purchaseContainer = document.querySelector('.game_area_purchase_game');
        if (!purchaseContainer) return;
        
        const buttonsContainer = purchaseContainer.querySelector('div > div:has(> #SubscribeItemBtn)');
        if (!buttonsContainer) return;
        
        const searchButton = document.createElement('a');
        searchButton.className = 'btn_green_white_innerfade btn_border_2px btn_medium';
        searchButton.style.cssText = `
            padding: 0 15px 0 10px;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            text-decoration: none !important;
            white-space: nowrap;
            margin-left: 10px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        `;
        
        const searchIcon = document.createElement('div');
        searchIcon.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 13L9 9M5.5 10C2.73858 10 0.5 7.76142 0.5 5C0.5 2.23858 2.73858 0 5.5 0C8.26142 0 10.5 2.23858 10.5 5C10.5 7.76142 8.26142 10 5.5 10Z" 
                  stroke="white" stroke-width="1.5"/>
        </svg>
        `;
        
        const buttonText = document.createElement('span');
        buttonText.textContent = 'Search Online';
        
        searchButton.appendChild(searchIcon);
        searchButton.appendChild(buttonText);
        
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            searchModOnline(modName);
        });
        
        buttonsContainer.appendChild(document.createTextNode(' '));
        buttonsContainer.appendChild(searchButton);
        
        buttonsContainer.style.textAlign = 'center';
    });
});

function searchModOnline(modName) {
    chrome.storage.sync.get(['enabledSites'], function(result) {
        const enabledSites = result.enabledSites || {
            smods: true,
            nexus: true,
            curseforge: true,
            moddb: true
        };
        
        let siteQueries = [];
        
        if (enabledSites.smods) siteQueries.push('site:smods.ru');
        if (enabledSites.nexus) siteQueries.push('site:nexusmods.com');
        if (enabledSites.curseforge) siteQueries.push('site:curseforge.com');
        if (enabledSites.moddb) siteQueries.push('site:moddb.com');
        
        let searchQuery;
        if (siteQueries.length > 0) {
            searchQuery = `"${modName}" (${siteQueries.join(' OR ')})`;
        } else {
            searchQuery = `"${modName}"`;
        }
        
        const encodedName = encodeURIComponent(searchQuery);
        window.open(`https://www.google.com/search?q=${encodedName}`, '_blank');
    });
}