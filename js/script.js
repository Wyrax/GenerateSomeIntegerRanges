window.addEventListener('DOMContentLoaded', () => {
    console.log('%c DOM fully loaded. ', 'background: #222; color: #bada55');

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    // var file = new Blob(["\ufeff", content], {type: contentType});
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

let joinedDataMergeText;

copyButton = document.getElementById('copy_button');
saveButton = document.getElementById('save_button');

copyButton.addEventListener('click', () => {
    generateRanges();
    document.getElementById('output_area').select();
    document.execCommand('copy');
    copyButton.textContent = 'COPIED!';
    copyButton.classList.add('animate_width');
});

saveButton.addEventListener('click', () => {
    download(joinedDataMergeText, 'data-merge.txt', 'text/plain');
    document.getElementById('output_area').select();
    saveButton.textContent = 'SAVED!';
    saveButton.classList.add('animate_width');
});

function generateRanges() {
    let inputArea = document.getElementById('input_area');
    let inputText = inputArea.value;
    console.log(inputText);
    filteredTextArray = inputText.replace(/[^0-9\s-,]/g, '').replace(/[\r\n,]/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
    console.log(filteredTextArray);

    let unpackedRangesArray = [];

    if (document.getElementById('header_checkbox').checked) {
        let headerText = document.getElementById('header_option').value;
        unpackedRangesArray.push(headerText);
    }

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
    console.log(unpackedRangesArray);

    joinedDataMergeText = unpackedRangesArray.join('\n');

    let outputArea = document.getElementById('output_area');
    outputArea.textContent = joinedDataMergeText;
    outputArea.style.height = (outputArea.scrollHeight) + 'px';

    
    // download(joinedDataMergeText, 'data-merge.txt', 'text/plain');
}

// Textarea autoresize functions by DreamTeK (https://stackoverflow.com/users/2120261/dreamtek)
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
    }

});