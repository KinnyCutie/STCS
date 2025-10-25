function init() {
    const isGamePage = document.querySelector('.apphub_AppName, .game_header_content');
    
    if (isGamePage) {
        addButtonsToGamePage();
    } else {
        setTimeout(addButtonsToGeneralPage, 1000);
    }
}

function addButtonsToGamePage() {
    const possibleParents = [
        '.game_header_content',
        '.game_area_purchase_game',
        '.details_block',
        '.glance_ctn_responsive_left',
        '.game_area_purchase'
    ];
    
    let parentElement = null;
    for (const selector of possibleParents) {
        parentElement = document.querySelector(selector);
        if (parentElement) break;
    }
    
    if (parentElement) {
        createButtons(parentElement);
    } else {
        setTimeout(() => {
            const fallbackParent = document.querySelector('.page_content') || document.body;
            if (fallbackParent) createButtons(fallbackParent);
        }, 1500);
    }
}

function addButtonsToGeneralPage() {
    const possibleParents = [
        '.page_content',
        '#main_content',
        '.responsive_page_template_content',
        '.home_page_gutter'
    ];
    
    let parentElement = null;
    for (const selector of possibleParents) {
        parentElement = document.querySelector(selector);
        if (parentElement) {
            createButtons(parentElement);
            break;
        }
    }
}

function createButtons(parentElement) {
    if (document.getElementById('steam-search-buttons')) {
        return;
    }
    
    const gameName = getGameName();
    
    const container = document.createElement('div');
    container.id = 'steam-search-buttons';
    
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'steam-search-buttons';
    
    const button1 = document.createElement('button');
    button1.className = 'steam-search-btn steam-search-other';
    button1.innerHTML = '🔍 Other Sites';
    button1.onclick = () => {
        const searchUrl = `https://cse.google.com/cse?cx=20c2a3e5f702049aa#gsc.tab=0&gsc.q=${encodeURIComponent(gameName)}&gsc.sort=`;
        window.open(searchUrl, '_blank');
    };
    
    const button2 = document.createElement('button');
    button2.className = 'steam-search-btn steam-search-emulation';
    button2.innerHTML = '🎮 Emulation';
    button2.onclick = () => {
        const searchUrl = `https://cse.google.com/cse?cx=86764d87bf4b74e01#gsc.tab=0&gsc.q=${encodeURIComponent(gameName)}&gsc.sort=`;
        window.open(searchUrl, '_blank');
    };
    
    buttonWrapper.appendChild(button1);
    buttonWrapper.appendChild(button2);
    
    container.appendChild(buttonWrapper);
    
    if (parentElement.querySelector('h1, .apphub_AppName')) {
        parentElement.insertBefore(container, parentElement.querySelector('h1, .apphub_AppName').nextSibling);
    } else if (parentElement.firstChild) {
        parentElement.insertBefore(container, parentElement.firstChild);
    } else {
        parentElement.appendChild(container);
    }
}

function getGameName() {
    const selectors = [
        '.apphub_AppName',
        '.game_header_name',
        'h1',
        '.page_title',
        '.app_name'
    ];
    
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.trim()) {
            return element.textContent.trim();
        }
    }
    
    const title = document.title;
    if (title.includes('on Steam')) {
        return title.replace(' on Steam', '').trim();
    }
    
    return 'Steam Game';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

setTimeout(init, 2000);