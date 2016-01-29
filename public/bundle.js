'use strict';

var app = angular.module('cardsAgainstHumanity', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', "base64", "firebase"])

app.constant('ENV', {
  //API_URL: 'http://localhost:3000'
  API_URL: 'http://localhost:3000' || 'https://dry-dawn-94066.herokuapp.com'
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
    if (res.data !== "authRequired"){
      //$state.go('userPage', {"username": res.data.username})
    $scope.isLoggedIn = true;
  } else {
    $scope.isLoggedIn = false;
    $state.go('login');
  }
  })
  $scope.$on('loggedIn', function(){
    $scope.isLoggedIn = true;
    var cookies = $cookies.get('token');
    if(cookies){
      $scope.userInfo = (jwtHelper.decodeToken(cookies))
    }
    username = $scope.userInfo.username

  })
  $scope.$on('edit', function(event, data){
    if(!$scope.userInfo.isAdmin || data._id === $scope.userInfo._id){
      $scope.userInfo = data;
      username = $scope.userInfo.username
    }
  })

  $scope.logout = function(){
    GameService.removePlayer();
    $cookies.remove('token');
    if (localStorage.playing){localStorage.removeItem('player')}
    $state.go('login')
    $scope.isLoggedIn = false;
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    $state.go('userPage', {"username": username})
  }
})

'use strict';

var app = angular.module('cardsAgainstHumanity');

