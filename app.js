document.addEventListener('DOMContentLoaded', () => {
    createSquares();

    let guessedWords = [[]] //guessed words array - to keep a record of all the guessed words (upto 6 attempts)
    let availSpace = 1; //always going to be 1 initially as you can input only 1 letter at a time starting from first array element
    let word = '';
    let guessedWordCount = 0;
    const keys = document.querySelectorAll('.keyboard-row button');

    async function getData() {
        try {
            let res = await fetch('wordsList.json')
            return await res.json()
        } catch (e) {
            console.log('ERROR fetching words list', e);
        }
    }

    function randomWordIndex() {
        const rand = Math.floor((Math.random() * 5757) + 1);
        console.log(rand);
        return rand
    }

    getData()
        .then(res => {
            console.log('total number of words in list: ' + res.length);
            res = res[randomWordIndex()];
            word = res
            console.log(`Word is: ${res}`);
        })


    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length //zero at the start as guessedWords array is empty
        // console.log(guessedWords[numberOfGuessedWords - 1])
        return guessedWords[numberOfGuessedWords - 1]; //returns the current array we are updating

    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr && currentWordArr.length < 5) { //at the current word array and if less than the 5th index (max 5 letters)
            currentWordArr.push(letter);

            const availSpaceEl = document.getElementById(String(availSpace))
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

    function handleSubmitWord() { //when enter key is pressed
        const currentWordArr = getCurrentWordArr();
        console.log('enter key pressed checking word: ', currentWordArr);

        if (currentWordArr.length !== 5) {
            return alert('Word must be 5 letters');
        }

        const currentWord = currentWordArr.join('') //takes array and joins into a single string so we can compare to answer

        //animation + color for when word is submitted (green for correct place and letter, yellow for correct letter, grey for incorrect letter)

        function updateKeyboard(letter, color) {
            console.log(letter);
            console.log(color); //apply this color to keys loop through keys and match with data-attribute
            const keyBoard = document.querySelectorAll(`[data-key=${letter}]`);
            keyBoard[0].style.color = color
            keyBoard[0].style.opacity = '0.5';
            console.log(keyBoard);


        }

        function checkWord(letter, index) {
            console.log(`checking for letter in ${word}`, letter);
            const correctLetter = word.includes(letter);

            if (!correctLetter) {
                // no correct letters apply regular color
                const color = 'rgb(58,58,60)';
                console.log('no correct letters in word');
                updateKeyboard(letter, color);
                return color;
            }

            console.log('there is a correct letter here somewhere')
            //check at what index and apply appropriate color
            const letterPosition = word.indexOf(letter);

            console.log('actual letter position: ', letterPosition);
            console.log('my letter position: ', index);

            if (letterPosition === index) {
                //correct letter + position GREEN
                const color = 'rgb(34,139,34)'
                console.log('correct letter and position')
                updateKeyboard(letter, color);
                return color;
            } else {
                //correct letter but not correct position YELLOW
                const color = 'rgb(201 180 88)';
                console.log('correct letter but not correct position')
                updateKeyboard(letter, color);
                return color;
            }

        }

        const row = (guessedWordCount * 5) + 1  //5 letters in each word and +1 to get first letterid

        const interval = 500; //timeout interval

        //loop through current words letters

        currentWordArr.forEach((letter, index) => {

            setTimeout(() => {
                const letterId = row + index;
                console.log('ROW:', row)
                const tileEl = document.getElementById(`${letterId}`);
                const tileColor = checkWord(letter, index);
                console.log(tileColor);
                tileEl.classList.add('animateFlip');
                tileEl.style.color = tileColor;
                console.log(tileEl);

            }, interval)

            // for (let i = 0; i < keys.length; i++) {
            //
            //     const key = target.getAttribute('data-key');
            //     console.log(key);
            // }


        })
        guessedWordCount++;

        //apply color update to keyboard

        if (currentWord === word) {
            return alert('Congratulations You Got The Word!');
        }

        if (guessedWords.length === 6) {
            alert(`Sorry no more guesses you lose! The word was: ${word}`)
        }


        console.log('guessed word array', currentWordArr)

        console.log(`guessed word string: ${currentWord}`);
        console.log('all guessedwords so far:', guessedWords);
        console.log(`total guessed words: ${guessedWordCount}`)
        // console.log(`total guessed words: ${guessedWords.length}`)

        //push after checking wordIsValid() logic

        guessedWords.push([]);//if not correct word push new array into guessedWords array
    }

    function handleDeleteKey() {
        const currentWordArr = getCurrentWordArr();
        console.log(currentWordArr)
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
    // function clearBoard(){
    //     for (let i = 0; i < 30; i++) {
    //         let board = document.getElementById(i + 1);
    //         board.textContent = '';
    //         board.style.backgroundColor = 'black';
    //         board.style.color = 'rgb(58,58,60)';
    //     }
    // }

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
        //clear the board
        // clearBoard();

        //create new board
        createSquares();

        getData()
            .then(res => {
                console.log('total number of words in list: ' + res.length);
                res = res[randomWordIndex()];
                word = res
                console.log(`Word is: ${res}`);
            })
    })


})





