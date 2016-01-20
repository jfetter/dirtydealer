'use strict';

var app = angular.module('socialMockup', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', "base64", "firebase"])

app.constant('ENV', {
  API_URL: 'http://localhost:3000'
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('home', {url: '/', templateUrl: 'views/home/home.html', controller: 'homeCtrl'})
		.state('login', {url: '/login', templateUrl: 'views/login/login.html', controller: 'loginCtrl'})
		.state('register', {url: '/register', templateUrl: 'views/register/register.html', controller: 'registerCtrl'})
		.state('game', {url: '/game', templateUrl: 'views/game/game.html', controller: 'gameMasterCtrl'})
		.state('userPage', {url: '/userpage/{username}', templateUrl: 'views/userPage/userPage.html', controller: 'userPageCtrl'})
})

app.controller('MasterController', function(UserService, $cookies, jwtHelper, $scope, $state, $rootScope){
  var cookies = $cookies.get('token');
  var username;
  if(cookies){
    $scope.userInfo = (jwtHelper.decodeToken(cookies))
  }

  UserService.isAuthed(cookies)
  .then(function(res , err){
    console.log(res.data)
    if (res.data !== "authRequired"){
      $state.go('userPage', {"username": res.data.username})
    $scope.isLoggedIn = true;
    console.log("LOGGED IN!")
  } else {
    $scope.isLoggedIn = false;
    $state.go('login');
  }
  })
  $scope.$on('loggedIn', function(){
    $scope.isLoggedIn = true;
    var cookies = $cookies.get('token');
    if(cookies){
      console.log("in cookis if")
      $scope.userInfo = (jwtHelper.decodeToken(cookies))
    }
    username = $scope.userInfo.username

  })
  $scope.$on('edit', function(event, data){
    console.log('e:', event);
    console.log('d:', data);
    console.log("New:", data._id)
    console.log("Old", $scope.userInfo._id)
    if(!$scope.userInfo.isAdmin || data._id === $scope.userInfo._id){
      $scope.userInfo = data;
      username = $scope.userInfo.username
      console.log("NEWUSERNAME!!!!!", username)
    }
  })

  $scope.logout = function(){
    $cookies.remove('token');
    if (localStorage.playing){localStorage.removeItem('player')}
    $state.go('login')
    $scope.isLoggedIn = false;
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    console.log("ISUSERNAME", username)
    $state.go('userPage', {"username": username})
  }
})

'use strict';

var app = angular.module('socialMockup');

app.service('UserService', function($http, $firebaseObject, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.register = function(user){
		console.log(user)
		return $http.post(`${ENV.API_URL}/register`, user);
	};
	this.login = function(user){
		return $http.post(`${ENV.API_URL}/login`, user);
	};
	this.list = function(){
		return $http.get(`${ENV.API_URL}/user/list`);
	};
	this.page = function(username){
		return $http.get(`${ENV.API_URL}/user/page/${username}`)
	}
	this.auth = function(){
		return $http.get(`${ENV.API_URL}/auth`)
	};
	this.editAccount = function(data){
		return $http.post(`${ENV.API_URL}/user/edit`, data)
	}
	this.loggedIn = function(isLoggedIn){
			if(isLoggedIn){ return true }
	};
  this.uploadImage = function(image, userId){
    return $http.post(`${ENV.API_URL}/imageUpload`, {
      userId: userId,
      image: image
    })
  }
	this.isAuthed = function(token){
		return $http.post(`${ENV.API_URL}/auth`, {token:token})
	};
})
'use strict';

var app = angular.module('socialMockup');

app.service('GameService', function($http, $rootScope, ENV, $location, $firebaseObject, $firebaseArray, $cookies){
	var ref = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/");

	// this.cards = function(){
	// 	// return $http.get('source/json/whiteCards.json');
	// 	console.log(whiteCards)
	// }

 // waiting state
 // display `waiting for players message`
 //accumulate users, when there are enough users start game.

	// $scope.players = $firebaseArray(ref);





////pre vote state/////
	 //initialize gameService

	 // start turn timer

	 //pull a black card from `deck`

	 //deal hand of white cards



})


var blackCards = [
{
text: "Why can't I sleep at night?",
pick: 1
},
{
text: "I got 99 problems but _ ain't one.",
pick: 1
},
{
text: "What's a girl's best friend?",
pick: 1
},
{
text: "What's that smell?",
pick: 1
},
{
text: "This is the way the world ends / This is the way the world ends / Not with a bang but with _.",
pick: 1
},
{
text: "What is Batman's guilty pleasure?",
pick: 1
},
{
text: "TSA guidelines now prohibit _ on airplanes.",
pick: 1
},
{
text: "What ended my last relationship?",
pick: 1
},
{
text: "MTV's new reality show features eight washed-up celebrities living with _.",
pick: 1
},
{
text: "I drink to forget _.",
pick: 1
},
{
text: "I'm sorry, Professor, but I couldn't complete my homework because of _.",
pick: 1
},
{
text: "Alternative medicine is now embracing the curative powers of _.",
pick: 1
},
{
text: "What's that sound?",
pick: 1
},
{
text: "What's the next Happy Meal&reg; toy?",
pick: 1
},
{
text: "It's a pity that kids these days are all getting involved with _.",
pick: 1
},
{
text: "In the new Disney Channel Original Movie, Hannah Montana struggles with _ for the first time.",
pick: 1
},
{
text: "_. That's how I want to die.",
pick: 1
},
{
text: "What does Dick Cheney prefer?",
pick: 1
},
{
text: "What's the most emo?",
pick: 1
},
{
text: "Instead of coal, Santa now gives the bad children _.",
pick: 1
},
{
text: "Next from J.K. Rowling: Harry Potter and the Chamber of _.",
pick: 1
},
{
text: "A romantic, candlelit dinner would be incomplete without _.",
pick: 1
},
{
text: "White people like _.",
pick: 1
},
{
text: "_. Betcha can't have just one!",
pick: 1
},
{
text: "War!<br><br>What is it good for?",
pick: 1
},
{
text: "BILLY MAYS HERE FOR _.",
pick: 1
},
{
text: "_. High five, bro.",
pick: 1
},
{
text: "During sex, I like to think about _.",
pick: 1
},
{
text: "What did I bring back from Mexico?",
pick: 1
},
{
text: "What are my parents hiding from me?",
pick: 1
},
{
text: "What will always get you laid?",
pick: 1
},
{
text: "What would grandma find disturbing, yet oddly charming?",
pick: 1
},
{
text: "What did the U.S. airdrop to the children of Afghanistan?",
pick: 1
},
{
text: "What helps Obama unwind?",
pick: 1
},
{
text: "What's there a ton of in heaven?",
pick: 1
},
{
text: "Major League Baseball has banned _ for giving players an unfair advantage.",
pick: 1
},
{
text: "When I am a billionaire, I shall erect a 50-foot statue to commemorate _.",
pick: 1
},
{
text: "What's the new fad diet?",
pick: 1
},
{
text: "When I am the President of the United States, I will create the Department of _.",
pick: 1
},
{
text: "_. It's a trap!",
pick: 1
},
{
text: "How am I maintaining my relationship status?",
pick: 1
},
{
text: "What will I bring back in time to convince people that I am a powerful wizard?",
pick: 1
},
{
text: "While the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on _.",
pick: 1
},
{
text: "Coming to Broadway this season, _: The Musical.",
pick: 1
},
{
text: "What's my secret power?",
pick: 1
},
{
text: "What gives me uncontrollable gas?",
pick: 1
},
{
text: "But before I kill you, Mr. Bond, I must show you _.",
pick: 1
},
{
text: "What never fails to liven up the party?",
pick: 1
},
{
text: "What am I giving up for Lent?",
pick: 1
},
{
text: "What do old people smell like? ",
pick: 1
},
{
text: "The class field trip was completely ruined by _.",
pick: 1
},
{
text: "When Pharaoh remained unmoved, Moses called down a plague of _.",
pick: 1
},
{
text: "I do not know with which weapons World War III will be fought, but World War IV will be fought with _.",
pick: 1
},
{
text: "What's Teach for America using to inspire inner city students to succeed?",
pick: 1
},
{
text: "In Michael Jackson's final moments, he thought about _.",
pick: 1
},
{
text: "Why do I hurt all over?",
pick: 1
},
{
text: "Studies show that lab rats navigate mazes 50% faster after being exposed to _.",
pick: 1
},
{
text: "Why am I sticky?",
pick: 1
},
{
text: "What's my anti-drug?",
pick: 1
},
{
text: "And the Academy Award for _ goes to _.",
pick: 2
},
{
text: "For my next trick, I will pull _ out of _.",
pick: 2
},
{
text: "_: Good to the last drop.",
pick: 1
},
{
text: "What did Vin Diesel eat for dinner?",
pick: 1
},
{
text: "_: kid-tested, mother-approved.",
pick: 1
},
{
text: "What gets better with age?",
pick: 1
},
{
text: "I never truly understood _ until I encountered _.",
pick: 2
},
{
text: "Rumor has it that Vladimir Putin's favorite delicacy is _ stuffed with _.",
pick: 2
},
{
text: "Lifetime&reg; presents _, the story of _.",
pick: 2
},
{
text: "Make a haiku.",
pick: 3
},
{
text: "In M. Night Shyamalan's new movie, Bruce Willis discovers that _ had really been _ all along.",
pick: 2
},
{
text: "_ is a slippery slope that leads to _.",
pick: 2
},
{
text: "In a world ravaged by _, our only solace is _.",
pick: 2
},
{
text: "That's right, I killed _. How, you ask? _.",
pick: 2
},
{
text: "When I was tripping on acid, _ turned into _.",
pick: 2
},
{
text: "_ + _ = _.",
pick: 3
},
{
text: "What's the next superhero/sidekick duo?",
pick: 2
},
{
text: "Dear Abby,<br><br>I'm having some trouble with _ and would like your advice.",
pick: 1
},
{
text: "After the earthquake, Sean Penn brought _ to the people of Haiti.",
pick: 1
},
{
text: "In L.A. County Jail, word is you can trade 200 cigarettes for _.",
pick: 1
},
{
text: "Maybe she's born with it. Maybe it's _.",
pick: 1
},
{
text: "Life for American Indians was forever changed when the White Man introduced them to _.",
pick: 1
},
{
text: "Next on ESPN2, the World Series of _.",
pick: 1
},
{
text: "Step 1: _. Step 2: _. Step 3: Profit.",
pick: 2
},
{
text: "Here is the church<br>Here is the steeple<br>Open the doors<br>And there is _.",
pick: 1
},
{
text: "How did I lose my virginity?",
pick: 1
},
{
text: "During his childhood, Salvador Dal&iacute; produced hundreds of paintings of _.",
pick: 1
},
{
text: "In 1,000 years, when paper money is a distant memory, how will we pay for goods and services?",
pick: 1
},
{
text: "What don't you want to find in your Kung Pao chicken?",
pick: 1
},
{
text: "The Smithsonian Museum of Natural History has just opened an exhibit on _.",
pick: 1
},
{
text: "Daddy, why is Mommy crying?",
pick: 1
}
]

var whiteCards = [
"Coat hanger abortions.",
"Man meat.",
"Autocannibalism.",
"Vigorous jazz hands.",
"Flightless birds.",
"Pictures of boobs.",
"Doing the right thing.",
"The violation of our most basic human rights.",
"Viagra&reg;.",
"Self-loathing.",
"Spectacular abs.",
"A balanced breakfast.",
"Roofies.",
"Concealing a boner.",
"Amputees.",
"The Big Bang.",
"Former President George W. Bush.",
"The Rev. Dr. Martin Luther King, Jr.",
"Smegma.",
"Being marginalized.",
"Cuddling.",
"Laying an egg.",
"The Pope.",
"Aaron Burr.",
"Genital piercings.",
"Fingering.",
"A bleached asshole.",
"Horse meat.",
"Fear itself.",
"Science.",
"Elderly Japanese men.",
"Stranger danger.",
"The terrorists.",
"Praying the gay away.",
"Same-sex ice dancing.",
"Ethnic cleansing.",
"Cheating in the Special Olympics.",
"German dungeon porn.",
"Bingeing and purging.",
"Making a pouty face.",
"William Shatner.",
"Heteronormativity.",
"Nickelback.",
"Tom Cruise.",
"The profoundly handicapped.",
"The placenta.",
"Chainsaws for hands.",
"Arnold Schwarzenegger.",
"An icepick lobotomy.",
"Goblins.",
"Object permanence.",
"Dying.",
"Foreskin.",
"A falcon with a cap on its head.",
"Hormone injections.",
"Dying of dysentery.",
"Sexy pillow fights.",
"The invisible hand.",
"A really cool hat.",
"Sean Penn.",
"Heartwarming orphans.",
"The clitoris.",
"The Three-Fifths compromise.",
"A sad handjob.",
"Men.",
"Historically black colleges.",
"A micropenis.",
"Raptor attacks.",
"Agriculture.",
"Vikings.",
"Pretending to care.",
"The Underground Railroad.",
"My humps.",
"Being a dick to children.",
"Geese.",
"Bling.",
"Sniffing glue.",
"The South.",
"An Oedipus complex.",
"Eating all of the cookies before the AIDS bake-sale.",
"Sexting.",
"YOU MUST CONSTRUCT ADDITIONAL PYLONS.",
"Mutually-assured destruction.",
"Sunshine and rainbows.",
"Count Chocula.",
"Sharing needles.",
"Being rich.",
"Skeletor.",
"A sausage festival.",
"Michael Jackson.",
"Emotions.",
"Farting and walking away.",
"The Chinese gymnastics team.",
"Necrophilia.",
"Spontaneous human combustion.",
"Yeast.",
"Leaving an awkward voicemail.",
"Dick Cheney.",
"White people.",
"Penis envy.",
"Teaching a robot to love.",
"Sperm whales.",
"Scrubbing under the folds.",
"Panda sex.",
"Whipping it out.",
"Catapults.",
"Masturbation.",
"Natural selection.",
"Opposable thumbs.",
"A sassy black woman.",
"AIDS.",
"The KKK.",
"Figgy pudding.",
"Seppuku.",
"Gandhi.",
"Preteens.",
"Toni Morrison's vagina.",
"Five-Dollar Footlongs&trade;.",
"Land mines.",
"A sea of troubles.",
"A zesty breakfast burrito.",
"Christopher Walken.",
"Friction.",
"Balls.",
"Dental dams.",
"A can of whoop-ass.",
"A tiny horse.",
"Waiting 'til marriage.",
"Authentic Mexican cuisine.",
"Genghis Khan.",
"Old-people smell.",
"Feeding Rosie O'Donnell.",
"Pixelated bukkake.",
"Friends with benefits.",
"The token minority.",
"The Tempur-Pedic&reg; Swedish Sleep System&trade;.",
"A thermonuclear detonation.",
"Take-backsies.",
"The Rapture.",
"A cooler full of organs.",
"Sweet, sweet vengeance.",
"RoboCop.",
"Keanu Reeves.",
"Drinking alone.",
"Giving 110%.",
"Flesh-eating bacteria.",
"The American Dream.",
"Taking off your shirt.",
"Me time.",
"A murder most foul.",
"The inevitable heat death of the universe.",
"The folly of man.",
"That thing that electrocutes your abs.",
"Cards Against Humanity.",
"Fiery poops.",
"Poor people.",
"Edible underpants.",
"Britney Spears at 55.",
"All-you-can-eat shrimp for $4.99.",
"Pooping back and forth. Forever.",
"Fancy Feast&reg;.",
"Jewish fraternities.",
"Being a motherfucking sorcerer.",
"Pulling out.",
"Picking up girls at the abortion clinic.",
"The homosexual agenda.",
"The Holy Bible.",
"Passive-agression.",
"Ronald Reagan.",
"Vehicular manslaughter.",
"Nipple blades.",
"Assless chaps.",
"Full frontal nudity.",
"Hulk Hogan.",
"Daddy issues.",
"The hardworking Mexican.",
"Natalie Portman.",
"Waking up half-naked in a Denny's parking lot.",
"God.",
"Sean Connery.",
"Saxophone solos.",
"Gloryholes.",
"The World of Warcraft.",
"Homeless people.",
"Scalping.",
"Darth Vader.",
"Eating the last known bison.",
"Guys who don't call.",
"Hot Pockets&reg;.",
"A time travel paradox.",
"The milk man.",
"Testicular torsion.",
"Dropping a chandelier on your enemies and riding the rope up.",
"World peace.",
"A salty surprise.",
"Poorly-timed Holocaust jokes.",
"Smallpox blankets.",
"Licking things to claim them as your own.",
"The heart of a child.",
"Robert Downey, Jr.",
"Lockjaw.",
"Eugenics.",
"A good sniff.",
"Friendly fire.",
"The taint; the grundle; the fleshy fun-bridge.",
"Wearing underwear inside-out to avoid doing laundry.",
"Hurricane Katrina.",
"Free samples.",
"Jerking off into a pool of children's tears.",
"A foul mouth.",
"The glass ceiling.",
"Republicans.",
"Explosions.",
"Michelle Obama's arms.",
"Getting really high.",
"Attitude.",
"Sarah Palin.",
"The &Uuml;bermensch.",
"Altar boys.",
"My soul.",
"My sex life.",
"Pedophiles.",
"72 virgins.",
"Pabst Blue Ribbon.",
"Domino's&trade; Oreo&trade; Dessert Pizza.",
"A snapping turtle biting the tip of your penis.",
"The Blood of Christ.",
"Half-assed foreplay.",
"My collection of high-tech sex toys.",
"A middle-aged man on roller skates.",
"Bitches.",
"Bill Nye the Science Guy.",
"Italians.",
"A windmill full of corpses.",
"Adderall&trade;.",
"Crippling debt.",
"A stray pube.",
"Prancing.",
"Passing a kidney stone.",
"A brain tumor.",
"Leprosy.",
"Puppies!",
"Bees?",
"Frolicking.",
"Repression.",
"Road head.",
"A bag of magic beans.",
"An asymmetric boob job.",
"Dead parents.",
"Public ridicule.",
"A mating display.",
"A mime having a stroke.",
"Stephen Hawking talking dirty.",
"African children.",
"Mouth herpes.",
"Overcompensation.",
"Riding off into the sunset.",
"Being on fire.",
"Tangled Slinkys.",
"Civilian casualties.",
"Auschwitz.",
"My genitals.",
"Not reciprocating oral sex.",
"Lactation.",
"Being fabulous.",
"Shaquille O'Neal's acting career.",
"My relationship status.",
"Asians who aren't good at math.",
"Alcoholism.",
"Incest.",
"Grave robbing.",
"Hope.",
"8 oz. of sweet Mexican black-tar heroin.",
"Kids with ass cancer.",
"Winking at old people.",
"The Jews.",
"Justin Bieber.",
"Doin' it in the butt.",
"A lifetime of sadness.",
"The Hamburglar.",
"Swooping.",
"Classist undertones.",
"New Age music.",
"Not giving a shit about the Third World.",
"The Kool-Aid Man.",
"A hot mess.",
"Tentacle porn.",
"Lumberjack fantasies.",
"The gays.",
"Scientology.",
"Estrogen.",
"GoGurt&reg;.",
"Judge Judy.",
"Dick fingers.",
"Racism.",
"Surprise sex!",
"Police brutality.",
"Passable transvestites.",
"The Virginia Tech Massacre.",
"When you fart and a little bit comes out.",
"Oompa-Loompas.",
"A fetus.",
"Obesity.",
"Tasteful sideboob.",
"Hot people.",
"BATMAN!!!",
"Black people.",
"A gassy antelope.",
"Sexual tension.",
"Third base.",
"Racially-biased SAT questions.",
"Porn stars.",
"A Super Soaker&trade; full of cat pee.",
"Muhammed (Praise Be Unto Him).",
"Puberty.",
"A disappointing birthday party.",
"An erection that lasts longer than four hours.",
"White privilege.",
"Getting so angry that you pop a boner.",
"Wifely duties.",
"Two midgets shitting into a bucket.",
"Queefing.",
"Wiping her butt.",
"Golden showers.",
"Barack Obama.",
"Nazis.",
"A robust mongoloid.",
"An M. Night Shyamalan plot twist.",
"Getting drunk on mouthwash.",
"Lunchables&trade;.",
"Women in yogurt commercials.",
"John Wilkes Booth.",
"Powerful thighs.",
"Mr. Clean, right behind you.",
"Multiple stab wounds.",
"Cybernetic enhancements.",
"Serfdom.",
"Kanye West.",
"Women's suffrage.",
"Children on leashes.",
"Harry Potter erotica.",
"The Dance of the Sugar Plum Fairy.",
"Lance Armstrong's missing testicle.",
"Parting the Red Sea.",
"The Amish.",
"Dead babies.",
"Child beauty pageants.",
"AXE Body Spray.",
"Centaurs.",
"Copping a feel.",
"Grandma.",
"Famine.",
"The Trail of Tears.",
"The miracle of childbirth.",
"Finger painting.",
"A monkey smoking a cigar.",
"The Make-A-Wish&reg; Foundation.",
"Anal beads.",
"The Force.",
"Kamikaze pilots.",
"Dry heaving.",
"Active listening.",
"Ghosts.",
"The Hustle.",
"Peeing a little bit.",
"Another goddamn vampire movie.",
"Shapeshifters.",
"The Care Bear Stare.",
"Hot cheese.",
"A mopey zoo lion.",
"A defective condom.",
"Teenage pregnancy.",
"A Bop It&trade;.",
"Expecting a burp and vomiting on the floor.",
"Horrifying laser hair removal accidents.",
"Boogers.",
"Unfathomable stupidity.",
"Breaking out into song and dance.",
"Soup that is too hot.",
"Morgan Freeman's voice.",
"Getting naked and watching Nickelodeon.",
"MechaHitler.",
"Flying sex snakes.",
"The true meaning of Christmas.",
"My inner demons.",
"Pac-Man uncontrollably guzzling cum.",
"My vagina.",
"A homoerotic volleyball montage.",
"Actually taking candy from a baby.",
"Crystal meth.",
"Exactly what you'd expect.",
"Natural male enhancement.",
"Passive-aggressive Post-it notes.",
"Inappropriate yodeling.",
"Lady Gaga.",
"The Little Engine That Could.",
"Vigilante justice.",
"A death ray.",
"Poor life choices.",
"A gentle caress of the inner thigh.",
"Embryonic stem cells.",
"Nicolas Cage.",
"Firing a rifle into the air while balls deep in a squealing hog.",
"Switching to Geico&reg;.",
"The chronic.",
"Erectile dysfunction.",
"Home video of Oprah sobbing into a Lean Cuisine&reg;.",
"A bucket of fish heads.",
"50,000 volts straight to the nipples.",
"Being fat and stupid.",
"Hospice care.",
"A pyramid of severed heads.",
"Getting married, having a few kids, buying some stuff, retiring to Florida, and dying.",
"A subscription to Men's Fitness.",
"Crucifixion.",
"A micropig wearing a tiny raincoat and booties.",
"Some god-damn peace and quiet.",
"Used panties.",
"A tribe of warrior women.",
"The penny whistle solo from 'My Heart Will Go On.'",
"An oversized lollipop.",
"Helplessly giggling at the mention of Hutus and Tutsis.",
"Not wearing pants.",
"Consensual sex.",
"Her Majesty, Queen Elizabeth II.",
"Funky fresh rhymes.",
"The art of seduction.",
"The Devil himself.",
"Advice from a wise, old black man.",
"Destroying the evidence.",
"The light of a billion suns.",
"Wet dreams.",
"Synergistic management solutions.",
"Growing a pair.",
"Silence.",
"An M16 assault rifle.",
"Poopy diapers.",
"A live studio audience.",
"The Great Depression.",
"A spastic nerd.",
"Rush Limbaugh's soft, shitty body.",
"Tickling Sean Hannity, even after he tells you to stop.",
"Stalin.",
"Brown people.",
"Rehab.",
"Capturing Newt Gingrich and forcing him to dance in a monkey suit.",
"Battlefield amputations.",
"An uppercut.",
"Shiny objects.",
"An ugly face.",
"Menstrual rage.",
"A bitch slap.",
"One trillion dollars.",
"Chunks of dead prostitute.",
"The entire Mormon Tabernacle Choir.",
"The female orgasm.",
"Extremely tight pants.",
"The Boy Scouts of America.",
"Stormtroopers.",
"Throwing a virgin into a volcano."
]

"use strict";

angular.module("socialMockup")

.directive('gameTimer', function() {
  // return {
  //   restrict: "AE",
  //   templateUrl: "game/timer.html",
  //   scope: {
  //     text: 'ettsts'
  //   }
  // };
})

.directive('dealCards', function() {
  return {
    templateUrl: "game/cards.html"
  };
})

'use strict';

angular.module('socialMockup')


.controller('dealingCardsCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){


// //******DEALING BOTH DECKS:
// $scope.startDeck = function(user){
//   $scope.whiteCards.$add(whiteCards)
//   $scope.blackCards.$add(blackCards)
// }
//
//
// //******DEALING BLACK CARDS:
// var blackCardRef = gameInstance.child("blackCards")
// $scope.blackCards = $firebaseArray(blackCardRef)
//
//
// $scope.dealBlackCard = function(user){
//   $scope.blackCards = blackCards;
//   var deal = Math.floor(Math.random() * ($scope.blackCards.length - 0)) + 0;
//   console.log($scope.blackCards[deal])
// }
//
//
//
// //******DEALING WHITE CARDS:
// var whiteCardRef = gameInstance.child("whiteCards")
// $scope.whiteCards = $firebaseArray(whiteCardRef)
//
// $scope.startingHand = function(user){
//   for(var i = 0; i<10; i++){
//     var rando = Math.floor(Math.random() * (whiteCards.length - 0)) + 0;
//     $scope.whiteCards.$add(whiteCards[rando])
//     $scope.whiteCards.splice(rando, 1)
//   }
// }

});

