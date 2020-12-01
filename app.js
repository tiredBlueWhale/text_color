const wrapperText = document.getElementById('wrapper_text');
const wrapperTextColor = document.getElementById('wrapper_text_color');
const wrapperColor = document.getElementById('wrapper_color');

const textField = document.getElementById('text');
const textColorField = document.getElementById('text_color');
const colorField = document.getElementById('color');

const wrapperTextarea = document.getElementById('wrapper_textarea_marker');
const settingsElement = document.getElementById('settings');
const defaultColors = [
    { letters: 'asdfzuiopü', color: '#6d5851' },
    { letters: 'qwert', color: '#4b759a' },
    { letters: 'm nghjkl', color: '#d0c197' },
    { letters: '^_yxcvvb', color: '#40E0D0' },
    { letters: '', color: '' },
];
var settingsTextColor = [];

const deleteColor = (letter) => {
    console.log('deleteColor: ' + letter);
    for (let mark of wrapperTextColor.getElementsByTagName('mark')) {
        if (mark.innerText== letter) {
            mark.style.backgroundColor = 'transparent';
        }
    }
    wrapperColor.innerHTML = wrapperTextColor.innerHTML;
}

const addColor = (setting) => {
    for (let mark of wrapperTextColor.getElementsByTagName('mark')) {
        if (setting.letters.includes(mark.innerText)) {
            mark.style.backgroundColor = setting.color;
        }
    }
    wrapperColor.innerHTML = wrapperTextColor.innerHTML;
}

const updateTextarea = (text) => {
    textField.value = text;
    wrapperText.innerHTML = text;
    textColorField.value = text;
    colorField.value = text;
    let html = '';

    [...text].forEach(letter => {
        let index = checkDuplicateLetter(letter)
        html += index >= 0 ? `<mark style="background-color: ${settingsTextColor[index].color}">${letter}</mark>` : `<mark>${letter}</mark>`;
    });

    wrapperTextColor.innerHTML = html;
    wrapperColor.innerHTML = html;
};

wrapperTextarea.addEventListener('input', (event) => {
    updateTextarea(event.target.value);
})

document.getElementById('button_settings').addEventListener('click', () => {
    let display = settingsElement.style.display;
    settingsElement.style.display = display != 'flex' ? 'flex' : 'none';
});

// SETTINGS
const deleteElements = (target) => {
    let index = target.parentNode.getElementsByTagName('input')[0].id.substring(5, 6);
    let deletedSetting = settingsTextColor.splice(index, 1)[0];
    target.parentElement.parentElement.remove();

    [...deletedSetting.letters].forEach(letter => {
        deleteColor(letter);
    });

    return index;
}

const updateTextSettingElements = (index) => {
    index++;
    while (document.getElementById(`letter${index}`)) {
        let letterInput = document.getElementById(`letter${index}`);
        letterInput.id = `letter${index - 1}`;
        letterInput.parentNode.id = index - 1;
        document.getElementById(`color${index}`).id = `color${index - 1}`;
        document.getElementById(`warning${index}`).id = `warning${index - 1}`;
        index++;
    }
}

const deleteButtonFunction = (target) => {
    updateTextSettingElements(deleteElements(target));
}

function updateAddButton(target) {
    console.log(target)
    target.id = 'button_delete';
    target.innerHTML = '&#8722;'
    // target.innerHTML = minusSVG();
    target.addEventListener('click', () => deleteButtonFunction(target), { once: true });
}

const getDeleteButtonRow = (index, letters, color) => {
    let view =
        `<div class="column_setting">
        <div id="${index}" class="row_setting">
        <input type="color" id="color${index}" value="${color}">
            <input type="text" id="letter${index}" value="${letters}">
            
            <button id="button_delete">&#8722;</button>
        </div>
        <label id="warning${index}">warning</label> 
    </div>`;
    return view;
}

const randomColor = () => { return '#' + Math.floor(Math.random() * 16777215).toString(16); }

const getAddButtonRow = (index, color) => {
    let view =
        `<div id="${index}" class="row_setting">
        <input type="color" id="color${index}" value="${color}">
        <input type="text" id="letter${index}">
        
        <button id="button_add">&#43;</button>
    </div>
    <label id="warning${index}">warning</label>`;
    return view;
}

const appendSettingRow = (index) => {
    let row = document.createElement('div');
    row.className = "row_setting";
    let color = randomColor();
    row.innerHTML = getAddButtonRow(index, color);
    settingsTextColor.push({ letters: '', color: color });
    // settingsElement.children
    settingsElement.insertBefore(row, document.getElementById('heading_layout'));
}

const setAddButton = () => {
    document.getElementById('button_add').addEventListener('click', (event) => {
        let target = event.target || event.srcElement;
        updateAddButton(target)
        appendSettingRow(target.parentElement.id + 1);
        setAddButton();
    }, { once: true });
}

