let dataGenerated = false;

window.addEventListener('DOMContentLoaded', () => {
    console.log('%c >>> DOM loaded ', 'background: #222; color: #bada55');

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    // var file = new Blob(["\ufeff", content], {type: contentType});
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

let joinedDataMergeText;
let headerOption = document.getElementById('header_option');
console.log(headerOption.value);
let inputArea = document.getElementById('input_area');
let outputArea = document.getElementById('output_area');
let copyButton = document.getElementById('copy_button');
let saveButton = document.getElementById('save_button');

headerOption.addEventListener('input', function() {
    renewButtons();
});

copyButton.addEventListener('click', () => {
    generateRanges();
    if (dataGenerated) {
        outputArea.select();
        document.execCommand('copy');
        copyButton.textContent = 'COPIED!';
        copyButton.classList.add('animate_width');
        // generateRanges();
    }
});

saveButton.addEventListener('click', () => {
    generateRanges();
    if (dataGenerated) {
        outputArea.select();
        saveButton.textContent = 'SAVED!';
        saveButton.classList.add('animate_width');
        // getFileName();
        download(joinedDataMergeText, 'data-merge.txt', 'text/plain');
    } else {
        // riseWarning('no data');
    }
});

function generateRanges() {
    // let inputArea = document.getElementById('input_area');
    // let inputText = inputArea.value;
    // let outputArea = document.getElementById('output_area');
    outputArea.value = '';
    dataGenerated = false;

if (inputArea.value == '') {
    riseWarning('no digits');
    inputArea.select();
    renewButtons();
    return;
}

    console.log('%c Input text: ', 'background: #ccc; color: black');
    console.log(inputArea.value);
    filteredTextArray = inputArea.value.replace(/[^0-9\s-,;]/g, '').replace(/[\r\n,;]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
    console.log('%c Filtered text: ', 'background: #df8482; color: black');
    console.log(filteredTextArray);

    let unpackedRangesArray = [];

    for (let i = 0; i < filteredTextArray.length; i++) {
        if (filteredTextArray[i].indexOf('-') > -1) {
            let rangeMinMax = filteredTextArray[i].split('-');

            // broken range or negative range
            if (rangeMinMax[0] == '') {
                rangeMinMax[0] = rangeMinMax[1];
            }
            if (rangeMinMax[1] == '') {
                rangeMinMax[1] = rangeMinMax[0];
            }


            for (let j = parseInt(rangeMinMax[0]); j <= parseInt(rangeMinMax[rangeMinMax.length-1]); j++) {
                unpackedRangesArray.push(j);
            };
        } else {
            unpackedRangesArray.push(parseInt(filteredTextArray[i]));
        };
    };
    if (document.getElementById('sort_checkbox').checked) {
        unpackedRangesArray.sort(function(a, b){return a - b});
    }

    if (isNaN(unpackedRangesArray[0])) {
        riseWarning('NaN');
        inputArea.select();
        renewButtons();
        return;
    }

    if (document.getElementById('header_checkbox').checked) {
        let headerText = document.getElementById('header_option').value;
        unpackedRangesArray.unshift(headerText);
    }
    console.log('%c Unpacked ranges: ', 'background: #99ccff; color: black');
    console.log(unpackedRangesArray);
    if (document.getElementById('duplicates_checkbox').checked) {
        let dataMergeSet = new Set(unpackedRangesArray);
        console.log('%c Removed duplicates: ', 'background: #99ff99; color: black');
        console.log(dataMergeSet);
        joinedDataMergeText = Array.from(dataMergeSet).join('\n');
    } else {
        joinedDataMergeText = unpackedRangesArray.join('\n');
    }
    console.log('%c Result generated: ', 'background: #ff9900; color: black');
    console.log(joinedDataMergeText.split('\n'));

    outputArea.value = joinedDataMergeText;

    if (outputArea.scrollHeight > 500) {
        outputArea.style.height = '500px';
    } else {
        outputArea.style.height = (outputArea.scrollHeight) + 'px';
    }
    dataGenerated = true;
    console.log('%c <<< Data served ', 'background: #222; color: #bada55');
    // download(joinedDataMergeText, 'data-merge.txt', 'text/plain');
}

function renewButtons() {
    // if (!inputArea.textContent == '') {
    console.log('renew buttons');
    copyButton.classList.remove('animate_width');
    saveButton.classList.remove('animate_width');
    // if (!outputArea.value == '← INPUT HAS NO DIGITS' || !outputArea.value == '← NOT A NUMBER') {
        // outputArea.value = '';
        // outputArea.classList.remove('error');
    // }

    copyButton.textContent = 'GENERATE & COPY';
    saveButton.textContent = 'GENERATE & SAVE';
    // } else {
    // outputArea.value = '';
    // outputArea.classList.remove('error');
    // }
}

function riseWarning(type) {
    let warning;
    switch (type) {
        case 'no data':
            warning = '← NO DATA TO SAVE';
            break;
        case 'NaN':
            warning = '← NOT A NUMBER';
            break;
        case 'no digits':
            warning = '← NO DIGITS FOUND';
            break;
        default:
            console.log('%c Unidentified error', 'background: red; color: white');
            break;
    }
    console.log(`%c Warning: ${warning} `, 'background: red; color: white');
    outputArea.value = warning;
    outputArea.classList.add('error');
    dataGenerated = false;
}

// Textarea autoresize by DreamTeK (https://stackoverflow.com/users/2120261/dreamtek)
    const tx = document.getElementsByTagName('textarea');
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;');
        // tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
        tx[i].addEventListener('input', OnInput, false);
        tx[i].addEventListener('change', OnInput, false);
    }

    function OnInput() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        // if (!inputArea.textContent == '') {
            renewButtons();
        // } else {
            // IF dataGenerated = false!
            if (!dataGenerated) {
                outputArea.value = '';
                outputArea.classList.remove('error');
            }

        // }
    }

});