'use strict';

angular.module('socialMockup')


.controller('gameMasterCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){

	//*******USERAUTH:
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){$location.path('/login')}
		else{$scope.isLoggedIn = true;}
	})

	$scope.isUser = function(user){
		if (user._id !== $scope.userInfo._id){
			return (false)
		} else {return true}
	}




	//********TIMER:
	$scope.counter = 90;
	var mytimeout = null; // the current timeoutID
	// actual timer method, counts down every second, stops on zero
	$scope.onTimeout = function() {
		if($scope.counter ===  0) {
			$scope.$broadcast('timer-stopped', 0);
			$timeout.cancel(mytimeout);
			return;
		}
		$scope.counter--;
		mytimeout = $timeout($scope.onTimeout, 1000);
	};
	$scope.startTimer = function() {
		mytimeout = $timeout($scope.onTimeout, 1000);
	};
	// stops and resets the current timer
	$scope.stopTimer = function() {
		$scope.$broadcast('timer-stopped', $scope.counter);
		$scope.counter = 90;
		$timeout.cancel(mytimeout);
	};
	// triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
	$scope.$on('timer-stopped', function(event, remaining) {
		if(remaining === 0) {
			console.log('your time ran out!');
		}
	});




	/////****ADD AND REMOVE PLAYERS:
	var gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	var playersRef = gameInstance.child("players");
	var messageRef = gameInstance.child("messages")
	$scope.playerss = $firebaseArray(playersRef); 
	$scope.numPlayers = 0;

	// create an array to store each player's info
	$scope.addPlayer = function(){
		// figure out how to pull user id info ... maybe store it on rootscope?
		var thisPlayer = Date.now();
		localStorage.player = thisPlayer;
		console.log("this player logged In", localStorage.player)
		playersRef.child(thisPlayer).set({player: thisPlayer});
	}
	if (!localStorage.thisPlayer){
		$scope.addPlayer();
	}


		//remove players
