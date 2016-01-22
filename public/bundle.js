'use strict';

var app = angular.module('cardsAgainstHumanity', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', "base64", "firebase"])

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

app.controller('MasterController', function(UserService, $cookies, jwtHelper, $scope, $state, $rootScope, GameService){
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
    GameService.removePlayer();
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    console.log("ISUSERNAME", username)
    $state.go('userPage', {"username": username})
  }
})

'use strict';

var app = angular.module('cardsAgainstHumanity');

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

angular.module("cardsAgainstHumanity")

.directive('gameTimer', function() {
  return {
    templateUrl: "game/timer.html",
    // controller: "gameMasterCtrl",
  };
})

'use strict';
angular.module('cardsAgainstHumanity')


.service('GameService', function($http, $firebaseObject, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){

	var cookies = $cookies.get('token');


	this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	this.playersRef = this.gameInstance.child("players");
	var playersRef = this.playersRef
	this.messageRef = this.gameInstance.child("messages");
	var messageRef = this.messageRef
	this.playerss = $firebaseArray(playersRef);
	this.messages = $firebaseArray(messageRef);
	this.votingRef = this.gameInstance.child("voting");


	///add game state to firebase
	this.gameStateRef = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/gamestate");
	var gameStateRef = this.gameStateRef;

	this.advanceGameState = function(){
		var next = "sad clown";
		gameStateRef.child('current').once('value', function(snap){
		next = snap.val() + 1; 
		if ( next > 3){
			next = 0;
		}
		gameStateRef.child('current').set(next);
		})

	}



	//remove players
	this.removePlayer = function(){
		// var player = JSON.parse(localStorage.player);
		var player = localStorage.player;
		console.log("player to remove", player);
		playersRef.child(player).remove();
		console.log("players before remove", this.playerss)
		localStorage.removeItem("player");
		console.log("players after remove", this.playerss)
	}

	this.pickCards = function(){
		var cookies = $cookies.get('token');

		var token = jwtHelper.decodeToken(cookies)


		// var myId = JSON.parse(localStorage.player)
		var myId = localStorage.player
		var myHand = CardsService.startingHand();
		var tempYourHand = [];
		var gamePoints = 0;

		//var myHand = ["test3", "test4", "test5", "test6"]
		this.playersRef.child(myId).set({
			playerId: myId,
			username: token.username,
			cards: myHand,
			gamePoints: gamePoints
		});
		console.log("picking a card")
		return myHand;
	}

	this.addPlayer = function(){
		var cookies = $cookies.get('token');

		var token = jwtHelper.decodeToken(cookies)

		// var thisPlayer = token.username;
		var thisPlayer = token._id;
		// var thisPlayer = Date.now();
		var gamePoints = 0;
		var cards = ["testA", "testB"];
		//var cards = CardService.DealWhite();
		//deal cards function here to populate array

		localStorage.player = thisPlayer;

		// token.username = thisPlayer;

		//console.log("this player logged In", localStorage.player)
		playersRef.child(thisPlayer).set({
			playerId: thisPlayer,
			username: token.username,
			cards: cards,
			gamePoints: gamePoints
		});
	}

	this.updatePlayerAfterVote = function(){
		// find player in player array
		if (player.votes > highestVotes){
			//increment this players points key
		}
		// restockHand(n); where n = number of cards to replace in hand
		console.log("player should have new cards and new point total now")
	}

	this.addMessage = function(message, player) {
		if(!message) return;

		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies);
		console.log(message, "MESSAGE I TYPE WHOO");

		var myId = localStorage.player;
		var thisPlayer = token._id;

		this.messages.$add({
			text: message,
			username: token.username,
			timestamp: Date.now()
		});
	}
	var tempYourHand = [];
	var subSpaceHand = [];
	this.addToVotedCards = function(cardClicked, index, sent) {
		// var myId = JSON.parse(localStorage.player)

		if(sent){
			var myId = localStorage.player
			var tempYourHand = subSpaceHand;
			this.playersRef.child(myId).set(subSpaceHand)
			this.votingRef.child(myId).remove({
				text: cardClicked,
			});
			tempYourHand.cards.splice(index, 1);
			return tempYourHand.cards;
		} else {
		var myId = localStorage.player
		this.playersRef.child(myId).on('value', function(snap){
			tempYourHand = snap.val()
			subSpaceHand = snap.val()
			console.log("YO HAND!", tempYourHand)
		})
		var myId = localStorage.player
		tempYourHand.cards.splice(index, 1);
		this.playersRef.child(myId).set(tempYourHand)
		this.votingRef.child(myId).set({
			text: cardClicked,
		});
		return tempYourHand.cards;
		}

	}
	this.voteCard = function(card){
		var myId = localStorage.player
		console.log("You're trying to vote for:", card.text)
		var wop = card.text.replace('.','')
		this.votingRef.child(wop).push({
			points: myId
		});
	}
});

'use strict';

