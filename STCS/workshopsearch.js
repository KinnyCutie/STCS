window.addEventListener('load', function() {
    chrome.storage.sync.get(['enabledButtons'], function(result) {
        const enabledButtons = result.enabledButtons || {
            gameSearch: true,
            emulator: true,
            workshop: true
        };

        if (!enabledButtons.workshop) return;

        const breadcrumbs = document.querySelector('.breadcrumbs');
        const isModpack = breadcrumbs && 
                         (breadcrumbs.textContent.includes('Collections') || 
                          window.location.href.includes('section=collections'));
        
        if (isModpack) {
            setTimeout(handleModpackPage, 500);
        } else {
            handleRegularWorkshopItem();
        }
    });
});

function handleRegularWorkshopItem() {
    const titleElement = document.querySelector('.workshopItemTitle');
    if (!titleElement) return;
    
    const modName = titleElement.textContent.trim();
    
    const purchaseContainer = document.querySelector('.game_area_purchase_game');
    if (!purchaseContainer) return;
    
    const buttonsContainer = purchaseContainer.querySelector('div > div:has(> #SubscribeItemBtn)');
    if (!buttonsContainer) return;
    
    addSearchButton(buttonsContainer, modName, 'Search Online');
}

function handleModpackPage() {
    console.log('Handling modpack page');
    
    const workshopItemSelectors = [
        '.workshopItem',
        '.workshopItemSubscription',
        '.collectionItem',
        '.workshopBrowseItem'
    ];
    
    let workshopItems = [];
    workshopItemSelectors.forEach(selector => {
        const items = document.querySelectorAll(selector);
        if (items.length > 0) {
            workshopItems = items;
        }
    });
    
    if (workshopItems.length === 0) {
        const subscriptionControls = document.querySelectorAll('.subscriptionControls');
        subscriptionControls.forEach(control => {
            const item = control.closest('div') || control.parentElement;
            if (item) {
                workshopItems.push(item);
            }
        });
    }
    
    console.log(`Found ${workshopItems.length} workshop items`);
    
    workshopItems.forEach(item => {
        addSearchButtonToModpackItem(item);
    });
}

function addSearchButton(container, modName, buttonText = 'Search Online') {
    if (container.querySelector('.workshop-search-button')) return;
    
    const searchButton = document.createElement('a');
    searchButton.className = 'btn_green_white_innerfade btn_border_2px btn_medium workshop-search-button';
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
    
    const searchIcon = createSearchIcon();
    const textSpan = document.createElement('span');
    textSpan.textContent = buttonText;
    
    searchButton.appendChild(searchIcon);
    searchButton.appendChild(textSpan);
    
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        searchModOnline(modName);
    });
    
    container.appendChild(document.createTextNode(' '));
    container.appendChild(searchButton);
    
    container.style.textAlign = 'center';
}

function addSearchButtonToModpackItem(item) {
    const subscriptionControl = item.querySelector('.subscriptionControls');
    if (!subscriptionControl) return;
    
    const titleSelectors = [
        '.workshopItemTitle',
        '.workshopItemTitle a',
        '.collectionItemTitle',
        'h3',
        'h4'
    ];
    
    let modName = '';
    titleSelectors.forEach(selector => {
        const titleElement = item.querySelector(selector);
        if (titleElement && !modName) {
            modName = titleElement.textContent.trim();
        }
    });
    
    if (!modName) {
        console.log('Could not find mod name for item:', item);
        return;
    }
    
    if (subscriptionControl.querySelector('.workshop-search-button')) return;
    
    const searchButton = document.createElement('a');
    searchButton.className = 'btn_green_white_innerfade btn_border_2px btn_medium workshop-search-button';
    searchButton.style.cssText = `
        padding: 0 0px;
        height: 30px;
        width: 30px;
        cursor: pointer;
        text-decoration: none !important;
        white-space: nowrap;
        margin-left: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        vertical-align: middle;
    `;
    
    const searchIcon = createSearchIcon();
    searchIcon.style.width = '12px';
    searchIcon.style.height = '12px';
    
    searchButton.appendChild(searchIcon);
    
    searchButton.title = `Search for "${modName}" online`;
    
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        searchModOnline(modName);
    });
    
    const subscribeBtn = subscriptionControl.querySelector('.general_btn, .subscribe, [id^="SubscribeItemBtn"]');
    if (subscribeBtn) {
        subscribeBtn.parentNode.insertBefore(searchButton, subscribeBtn.nextSibling);
    } else {
        subscriptionControl.appendChild(searchButton);
    }
    
    console.log('Added search button for:', modName);
}

function createSearchIcon() {
    const searchIcon = document.createElement('div');
    searchIcon.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 13L9 9M5.5 10C2.73858 10 0.5 7.76142 0.5 5C0.5 2.23858 2.73858 0 5.5 0C8.26142 0 10.5 2.23858 10.5 5C10.5 7.76142 8.26142 10 5.5 10Z" 
              stroke="white" stroke-width="1.5"/>
    </svg>
    `;
    return searchIcon;
}

function searchModOnline(modName) {
    const searchQuery = `"${modName}" (site:smods.ru OR site:nexusmods.com OR site:curseforge.com OR site:moddb.com)`;
    const encodedName = encodeURIComponent(searchQuery);
    window.open(`https://www.google.com/search?q=${encodedName}`, '_blank');
}

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            const breadcrumbs = document.querySelector('.breadcrumbs');
            const isModpack = breadcrumbs && 
                             (breadcrumbs.textContent.includes('Collections') || 
                              window.location.href.includes('section=collections'));
            
            if (isModpack) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { 
                        if (node.querySelector && 
                            (node.querySelector('.subscriptionControls') || 
                             node.querySelector('.workshopItem') ||
                             node.classList.contains('workshopItem'))) {
                            setTimeout(handleModpackPage, 100);
                        }
                    }
                });
            }
        }
    });
});

setTimeout(() => {
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}, 1000);
