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
var rf2 = firebase.database().ref('WomenSafetyApp');

var womenList;
rf2.on('value', gotData2,errorData2);
function gotData2(data){
    womenList = [];
    let x = data.val();
    let keys = Object.keys(x);
    for(let i = 0;i<keys.length;i++){
        let vals = x[keys[i]].replace(/"/g,'').split(',');
        womenInfo = {
            'key': keys[i],
            'latitude': Number(vals[0]),
            'longitude': Number(vals[1]),
            'got help?': Boolean(Number(vals[2]))
        };
        womenList.push(womenInfo);
    }
    console.log(womenList);
}
function errorData2(error){
    console.log("error In 2");
    console.log(error);
}
setTimeout(yo,5000);
function yo(){
  let newVal = `${womenList[1]['latitude']},${womenList[1]['longitude']},1`;
  let key = '130080';
  let json = {};
  json[key]
  rf2.update({'26269':});
  console.log('update ho gaya');
}