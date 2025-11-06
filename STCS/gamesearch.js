function init() {
    chrome.storage.sync.get(['enabledButtons'], function(result) {
        const enabledButtons = result.enabledButtons || {
            gameSearch: true,
            emulator: true,
            workshop: true
        };

        const isGamePage = document.querySelector('.apphub_AppName, .game_header_content');
        
        if (isGamePage) {
            addButtonsToGamePage(enabledButtons);
        } else {
            setTimeout(() => addButtonsToGeneralPage(enabledButtons), 1000);
        }
    });
}

function addButtonsToGamePage(enabledButtons) {
    const purchaseTitle = document.querySelector('#game_area_purchase_section_add_to_cart_title, .game_area_purchase_game h2.title');
    
    if (purchaseTitle) {
        createButtonsUnderTitle(purchaseTitle, enabledButtons);
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
            createButtons(parentElement, enabledButtons);
        } else {
            setTimeout(() => {
                const fallbackParent = document.querySelector('.page_content') || document.body;
                if (fallbackParent) createButtons(fallbackParent, enabledButtons);
            }, 1500);
        }
    }
}

function addButtonsToGeneralPage(enabledButtons) {
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
            createButtons(parentElement, enabledButtons);
            break;
        }
    }
}

function createButtonsUnderTitle(purchaseTitle, enabledButtons) {
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
    
    if (enabledButtons.gameSearch) {
        const button1 = createSteamStyleButton('Search Other Sites', 'search', () => {
            const searchUrl = `https://cse.google.com/cse?cx=20c2a3e5f702049aa#gsc.tab=0&gsc.q=${encodeURIComponent(gameName)}&gsc.sort=`;
            window.open(searchUrl, '_blank');
        });
        buttonsWrapper.appendChild(button1);
    }
    
    if (enabledButtons.emulator) {
        const button2 = createSteamStyleButton('Search Emulation', 'emulation', () => {
            const searchUrl = `https://cse.google.com/cse?cx=86764d87bf4b74e01#gsc.tab=0&gsc.q=${encodeURIComponent(gameName)}&gsc.sort=`;
            window.open(searchUrl, '_blank');
        });
        buttonsWrapper.appendChild(button2);
    }
    
    if (buttonsWrapper.children.length > 0) {
        purchaseTitle.parentNode.insertBefore(buttonsWrapper, purchaseTitle.nextSibling);
    }
}


function createSteamStyleButton(text, iconType, clickHandler) {
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
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '14');
    svg.setAttribute('height', '14');
    svg.setAttribute('viewBox', '0 0 14 14');
    svg.setAttribute('fill', 'none');
    
    if (iconType === 'search') {
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M13 13L9 9M5.5 10C2.73858 10 0.5 7.76142 0.5 5C0.5 2.23858 2.73858 0 5.5 0C8.26142 0 10.5 2.23858 10.5 5C10.5 7.76142 8.26142 10 5.5 10Z');
        path1.setAttribute('stroke', 'white');
        path1.setAttribute('stroke-width', '1.5');
        svg.appendChild(path1);
    } else if (iconType === 'emulation') {
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path1.setAttribute('d', 'M 29 16 C 29 8.821429 23.178571 3 16 3 C 8.821429 3 3 8.821429 3 16 C 3 23.178571 8.821429 29 16 29 C 23.178571 29 29 23.178571 29 16 Z M 29 16 ');
		path1.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path1.setAttribute('stroke', 'white');
		path1.setAttribute('stroke-width', '2');
		path1.setAttribute('stroke-linecap', 'round');
		path1.setAttribute('stroke-linejoin', 'round');
		path1.setAttribute('fill', 'none');
    
		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', 'M 28.401786 12 L 20 12 L 20 3.598214 ');
		path2.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path2.setAttribute('stroke', 'white');
		path2.setAttribute('stroke-width', '2');
		path2.setAttribute('stroke-linecap', 'round');
		path2.setAttribute('stroke-linejoin', 'round');
		path2.setAttribute('fill', 'none');
		
		const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path3.setAttribute('d', 'M 20 28.401786 L 20 20 L 28.401786 20 ');
		path3.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path3.setAttribute('stroke', 'white');
		path3.setAttribute('stroke-width', '2');
		path3.setAttribute('stroke-linecap', 'round');
		path3.setAttribute('stroke-linejoin', 'round');
		path3.setAttribute('fill', 'none');
		
		const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path4.setAttribute('d', 'M 3.598214 20 L 12 20 L 12 28.401786 ');
		path4.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path4.setAttribute('stroke', 'white');
		path4.setAttribute('stroke-width', '2');
		path4.setAttribute('stroke-linecap', 'round');
		path4.setAttribute('stroke-linejoin', 'round');
		path4.setAttribute('fill', 'none');
		
		const path5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path5.setAttribute('d', 'M 12 3.598214 L 12 12 L 3.598214 12 ');
		path5.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path5.setAttribute('stroke', 'white');
		path5.setAttribute('stroke-width', '2');
		path5.setAttribute('stroke-linecap', 'round');
		path5.setAttribute('stroke-linejoin', 'round');
		path5.setAttribute('fill', 'none');
		
		const path6 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path6.setAttribute('d', 'M 16 6 L 16.696429 7 L 15.303571 7 Z M 16 6 ');
		path6.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path6.setAttribute('stroke', 'white');
		path6.setAttribute('stroke-width', '2');
		path6.setAttribute('stroke-linecap', 'round');
		path6.setAttribute('stroke-linejoin', 'round');
		path6.setAttribute('fill', 'none');
		
		const path7 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path7.setAttribute('d', 'M 16 26 L 15.303571 25 L 16.696429 25 Z M 16 26 ');
		path7.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path7.setAttribute('stroke', 'white');
		path7.setAttribute('stroke-width', '2');
		path7.setAttribute('stroke-linecap', 'round');
		path7.setAttribute('stroke-linejoin', 'round');
		path7.setAttribute('fill', 'none');
		
		const path8 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path8.setAttribute('d', 'M 6 16 L 7 15.303571 L 7 16.696429 Z M 6 16 ');
		path8.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path8.setAttribute('stroke', 'white');
		path8.setAttribute('stroke-width', '2');
		path8.setAttribute('stroke-linecap', 'round');
		path8.setAttribute('stroke-linejoin', 'round');
		path8.setAttribute('fill', 'none');
		
		const path9 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path9.setAttribute('d', 'M 26 16 L 25 16.696429 L 25 15.303571 Z M 26 16 ');
		path9.setAttribute('transform', 'matrix(0.4375,0,0,0.4375,0,0)');
		path9.setAttribute('stroke', 'white');
		path9.setAttribute('stroke-width', '2');
		path9.setAttribute('stroke-linecap', 'round');
		path9.setAttribute('stroke-linejoin', 'round');
		path9.setAttribute('fill', 'none');
		
		svg.appendChild(path1);
		svg.appendChild(path2);
		svg.appendChild(path3);
		svg.appendChild(path4);
		svg.appendChild(path5);
		svg.appendChild(path6);
		svg.appendChild(path7);
		svg.appendChild(path8);
		svg.appendChild(path9);
    
    }
    
    icon.appendChild(svg);
    
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