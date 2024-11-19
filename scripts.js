document.addEventListener('DOMContentLoaded', function() {
    // Игрок 1
    var player1Active = document.getElementById("player1-active");
    player1Active.addEventListener("change", function() {
        document.getElementById("player1-name").disabled = !this.checked;
        document.getElementById("player1-start").disabled = !this.checked;
    });

    // Игрок 2
    var player2Active = document.getElementById("player2-active");
    player2Active.addEventListener("change", function() {
        document.getElementById("player2-name").disabled = !this.checked;
        document.getElementById("player2-start").disabled = !this.checked;
    });

    // Игрок 3
    var player3Active = document.getElementById("player3-active");
    player3Active.addEventListener("change", function() {
        document.getElementById("player3-name").disabled = !this.checked;
        document.getElementById("player3-start").disabled = !this.checked;
    });

    // Игрок 4
    var player4Active = document.getElementById("player4-active");
    player4Active.addEventListener("change", function() {
        document.getElementById("player4-name").disabled = !this.checked;
        document.getElementById("player4-start").disabled = !this.checked;
    });

    // Игрок 5
    var player5Active = document.getElementById("player5-active");
    player5Active.addEventListener("change", function() {
        document.getElementById("player5-name").disabled = !this.checked;
        document.getElementById("player5-start").disabled = !this.checked;
    });

    // Игрок 6
    var player6Active = document.getElementById("player6-active");
    player6Active.addEventListener("change", function() {
        document.getElementById("player6-name").disabled = !this.checked;
        document.getElementById("player6-start").disabled = !this.checked;
    });

    // Игрок 7
    var player7Active = document.getElementById("player7-active");
    player7Active.addEventListener("change", function() {
        document.getElementById("player7-name").disabled = !this.checked;
        document.getElementById("player7-start").disabled = !this.checked;
    });

    // Игрок 8
    var player8Active = document.getElementById("player8-active");
    player8Active.addEventListener("change", function() {
        document.getElementById("player8-name").disabled = !this.checked;
        document.getElementById("player8-start").disabled = !this.checked;
    });
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

        playerNameInput.addEventListener("input", function() {
            this.classList.toggle('input-invalid', this.value.trim().length === 0);
            validateForm();
        });
    });

    function validateForm() {
        var invalidFields = fieldsToCheck.filter(function(input) {
            return input.value.trim().length === 0;
        });

        var isRadioChecked = Array.from(document.querySelectorAll('[name="start"]')).some(radio => radio.checked);

        startButton.disabled = invalidFields.length > 0 || !isRadioChecked;
    }
});

document.getElementById("start-button").addEventListener('click', function() {   
    // Fetch JSON
    fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        // Filter questions where flag is false
        var availableQuestions = data.quiz.filter(item => item.flag === false);
        
        if(availableQuestions.length === 0){
            // No more questions left
            alert('No more questions available');
            return;
        }

        // Select random question
        var questionIndex = Math.floor(Math.random() * availableQuestions.length);
        var selectedQuestion = availableQuestions[questionIndex];
        
        // Get the player name from the corresponding text input
        var selectedRadioButtonId = document.querySelector('[name="start"]:checked').id;
        var playerNameInputId = selectedRadioButtonId.replace('-start', '-name');
        var playerName = document.getElementById(playerNameInputId).value;

        // Display selectedQuestion.question, player name and answer
        document.getElementById("question-text").innerText = selectedQuestion.question;
        document.getElementById("player-name").innerText = playerName; 
        document.getElementById("answer-text").innerText = "Ответ: " + selectedQuestion.answer;

        // Update flag in original data
        data.quiz.find(item => item.id === selectedQuestion.id).flag = true;

        // Here you should save updated data, but it's not possible to do this in the browser due to security reasons
    })
    .catch(error => console.error('Error:', error));
});