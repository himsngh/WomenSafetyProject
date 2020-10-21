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

// SMS API configuration
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: 'b5b8b298',
  apiSecret: '7dlD77kOibsNrbvY',
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Database
var rf = firebase.database().ref('helpers');
var rf2 = firebase.database().ref('WomenSafetyApp');

var womenList;
var HelperList;

//Womens DB cloud functions
rf2.on('value', gotData_W,errorData_W);
function gotData_W(data){
  console.log('Change detected in women database');
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
  console.log('Updated women list: ');
  console.log(womenList);
}

function errorData_W(error){
    console.log("women's DB se error aaya");
    console.log(error);
}

function updateWomenHelp(key){
  for(let i = 0;i<womenList.length;i++)
    if(womenList[i].key == key){
      womenList[i]['got help?'] = true;
      let newVal = String(womenList[i]['latitude'])+','+String(womenList[i]['longitude'])+','+String(1);
      key = String(key);
      let json = {};
      json[key] = newVal;
      rf2.update(json);
      console.log('a women got help...firebase updated');
      break;
    }
}
//Helpers DB cloud functions
rf.on('value', gotData_H,errorData_H);
function gotData_H(data){
  console.log('Change detected in Helpers database' );
  let helperObj = data.val();//Getting Data
  HelperList = [];
  var helperKeys = Object.keys(helperObj);
  for(let j=0;j<helperKeys.length;j++) {
      let aHelperInfo = {
          'name': helperObj[helperKeys[j]].name,
          'latitude': Number(helperObj[helperKeys[j]].latitude),
          'longitude': Number(helperObj[helperKeys[j]].longitude),
          'number': helperObj[helperKeys[j]].number
      };
  HelperList.push(aHelperInfo);
  }
  console.log(HelperList);
}

function errorData_H(error){
  console.log("helper mei error aaya");
  console.log(error);
}

// Looped code
setInterval(mainLoop,5000);
function mainLoop(){
  for(women of womenList){
    if(women['got help?'])  // If helpers are already notified for the women in need of help
      continue;
    let helpersSent = [];
    for(helper of HelperList){
      if(0.5 > calculateDistance(women['latitude'],women['longitude'],helper['latitude'],helper['longitude'])){
        message(women['latitude'],women['longitude'],helper['number']);
        if(!women['got help?'])
          updateWomenHelp(women['key']);
        helpersSent.push(helper['name']);
      }
    }
    if(helpersSent){
      console.log(`${helpersSent.length} helper(s) sent for helping WomenID: ${women['key']}`);
      console.log(`Name of helpers sent: ${helpersSent}`);
    }
  }
}

//SMS sending
function message(lat,long,helNumber){
  const from = 'kshitij';
  const to = '91'+String(helNumber);
  const text = `Women in need near you!!.. https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
  nexmo.message.sendSms(from, to, text);
  console.log('sending to: '+to);
  console.log('SMS sent: '+text);
}

//essentials
function calculateDistance(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  
  var dist=earthRadiusKm*c
  return dist;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}