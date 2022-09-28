let selectedQ = document.querySelector(".selectedQ");
let xInput = document.querySelector("#x");
let notoficationPannel = document.querySelector("#warning");
let checkboxes = document.querySelectorAll("input[type='checkbox']");
let generateQuestionsButton = document.querySelector("#getQuestionsButton");
let cardsID1 = document.querySelector(".cardsID1");

let q = 0;
let topicsSelected = {};
let dictionary = {
    "numberSystem": numberSystem
}

/////////////////

function main() {
    addListnerToCheckboxes();
    addListenerToRange();
    addListenerToGenerateFlashcards();
}

main();


///////////////

function addListnerToCheckboxes() {
    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                topicsSelected[this.id] = 1;
            } else {
                delete topicsSelected[this.id];
            }
            q = Object.keys(topicsSelected).length;
            var maxQs = getMaxQuestions(topicsSelected);
            xInput.setAttribute("min", q.toString());
            xInput.setAttribute("max", maxQs.toString());
            xInput.setAttribute("value", q.toString());
            selectedQ.innerHTML = "&nbsp;" + q.toString() + `/${maxQs}&nbsp;`;
        });
    }
}

function getMaxQuestions(topicsSelected) {
    let sum = 0;
    for (const [topic] of Object.entries(topicsSelected)) {
        if (dictionary[topic]) {
            sum += (dictionary[topic].match(/Q:/g) || []).length;
        }
    }
    return sum;
}

function addListenerToRange() {
    xInput.addEventListener('change', () => {
        q = parseInt(xInput.value);
        xInput.setAttribute("value", q.toString());
        selectedQ.innerHTML = "&nbsp;" + q.toString() + `/${getMaxQuestions(topicsSelected)} &nbsp;`;
    });
}


function addListenerToGenerateFlashcards() {
    generateQuestionsButton.addEventListener('click', () => {
        var maxQ = getMaxQuestions(topicsSelected);
        if (q === 0) {
            slideNotification("Please select at least one topic.")
        } else if (maxQ < q) {
            slideNotification("Please select more topic.")
        } else {
            // reinitialize the dictionary
            for (const [key] of Object.entries(topicsSelected)) {
                topicsSelected[key] = 1;
            }

            //divide the questions count evenly, almost evenly :)
            divideQuestionsCount(q - Object.entries(topicsSelected).length);
            //get the questions, shuffle them
            let ques = getQuestions();
            shuffleArray(ques);

            //add the cards
            document.querySelector(".scene").innerHTML = "<h2>Try to answer these Flashcards</h2>";
            for (let i = 0; i < ques.length; i++) {
                let qna = ques[i];
                setTimeout(() => {
                    addFlashcard(qna.question, qna.answer, (4 * i), (i + 1) < ques.length, ques.length)
                }, i * 100);
            }
            // addFunctionalityToFlashCards();
        }
    });
}


//get random questions from differnt topics
function getQuestions() {
    //console.log("inside get Questions");
    var questions = [];
    for (const [key, value] of Object.entries(topicsSelected)) {
        if (topicsSelected[key] === 0) continue;
        var allQuestions = textToQuestions(dictionary[key]);

        var qnos = [...Array((dictionary[key].match(/Q:/g) || []).length).keys()].map(x => ++x);
        shuffleArray(qnos);
        qnos = qnos.slice(0, value);
        for (const qno of qnos) {
            questions.push(allQuestions[qno - 1]);
        }
    }
    return questions;
}


function addFlashcard(question, answer, i, hasNext = true, totalQues) {
    //console.log("adding card " + i / 4)
    // console.log(question)
    var elem = document.createElement('div');
    elem.classList.add('card');
    elem.setAttribute('style', `--i: ${i}`);
    elem.innerHTML = `<div class="card__face card__face--front">
            <div class="index">${(i / 4 + 1) + "/" + (totalQues)}</div>
            <div class="q"><p class="scroll">${question}</p></div>
            <div class="buttons">
                <div class="showAns">show answer</div>
                ${i === 0 ? "" : "<div class=\"prev\">previous</div>"}
            </div>

        </div>
        <div class="card__face card__face--back">
            <div class="a"><p class="scroll">${answer}</p></div>
            <div class="buttons">
                ${hasNext ? '<div class="next">next</div>' : ""}
                <div class="showQues">show Question</div>
            </div>
        </div>`;
    addFunctionalityToCards(elem);
    document.querySelector(".scene").appendChild(elem);
    //console.log(question)
    //console.log(answer)
    //console.log("")
}

//function to convert text to Question objects array
function textToQuestions(text) {
    var qnas = [];
    var qnaAsTextArray = text.split(/(Q:|A:)/).filter(function (e) {
        return String(e).match(/(Q:|A:)/) ? "" : String(e).trim();
    });
    for (var i = 0; i < qnaAsTextArray.length; i += 2) {
        var ques = new QuestionAnswer(qnaAsTextArray[i], qnaAsTextArray[i + 1], qnaAsTextArray[i].trim().charAt(0) === "$" ? "latex-js" : "span", qnaAsTextArray[i + 1].trim().charAt(0) === "$" ? "latex-js" : "span");
        qnas.push(ques);
    }
    return qnas;
}

//function to divide questions count evenly, almost evenly
//n questions are divided
function divideQuestionsCount(n) {

    //console.log("dividing " + n + " questions in ")
    //console.log(topicsSelected)

    for (const [key] of Object.entries(topicsSelected)) {
        if (!dictionary[key]) {
            n++;
            delete topicsSelected[key];
        }
    }

    while (n > 0) {
        const keys = Object.keys(topicsSelected);
        var lucky = keys[Math.floor(Math.random() * keys.length)];
        if (topicsSelected[lucky] < (dictionary[lucky].match(/Q:/g) || []).length) {
            topicsSelected[lucky] += 1;
            n--;
        }
    }

    //console.log(topicsSelected)

}


///utility
function slideNotification(message) {
    notoficationPannel.innerHTML = message;
    notoficationPannel.parentNode.style.top = "50px";
    setTimeout(() => {
        notoficationPannel.parentNode.style.top = "-100%";
    }, 3000);
}

function shuffleArray(array) {
    //console.log(...array);
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    //console.log(array);
}
