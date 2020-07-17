var img = new Image();
img.src = "kafka2.jpg";
img.crossOrigin = "anonymous";
var width = 160;
var height = 120;
var ctx, imgd, pix;
var ctx1, imgd1, pix1;

img.onload = () => {
  ctx = document.getElementById("photo").getContext("2d");
  ctx.drawImage(img, 0, 0);
  imgd = ctx.getImageData(0, 0, width, height);
  pix = imgd.data;
};

function arrToString(a) {
  let s = "";
  for (let i = 0; i < pix.length; i += 4) {
    s +=
      String.fromCharCode(pix[i]) +
      String.fromCharCode(pix[i + 1] + String.fromCharCode(pix[i + 2]));
  }
  return s;
}

function stringToArr(a) {
  let arr = [];
  for (let i = 0; i < a.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      arr.push(s.substring(i + j, i + j + 1).charCodeAt());
    }
    arr.push(255);
  }
  return arr;
}

function clear() {
  ctx.clearRect(0, 0, 160, 120);
  imgd.data = [];
}

function encryptPhoto() {
  let password = document.getElementById("password").value;
  let s = arrToString(pix);
  let encrypted = CryptoJS.TripleDES.encrypt(s, password);
  document.getElementById("valueEncryption").value = encrypted;
  document.getElementById("valueEncryptionLength").innerHTML =
    "" + encrypted.length;
}

function decryptPhoto() {
  let password = document.getElementById("password").value;
  let a = document.getElementById("valueEncryption");
  let arr = stringToArr(CryptoJS.TripleDES.decrypt(a, password));
  ctx1 = document.getElementById("photo1").getContext("2d");
  pix1 = arr;
  imgd1 = ctx1.getImageData(0, 0, width, height);
  imgd1.data = pix1;
  ctx1.putImageData(imgd1, 0, 0);
}

//tbd

//2
function saveTextAsFile() {
  let textToSave = document.getElementById("inputTextToSave").value;
  let password = document.getElementById("inputPasswordToSave").value;
  let encrypted = CryptoJS.TripleDES.encrypt(textToSave, password);
  let textToSaveAsBlob = new Blob([encrypted], { type: "text/plain" });
  let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
  let fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

  let downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  downloadLink.href = textToSaveAsURL;
  downloadLink.onclick = destroyClickedElement;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);

  downloadLink.click();
}

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

function loadFileAsText() {
  let fileToLoad = document.getElementById("fileToLoad").files[0];
  let password = document.getElementById("inputPasswordToSave").value;
  let fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
    let textFromFileLoaded = fileLoadedEvent.target.result;
    let decrypted = CryptoJS.TripleDES.decrypt(textFromFileLoaded, password);
    let stringDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
    document.getElementById("inputTextToSave").value = stringDecrypted;
  };
  fileReader.readAsText(fileToLoad, "UTF-8");
}

//3
var firebaseConfig = {
  apiKey: "type-info",
  authDomain: "type-info",
  databaseURL: "type-info",
  projectId: "type-info",
  storageBucket: "type-info",
  messagingSenderId: "type-info",
  appId: "type-info",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function sendData() {
  var contentValue = document.getElementById("contentField").value;
  var passwordValue = document.getElementById("passwordField").value;
  var encryptedDataBase = CryptoJS.TripleDES.encrypt(
    contentValue,
    passwordValue
  );
  let stringEncryptedDataBase = encryptedDataBase.toString();

  firebase.database().ref("User").set({
    content: stringEncryptedDataBase,
  });
}

function getData() {
  firebase
    .database()
    .ref("/")
    .once("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        document.getElementById("getDataBase").innerHTML = childData["content"];
        var passwordValue = document.getElementById("passwordField").value;
        var stringEncryptedValue = childData["content"].toString();
        var valueDecryptedToPrint = CryptoJS.TripleDES.decrypt(
          stringEncryptedValue,
          passwordValue
        );
        document.getElementById(
          "getDataBaseDecrypted"
        ).innerHTML = valueDecryptedToPrint.toString(CryptoJS.enc.Utf8);
      });
    });
}
