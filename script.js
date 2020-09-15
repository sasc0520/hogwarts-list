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
      // and then this means there is no middle name therefore we set it to null vecause 2 items are a firstName and a lastName
      newStudent.middleName = null;
      // now we check if the student has three items meaning a firstName, lastName and middleName
    } else if (nameArray.length == 3) {
      // if so we assign newStudent's lastName whatever (in capitalized version) is at the 2nd position of nameArray which would be middleName
      newStudent.lastName = capitalize(nameArray[2]);
      // then we say check if this name also includes a "" and if so it must assign newStudent's nickname whatever is at the 1st position of the nameArray
      // but in this position it has to be something inside the actual string at this position
      // therefore we use substring() method, where we say at position 1 ("(" = 1)Ernie"") and then the length og whatever is in nameArray position 1
      // and then we subtract this with 1 so we get "Ernie" and not "Erni" - and all of this in capitalized version
      if (nameArray[1].includes('"')) {
        newStudent.nickName = capitalize(
          nameArray[1].substring(1, nameArray[1].length - 1)
        );
        // and then we say that middleName does not exist as if there is a nickName there is not a middleName as well
        newStudent.middleName = null;
      } else {
        // otherwise if it does not contain a "", then it should assign middleName whatever is at the 1st position in the nameArray being lastName
        newStudent.middleName = capitalize(nameArray[1]);
      }
    }
    // we just set the house to the house data and then we get this capitalized and trimmed so all extra spaces are removed
    newStudent.house = capitalize(jsonObject.house.trim());
    // we assign the newStudent's img the function of findImage with the parameters of firstName and lastName
    // that is due to the fact that the image files' pattern is based on the names of the students
    newStudent.img = findImage(newStudent.firstName, newStudent.lastName);
    newStudent.gender = capitalize(jsonObject.gender.trim());
    // we push the newStudent object so that it is assigned all these new properties and the values of these properties
    studentArray.push(newStudent);
  });
  // and for us to see it, we use console.table which just displays what we have made in a table in the console
  console.table(studentArray);
  displayStudents();
}

function displayStudents() {
  const template = document.querySelector("template");
  studentArray.forEach((student) => {
    let clone = template.cloneNode(true).content;
    clone.querySelector(".name").textContent =
      student.firstName + " " + student.lastName;
    clone.querySelector(".gender").textContent = student.gender;
    clone.querySelector(".house").textContent = student.house;
    clone.querySelector("img").src = `images/${student.img}`;
    clone
      .querySelector("img")
      .addEventListener("click", () => showDetails(student));

    document.querySelector("main").appendChild(clone);
  });
}

function showDetails(student) {
  document.querySelector("#popup").style.display = "block";
  document.querySelector(".close").addEventListener("click", hideDetails);

  document.querySelector(".name").textContent =
    student.firstName + " " + student.lastName;
  document.querySelector(".gender").textContent = student.gender;
  document.querySelector(".house").textContent = student.house;
  document.querySelector("img").src = `images/${student.img}`;
}

function hideDetails() {
  document.querySelector("#popup").style.display = "none";
}

function capitalize(name) {
  // we need to check if a name has a hyphen as one student's lastName contains a hyphen,
  // and we want whatever is at the end of this hyphen to also be capitalized
  if (name.includes("-")) {
    let hyphen = name.indexOf("-") + 1;
    return (
      // we tell the computer to return the following
      name[0].toUpperCase() +
      name.substring(1, hyphen) +
      name[hyphen].toUpperCase() +
      name.substring(hyphen + 1, name.length).toLowerCase()
    );
  }
  return name[0].toUpperCase() + name.substring(1, name.length).toLowerCase();
}

function findImage(firstName, lastName) {
  let img = lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";
  // "XMLHttpRequest (XHR) objects are used to interact with servers. You can retrieve data from a URL without having to do a full page refresh.
  // This enables a Web page to update just part of a page without disrupting what the user is doing. XMLHttpRequest is used heavily in AJAX programming."
  // --source MDN on XMLHttpRequest
  let request = new XMLHttpRequest();
  request.open("HEAD", "/images/" + img, false);
  request.send();

  if (request.status !== 404) {
    return img;
  } else {
    img = lastName.toLowerCase() + "_" + firstName.toLowerCase() + ".png";
    request.open("HEAD", "/images/" + img, false);
    request.send();
    console.log("/images/" + img);
    console.log(request.status);

    if (request.status !== 404) {
      return img;
    } else {
      return null;
    }
  }
}