$scope.removePlayer = function(){
    var player = JSON.parse(localStorage.player);
		console.log("player to remove", player);
		playersRef.child(player).remove();
		console.log("players before remove", $scope.playerss)
		localStorage.removeItem("player");
		console.log("players after remove", $scope.playerss)
		$state.go("userPage");
	}


	playersRef.on("child_added", function() {
		$timeout(function() {
			$scope.numPlayers ++;
			console.log("current Players", $scope.playerss)
		});
	});

	//update number of players when a player quits
	playersRef.on("child_removed", function() {
		$timeout(function() {
			$scope.numPlayers -= 1;
			console.log("PLAYER QUIT", playersRef)
		});
	});

//initialize new game 
$scope.launchNewGame = function(){
	$scope.numPlayers = 0; 
	console.log("NEW GAME");
}
	//add player to waiting room when they click join
	if ($scope.numPlayers < 3 ){
		$scope.phase = "waitingForPlayers";
		} else {
		$scope.launchNewGame();
	}




	// *******MESSAGES
	$scope.messages = $firebaseArray(messageRef);
	$scope.addMessage = function(message) {
		console.log(message);
		$scope.messages.$add({
			text: message
		});
	};
});

angular.module('socialMockup')

.controller('voteCardsCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){

});

'use strict';

