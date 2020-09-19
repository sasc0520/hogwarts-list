function hackTheSystem() {
  hacked = true;
  const myself = object.create(Student);
  myself.firstName = "Sascha Brouer";
  myself.hacker = true;

  const values = ["pure", "half", "muggle"];

  //   randomize;
  studentArray.forEach(student => {
    student.bloodstatus = values[Math.floor(Math.random() * values.length)];
    // if (student.bloodstatus === "pure") {
    //   const random = Math.floor(Math.random() * values.length);
    //   if (random < 0.3) {
    //     student.bloodstatus = "pure";
    //   } else if (random === 1) {
    //     student.bloodstatus = "half";
    //   } else {
    //     student.bloodstatus = "muggle";
    //   }
    // }
  });
}

function expel(student) {
  if (student.hacker) {
    // cannot expel
  } else {
    // actually expel
  }
}

function addToStudent(student) {
  if (hacked) {
    setTimeout(removeStudentFromSquad, 2000, student);
  }
}

function removeStudentFromSquad(student) {
  // code for removing
}
