function init() {
    const isGamePage = document.querySelector('.apphub_AppName, .game_header_content');
    
    if (isGamePage) {
        addButtonsToGamePage();
    } else {
        setTimeout(addButtonsToGeneralPage, 1000);
    }
}

function addButtonsToGamePage() {
    const purchaseTitle = document.querySelector('#game_area_purchase_section_add_to_cart_title, .game_area_purchase_game h2.title');
    
    if (purchaseTitle) {
        createButtonsUnderTitle(purchaseTitle);
    } else {
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

function createButtonsUnderTitle(purchaseTitle) {
    if (document.getElementById('steam-search-buttons')) {
        return;
    }
    
    const gameName = getGameName();
    
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.id = 'steam-search-buttons';
    buttonsWrapper.style.cssText = `
        display: flex;
        gap: 10px;
        margin: 15px 0;
        justify-content: flex-start;
        flex-wrap: wrap;
    `;
    
    const button1 = createSteamStyleButton('Search Piracy Sites', `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 13L9 9M5.5 10C2.73858 10 0.5 7.76142 0.5 5C0.5 2.23858 2.73858 0 5.5 0C8.26142 0 10.5 2.23858 10.5 5C10.5 7.76142 8.26142 10 5.5 10Z" 
                  stroke="white" stroke-width="1.5"/>
        </svg>
    `, () => {
        const searchUrl = `https://cse.google.com/cse?cx=20c2a3e5f702049aa#gsc.tab=0&gsc.q=${encodeURIComponent(gameName)}&gsc.sort=`;
        window.open(searchUrl, '_blank');
    });
    
    const button2 = createSteamStyleButton('Search Emulation', `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 12.5C10.0376 12.5 12.5 10.0376 12.5 7C12.5 3.96243 10.0376 1.5 7 1.5C3.96243 1.5 1.5 3.96243 1.5 7C1.5 10.0376 3.96243 12.5 7 12.5Z" 
                  stroke="white" stroke-width="1.5"/>
            <path d="M5 5L9 9M9 5L5 9" stroke="white" stroke-width="1.5"/>
        </svg>
    `, () => {
        const searchUrl = `https://cse.google.com/cse?cx=86764d87bf4b74e01#gsc.tab=0&gsc.q=${encodeURIComponent(gameName)}&gsc.sort=`;
        window.open(searchUrl, '_blank');
    });
    
    buttonsWrapper.appendChild(button1);
    buttonsWrapper.appendChild(button2);
    
    purchaseTitle.parentNode.insertBefore(buttonsWrapper, purchaseTitle.nextSibling);
}

function createSteamStyleButton(text, iconSvg, clickHandler) {
    const button = document.createElement('a');
    button.className = 'btn_green_white_innerfade btn_border_2px btn_medium';
    button.style.cssText = `
        padding: 0 15px 0 10px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        text-decoration: none !important;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    `;
    
    const icon = document.createElement('div');
    icon.innerHTML = iconSvg;
    
    const buttonText = document.createElement('span');
    buttonText.textContent = text;
    
    button.appendChild(icon);
    button.appendChild(buttonText);
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        clickHandler();
    });
    
    return button;
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