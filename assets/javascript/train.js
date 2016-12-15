// 1. Link to Firebase
  var config = {
    apiKey: "AIzaSyDSmoD0zsa-l6uXKpgLYZbCjCZp4LyQ1as",
    authDomain: "tmnt-1e50f.firebaseapp.com",
    databaseURL: "https://tmnt-1e50f.firebaseio.com",
    storageBucket: "tmnt-1e50f.appspot.com",
    messagingSenderId: "548758783049"
  };

  firebase.initializeApp(config);

// 2. Populate Firebase Database 
var database = firebase.database();


 $("#addTrain").on("click", function() {

     //Get user input
     var trainName = $('#trainName').val().trim();
     var trainDestination = $('#trainDestination').val().trim();
     var firstTrainTime = $('#trainTimeHour').val().trim() + ":" + $('#trainTimeMin').val().trim();
     var trainFrequency = $('#trainFrequency').val().trim();

     // console.log(trainName);
     // console.log(trainDestination);
     // console.log(firstTrainTime);
     // console.log(trainFrequency);

     // Creates object for holding train data
     var newTrain = {
         name: trainName,
         destination: trainDestination,
         firstTrain: firstTrainTime,
         frequency: trainFrequency
     }

     // Uploads train data to database
     database.ref().push(newTrain);

     // Clears all text-boxes
     $("#trainName").val("");
     $("#trainDestination").val("");
     $("#trainTimeHour").val("");
     $("#trainTimeMin").val("");
     $("#trainFrequency").val("");

     return false;
 });

 database.ref().on("child_added", function(snapshot, prevChildKey) {
     var newTrain = snapshot.val();
     console.log("Previous Post ID: " + prevChildKey);

     var tFrequency = parseInt(newTrain.frequency);
     var firstTime = newTrain.firstTrain;

     // First Time (pushed back 1 year to make sure it comes before current time)
     var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
     console.log("firstTimeConverted:" + moment(firstTimeConverted));

     // Current Time
     var currentTime = moment();
     console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

     // Difference between the times
     var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
     console.log("DIFFERENCE IN TIME: " + diffTime);

     // Time apart (remainder)
     var tRemainder = diffTime % tFrequency;
     console.log(tRemainder);

     // Minute Until Train
     var tMinutesTillTrain = tFrequency - tRemainder;
     console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

     // Next Train
     var nextTrain = moment().add(tMinutesTillTrain, "minutes")
     console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"))


 	//add each train data into the table
     $("#trainList").append("<tr><td>" + newTrain.name + "</td><td>" + newTrain.destination + "</td><td>" + newTrain.frequency + "min </td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "min" + "</td></tr>");

 });