angular.module('cardsAgainstHumanity')
.controller('homeCtrl', function($scope){
	console.log('homeCtrl');

})

'use strict';

angular.module('cardsAgainstHumanity')

.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){


	this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/cards");
	this.whiteCardRef = this.gameInstance.child("whiteCards")
	//var whiteCardRef = this.whiteCardRef;
	this.blackCardRef = this.gameInstance.child("blackCards")
	//var blackCardRef = this.blackCardRef;

	this.scenarioCard = this.gameInstance.child("scenarioCard")
	this.exampleHand = this.gameInstance.child("exampleHand")

	//******DEALING BOTH DECKS:
	this.startDeck = function(){
		//initialize game state to -1 on fb so when it advances first time it will go to 0
		this.gameStateRef = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/gamestate");
		this.gameStateRef.child('current').set(0);

		console.log("IN START DECK")
		this.gameInstance.child('whiteCards').set({array: whiteCards})
		this.gameInstance.child('blackCards').set(blackCards)
	}

	var tempBlackCard = [];
	this.blackCardRef.on('value', function(snap) {
		tempBlackCard = snap.val();
		console.log("Black", tempBlackCard)
		//console.log("BLength", tempBlackCard.length)
	});
	this.dealBlackCard = function(){
		this.gameInstance.child("scenarioCard").set(null);
		var rando = Math.floor((Math.random() * tempBlackCard.length ) + 0);
		var takenCards = tempBlackCard[rando];
		console.log("TAKEN", takenCards);
		this.scenarioCard = this.gameInstance.child("scenarioCard").set(takenCards)
		tempBlackCard.splice(rando, 1);
		this.gameInstance.child('blackCards').set(tempBlackCard);
		// return this.gameInstance.child("scenarioCard");
		// return this.scenarioCard;
		return this.scenarioCard = this.gameInstance.child("scenarioCard").set(takenCards)
		// return takenCards;
	}
	var tempWhiteCard = [];
	this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val();
		console.log("BASE", tempWhiteCard)
	});
	this.startingHand = function(){
		var fullHand = [];
		for(var i = 0; i<10; i++){
			var rando = Math.floor((Math.random() * tempWhiteCard.array.length ) + 0);
			var takenCards = tempWhiteCard.array[rando];
			console.log("Rando", rando)
			console.log("Taken cards", takenCards)
			tempWhiteCard.array.splice(rando, 1);
			console.log("Cards left", tempWhiteCard.array.length)
			fullHand.push(takenCards);
			//this.gameInstance.child("exampleHand").push(takenCards)
		}
		this.gameInstance.child('whiteCards').set(tempWhiteCard)
		return fullHand;
	}
	this.draw = function(n){
		for(var i=0; i<n; i++){
			var rando = Math.floor((Math.random() * tempWhiteCard.array.length ) + 0);
			var takenCard = tempWhiteCard.array[rando];
			console.log("TAKEN", takenCard);
			tempWhiteCard.array.splice(rando, 1);
			this.gameInstance.child("exampleHand").push(takenCard)
			this.gameInstance.child('whiteCards').set(tempWhiteCard);
		}
	}

});

'use strict';

angular.module('cardsAgainstHumanity')