app.service('UserService', function($http, $firebaseObject, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.register = function(user){
		console.log("USER SERVICE .REGISTER",user)
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
	this.gamePoints = function(ddWins) {
		return $http.ge(`${ENV.API_URL}/user/page/${dirtyWin}`);
	};
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
// {
// text: "And the Academy Award for _ goes to _.",
// pick: 2
// },
// {
// text: "For my next trick, I will pull _ out of _.",
// pick: 2
// },
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
// {
// text: "I never truly understood _ until I encountered _.",
// pick: 2
// },
// {
// text: "Rumor has it that Vladimir Putin's favorite delicacy is _ stuffed with _.",
// pick: 2
// },
// {
// text: "Lifetime&reg; presents _, the story of _.",
// pick: 2
// },
// {
// text: "Make a haiku.",
// pick: 3
// },
// {
// text: "In M. Night Shyamalan's new movie, Bruce Willis discovers that _ had really been _ all along.",
// pick: 2
// },
// {
// text: "_ is a slippery slope that leads to _.",
// pick: 2
// },
// {
// text: "In a world ravaged by _, our only solace is _.",
// pick: 2
// },
// {
// text: "That's right, I killed _. How, you ask? _.",
// pick: 2
// },
// {
// text: "When I was tripping on acid, _ turned into _.",
// pick: 2
// },
// {
// text: "_ + _ = _.",
// pick: 3
// },
// {
// text: "What's the next superhero/sidekick duo?",
// pick: 2
// },
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
// {
// text: "Step 1: _. Step 2: _. Step 3: Profit.",
// pick: 2
// },
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


	this.gameInstance = new Firebase("https://mycah.firebaseio.com");
	// this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	this.playersRef = this.gameInstance.child("players");
	var playersRef = this.playersRef
	this.messageRef = this.gameInstance.child("messages");
	var messageRef = this.messageRef
	this.playerss = $firebaseArray(playersRef);
	this.messages = $firebaseArray(messageRef);
	this.responseRef = this.gameInstance.child("response");
	var responseRef = this.responseRef
	this.voteRef = this.gameInstance.child("votes");
	var voteRef = this.voteRef
	this.votes = $firebaseArray(voteRef);

	///Add game state to firebase
	this.gameStateRef = new Firebase("https://mycah.firebaseio.com/gamestate");
	// this.gameStateRef = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/gamestate");
	var gameStateRef = this.gameStateRef;

	this.killAll = function(){
		playersRef.remove();
	}

	//remove players
	this.removePlayer = function(){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id

		playersRef.child(myId).remove();
		console.log("PLAYER QUIT", myId)
	}

	this.identifyPlayer = function(){
		var cookies = $cookies.get('token');
		var myInfo = jwtHelper.decodeToken(cookies)
		return myInfo;
	}

	this.pickCards = function(){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		console.log(myId, "IS IN THE HIZOUSE");
		var myHand = CardsService.startingHand();
		this.playersRef.child(myId).update({
			cards: myHand
		});
		return myHand;
	}

	// this.drawCard = function(){
	// 	var myInfo = this.identifyPlayer()
	// 	var myId = myInfo._id
	// 	var newCard = CardsService.draw();
	// 	this.playersRef.child(myId).update({
	// 		cards: newCard
	// 	});
	// }

	this.addPlayer = function(){
		//initialize test 'children'
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id;
		//var cards = CardsService.startingHand();
		playersRef.child(myId).set({
			playerId: myInfo._id,
			username: myInfo.username,
			cards: CardsService.startingHand(),
			gamePoints: 0
		});
	}



	/* ______________
	|              |
	| cards        |
	|______________| */

	//submit response card (game state 1)
	this.addToResponseCards = function(cardClicked, index) {
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		var tempHand;
		var fullHand;
		console.log(cardClicked, "BEGINNNING");
		this.playersRef.child(myId).on('value', function(snap) {
			tempHand = (snap.val().cards);
			if(snap.val().tempHand){
				fullHand = (snap.val().tempHand);
			}
		})
		if(tempHand.length < 10){
			playersRef.child(myId).update({cards: fullHand})
			fullHand.splice(index, 1);
			playersRef.child(myId).update({cards: tempHand})
			responseRef.child(myId).set({text: cardClicked, player: myId})
			return tempHand
		}
		playersRef.child(myId).update({tempHand: tempHand})
		tempHand.splice(index, 1);
		playersRef.child(myId).update({cards: tempHand})
		responseRef.child(myId).set({text: cardClicked, player: myId})
		return tempHand
	}
	this.drawOneCard = function() {
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		var tempHand;
		var newCard = CardsService.draw();
		this.playersRef.child(myId).on('value', function(snap) {
			//	console.log(snap.val().cards, "IN SNAP.VAL");
			tempHand = (snap.val().cards);
			//	console.log("Temporary hand", tempHand);
		})
		playersRef.child(myId).update({tempHand: tempHand})
		tempHand.push(newCard);
		playersRef.child(myId).update({cards: tempHand})
		return tempHand
	}

	//vote for a card (game state 2)
	this.voteCard = function(card){
		//console.log("!!!!!You're trying to vote for!!!!", card.text, card.player)
		var player = card.player;
		this.votes.$add(player);
	}

	//deal a new white card for the player (game state 3)
	this.updatePlayerAfterVote = function(){
		// find player in player array
		if (player.votes > highestVotes){
			//increment this players points key
		}
		// restockHand(n); where n = number of cards to replace in hand
		console.log("player should have new cards and new point total now")
	}

	/* ______________
	|              |
	| win points   |
	|______________| */

	// if you won the round add a point to your score (game state 2)
	this.addWinPoint = function(player){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		var myRef = playersRef.child(myId);


		//only add points once per player
		if (player === myId){
			var winnerName;


			var myPoints;
			myRef.on('value', function(snap) {
				myPoints = snap.val().gamePoints;
				winnerName = snap.val().username;
			})
			var myNewPoints = myPoints + 1;

			//FORCING FIREBASE TO TAKE SNAPSHOT OF PLAYER
			myRef.update({temp: "temp"});
			myRef.child('temp').remove();

			myRef.child('gamePoints').set(myNewPoints)
			if (myNewPoints >= 3){
				winnerName = winnerName + "!";
				console.log('we have a winner', player)
				updateMongoWins(player);
				this.gameInstance.child('winner').set({
					userId: player,
					winnerName: winnerName
				});
			}
			playersRef.child(player).update({gamePoints: myNewPoints})
			console.log(player, 'got a win point');
			// this code is not tested and not finished !!!!!
			gameStateRef.set(3)
		} //end if me
		return;
	} // end add win point

	/* ______________
	|              |
	| update MONGO |
	|______________| */

	function updateMongoWins(winner){
		console.log("OFF TO MOGO DB TO LOOK FOR", winner)
		//var winner = winner.userId;
		$http.post("user/dirtyWin", {userId: winner})
		.then(function (res){
		console.log(res);
		}, function(err){
		console.error(err);
		})
	}


	/* ______________
	|              |
	| messages     |
	|______________| */

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

});

'use strict';

angular.module('cardsAgainstHumanity')

.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){


	// this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/cards");
	this.gameInstance = new Firebase("https://rachdirtydeals.firebaseio.com/cards");
	this.whiteCardRef = this.gameInstance.child("whiteCards")
	this.blackCardRef = this.gameInstance.child("blackCards")
	this.scenarioCard = this.gameInstance.child("scenarioCard")

	// this.exampleHand = this.gameInstance.child("exampleHand")
	this.tempWhiteRef = this.gameInstance.child("tempWhite")

	//******DEALING BOTH DECKS:
	this.startDeck = function(){
		console.log("IN START DECK")
		this.gameInstance.child('whiteCards').set(whiteCards);
		this.gameInstance.child('blackCards').set(blackCards);
	}
	this.killCards = function(){
		this.blackCardRef.remove();
		this.scenarioCard.remove();
		this.whiteCardRef.remove();
	}
	var tempBlackCard = [];
	this.blackCardRef.on('value', function(snap) {
		tempBlackCard = snap.val();
		//console.log("Black", tempBlackCard)
	});

	this.dealBlackCard = function(){

		this.gameInstance.child("scenarioCard").set(null);
		var rando = Math.floor((Math.random() * tempBlackCard.length ) + 0);
		var takenCard = tempBlackCard[rando];
		console.log("TAKEN", takenCard);
		tempBlackCard.splice(rando, 1);
		this.scenarioCard = this.gameInstance.child("scenarioCard").set(takenCard)
		this.gameInstance.child('blackCards').set(tempBlackCard);
		return takenCard;
	}

var tempWhiteCard;
	this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val()
		console.log("Temp white card updated", tempWhiteCard)
		console.log("There are ", tempWhiteCard.length, " Temporary white cardss");
	});


	this.startingHand = function(){
		var fullHand = [];
		for(var i = 0; i<10; i++){
			console.log("TEMP WHITE CARD IN STARTING HAND", tempWhiteCard);
			var rando = Math.floor((Math.random() * tempWhiteCard.length ) + 0);
			var takenCards = tempWhiteCard[rando];
			tempWhiteCard.splice(rando, 1);
			fullHand.push(takenCards);
			this.gameInstance.child('whiteCards').set(tempWhiteCard)
			console.log("card exchange")
		}
		console.log('MY FULL HAND IS', fullHand)
		return fullHand;
	}

	this.draw = function(){
		this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val();

		console.log("Temp white card updated", tempWhiteCard)
		console.log("There are ", tempWhiteCard.length, " Temporary white cardss");
	});
		this.whiteCardRef.update({forcesnap: "forcesnap"});
		this.whiteCardRef.child('forcesnap').remove();

		// for(var i=0; i<n; i++){
		console.log("TEMP WHITE CARD IN DRAW FUNCTIOM HAND", tempWhiteCard);
		var rando = Math.floor((Math.random() * tempWhiteCard.length ) + 0);
		var takenCard = tempWhiteCard[rando];
		console.log("TAKEN", takenCard);
		tempWhiteCard.splice(rando, 1);
		this.gameInstance.child('whiteCards').set(tempWhiteCard);
		// }
		return takenCard
	}

});

