// Load sample data to show the user examples for asking a question to the chatbot
ChatbotLayout.loadSamples = function () {
    self = this;
    self.showSampleLoader();
    $.getJSON(this.sampleLink, function (json) {
        const samples = {};
        samples.moviename = json.moviename;
        //console.log(samples.moviename.length)
        self.getRandomSamples(samples);
        self.pushMessage('<p>' + self.textStartingConversation + '</p>', 'bot');
        self.hideSampleLoader();

        //Change the random data when the user click on the refresh button
        $('#btn-refresh').on('click', function () {
            self.getRandomSamples(samples);
        });
    });
}

//Choose sample data randomly
ChatbotLayout.getRandomSamples = function (samples) {
    $('#sample-data').empty();
    this.samplesDisplay = [];

    //Create a random number to display randomly
    //count();

    //  Push data into an array "this.samplesDisplay"
    var neededInformation = samples.moviename;

    //Create the array -> insert the selected samples (with randomNumber);
    for(i = 0; i < neededInformation.length; i++){
        this.samplesDisplay.push(neededInformation[i]);
    }

    // function call showSamples
    this.showSamples(samples);
}
/*
ChatbotLayout.recsys = function() {
    this.pushMessage('<p>' + 'I recommends: ' + '</p>', 'bot');
    console.log(this.input_movies)
}
*/
//Display samples on the right side of the demo
ChatbotLayout.showSamples = function (samples) {
    var dataKeys = Object.keys(samples);

    for(i = 0; i < this.samplesDisplay.length; i++){
        var samplesData = '<p id="data-key-' + dataKeys[0] + '"class="sample-data"><i>' + this.samplesDisplay[i] + '</i></p>';
        $('#sample-data').append(samplesData + '<br>');
        //$('#sample-data').append('')
    }

    readData()
}

function suggestSearchMovie(data){
  $('#input-submit').on('input', function () {
      input = this.value
  })
  //console.log(data)
    return 1
}

function readData() {
  var self = this;
  $.ajax({
    type: "GET",
    url: "/recommendations/movielens",
    success: function(data){
      names = data['title']
      ids = data['id']
      var list = document.getElementById('moviesList');
      names.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        list.appendChild(option);
      })
      //for(i = 0; i < names.length; i++){
          //ChatbotLayout.moviesName.push(names[i])
          //ChatbotLayout.moviesId.push(ids[i])
      //}
    }
  })
}

function submit(input) {

    this.inputMovieName.push(input)

    if (this.inputMovieName.length == this.nbMovieNeeded) {
        this.setLoadingState();
        input = this.inputMovieName
        this.inputMovieName = []
    }
    var data = {"input": input, "nbMovies": input.length};
    var url = "/recommendations";
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {
            if (data['pred'] == 1){
                ChatbotLayout.pushMessage('<p>' + 'AIMLX recommend these movies: ' + '</p>', 'bot');
                outputs = data['results']
                for(i = 0; i < outputs.length; i++){
                    ChatbotLayout.addBotSpeechBuble(outputs[i]);
                }
            }
        }
    });
}

ChatbotLayout.config({
    sampleLink: "recommendations/static/samples-movie.json",
    textStartingConversation: 'Good everning, wanna to see a movie? Please give me three movies that you liked.',
    submitFunction: submit,
    suggestFunction:suggestSearchMovie,
    config: function (options) {
        if (options.submitFunction) {
            this.submitFunction = options.submitFunction;
        }else {
            throw "SubmitFunction is not defined in config method.";
        }
        if (options.suggestFunction) {
            this.suggestFunction = options.suggestFunction;
        } else {
            throw "SuggestFunction is not defined in config method.";
        }
        this.initializeUiEventHandler();
        if (options.sampleLink) {
            $('.sample-container').removeClass('aix-invisible');
            this.sampleLink = options.sampleLink;
            this.loadSamples();
        }
        if (options.textStartingConversation) {
            this.textStartingConversation = options.textStartingConversation;
        }
    }
});

function removePunctuation(input) {
    return input.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
}

// Toggle (show/hide) the JSON Object in the speech-bubble
function toggleJsonObject (id){
    $('#display-json-' + id).next().hide();
    $('#display-json-' + id).click(function( event ){
        event.preventDefault();
        var value = $(this).text();
        if(value == 'This is what I understood'){
            $(this).next().toggle();
            $(this).text('Hide');
        }else if(value == 'Book another ticket'){
            window.location.reload();
        }else{
            $(this).next().toggle();
            $(this).text('This is what I understood');
        }
    });
}

