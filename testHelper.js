var firebase = require('firebase');

var firebaseConfig = {
  apiKey: "AIzaSyC41missDC3PqPylX3_N7w1k97rTvdYp8g",
  authDomain: "womensafety-8186a.firebaseapp.com",
  databaseURL: "https://womensafety-8186a.firebaseio.com",
  projectId: "womensafety-8186a",
  storageBucket: "womensafety-8186a.appspot.com",
  messagingSenderId: "332673281240",
  appId: "1:332673281240:web:acb8a7ef0f79fe8354bbad",
  measurementId: "G-LYKTJ78QE3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Database
var rf = firebase.database().ref('helpers');

rf.on('value', gotData,errorData);
var HelperList;
function gotData(data){
    let helperObj=data.val();//Getting Data
    HelperList = [];
    var helperKeys = Object.keys(helperObj);
    for(var j=0;j<helperKeys.length;j++) {
        var aHelperInfo = {
            'name': helperObj[helperKeys[j]].name,
            'latitude': Number(helperObj[helperKeys[j]].latitude),
            'longitude': Number(helperObj[helperKeys[j]].longitude)
        };
    HelperList.push(aHelperInfo);
    }
    console.log(HelperList);
}

  function errorData(error){
    console.log("error Aya");
    console.log(error);
  }



  // message(latFemale,longFemale,'91'+helperObj[helperKeys[j]].number);