'use strict';

angular.module('cardsAgainstHumanity')


.controller('gameMasterCtrl', function(TimerService, $timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, CardsService, $http){

	/* ______________
	|              |
	|  User Auth:  |
	|______________| */
	var myId	= ''
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
		myId = $scope.userInfo._id;
	}

	$scope.isMyCard = function(card){
		if(card === myId){
			console.log(card, "That's me!");
			return "myCard";
		} else {
			console.log(card, "That ain't!");
			return "whiteCard"
		}
	}

	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){
			console.log("AUTH REQUIRED")
			$location.path('/login')
		}else{
			$scope.isLoggedIn = true;}
		})

		$scope.isUser = function(user){
			if (user._id !== $scope.userInfo._id){
				return (false)
			} else {return true}
		}

		if($scope.isLoggedIn){
			var cookies = $cookies.get('token');
			var token = jwtHelper.decodeToken(cookies)
		}

		$scope.sayName = function(){
			var token = jwtHelper.decodeToken(cookies)
			console.log("TOKEN MASTER ", token)
		}
		/* ______________
		|              |
		|Utility Functs|
		|______________| */



		/* ______________
		|              |
		| Firebase:    |
		|______________| */
		var thisGame = GameService.gameInstance
		var playersRef = GameService.gameInstance.child("players");
		var messageRef = GameService.gameInstance.child("messages")
		var responseRef = GameService.gameInstance.child("response");
		$scope.playerss = GameService.playerss
		$scope.whiteCardRef = CardsService.whiteCardRef;
		$scope.blackCardRef = CardsService.blackCardRef;
		//$scope.timerRef = TimerService.timerRef;
		var myRef = playersRef.child(myId);
		$scope.scenarioCardRef = CardsService.gameInstance.child("scenarioCard")
		var scenarioCardRef = CardsService.gameInstance.child("scenarioCard")
		var gameStateRef = GameService.gameStateRef;
		var votesRef = GameService.gameInstance.child("votes");

		var cardsRef = GameService.gameInstance.child("cards");

		// playersRef.child(myId).on('value', function(snap){
		// 	console.log("I EVLOLVED", snap.val().cards.length)
		// })
		var winVotes = GameService.votes;
		// $scope.blackCard = scenarioCardRef


		/* ______________
		|              |
		|  States:     |
		|______________| */


		var gameState = function(thisState) {
			switch (thisState) {

				case 1:
				$rootScope.voted = false;

				//ng-hide all the cards submitted for vote
				break;

				case 2:
				console.log("STATE 2 VOTE !!!!!")

				// ng-show all the cards that are submitted for voting
				// ng-disable clickable cards from your deck
				break;

				case 3:
				console.log("!!!! POSTVOTE !!!!")
				votesRef.remove();
				responseRef.remove();
				scenarioCardRef.remove();
				myRef.child('voted').remove();
				myRef.child('submittedResponse').remove();
				myRef.child('tempHand').remove();
				GameService.drawOneCard();
				CardsService.dealBlackCard();
				gameStateRef.set(1)
				break;
			}
		}


		//connect with firebase game states
		gameStateRef.on('value', function(snap) {
			// if (){
			// 	return;
			// }
			console.log("GAME REF JUST CHANGED TO: ", snap.val())
			var thisState = snap.val();
			$scope.currentState = thisState;
			gameState(thisState);
		})

		// 	_______________
		// |	             |
		// |	Debug:       |
		// |_______________|

		$scope.summonDeck = function(){
			console.log("I DID IT, RIGHT?")
			CardsService.startDeck();
		}
		$scope.summonHand = function(){
			console.log("I DID IT, RIGHT?")
			GameService.pickCards();
			console.log("FALSE?", playersRef.child(myId).hasOwnProperty('cards'));
		}

		$scope.selfDestruct = function(){
			gameStateRef.remove();
			GameService.killAll();
			CardsService.killCards();
		}


		/* ______________
		|              |
		| Timer:       |
		|______________| */

		//$scope.timerRef.on("value", function(snap){
		// $scope.counter = snap.val();
		//})

		// Triggered, when the timer stops, can do something here, maybe show a visual alert.
		$scope.$on('timer-stopped', function(event, remaining) {
			if(remaining === 0) {
				if ($scope.haveSubmitted != true && $scope.currentState === 1){
					//console.log("you should have submitted by now")
					//console.log("My hand", $scope.myHand )
					var rando = Math.floor((Math.random() * $scope.myHand.length ) + 0);
					var spliced = $scope.myHand.splice(rando, 1)
					spliced = spliced[0];
					//console.log("spliced", spliced, "rando", rando);
					GameService.addToResponseCards(spliced, rando)
					myRef.child('cards').set($scope.myHand);
					myRef.child('submittedResponse').set(true)
				}
				console.log("ROOTSCOPE voted", $rootScope.voted)
				var otherPlayers = [];
				if ($rootScope.voted != true && $scope.currentState === 2){
					console.log($scope.playerss)
					$scope.playerss.forEach(function(player){
						if(player != myId){
							otherPlayers.push(player)
						}
					})
					var rando = Math.floor((Math.random() * otherPlayers.length ) + 0);
					var spliced = otherPlayers.splice(rando, 1)
					spliced = spliced[0].playerId;
					winVotes.$add(spliced)
					console.log("YOU VOTE FOR", spliced)
				}
				// $scope.counter = 60;
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: "Next Phase is underway!",
					showConfirmButton: true,
					confirmButtonText: "GET GOIN' ",
				});
			}
		});

	/* ______________
	|              |
	| Players:     |
	|______________|
	*/

		// upon login or refresh page
		thisGame.once('value', function(snap){

			if(snap.val() == null){
				CardsService.startDeck();
				CardsService.dealBlackCard();
				$timeout(function(){
					GameService.addPlayer()
				},100)
			} else {
				var players = snap.val().players;
				console.log("PLAYERS", players);
				if (players.hasOwnProperty(myId) === false){
					console.log("I JUST GOT ADDED");
					GameService.addPlayer();
					return;
				}
				// $scope.counter === TimerService.counter;
				$scope.playerss = [];
				for (var player in players){
					$scope.playerss.push(player);
				}
				console.log(players[myId].cards);
				$scope.myHand = players[myId].cards;
			}
		})


		// playersRef.child(myId).once('child_added', function(snap) {
		// 	if(!snap.val().cards){
		// 		console.log("You have cards now");
		// 	} else {
		// 		console.log("You already have cards");
		// 	}
		// })
		//Will not reset your player info by logging you in if you are already in
		// thisGame.once('value', function(snap){
		// 		console.log("snap.VAL() IN THIS GAME ONCE)", snap.val())
		// 	// if (snap.val() === null){
		// 	// 	GameService.addPlayer();
		// 	// 	return;
		// 	// }
		// 		var players = snap.val().players;
		// 		console.log("PLAYERS", players);
		// 	if (players.hasOwnProperty(myId) === false){
		// 		GameService.addPlayer();
		// 		console.log("LOGGING IN ONCE")
		// 		return;
		// 	} else{
		// 		console.log("NOT LOGGING IN TWICE")
		// 		return;
		// 	}

		// })

		//Add player to waiting room when they click join.


	// 	playersRef.on("value", function(snap) {
	// 		console.log(players[myId].cards);
	// 		$scope.myHand = players[myId].cards;
	// 	}
	// })


	// playersRef.child(myId).once('child_added', function(snap) {
	// 	if(!snap.val().cards){
	// 		console.log("You have cards now");
	// 	} else {
	// 		console.log("You already have cards");
	// 	}
	// })