// Highlight JSON objects (highlight.js)
function highlightingBlock(id){
    var code = document.getElementById(id);
    hljs.highlightBlock(code);
}


// Check if the chatbot understood the question and put a checkmark next to the needed Information on the right side
function checkingChatbotUnderstanding (information) {

    //Array with every keys of the JSON object in the speech-bubble
    var existingKeys = Object.keys(information);
    for(i = 0; i < existingKeys.length; i++){

        //Checks whether the element has already been checked
        var iconSelector = "icon-" + existingKeys[i];
        var checkMarkIcon = document.getElementById(iconSelector);

        if(checkMarkIcon === null){
            $('#' + existingKeys[i]).after('<i id="icon-' + existingKeys[i] + '"class="icon icon-011-check-mark icon--s2 checked" aria-hidden="true"></i>');
        }
    }
    for(i=0; i < existingKeys.length; i++){
        $("#data-key-" + existingKeys[i]).html('<p class="user-data">' + information[existingKeys[i]] + '</p>');
    }
}

function purposeEndChat (purpose, id) {
    if(purpose == "closing"  || purpose  == "thanks"){
        $('#display-json-' + id).text('Book another ticket');
        $('#input-submit').prop('disabled', true);
    }
}

$('.btn-sample-refresh').removeClass("aix-invisible");

// A random number to display example data randomly
var num = parseInt(Math.round(Math.random() * (8)));

function count() {
    if(num >= 8){
        num = 0;
    }else{
        num++;
    }
    return num;
}

// Help for the user | The three functions below are used to guide the user to start a conversation with the chatbot
// Block Part "How to get started

//Instruction & Question Data Object
var stepsInstruction = {
    getStarted : 'Find here a sample question to start chatting',
    neededInformation: 'Ask chatbot the needed information',
    bookTickets : 'The chatbot can now help you to book tickets',
    confirmation : 'Confirm your reservation'
}

var stepsQuestion = {
    getStarted : 'Which theater is available tomorrow for 3 tickets for Deadpool ?',
    neededInformation: 'Which start time is available ?',
    bookTickets : 'Can you please help me book tickets ?',
    confirmation : 'Okay'
}

//Add the question in the chatbot input field when the user click on the question sample link (right side)
$('#hint-question').click(function(){
    var questionSample;
    if($('#hint-instruction').text() === stepsInstruction.getStarted){
        questionSample = stepsQuestion.getStarted;
    }else if($('#hint-instruction').text() === stepsInstruction.neededInformation){
        questionSample = stepsQuestion.neededInformation;
    }else if($('#hint-instruction').text() === stepsInstruction.bookTickets){
        questionSample = stepsQuestion.bookTickets;
    }else if($('#hint-instruction').text() === stepsInstruction.confirmation){
        questionSample = stepsQuestion.confirmation;
    }

    $('#input-submit').val(questionSample);
    $('#input-submit').focus();
    $('#btn-submit').removeClass('disabled');
});


//Display the instructions/hint that help the user to start
function userInstruction(){
    var hintInstruction;
    if($('#hint-instruction').text() === stepsInstruction.getStarted){
        hintInstruction = stepsInstruction.neededInformation;
    }else if($('#hint-instruction').text() === stepsInstruction.neededInformation){
        hintInstruction = stepsInstruction.bookTickets;
    }else if($('#hint-instruction').text() === stepsInstruction.bookTickets){
        hintInstruction = stepsInstruction.confirmation;
    }

    $('#hint-instruction').text(hintInstruction);
}

//Display the question sample for starting the conversation
function userQuestionSample(){
    var hintQuestion;
    if($('#hint-question p i').text() === stepsQuestion.getStarted){
        hintQuestion = stepsQuestion.neededInformation;
    }else if($('#hint-question p i').text() === stepsQuestion.neededInformation){
        hintQuestion = stepsQuestion.bookTickets;
    }else if($('#hint-question p i').text() === stepsQuestion.bookTickets){
        hintQuestion = stepsQuestion.confirmation;
    }

    $('#hint-question p i').text(hintQuestion);
}
