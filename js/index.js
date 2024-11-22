const letter = document.querySelectorAll('.letter');
const answerArr = [];

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function verify() {
    let answerStr = ''
    for (let i = 0; i < answerArr.length; i++) {
        answerStr += answerArr[i];
    }
}

async function init() {
    document.addEventListener('keyup', function letterVerification (event) {
        const keyStroke = event.key;
        console.log(keyStroke)

        if (keyStroke === 'Enter') {
            if (answerArr.length === 5) {
                // letters[index].innerText = keyStroke;
                verify();
            }
        } else if (keyStroke === 'Backspace') {
            if (answerArr.length > 0) {
                answerArr.pop()
            }
        } else if (isLetter(keyStroke)) {
            if (answerArr.length < 5) {
                answerArr.push(keyStroke.toUpperCase());
            } 
        } 
        console.log(answerArr)
    })
}

init();