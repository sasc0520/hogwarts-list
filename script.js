"use strict";
const endpoint = "https://petlatkea.dk/2020/hogwarts/students.json";
let studentArray = [];
let filteredArray = [];
let expelledStudents = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: "",
  house: "",
  bloodstatus: "N/A",
  prefect: "No prefects given",
  squad: "Not inquisitorial squad member",
  expelled: "Not expelled",
};

window.addEventListener("DOMContentLoaded", loadJSON);
function loadJSON() {
  fetch(endpoint)
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
      registerButtons();
      displayList(studentArray);
      displayBox();
      // addHouseTheme(studentArray);
    });
}

function registerButtons() {
  document.querySelectorAll(".filter").forEach(elm => {
    elm.addEventListener("click", filterStudents);
  });
  // document.querySelectorAll(".filter").forEach(elm => {
  //   elm.addEventListener("click", addHouseTheme);
  // });
  document.querySelectorAll(".sort").forEach(elm => {
    elm.addEventListener("click", selectSort);
  });
}

function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
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
        newStudent.nickName = capitalize(nameArray[1].substring(1, nameArray[1].length - 1));
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
}

function displayList(students) {
  document.querySelector("#list main").innerHTML = "";
  students.forEach(displayStudent);
}

function displayBox() {
  document.querySelector("#container > div.display_box > p.total_students > span").textContent = "34";
  document.querySelector("#container > div.display_box > p.expelled_students > span").textContent = expelledStudents.length;
  document.querySelector("#container > div.display_box > p.gryffindor_students > span").textContent = gryffindorStudents().length;
  document.querySelector("#container > div.display_box > p.hufflepuff_students > span").textContent = hufflepuffStudents().length;
  document.querySelector("#container > div.display_box > p.ravenclaw_students > span").textContent = ravenclawStudents().length;
  document.querySelector("#container > div.display_box > p.slytherin_students > span").textContent = slytherinStudents().length;
  document.querySelector("#container > div.display_box > p.displayed_students > span").textContent = studentArray.length;
}

function displayStudent(student) {
  const template = document.querySelector("template");
  let clone = template.cloneNode(true).content;
  clone.querySelector(".name").textContent = student.firstName + " " + student.lastName;
  clone.querySelector(".gender").textContent = student.gender;
  clone.querySelector(".house").textContent = student.house;
  clone.querySelector("img").src = `images/${student.img}`;
  clone.querySelector("img").addEventListener("click", () => showDetails(student));

  clone.querySelector(".expel").addEventListener("click", () => expelStudent(student));
  clone.querySelector(".add_member").addEventListener("click", () => addStudentToSquad(student));

  document.querySelector("main").appendChild(clone);
}

function showDetails(student) {
  document.querySelector("#popup").style.display = "block";
  document.querySelector(".close").addEventListener("click", hideDetails);

  document.querySelector(".name").textContent = student.firstName + " " + student.lastName;
  document.querySelector(".gender").textContent = student.gender;
  document.querySelector(".house").textContent = student.house;
  document.querySelector(".blood").textContent = student.bloodstatus;
  document.querySelector(".prefect").textContent = student.prefect;
  document.querySelector(".squad").textContent = student.squad;
  document.querySelector(".expelled").textContent = student.expelled;

  document.querySelector("img").src = `images/${student.img}`;

  addHouseTheme(student);
}

function hideDetails() {
  document.querySelector("#popup").style.display = "none";
}

function addHouseTheme(student) {
  document.querySelector("#popup .info").classList.remove("gryffindor");
  document.querySelector("#popup .info").classList.remove("hufflepuff");
  document.querySelector("#popup .info").classList.remove("ravenclaw");
  document.querySelector("#popup .info").classList.remove("slytherin");
  const className = student.house.toLowerCase();
  document.querySelector("#popup .info").classList.add(className);
}

function capitalize(name) {
  // we need to check if a name has a hyphen as one student's lastName contains a hyphen,
  // and we want whatever is at the end of this hyphen to also be capitalized
  if (name.includes("-")) {
    let hyphen = name.indexOf("-") + 1;
    return (
      // we tell the computer to return the following
      name[0].toUpperCase() + name.substring(1, hyphen) + name[hyphen].toUpperCase() + name.substring(hyphen + 1, name.length).toLowerCase()
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

    if (request.status !== 404) {
      return img;
    } else {
      return null;
    }
  }
}

function gryffindorStudents() {
  return studentArray.filter(elm => {
    return elm.house === "Gryffindor";
  });
}
function hufflepuffStudents() {
  return studentArray.filter(elm => {
    return elm.house === "Hufflepuff";
  });
}
function ravenclawStudents() {
  return studentArray.filter(elm => {
    return elm.house === "Ravenclaw";
  });
}
function slytherinStudents() {
  return studentArray.filter(elm => {
    return elm.house === "Slytherin";
  });
}

function filterStudents() {
  let filter = this.dataset.option;
  if (filter === "all") {
    filteredArray = studentArray;
  } else if (filter === "expelled") {
    filteredArray = expelledStudents;
  } else {
    filteredArray = studentArray.filter(elm => elm.house.toLowerCase() === filter);
  }
  displayList(filteredArray);
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  sortStudents(sortBy);
}

function sortStudents(sortBy) {
  let sortedList = studentArray;

  if (sortBy === "firstname") {
    sortedList = sortedList.sort(sortByFirstname);
  } else if (sortBy === "lastname") {
    sortedList = sortedList.sort(sortByLastname);
  }
  // const sortedByLastname = list.sort(sortByLastname);
  displayList(sortedList);
  // displayList(sortedByLastname);
}

function sortByFirstname(studentA, studentB) {
  if (studentA.firstName < studentB.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByLastname(studentA, studentB) {
  if (studentA.lastName < studentB.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function expelStudent(student) {
  if (student.expelled === "Not expelled") {
    student.expelled = "Expelled";
    studentArray.splice(studentArray.indexOf(student), 1);
    expelledStudents.push(student);
    document.querySelector(".dialogue").classList.remove("hide");
    document.querySelector(".message").innerHTML = `${student.firstName} ${student.lastName} has been expelled`;
    setTimeout(() => {
      document.querySelector(".dialogue").classList.add("hide");
    }, 1500);
  } else {
    document.querySelector(".dialogue").classList.remove("hide");
    document.querySelector(".message").innerHTML = `${student.firstName} ${student.lastName} has already been expelled`;
    setTimeout(() => {
      document.querySelector(".dialogue").classList.add("hide");
    }, 1500);
  }
  displayBox();
  displayList(studentArray);
}

function addStudentToSquad(student) {
  if (student.squad === "Not inquisitorial squad member") {
    student.squad = "Member of the inquisitorial squad";
    document.querySelector(".dialogue").classList.remove("hide");
    document.querySelector(".message").innerHTML = `${student.firstName} ${student.lastName} is now a member of the inquisitorial squad`;
    setTimeout(() => {
      document.querySelector(".dialogue").classList.add("hide");
    }, 1500);
  } else {
    document.querySelector(".dialogue").classList.remove("hide");
    document.querySelector(".message").innerHTML = `${student.firstName} ${student.lastName} is already a member of the inquisitorial squad`;
    setTimeout(() => {
      document.querySelector(".dialogue").classList.add("hide");
    }, 1500);
  }
  displayList(studentArray);
}
