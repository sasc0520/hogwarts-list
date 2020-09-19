let familyArray = [];
loadFamilies();
const familyJSON = "https://petlatkea.dk/2020/hogwarts/families.json";
function loadFamilies() {
  fetch(familyJSON)
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    console.log(familyArray);
  });
}
