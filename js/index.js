const letter = document.querySelectorAll('.letter');
const answerArr = [[],[],[],[],[],[]];
let submissions = 0;
let done = false;
let word = '';

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function verify() {
    //convert guess into word
    let answerStr = ''
    const container = answerArr[submissions].toString();
    for (let i = 0; i < container.length; i++) {
        if (container[i] === ',') {

        } else {
            answerStr += container[i];
        }
    }

    //retrieve word
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    if (word.length === 0) {
        word = resObj.word.toUpperCase();
    }
    console.log(word);

    //valid word
    const validate = await fetch('https://words.dev-apis.com/validate-word', {
        method: "POST",
        body: JSON.stringify({ word: answerStr})
    });
    const validateObj = await validate.json();
    const valid = validateObj.validWord;

    if (!valid) {
        for (let i = 0; i < answerArr[submissions].length; i++) {
            letter[((submissions + 1) * 5) + i - 5].classList.add("invalid");
        }
        for (let i = 0; i < answerArr[submissions].length; i++) {
            //need to learn about this more
            setTimeout(function () {
                letter[((submissions + 1) * 5) + i - 5].classList.remove("invalid");
            }, 1000);
        }
        
        return;
    }

    //correct word
    if (answerStr === word) {
        alert('You\'ve won!');
        done = true;
        return;
    }

    //flag initial greens
    let correctDict = {}
    let guessStr = ''
    for (let i = 0; i < word.length; i++) {
        if (answerStr[i] === word[i]) {
            //to modify an html's class, do querySelectorResult.class.toggle('class', bool)/.add('class')/.remove('class')
            letter[((submissions + 1) * 5) + i - 5].classList.add("correct");
            guessStr += ' '
        } else {
            if (correctDict[word[i]]) {
                correctDict[word[i]] += 1;
            } else {
                correctDict[word[i]] = 1;
            }

            guessStr += answerStr[i];
        }
    }

    //flag yellows and greys
    for (let i = 0; i < guessStr.length; i++) {
        if (guessStr[i] in correctDict && correctDict[guessStr[i]] > 0) {
            correctDict[guessStr[i]] -= 1;
            letter[((submissions + 1) * 5) + i - 5].classList.add("close")
        } else if (guessStr[i] === ' ') {

        } else {
            letter[((submissions + 1) * 5) + i - 5].classList.add("incorrect")
        }
    }

    //6 guesses are over
    submissions += 1;
    if (submissions === 6) {
        alert('You\'ve lost');
        done = true;
        return;
    }
}

async function init() {
    document.addEventListener('keyup', function letterVerification (event) {
        const keyStroke = event.key;

        if (keyStroke === 'Enter') {
            if (answerArr[submissions].length === 5) {
                verify();
            }
        } else if (keyStroke === 'Backspace') {
            if (answerArr[submissions].length > 0) {
                console.log(((submissions + 1) * 5) - (5 - answerArr[submissions].length));
                letter[((submissions + 1) * 5) - (5 - answerArr[submissions].length) - 1].innerText = "";
                answerArr[submissions].pop()
            }
        } else if (isLetter(keyStroke)) {
            if (answerArr[submissions].length < 5) {
                inputKeyStroke = keyStroke.toUpperCase();
                letter[((submissions + 1) * 5) - (5 - answerArr[submissions].length)].innerText = inputKeyStroke;
                answerArr[submissions].push(inputKeyStroke);
            }
        }
        console.log(answerArr[submissions])
    })
}

init();