document.addEventListener('DOMContentLoaded', () => {
    createSquares();

    let guessedWords = [[]] //guessed words array - to keep a record of all the guessed words (upto 6 attempts)
    let availSpace = 1; //always going to be 1 initially as you can input only 1 letter at a time starting from first array element
    let word = '';
    let guessedWordCount = 0;
    const keys = document.querySelectorAll('.keyboard-row button');
    let lookUp = '';
    let wordList = null;
    let correctLetters = [];
    let incorrectPos = [];
    
    async function getData() { //fetch wordList asynchronously 
        try {
            let res = await fetch('wordsList.json')
            return await res.json()
        } catch (e) {
            console.log('ERROR fetching words list', e);
        }
    }


    function randomWordIndex() {
        const rand = Math.floor((Math.random() * 5757) + 1);
        // console.log(rand);
        return rand
    }

    getData()
        .then(res => {
            // console.log('total number of words in list: ' + res.length);
            wordList = res;
            // console.log(wordList.length);
            // word = res[randomWordIndex()]; //sets global variable word from the list
            word = 'bacon'; //sets global variable word from the list
            if (word === undefined) {
                word = res[randomWordIndex()]; //get another word
            }
            // console.log(`Word is: ${word}`);
        })


    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length //zero at the start as guessedWords array is empty
        return guessedWords[numberOfGuessedWords - 1]; //returns the current array we are updating

    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr && currentWordArr.length < 5) { //at the current word array and if less than the 5th index (max 5 letters)
            currentWordArr.push(letter);

            const availSpaceEl = document.getElementById(String(availSpace)) //index of tile where letter would go
            availSpace = availSpace + 1; //increment availSpace by 1
            availSpaceEl.textContent = letter; //insert letter into availSpace element

        }

    }

    function createSquares() {
        const gameBoard = document.getElementById('board');
        //create the 30 squares for game board
        for (let i = 0; i < 30; i++) {
            let square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('id', String(i + 1)); //sets id attribute of each square as index
            gameBoard.appendChild(square);
        }
    }

    function checkValidWord(wordToCheck) {
        console.log(`word to check ${wordToCheck}`);
        lookUp = wordList.find(el => el === `${wordToCheck}`);
        return lookUp !== undefined;
    }

    function handleSubmitWord() { //when enter key is pressed
        const currentWordArr = getCurrentWordArr();
        // console.log('enter key pressed checking word: ', currentWordArr);

        if (currentWordArr.length !== 5) {
            return alert('Word must be 5 letters');
        }

        //takes array and joins into a single string so we can compare to answer
        const currentWord = currentWordArr.join('');

        //check currentWord to make sure it is a valid word

        const isValid = checkValidWord(currentWord);

        if (!isValid) {
            return alert('Sorry Word is Invalid!');
        }


        //animation + color for when word is submitted (green for correct place and letter, yellow for correct letter, grey for incorrect letter)

        function updateKeyboard(letter, color) {
            // console.log(letter);
            // console.log(color); //apply this color to keys loop through keys and match with data-attribute
            const keyBoard = document.querySelectorAll(`[data-key=${letter}]`);
            keyBoard[0].style.color = color
            keyBoard[0].style.opacity = '0.5';
        }

        function checkWord(letter, index) {
            // console.log(`checking for letter in ${word}`, letter);


            const correctLetter = word.includes(letter);

            // console.log('is correct letter: ' + correctLetter);//true or false
            // console.log('all guesses so far:', guessedWords);

            let letterPosition = word.indexOf(letter);
            // console.log('my guess:',currentWordArr);
            let actualWord = word.split('');
            // console.log('actual word: ', actualWord);

            let position = [];
            for (let i = 0; i < actualWord.length; i++) {
                if(actualWord[i] === letter){
                    position.push(i);
                }
            }
            // console.log(position); //gives the index(s) where the letter appears...

            // // console.log('Word map: ', wordMap);
            // console.log('actual letter position: ', letterPosition);
            // console.log('my letter position: ', index);
            // console.log('repeated letter pos: ', position);

            if (!correctLetter) {
                // no correct letters apply regular color
                const color = 'rgb(58,58,60)';
                // console.log('no correct letters in word');
                updateKeyboard(letter, color);
                return color;
            }

            if(currentWordArr[index] === actualWord[index]){
                console.log('my guess: '+currentWordArr[index]);
                console.log('actual word: '+actualWord[index]);
            }

// letterPosition === index || position[1] === index || position[2] === index || position[3] === index

            if ((currentWordArr[index] === actualWord[index])) {
                //correct letter + position GREEN
                correctLetters.push(currentWordArr[index]);
                console.log(correctLetters);
                const color = 'rgb(34,139,34)';
                // console.log('correct letter and position');
                updateKeyboard(letter, color);
                return color;
            } else {
                //correct letter but not correct position YELLOW
                const color = 'rgb(201 180 88)';
                incorrectPos.push(letter);
                // console.log('correct letter but not correct position');
                updateKeyboard(letter, color);
                return color;
            }


        }
        
        console.log(correctLetters);
        console.log(incorrectPos);
        const row = (guessedWordCount * 5) + 1  //5 letters in each word and +1 to get first letterid

        const interval = 500; //timeout interval

        //loop through current words letters
        currentWordArr.forEach((letter, index) => {

            setTimeout(() => {
                const letterId = row + index;
                const tileEl = document.getElementById(`${letterId}`);
                const tileColor = checkWord(letter, index);
                tileEl.classList.add('animateFlip');
                tileEl.style.color = tileColor;
            }, interval)

        })
        guessedWordCount++;

        //apply color update to keyboard

        if (currentWord === word) {
            return alert(`Congratulations You Got The Word: ${word}!`);
        }

        if (guessedWords.length === 6) {
            alert(`Sorry no more guesses you lose! The word was: ${word}`)
        }


        // console.log('guessed word array', currentWordArr)
        //
        // console.log(`guessed word string: ${currentWord}`);
        // console.log('all guessedwords so far:', guessedWords);
        // console.log(`total guessed words: ${guessedWordCount}`)
        // console.log(`total guessed words: ${guessedWords.length}`)

        guessedWords.push([]);//if not correct word push new array into guessedWords array
    }

    function handleDeleteKey() {
        const currentWordArr = getCurrentWordArr();
        // console.log(currentWordArr)
        if (!currentWordArr.length) {
            return
        }
        //removes from array
        currentWordArr.pop();
        //remove from board

        //set the current word to new array that removed last el from array
        guessedWords[guessedWords.length - 1] = currentWordArr
        const lastEl = document.getElementById(String(availSpace - 1));
        lastEl.innerHTML = "";
        availSpace = availSpace - 1

    }


    for (let i = 0; i < keys.length; i++) {
        //add eventListener to each keyboard-key button
        keys[i].addEventListener('click', ({target}) => {
            const letter = target.getAttribute('data-key');

            if (letter === 'enter') {
                handleSubmitWord();
                //updateKeyBoard(letter);
                return
            }

            if (letter === 'del') {
                handleDeleteKey();
                return
            }

            updateGuessedWords(letter);
        })
    }

    const resetGame = document.getElementById('reset');
    resetGame.addEventListener('click', function () {
        //reset these variables and guessed words
        // array
        guessedWords = [[]] //guessed words array - to keep a record of all the guessed words (upto 6 attempts)
        availSpace = 1; //always going to be 1 initially as you can input only 1 letter at a time starting from first array element
        word = '';
        guessedWordCount = 0;

        const getTiles = document.querySelectorAll('.square');

        //remove previous board
        getTiles.forEach(el => {
            el.remove();
        })
        //remove keyboard styles
        const keyBoard = document.querySelectorAll(`[data-key]`);
        console.log(keyBoard);

        for (const keyBoardElement of keyBoard) {
            keyBoardElement.style.color = 'gainsboro'
            keyBoardElement.style.opacity = '1';
        }

        //create new board
        createSquares();

        getData()
            .then(res => {
                console.log('total number of words in list: ' + res.length);
                res = res[randomWordIndex()];
                word = res
                // console.log(`Word is: ${res}`);
            })
    })


})