angular.module('socialMockup')
.controller('homeCtrl', function($scope){
	console.log('homeCtrl');

})

'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){

			console.log('res', res.data)
			if(res.data=="login succesfull"){
				UserService.loggedIn = 'true';
				$scope.$emit('loggedIn');
				$state.go('userPage', {"username": user.username})
			} else if (res.data === "Incorrect Username or Password!"){
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: res.data,
					showConfirmButton: true,
					confirmButtonText: "I hear ya.",
				});
			}
			var token = $cookies.get('token');
			var decoded = jwtHelper.decodeToken(token);
		}, function(err) {
			console.error(err);
		});
	}

});

'use strict';

angular.module('socialMockup')

.controller('registerCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		console.log(user)
		if(user.password !== user.password2){
			swal({
				type: "warning",
				title: "Passwords don't match!",
				text: "Matching passwords only please",
				showConfirmButton: true,
				confirmButtonText: "Gotcha.",
			});
			return;
		}

		UserService.register(user)
		.then(function(data){
			swal({
				type: "success",
				title: "Successful registration!",
				text: "Hurray. You're a User!",
				imageUrl: "images/thumbs-up.jpg"
			});
			$state.go('login');
		}, function(err){
			console.log(err);
		});
	}
});

'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64){
	$scope.user = {};
	$scope.editPayload = {};
	var cookies = $cookies.get('token');
	var token = jwtHelper.decodeToken(cookies)
	console.log("COOKIES", cookies)
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){
			 $location.path('/login')
		 } else{$scope.isLoggedIn = true;}
	})

	UserService.page($state.params.username)
	.then(function(res) {
		$scope.user = res.data;
		$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
		$scope.isEditing = false;
		$scope.editPayload.username = $scope.user.username;
		$scope.editPayload._id = $scope.user._id

    console.log($scope.isEditing)
		console.log("edit Payload", $scope.editPayload)
		console.log('token:',token);
		console.log('scope user username: ', $scope.user.username);
    if(res.data.avatar){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`
    } else {
      $scope.profileImageSrc = `http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg`
    }

	}, function(err) {
		console.error(err)
	});

	$scope.toggleEdit = function(){
    console.log($scope.isEditing)
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		console.log("save edits!!!!!" , $scope.editPayload);
		UserService.editAccount($scope.editPayload)
		.then(function(response){
			$scope.$emit('edit', response.data)
			$scope.user = response.data;
			$scope.isEditing = !$scope.isEditing;
			console.log(response.data, "received")
		})
	}

  $scope.uploadImage = function(image){
    console.log(image)
    UserService.uploadImage(image, $scope.user._id)
    .then(function(res){
      console.log(res.data)
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;
      console.log($scope.profileImageSrc)
    })
  }

	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
});
