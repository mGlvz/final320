var userExists = false;
var userFullName = "";

function changeRoute(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#","");
    console.log(hashTag + " " + pageID);
    if(pageID != ""){
    $.get(`pages/${pageID}/${pageID}.html`, function(data){
        console.log("data" + data);
        $("#app").html(data);
    })
  }else{
    $.get(`pages/home/home.html`, function(data){
        console.log("data" + data);
        $("#app").html(data);
    })
  }
} 

function initURLListener(){
    $(window).on("hashchange", changeRoute);
    changeRoute();
}

function initListener(){
  $(".bars").click(function(e){
      $(".bars").toggleClass("active");
      $(".links").toggleClass("active");
  });

  $(".links a").click(function(e){
      $(".bars").toggleClass("active");
      $(".links").removeClass("active");
  });
}

RECIPES = [{
  name: "Supreme Pizza",
  desc: 'Make pizza night super duper out of this world with homemade pizza. This recipe is supreme with vegetables and two types of meat. Yum!',
  time: '1h24mins',
  servings: 4,
  image: 'recipe-pizza.jpg',
  ingredients: [
    {ingredient: '1/4 batch pizza dough',}, 
    {ingredient: '2 tablespoons Last-Minute Pizza Sauce',}, 
    {ingredient: '10 slices pepperoni'}, 
    {ingredient: '1 cup cooked and crumbled Italian sausage',},
    {ingredient: '2 large mushrooms sliced',},
    {ingredient: '1/4 bell pepper sliced',},
    {ingredient: '1 tablespoon sliced black olives',}, 
    {ingredient: '1 cup shredded mozzarella cheese'}
  ],
  instructions: [
    {instruction: 'Preheat the oven to 475°. Spray pizza pan with nonstick cooking or line a baking sheet with parchment paper.'},
    {instruction: 'Flatten dough into a thin round and place on the pizza pan.'},
    {instruction: 'Spread pizza sauce over the dough.'},
    {instruction: 'Layer the toppings over the dough in the order listed.'},
    {instruction: 'Bake for 8 to 10 minutes or until the crust is crisp and the cheese melted and lightly browned.'}
  ]
},
{
  name: "Classic Burger",
  desc: 'Sink your teeth into a delicious restaurant-style, hamburger recipe made from lean beef. Skip the prepackaged patties and take the extra time to craft up your own, and that little extra effort will be worth it.',
  time: '30mins',
  servings: 4,
  image: 'recipe-burger.jpg',
  ingredients: [
    {ingredient: 'Beef',},
    {ingredient: 'Buns',},
    {ingredient: 'Cheese'}
  ],
instructions: [
    {instruction: 'Season beef',},
    {instruction: 'Shape beef into patties',},
    {instruction: 'Add oil to pan and add patties'}
  ]
}, {
  name: "Chicken Biryani",
  desc: 'Chicken Biryani is a bold and flavorful Indian dish with crazy tender bites of chicken with bell peppers in a deliciously spiced and fragrant rice.',
  time: '1h15mins',
  servings: 6,
  image: 'recipe-pilaf.jpg',
  ingredients: [
    {ingredient: 'Chicken',},
    {ingredient: 'Tomato',},
    {ingredient: 'Cumin'}
  ],
instructions: [
    {instruction: 'Prep chicken',},
    {instruction: 'Cut tomatoes',},
    {instruction: 'Add tomatoes and spices to pot'}
  ]
},
{
  name: "Ch. Chow Mein",
  desc: 'A great Chow Mein comes down to the sauce - it takes more than just soy sauce and sugar! Jam packed with a surprising amount of hidden vegetables, customize this Chicken Chow Mein recipe using your protein of choice!',
  time: '20mins',
  servings: 4,
  image: 'recipe-chowmein.jpg',
  ingredients: [
    {ingredientOne: 'Noodles',},
    {ingredientTwo: 'Peas',},
    {ingredientThree: 'Carrots'}
  ],
instructions: [
    {instructionOne: 'Boil a pot of water',},
    {instructionTwo: 'Chop veggies',},
    {instructionThree: 'Add noodles to boiling water'}
  ]
}
]

function signOut() {
  firebase
      .auth()
      .signOut()
      .then(() => {
          console.log("Signed out")
      })
      .catch((error) => {
          console.log("error signing out");
      })
}

function createAccount(){
  let fName = $("#fNameCA").val();
  let lName = $("#lNameCA").val();
  let email = $("#emailCA").val();
  let pw = $("#pwCA").val();
  let fullName = fName + " " + lName;

  console.log("create " + fName + " " + lName + " " + email + " " + pw );
  firebase.auth().createUserWithEmailAndPassword(email, pw)
.then((userCredential) => {
  // Signed in 
  var user = userCredential.user;
  console.log('created');
  firebase.auth().currentUser.updateProfile({
      displayName: fullName,
  });
  userFullName = fullName;
  $(".name").html(userFullName);
  $("#fNameCA").val("");
  $("#lNameCA").val("");
  $("#emailCA").val("");
  $("#pwCA").val("");
})
.catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log('create error ' + errorMessage);
});

}

function signIn(){
  firebase.auth().signInAnonymously()
  .then(() => {
    console.log("signed in");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error Signing in" + errorMessage);
  });
}

function login(){
  let email = $("#log-email").val();
  let pw = $("#log-pw").val();
  firebase.auth().signInWithEmailAndPassword(email, pw)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log("logged in");
    $("#log-email").val("");
    $("#log-pw").val("");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("logged in error" + errorMessage);
  });
}

function initFirebase (){
  firebase.auth().onAuthStateChanged((user) => {
      if(user){
          console.log ("auth change logged in");
          if(user.displayName){
              $(".name").html(user.displayName);
          }
          
          $(".loadLists").prop("disabled", false);
          userExists = true;
      }else{
          console.log("auth changed logged out");
          $(".name").html("");
          $(".loadLists").prop("disabled", true);
          userExists = false;
          userFullName = "";

      }
  });
}

$(document).ready(function(){
  try{
    let app = firebase.app();
    initFirebase();
    // signInAnon();
    initListener();
  }catch(error){
    console.log("error " + error);
}
   initURLListener();
   initListener();
});