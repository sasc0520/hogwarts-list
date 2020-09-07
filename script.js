"use strict";
const endpoint = "https://petlatkea.dk/2020/hogwarts/students.json";
let studentArray = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: "",
  house: "",
};
window.addEventListener("DOMContentLoaded", loadJSON);
function loadJSON() {
  fetch(endpoint)
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}
function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    // we need to take every item from the JSON data and trim it and split it into parts
    // however trimming it immiedtaely also immediately removes both types of extra spaces
    let nameArray = jsonObject.fullname.trim().split(" ");
    // we create the object Student inside the const newStudent
    const newStudent = Object.create(Student);
    // we set the newStudent's firstname to the capitalized version of this at the 0 position in the nameArray which is firstName
    newStudent.firstName = capitalize(nameArray[0]);
    // this if statements checks how many items there are in the array 2 being firstName + lastName
    // and 3 being all 3 items meaning firstName + lastName + middleName
    if (nameArray.length == 2) {
      // if only 2 items then assign newStudent's lastname the capitalized version if whatever is on nameArray position 1 (this being lastName)
      newStudent.lastName = capitalize(nameArray[1]);
      // and then this means there is no middle name therefore we set it to null
      newStudent.middleName = null;
    } else if (nameArray.length == 3) {
      newStudent.lastName = capitalize(nameArray[2]);
      if (nameArray[1].includes('"')) {
        newStudent.nickName = capitalize(
          nameArray[1].substring(1, nameArray[1].length - 1)
        );
        newStudent.middleName = null;
      } else {
        newStudent.middleName = capitalize(nameArray[1]);
      }
    }
    newStudent.house = capitalize(jsonObject.house.trim());
    newStudent.img = findImage(newStudent.firstName, newStudent.lastName);
    studentArray.push(newStudent);
    // console.log(nameArray);
  });
  console.table(studentArray);
}
function capitalize(name) {
  if (name.includes("-")) {
    let hyphen = name.indexOf("-") + 1;
    return (
      name[0].toUpperCase() +
      name.substring(1, hyphen) +
      name[hyphen].toUpperCase() +
      name.substring(hyphen + 1, name.length).toLowerCase()
    );
  }
  return name[0].toUpperCase() + name.substring(1, name.length).toLowerCase();
}

function findImage() {
  console.log("no");
}
