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
let inputArea = document.getElementById('input_area');
let outputArea = document.getElementById('output_area');
let copyButton = document.getElementById('copy_button');
let saveButton = document.getElementById('save_button');
let dataGenerated = false;

// inputArea.addEventListener('change', function() {
//     inputArea.value = '';
//     queryData = inputArea.value;
// });

copyButton.addEventListener('click', () => {
    outputArea.select();
    document.execCommand('copy');
    copyButton.textContent = 'COPIED!';
    copyButton.classList.add('animate_width');
    generateRanges();
});

saveButton.addEventListener('click', () => {
    if (dataGenerated) {
        download(joinedDataMergeText, 'data-merge.txt', 'text/plain');
        outputArea.select();
        saveButton.textContent = 'SAVED!';
        saveButton.classList.add('animate_width');
        generateRanges();
    } else {
        outputArea.textContent = '← NO DATA TO SAVE';
        outputArea.classList.add('error');
    }
});

function generateRanges() {
    // let inputArea = document.getElementById('input_area');
    // let inputText = inputArea.value;
    // let outputArea = document.getElementById('output_area');

if (inputArea.value == '') {
    console.log('%c Input HAS NO DIGITS ', 'background: red; color: white');
    outputArea.textContent = '← INPUT HAS NO DIGITS';
    outputArea.classList.add('error');
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
    //HERE NaN check
    if (isNaN(unpackedRangesArray[0])) {
        console.log('%c NOT A NUMBER ', 'background: red; color: white');
        outputArea.textContent = '← NOT A NUMBER';
        outputArea.classList.add('error');
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

    outputArea.textContent = joinedDataMergeText;

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
    // if (!outputArea.textContent == '← INPUT HAS NO DIGITS' || !outputArea.textContent == '← NOT A NUMBER') {
        // outputArea.textContent = '';
        // outputArea.classList.remove('error');
    // }

    copyButton.textContent = 'GENERATE & COPY';
    saveButton.textContent = 'GENERATE & SAVE';
    // } else {
    // outputArea.textContent = '';
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
            warning = '← INPUT HAS NO DIGITS';
            break;
    
        default:
            break;
    }
    outputArea.textContent = warning;
    outputArea.classList.add('error');
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
            outputArea.textContent = '';
            outputArea.classList.remove('error');
        // }
    }

});