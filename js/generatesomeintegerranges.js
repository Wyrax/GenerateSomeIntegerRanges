let dataGenerated = false;

window.addEventListener('DOMContentLoaded', () => {
console.log('%c >>> DOM loaded ', 'background: #222; color: #bada55');

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    // let file = new Blob(["\ufeff", content], {type: contentType});
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName+'.txt';
    a.click();
}

let joinedDataMergeText;
const headerOption = document.getElementById('header_option');
const fileNameOption = document.getElementById('filename_option');
const inputArea = document.getElementById('input_area');
const outputArea = document.getElementById('output_area');
const copyButton = document.getElementById('copy_button');
const saveButton = document.getElementById('save_button');

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', renewButtons);
    }

headerOption.addEventListener('input', function() {
    renewButtons();
});
fileNameOption.addEventListener('input', function() {
    renewButtons();
});

copyButton.addEventListener('click', () => {
    generateRanges();

    if (dataGenerated) {
        outputArea.select();
        document.execCommand('copy');
        copyButton.textContent = 'COPIED!';
        copyButton.classList.add('animate_width');
    }
});

saveButton.addEventListener('click', () => {
    generateRanges();

    if (dataGenerated) {
        outputArea.select();
        saveButton.textContent = 'SAVED!';
        saveButton.classList.add('animate_width');
        let fileName = fileNameOption.value;
        download(joinedDataMergeText, fileName, 'text/plain');
    } else {
        // riseWarning('no data');
    }
});

function generateRanges() {
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

    filteredTextArray = inputArea.value.replace(/[^0-9\s-,;\.]/g, '').replace(/[\r\n,;\.]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
    console.log('%c Filtered text: ', 'background: #df8482; color: black');
    console.log(filteredTextArray);

    let unpackedRangesArray = [];

    for (let i = 0; i < filteredTextArray.length; i++) {
        if (filteredTextArray[i].indexOf('-') > -1) {
            let rangeMinMax = filteredTextArray[i].split('-');

            // Broken range or negative range negation
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
        let headerText = headerOption.value;
        unpackedRangesArray.unshift(headerText);
    }
    console.log('%c Unpacked ranges: ', 'background: #99ccff; color: black');
    unpackedRangesArray = unpackedRangesArray.map(String);
    console.log(unpackedRangesArray);

    if (document.getElementById('zeros_checkbox').checked) {
        //(unpackedRangesArray.getMaxValue
        // let longestValue = '';
        let longestValueLength = 0;
        for (let i = 0; i < unpackedRangesArray.length; i++) {
            // console.log('unpackedRangesArray[i] = '+unpackedRangesArray[i]);
            // console.log('unpackedRangesArray[i].length = '+unpackedRangesArray[i].length);
            // console.log({longestValueLength});
            if (unpackedRangesArray[i].length > longestValueLength) {
                // longestValue = unpackedRangesArray[i];
                longestValueLength = unpackedRangesArray[i].length; //toString
            }
        }
        // console.log({longestValue});
        console.log({longestValueLength});
        //forEach index.value.length-maxValue.length add '0'
        unpackedRangesArray.forEach(addLeadingZeros);

        function addLeadingZeros(str) {
            console.log('str before: ' + str);
            console.log('str padded: ' + str.padStart(longestValueLength, '0'));
            return str.padStart(longestValueLength, '0');
            console.log('str after' + str);
            console.log('padStart+');
        }
    }

    if (document.getElementById('duplicates_checkbox').checked) {
        let dataMergeSet = new Set(unpackedRangesArray);
        console.log('%c Removed duplicates: ', 'background: #99ff99; color: black');
        console.log(dataMergeSet);
        joinedDataMergeText = Array.from(dataMergeSet).join('\n');
    } else {
        joinedDataMergeText = unpackedRangesArray.join('\n');
    }
    console.log('%c Result generated: ', 'background: #ff9900; color: black');
    console.log(joinedDataMergeText.split('\n')); //split applied to compress output in the console into array
    // console.log(joinedDataMergeText);

    outputArea.value = joinedDataMergeText;

    if (outputArea.scrollHeight > 500) {
        outputArea.style.height = '500px';
    } else {
        outputArea.style.height = 'auto';
        outputArea.style.height = outputArea.scrollHeight + 'px';
    }

    dataGenerated = true;
    console.log('%c <<< Data served ', 'background: #222; color: #bada55');
}

function renewButtons() {
    console.log('renew buttons');
    copyButton.classList.remove('animate_width');
    saveButton.classList.remove('animate_width');
    copyButton.textContent = 'GENERATE & COPY';
    saveButton.textContent = 'GENERATE & SAVE';
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
    outputArea.style.height = 'auto';
    outputArea.style.height = outputArea.scrollHeight + 'px';
}

// Textarea autoresize by DreamTeK (https://stackoverflow.com/users/2120261/dreamtek)
const tx = document.getElementsByTagName('textarea');
for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;');
    tx[i].addEventListener('input', OnInput);
    tx[i].addEventListener('change', OnInput);
}

function OnInput() {
    this.style.height = 'auto';
    if (this.scrollHeight > 500) {
        this.style.height = '500px';
    } else {
        this.style.height = (this.scrollHeight) + 'px';
    }

    renewButtons();
    
    if (!dataGenerated) {
        outputArea.value = '';
        outputArea.classList.remove('error');
    }
}

});