//Will not reset your player info by logging you in if you are already in
// thisGame.once('value', function(snap){
// 		console.log("snap.VAL() IN THIS GAME ONCE)", snap.val())
// 	// if (snap.val() === null){
// 	// 	GameService.addPlayer();
// 	// 	return;
// 	// }
// 		var players = snap.val().players;
// 		console.log("PLAYERS", players);
// 	if (players.hasOwnProperty(myId) === false){
// 		GameService.addPlayer();
// 		console.log("LOGGING IN ONCE")
// 		return;
// 	} else{
// 		console.log("NOT LOGGING IN TWICE")
// 		return;
// 	}

// })

	//Add player to waiting room when they click join.


	playersRef.on("value", function(snap) {
			//&& $scope.currentState === undefined
			var players = snap.val();
			var numPlayers = snap.numChildren();
			console.log("playas gonna play play play play play", players)
			if (numPlayers === 3 && !$scope.currentState) {
				// $scope.counter = 60;
				console.log("STARTING GAME", $scope.playerss)
				//TimerService.countDown();
				gameStateRef.set(1);
			} else if ($scope.playerss.length < 3){
				console.log("THE current Playas:", $scope.playerss)
				return;
			} else {
				return;
			}
		});

playersRef.on("child_removed", function(snap) {
		//alert("PLAYER QUIT", snap.val())
		if ($scope.playerss.length === 0 ){
			GameService.gameInstance.set(null);
		} else if ( $scope.playerss.length ===1){
			GameService.gameInstance.set(null);
			$timeout(function() {
				location.reload(true);
			}, 500);
		}
		return;
	});

		$scope.removePlayer = function(){
			GameService.removePlayer();
			$state.go("userPage");
		}

		/* _____________
		|              |
		| cards        |
		|______________| */
		// maybe need to play around with child_added/ child_removed
		// to prevent re-deals?

		//$scope.myHand = [];


		myRef.child('cards').on('value', function(snap){
			$scope.myHand = snap.val();
		});

		scenarioCardRef.on("value", function(snap) {
			$scope.blackCard = snap.val();
		});

		/* _____________
		|              |
		| Responses:   |
		|______________| */

		// notify firebase that I submitted a response card
		//responseRef.on('child_added', function(snap){

		//})
		$scope.addToResponseCards = function(cardClicked, index) {
			console.log("cardClicked", cardClicked)
			GameService.addToResponseCards(cardClicked, index);
		}

		//update the scope when I submit a response card
		myRef.child('submittedResponse').on('value', function(snap){
			//console.log(snap.val(), "SNAP VAL IN SUBMITTD RESPONSE")
			//console.log("$scope.haveSubmitted", $scope.haveSubmitted)
			$scope.haveSubmitted = snap.val();
		})

		responseRef.on("value", function(snap) {
			var allResponses = snap.val();
			var numResponses = snap.numChildren();
			$scope.responses = snap.val();
			console.log("RESPONSE REF IS NOW",allResponses)
			console.log("$scope.playerss.length", $scope.playerss.length)
			if (allResponses != null){
				if(allResponses.hasOwnProperty(myId)){
					console.log("I SUBMITTED A RESPONSE!")
					myRef.update({
						submittedResponse: true
					})
				}
			}
			// if (allResponses.hasOwnProperty(myId))
			// 	{
			// 		console.log("I SUBMITTED!")
			// 		myRef.child()
			// 		// to account for refreshing could set this as
			// 		// a key in the player schema;
			// 	}
			//console.log(snap.val(), "OUTSIDE THE IF");
			if (numResponses === $scope.playerss.length && numResponses > 0) {
				console.log(snap.val(), "INSIDE");
				//start timer for next round;
				//TimerService.counter = 61;
				//TimerService.countDown();
				gameStateRef.set(2);
			}
		});

		/* _____________
		|              |
		| Votes:   		 |
		|______________| */


		$scope.voteCard = function(card){
			if ($rootScope.voted === true || $scope.currentState !== 2){
				console.log("YOU ALREADY VOTED")
				return;
			}
			console.log("IN VOTECARD", card)
			if (card.player === myId){
				votesRef.child(myId).remove();
				swal({
					type: "error",
					title: "Wow, someone thinks they're special",
					text: "Choose someone else's response",
					showConfirmButton: true,
					confirmButtonText: "Choose Again",
				});
			} else {
				var thisCard = card.player
				// $scope.isMyCard = function(card){
				// 	if(thisCard === card){
				// 		return "selectedCard";
				// 	} else if(thisCard === myId){
				// 		return "myCard";
				// 	} else {
				// 		return "whiteCard";
				// 	}
				// }
				$rootScope.voted = true;
				console.log("I AM ROOT:", $rootScope.voted)
				GameService.voteCard(card);
			}
		}
		votesRef.on("value", function(snap) {


			var votes = snap.val();
			var votesLength = snap.numChildren();
			console.log(votesLength, "VOTES OUTSIDE THE IF IN VOTES");
			if (votesLength == $scope.playerss.length && votesLength > 0) {
				//console.log("INSIDE VOTES")

				//create a dictionary of players who received votes
				var votesCast = {};
				for(var player in votes){
					player = votes[player];
					if (!votesCast[player]){
						votesCast[player] = 1;
					} else {
						votesCast[player] ++;
					}
					console.log(votesCast, "*.*. VOTES CAST *,*,");
				}
				console.log(votesCast, "*.*. VOTES CAST *,*,");
			}

			//create an array of objects from the votesCast dictionary
			var victors = Object.keys(votesCast).map(function(key) {
				return [key, votesCast[key]];
			});
			console.log("WINNER ARRAY PHASE 1.0", victors);

			// Sort the victors array based on the points
			// putting lowest number at 0 position
			victors.sort(function(a, b) {
				return a[1] - b[1];
			});

			console.log("WINNER ARRAY PHASE 2.0", victors);
			var winner = [];
			var prev = 0;
			var person = {};
			//compare each of the victors in the sorted array
			victors.forEach(function(victor, index, all){
				var player = victor[0];
				var votesWon = victor[1];
				var person = {};
				person.player = player;
				person.points = votesCast[player];
				if (votesWon > prev){
					winner = [];
					winner.push(person);
					prev = votesWon;
					console.log("PERSON IN GREATER THAN" ,person, "PREV", prev)
				} else if (votesCast[player] == prev){
					winner.push(person);
					console.log("PERSON IN LESS THAN" ,person, "PREV", prev)
				}
			})

			$timeout( function(){
				console.log("*.*.*.* WINNER ARRAY PHASE 3*.*.*.*", winner);
				winner.forEach(function(player){
					var player = player.player;
					console.log(player, "GETS A POINT !!!!")
					GameService.addWinPoint(player);
				})
			},50)
		});


		/* ______________
		|              |
		| Winner!			 |
		|______________| */

		thisGame.child('winner').on('child_added', function(snap){
			var winner = snap.val();
			// var winningBlackCard = thisGame.child('scenarioCard').text();
			// var winningWhiteCard = thisGame.child()

			//console.log("Announcing the winner", snap.val().winnerName);
			console.log("Announcing the winner", snap.val());

			//Play Again refreshes game page & clears out old data.
			//Quit Game redirects to userpages & removes player from game.
			swal({
				title: "<b> And the winner is... </b>",
				text: winner,
				html: true,

				type: "success",
				animation: "slide-from-top",
				showCancelButton: true,
				cancelButtonText: "Play Again",
				closeOnConfirm: true,
				showLoaderOnConfirm: true,
				showConfirmButton: true,
				confirmButtonText: "Cool. I'm done."
			}, function(isConfirm) {
				if (isConfirm) {
					var cookies = $cookies.get('token');
					var username;
					if(cookies){
						$scope.userInfo = (jwtHelper.decodeToken(cookies))
					}
					GameService.gameInstance.set(null);
					$timeout(function() {
						$scope.removePlayer()

						// GameService.removePlayer();
						$state.go('userPage', {"username": username})
						console.log("REMOVED PLAYER");
						// }
					}, 500)
				} else {
					$timeout(function() {
						location.reload(true);
					}, 500)
				};
			});
			return;
		});



		/* _____________
		|              |
		| Messages:    |
		|______________| */
		$scope.messages = GameService.messages;
		$scope.addMessage = function(message) {
			GameService.addMessage(message);
			// $scope.newMessageText = "";
		}



	});