const initSettings = () => {
    // localStorage.clear();
    let savedSettingsTextColor = JSON.parse(localStorage.getItem("settingsTextColor"));
    settingsTextColor = savedSettingsTextColor ? savedSettingsTextColor : JSON.parse(localStorage.getItem("defaultSettings"));;

    settingsElement.innerHTML = '<h2>Colors</h2>';
    let i = 0;
    while (i < settingsTextColor.length - 1) {
        settingsElement.innerHTML += getDeleteButtonRow(i, settingsTextColor[i].letters, settingsTextColor[i].color);
        i++;
    }
    let color = randomColor();
    settingsTextColor[settingsTextColor.length - 1].color = color;
    settingsElement.innerHTML += `<div>${getAddButtonRow(i, color)}</div>`

    settingsElement.innerHTML += 
    `<h2 id="heading_layout">Layout</h2>
    <div class="row_setting">
        <div class="column_setting">
            <input type="checkbox" id="direction" checked>
            <label class="checkbox_label" for="direction">Column</label>
        </div>
        <div class="column_setting">
            <input type="checkbox" id="hideText" checked>
            <label class="checkbox_label" for="hideText">Text</label>
        </div>
        <div class="column_setting">
            <input type="checkbox" id="hideTextColor" checked>
            <label class="checkbox_label" for="hideTextColor">TextColor</label>
        </div>
        <div class="column_setting">
            <input type="checkbox" id="hideColor" checked>
            <label class="checkbox_label" for="hideColor">Color</label>
        </div>
    </div>
    <button id="button_reset" >Reset Default</button>
    `;

    document.querySelectorAll('#button_delete').forEach(deleteButton => {
        deleteButton.addEventListener('click', () => deleteButtonFunction(deleteButton), { once: true });
    });
    document.getElementById('button_reset').addEventListener('click', () => {
        localStorage.removeItem('settingsTextColor');
        initSettings();
        updateTextarea(textField.value);
    })
    setAddButton();
}

const checkDuplicateLetter = (currentInput) => {
    let index = -1;
    settingsTextColor.forEach((setting, i) => {
        if (setting.letters.includes(currentInput)) {
            index = i;
        }
    });
    return index;
}

const checkDuplicateColor = (currentColor) => {
    for (let i = 0; i < settingsTextColor.length; i++) {
        if (settingsTextColor[i].color == currentColor) return i;
    }
    return -1;
}

let warningElement = null;
settingsElement.addEventListener('input', (event) => {
    let id = event.target.id;
    let inputValue = event.target.value;

    if (warningElement) warningElement.style.visibility = 'hidden';

    if (id.includes('letter')) {
        let setting = settingsTextColor[id.substring(6, 7)];
        let duplicate = checkDuplicateLetter(event.data);
        if (duplicate == -1) {
            if (setting.letters.length < inputValue.length) {
                setting.letters = inputValue;
                addColor(setting);

            } else if (setting.letters.length > inputValue.length) {
                let i = 0;
                while (setting.letters.charAt(i) == inputValue.charAt(i)) { i++; }
                deleteColor(setting.letters.charAt(i));
                setting.letters = inputValue;
            } else {
                console.error('Should not be possible');
            }
        } else {
            event.target.value = setting.letters;
            warningElement = document.getElementById(`warning${duplicate}`);
            warningElement.style.visibility = 'visible';
            warningElement.innerText = `! ${event.data} is used here already!`;
        }

    } else if (id.includes('color')) {
        let setting = settingsTextColor[id.substring(5, 6)];
        let duplicate = checkDuplicateColor(inputValue);
        if (duplicate == -1) {
            setting.color = inputValue;
            addColor(setting);

        } else {
            event.target.value = setting.color;
            warningElement = document.getElementById(`warning${duplicate}`);
            warningElement.style.visibility = 'visible';
            warningElement.innerText = `! ${inputValue} is used here already!`;
        }

    } else {
        if (event.target.id == 'direction') wrapperTextarea.style.flexDirection = event.target.checked ? 'column' : 'row';
        if (event.target.id == 'hideText') textField.parentElement.style.display = event.target.checked ? 'grid' : 'none';
        if (event.target.id == 'hideTextColor') textColorField.parentElement.style.display = event.target.checked ? 'grid' : 'none';
        if (event.target.id == 'hideColor') colorField.parentElement.style.display = event.target.checked ? 'grid' : 'none';
    }
})

window.addEventListener("load", () => {
    localStorage.setItem('defaultSettings', JSON.stringify(defaultColors));
    initSettings();
    updateTextarea('Hello this is some random text to show you what this is can and can not ^_^ ');
    
});

window.addEventListener('unload', () => {
    console.log('unload');
    localStorage.setItem('settingsTextColor', JSON.stringify(settingsTextColor));
});