.controller('gameMasterCtrl', function(TimerService, $timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, CardsService, $http){

	/* ______________
	|              |
	|  User Auth:  |
	|______________| */
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

	/* ______________
	|              |
	| Card Dealing:|
	|______________| */
	$scope.startDeck = function(){
		CardsService.startDeck();
	}
	$scope.dealBlackCard = function(){
		CardsService.dealBlackCard();
	}
	$scope.startingHand = function(){
		CardsService.startingHand();
	}
	$scope.draw = function(n){
		CardsService.draw(n);
	}


	/* ______________
	|              |
	| Firebase:    |
	|______________| */
	var playersRef = GameService.gameInstance.child("players");
	var messageRef = GameService.gameInstance.child("messages")
	$scope.playerss = GameService.playerss
	$scope.whiteCardRef = CardsService.whiteCardRef;
	$scope.blackCardRef = CardsService.blackCardRef;
	$scope.timerRef = TimerService.timerRef;
	var votingRef =  new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/voting");
	// GameService.gameInstance.child("voting");

	$scope.myHand = [];

	$scope.numPlayers;


	/* ______________
	|              |
	|  States:     |
	|______________| */
	$scope.currentState = '';

	if($scope.isLoggedIn){
		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies)
	}

	var gameStates = ['prevote', 'vote', 'postvote'];
	$scope.currentState;
	

	//connect with firebase game states
	var gameStateRef = GameService.gameStateRef.child('current');
	gameStateRef.on('value', function(snap){
		$scope.currentState = gameStates[snap.val()];
		console.log("!!!!!game state ref!!!!!", $scope.currentState)
	})

	var gameWon = false; // link this to a node on firebase...

	var gameState = function() {
		CardsService.startDeck();

		$scope.blackCard = 	CardsService.dealBlackCard();
		// console.log("THIS IS THE BLACK CARD!", $scope.blackCard);
		//send a deck of black cards and white to Firebase
		// console.log("in game state function")
		// var gameStates = ['prevote', 'vote', 'postvote'];
		// var count = 0;
		var n = 60;

		if (gameWon === false){

			switch ($scope.currentState) {

				case 'prevote':
				$scope.currentState = 'prevote';
				console.log('CURRENT STATE IS PREVOTE');
				$scope.myHand = GameService.pickCards();
				//GameService.advanceGameState();
				//ng-hide all the cards submitted for vote
				if (!$scope.counter){
					$scope.countDown();
				}
				break;

				case 'vote':
					$scope.countDown();
				console.log("!!!! VOTE !!!!")
				// ng-show="currentState === vote"
				// ng-show all the cards that are submitted for voting
				// ng-disable clickable cards from your deck
				break;

				case 'postvote':
				console.log("!!!! POSTVOTE !!!!")
				//check if game won returns true...
				break;
			}
		} else {
			console.log("execute game won sequence")
			return;
		}
		// break;
	}


	/* ______________
	|              |
	| Timer:       |
	|______________| */

	$scope.timerRef.on("value", function(snap){
		$scope.counter = snap.val();
	})

	var n = 60;
	var mytimeout = null;
	// Actual timer method, counts down every second, stops on zero.
	$scope.countDown = function() {
		
		console.log("COUNTER ", n)
		if(n ===  0) {
			$scope.$broadcast('timer-stopped', 0);
			$timeout.cancel(mytimeout);
			return;
		}
		n--;
		TimerService.countDown(n);
		mytimeout = $timeout($scope.countDown, 1000);
	};

	// Triggered, when the timer stops, can do something here, maybe show a visual alert.
	$scope.$on('timer-stopped', function(event, remaining) {
		if(remaining === 0) {
			n = 60;
			//advance game to next state
			//$scope.timerRef.remove();
			GameService.advanceGameState();
			gameState();
			swal({
				type: "error",
				title: "Uh-Oh!",
				text: "Next Phase is underway!",
				showConfirmButton: true,
				confirmButtonText: $scope.currentState,
			});
		}
	});

	/* ______________
	|              |
	| Players:     |
	|______________|
	*/	// Create array to store each player's info.

	if (!localStorage.thisPlayer){
		GameService.addPlayer();
	}

	//Add player to waiting room when they click join.
	playersRef.on("child_added", function() {
		$timeout(function() {
			//&& $scope.currentState === undefined
			if ($scope.playerss.length >= 3 ) {
				$scope.currentState = 'prevote';
				gameState();
			}
		});
	});

	//Update number of players when a player quits.
	playersRef.on("child_removed", function() {
		$timeout(function() {
			console.log("PLAYER QUIT", playersRef)
			$scope.numPlayers = $scope.playerss.length
		});
	});

	$scope.removePlayer = function(){
		GameService.removePlayer();
		$state.go("userPage");
	}


	/* ______________
	|              |
	| Messages:    |
	|______________| */
	$scope.messages = GameService.messages;
	$scope.addMessage = function(message) {
		GameService.addMessage(message);
		// $scope.newMessageText = "";
	}
	$scope.voteCard = function(card){
		GameService.voteCard(card);
		console.log("YOU voted for:", card)
		$scope.voted = true;
	}
	$scope.sayName = function(){
		var token = jwtHelper.decodeToken(cookies)
		console.log("TOKEN MASTER ", token)
	}


	/* ______________
	|              |
	| Votes:       |
	|______________| */

	$scope.addToVotedCards = function(cardClicked, index) {
		$scope.myHand	= GameService.addToVotedCards(cardClicked, index);

		$scope.addToVotedCards = function(cardClicked, index, sent) {
			// $scope.myHand	= GameService.addToVotedCards(cardClicked, index, sent);
			GameService.addToVotedCards(cardClicked, index, sent);
			$scope.sent = !$scope.sent
		}
		$scope.votes = [];
		votingRef.on("value", function(snap) {
			$scope.votes = snap.val();
			console.log(snap.val(), "duddbjddjbdjbkdbdk");
		});
	};
});


'use strict';
angular.module('cardsAgainstHumanity')


.service('TimerService', function($http, $firebaseObject, $interval, $timeout, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){

	this.timerRef = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/timer");
	//var counter = 60;
	//this.mytimeout = null;


	this.countDown = function(counter){
		console.log("REMAINING SECONDS", counter)
		this.timerRef.set(counter);
	};




	// 	this.timerRef.on('value', function(snap){
	// 	console.log(snap)
	// 	var counter = snap --
	// 	this.timerRef.set(counter);
	// 	return snap;
	// })

})

angular.module('cardsAgainstHumanity')

.controller('voteCardsCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){

});

'use strict';

angular.module('cardsAgainstHumanity')
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

angular.module('cardsAgainstHumanity')

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

angular.module('cardsAgainstHumanity')


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