'use strict';
angular.module('cardsAgainstHumanity')


.service('TimerService', function($http, $firebaseObject, $interval, $timeout, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){
	var myGame = $rootScope.myGame;

	this.timerRef = new Firebase(`https://rachdirtydeals.firebaseio.com/games/${myGame}/timer`);
	var timerRef = this.timerRef;
	this.counter = 61;
	var counter = this.counter;
	var mytimeout = null;

		var countDown = function(){
			console.log("IN COUNTDOWN FUnCTION", counter)
			if(counter ===  0) {
			$rootScope.$broadcast('timer-stopped', 0);
			$timeout.cancel(mytimeout);
			return;
		}
		counter--;
		timerRef.set(counter);
		mytimeout = $timeout(countDown, 1000);
		}

	this.countDown = function(){
		countDown();
		};

})

angular.module('cardsAgainstHumanity')

.controller('voteCardsCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){

});

'use strict';

angular.module('cardsAgainstHumanity')
.controller('homeCtrl', function($scope){
})

'use strict';

angular.module('cardsAgainstHumanity')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
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
	UserService.isAuthed(cookies)
	.then(function(res , err){
		 if (res.data === "authRequired"){
			 $location.path('/login')
		 } else{$scope.isLoggedIn = true;}
	})

	UserService.page($state.params.username)
	.then(function(res) {
		console.log(res.data.ddWins);
		$scope.user = res.data;
		$scope.user.gamePoints = res.data.ddWins;
		$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
		$scope.isEditing = false;
		$scope.editPayload.username = $scope.user.username;
		$scope.editPayload._id = $scope.user._id
		console.log('scope user username: ', $scope.user.username);
    if(res.data.avatar){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`
    } else {
      $scope.profileImageSrc = 'http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg'
    }

	}, function(err) {
		console.error(err)
	});

	$scope.toggleEdit = function(){
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		UserService.editAccount($scope.editPayload)
		.then(function(response){
			$scope.$emit('edit', response.data)
			$scope.user = response.data;
			$scope.isEditing = !$scope.isEditing;
		})
	}

  $scope.uploadImage = function(image){
    UserService.uploadImage(image, $scope.user._id)
    .then(function(res){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;
    })
  }

	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
});
