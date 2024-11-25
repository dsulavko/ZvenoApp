window.onload = function() {   
    if(!sessionStorage.getItem("questions")) {
        fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            // Save all questions to sessionStorage
            sessionStorage.setItem("questions", JSON.stringify(data.quiz));
        })
        .catch(error => console.error('Error:', error));
    }
} 

document.addEventListener('DOMContentLoaded', function() {
    // Disable player name input fields and start radiobuttons by default
    for (let i = 1; i <= 8; i++) {
        document.getElementById("player" + i + "-name").disabled = true;
        document.getElementById("player" + i + "-start").disabled = true;

        document.getElementById("player" + i + "-active").addEventListener("change", function() {
            document.getElementById("player" + i + "-name").disabled = !this.checked;
            document.getElementById("player" + i + "-start").disabled = !this.checked;
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var startButton = document.getElementById("start-button");
    var players = [1, 2, 3, 4, 5, 6, 7, 8];
    var fieldsToCheck = [];

    players.forEach(function(player) {
        var playerActiveCheckbox = document.getElementById("player" + player + "-active");
        var playerNameInput = document.getElementById("player" + player + "-name");
        var playerStartRadio = document.getElementById("player" + player + "-start");

        playerActiveCheckbox.addEventListener("change", function() {
            playerNameInput.disabled = !this.checked;
            playerStartRadio.disabled = !this.checked;

            if (this.checked) {
                fieldsToCheck.push(playerNameInput);
                playerNameInput.required = true;
            } else {
                fieldsToCheck = fieldsToCheck.filter(function(item) {
                    return item !== playerNameInput;
                });
                playerNameInput.required = false;
                playerNameInput.classList.remove('input-invalid');
            }

            validateForm();
        });

        playerStartRadio.addEventListener("change", function() {
            validateForm();
        });

        playerNameInput.addEventListener("input", function() {
            this.classList.toggle('input-invalid', this.value.trim().length === 0);
            validateForm();
        });
    });

    function validateForm() {
        var invalidFields = fieldsToCheck.filter(function(input) {
            return input.value.trim().length === 0;
        });

        var isCheckedNum = Array.from(document.querySelectorAll('[id$="-active"]')).filter(checkbox => checkbox.checked).length;
        var isRadioChecked = Array.from(document.querySelectorAll('[name="start"]')).some(radio => radio.checked);

        startButton.disabled = invalidFields.length > 0 || isCheckedNum < 2 || !isRadioChecked;
    }
});

document.getElementById("start-button").addEventListener('click', function() {   
    startTimer();
    // Fetch player name from the corresponding text input
    let selectedRadioButtonId = document.querySelector('[name="start"]:checked').id;
    let playerNameInputId = selectedRadioButtonId.replace('-start', '-name');
    let playerName = document.getElementById(playerNameInputId).value;
    document.getElementById("player-name").innerText = playerName;

        // Reset round statistics and initialize players
        let playerStats = {};
        let activePlayers = [];
        for (let i = 1; i <= 8; i++) {
            if (document.getElementById("player" + i + "-active").checked) {
                let playerName = document.getElementById("player" + i + "-name").value;
                activePlayers.push(playerName); // добавили игрока в список активных
                playerStats[playerName] = {
                    roundRightAnswers: 0,
                    roundWrongAnswers: 0,
                    roundBank: 0
                };
            }
        }
    
        // Save current players and playerStats to localStorage
        localStorage.setItem("playerStats", JSON.stringify(playerStats));
        
        // Save active players to localStorage
        localStorage.setItem("activePlayers", JSON.stringify(activePlayers));
  

    // Disable the button
    this.disabled = true;
    document.getElementById('end-button').disabled = false;

    // Fetch next question
    getNextQuestion();

    // Display elements
    document.getElementById('values').style.display = 'none';
    document.getElementById('player-name').style.display = 'block';
    document.getElementById('question-text').style.display = 'block';
    document.getElementById('answer-text').style.display = 'block';
    document.getElementById('buttons').style.display = 'block';
    document.getElementById('values').style.display = 'flex';
    document.getElementById('player-stats').style.display = 'none';

    for(let i = 1; i <= 8; i++) {
        document.getElementById('value-' + i).style.background = "red"; // заменили indicator на value
    }
    currentRightAnswer = 1;
});

function getNextQuestion() {
    let allQuestions = JSON.parse(sessionStorage.getItem("questions"));

    // Filter questions where flag is false
    let availableQuestions = allQuestions.filter(item => item.flag === false);

    if(availableQuestions.length === 0) {
        // No more question left
        alert('No more questions available');
        return;
    }

    // Select random question
    let questionIndex = Math.floor(Math.random() * availableQuestions.length);
    let selectedQuestion = availableQuestions[questionIndex];

    // Display selectedQuestion.question, player name and answer
    document.getElementById("question-text").innerText = selectedQuestion.question;
    document.getElementById("answer-text").innerText = "Ответ: " + selectedQuestion.answer;

    // Update flag in original data
    allQuestions.find(item => item.id === selectedQuestion.id).flag = true;

    // Save updated data to sessionStorage
    sessionStorage.setItem("questions", JSON.stringify(allQuestions));

};


document.getElementById('end-button').addEventListener('click', function() {  
    resetTimer();
    // Hide elements
    document.getElementById('player-name').style.display = 'none';
    document.getElementById('question-text').style.display = 'none';
    document.getElementById('answer-text').style.display = 'none';
    document.getElementById('buttons').style.display = 'none';
    document.getElementById('values').style.display = 'none';


       // Fetch the playerStats and activePlayers order from localStorage
       let playerStats = JSON.parse(localStorage.getItem("playerStats"));
       let activePlayers = JSON.parse(localStorage.getItem("activePlayers"));
   
       // Clear previous stats and display current stats
       let playerStatsDiv = document.getElementById('player-stats');
       playerStatsDiv.innerHTML = `
           <table>
               <tr>
                   <th>Игрок</th>
                   <th>+/-</th>
                   <th>Банк</th>
               </tr>
           </table>`;

// Output the stats following the order of the saved players
    let totalBank = 0; // счетчик общего банка
    for (let playerName of activePlayers) {
        let stats = playerStats[playerName];
        totalBank += stats.roundBank; // добавляем банк игрока к общему банку
        playerStatsDiv.innerHTML += `
            <table>
                <tr>
                    <td>${playerName}</td>
                    <td>${stats.roundRightAnswers}/${stats.roundWrongAnswers}</td>
                    <td>${stats.roundBank}</td>
                </tr>
            </table>`;
    }
    playerStatsDiv.innerHTML += `<p>Общий банк: ${totalBank}</p>`; // выводим общий банк
    playerStatsDiv.style.display = 'block';


    // Disable the button
    this.disabled = true;
    document.getElementById('start-button').disabled = false;
});

document.getElementById("incorrectButton").addEventListener('click', function() {
        // Fetch the active players order from localStorage
        let activePlayers = JSON.parse(localStorage.getItem("activePlayers"));

        let currentName = document.getElementById("player-name").innerText;
        let currentPlayerIndex = activePlayers.indexOf(currentName);

  // Изменение статистики игрока
    let playerStats = JSON.parse(localStorage.getItem("playerStats"));
    if (playerStats[currentName]) {
        playerStats[currentName].roundWrongAnswers += 1;
        localStorage.setItem("playerStats", JSON.stringify(playerStats));
    } else {
        console.error('Player not found:', currentName);
    }
        
        // If this player is the last one in the list of active players
        if (currentPlayerIndex === activePlayers.length - 1) {
            // Then the next player becomes the first one in the list
            currentName = activePlayers[0];
        } else {
            // Otherwise, the next player is the next one in the list
            currentName = activePlayers[currentPlayerIndex + 1];
        }
    
        document.getElementById("player-name").innerText = currentName;


    // Сброс цвета кружков на красный и счетчика правильных ответов
    for (let i = 1; i <= 8; i++) {
        document.getElementById('value-' + i).style.background = "red";
    }
    currentRightAnswer = 1;

    getNextQuestion();
});

let currentRightAnswer = 1;

document.getElementById("correctButton").addEventListener('click', function() {
    document.getElementById('value-' + currentRightAnswer).style.background = "green"; // заменили indicator на value
    currentRightAnswer++;

       // Fetch the active players order from localStorage
       let activePlayers = JSON.parse(localStorage.getItem("activePlayers"));

        let currentName = document.getElementById("player-name").innerText;
        let currentPlayerIndex = activePlayers.indexOf(currentName);

        // Изменение статистики игрока
        let playerStats = JSON.parse(localStorage.getItem("playerStats"));
        if (playerStats[currentName]) {
            playerStats[currentName].roundRightAnswers += 1;
            localStorage.setItem("playerStats", JSON.stringify(playerStats));
        } else {
            console.error('Player not found:', currentName);
        }
        
        // If this player is the last one in the list of active players
        if (currentPlayerIndex === activePlayers.length - 1) {
            // Then the next player becomes the first one in the list
            currentName = activePlayers[0];
        } else {
            // Otherwise, the next player is the next one in the list
            currentName = activePlayers[currentPlayerIndex + 1];
        }
        document.getElementById("player-name").innerText = currentName;

    getNextQuestion();
});

let bankValue = 0;

document.getElementById("bankButton").addEventListener('click', function() {
    // When the "Bank" button is clicked, we first get the value from the last green circle
    let currentCircleValue = document.getElementById('value-' + (currentRightAnswer - 1)).innerText;

    // This value should be added to the global bank value
    bankValue += parseInt(currentCircleValue);
    
    // The updated bank value should be displayed on the screen
    document.getElementById('bank-value').innerHTML = bankValue;

    // Now we need to add this value to the player's personal bank
    let currentName = document.getElementById("player-name").innerText;
    let playerStats = JSON.parse(localStorage.getItem("playerStats"));
    
    if (playerStats[currentName]) {
        playerStats[currentName].roundBank += parseInt(currentCircleValue);
        localStorage.setItem("playerStats", JSON.stringify(playerStats));
    } else {
        console.error('Player not found:', currentName);
    }

    // Reset the value circles color to red and the right answers count
    for(let i = 1; i <= 8; i++) {
        document.getElementById('value-' + i).style.background = "red";
    }
    currentRightAnswer = 1;

});

// Выбранное время в секундах
let selectedTime = document.getElementById("round").value;

function setTime() {
  selectedTime = document.getElementById("round").value;
}

let timer;

function startTimer() {
  timer = setInterval(function() {
    selectedTime--;
    // Форматируем время в минуты и секунды
    let minutes = Math.floor(selectedTime / 60);
    let seconds = selectedTime % 60;
    
    // Выводим время
    document.getElementById("timer").innerHTML = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
      
    // Если время истекло, останавливаем таймер
    if (selectedTime <= 0) {
      clearInterval(timer);
      document.getElementById("timer").innerHTML = "TIME OUT";
    }
  }, 1000);
}
function resetTimer() {
    clearInterval(timer);
    document.getElementById("timer").innerHTML = "";
    setTime(); // сбрасываем время до изначально выбранного
  }