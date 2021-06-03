//Front-end developer test
/*
  - create a new file, add it into html
  - create a function to show realtime chat interface
  - style layout
  - call a dummy api function (supplied) to get / receive messages
  - show chat history from dummy api function

*/

const chat = new function(){
	var _events = {};
	const VISITOR = 'Visitor';
	const OPERATOR = 'Operator';

	this.getChatHistory = getChatHistory;
	function getChatHistory(callback){
		var d = new Date();
		d.setTime(d.getTime()-200000)
		var chats = [];
		chats.push({datetime:new Date(d.setTime(d.getTime()+2000)).toISOString(), message:"hello", from: VISITOR});
		chats.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"Hi, how can I help you?", from: OPERATOR});
		chats.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"I'm looking for a size 7, but can't find it", from: VISITOR});
		chats.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"Ok, one moment I'll check the stock", from:OPERATOR})
		chats.push({datetime:new Date(d.setTime(d.getTime()+10000)).toISOString(), message:"I'm sorry, there is no sie 7 available in that colour. There are some in red and blue however", from: OPERATOR})
		chats.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"Oh great, thank you", from: VISITOR});
		chats.push({datetime:new Date(d.setTime(d.getTime()+4000)).toISOString(), message:"my pleasure :-)", from: OPERATOR});

		if(typeof(callback) == "function") {
			setTimeout(callback(chats), 1000);
		}
	}

	
	this.sendChat = sendChat;
	function sendChat(str){
		dispatchChatEvent(str, VISITOR);
		if(str.indexOf("hello") != -1 || str.indexOf("hi") != -1) {
			setTimeout(operatorGreetingChat, 2000);
		} else if(str.indexOf("?") != -1) {
			setTimeout(operatorAnswerChat, 2000);
		} else {
			setTimeout(operatorChat, 2000);
		}
	}

	var responses = [
		"OK, let me check that out for you",
		"Message received. I'll see what I can do.",
		"ok, thank you.",
		"I understand.",
		"Hmm, I'm not sure I understand, can you rephrase that?",
		"Right ok, let me sort that out for you."
	];
	var greetings = [
		"Hello there, welcome to the site. How may I help you?",
		"Good day! How are you?",
		"Hello, what can I do for you?",
		"Hi and welcome!",
		"Greetings :-)"

	]
	var answers = [
		"Thank you for your question.",
		"OK, let me check that out for you",
		"A very good question! Let me have a look...",
		"Hmm, ok give me a minute and I'll sort that out.",
		"Yes, I think so."
	]
	function operatorChat(){
		var randResponse = responses[Math.floor(Math.random()*responses.length)];
		dispatchChatEvent(randResponse, OPERATOR);
	}
	function operatorAnswerChat(){
		var randResponse = answers[Math.floor(Math.random()*responses.length)];
		dispatchChatEvent(randResponse, OPERATOR);
	}
	function operatorGreetingChat(){
		var randResponse = greetings[Math.floor(Math.random()*responses.length)];
		dispatchChatEvent(randResponse, OPERATOR);
	}

	function dispatchChatEvent(msg, from){
		var event = new CustomEvent('chatreceived', {"detail":{datetime:new Date().toISOString(), message:msg, from:from}});
		
		// Listen for the event
		chat.addListener('chatreceived', function (e) { 
			console.log(e.chat.message) 
			var msg = e.chat.message,
				from = e.chat.from,
				datetime = e.chat.datetime;

				chat.loadDataManager(msg, from, datetime)
		
		}, false);

		// Dispatch the event.
		raiseEvent("chatreceived", {"chat":{datetime:new Date().toISOString(), message:msg, from:from}});

		// remove the events, once the event raised...
		_events = {};
	}

	this.addListener = function(eventName, callback) {
		var events = _events;
	 	callbacks = events[eventName] = events[eventName] || [];
		callbacks.push(callback);
		
	};

	function raiseEvent(eventName, args) {
		var callbacks = _events[eventName];
		if(typeof(callbacks) != "undefined") {
			for (let i = 0, l = callbacks.length; i < l; i++) {
			  callbacks[i](args);
			}
		}
	}

	this.loadDataManager = loadDataManager;
	function loadDataManager(msg, from, datetime) {
		
		// setup the dynamic values in html to be render
		var visitorClassMedia = ( from === VISITOR ) ? 'ml-auto' : '',
			visitorClassMediaBody = ( from !== VISITOR ) ? 'ml-3' : '',
			bgColorClass = ( from === VISITOR ) ? 'bg-primary' : 'bg-light',
			msgTextClass = ( from === VISITOR ) ? 'text-white' : 'text-muted',
			date = new Date(datetime).toDateString(),
			time = new Date(datetime).toLocaleTimeString(),
			timeStamp = `${date} | ${time}`,
			img =  (type) => `<img  src="https://img.icons8.com/color/36/000000/administrator-${type}.png" alt="user" width="50" class="avatar rounded-circle">`,
			senderImage = ( from === VISITOR ) ? img('male') : '';
			receiverImage = ( from === OPERATOR ) ? img('female') : '',
			chatStr = `
				<div class="media w-50 mb-3 ${visitorClassMedia}">
					${receiverImage}
					<div class="media-body ${visitorClassMediaBody}">
						<div class="${bgColorClass} rounded py-2 px-3 mb-2">
							<p class="text-small mb-0 ${msgTextClass}">${msg}</p>
						</div>
						<p class="small text-muted">${timeStamp}</p>
					</div>
					${senderImage}
				</div>
			`;

		// append the chat at last
		var ele = document.querySelector('#chatHistory');
		ele.innerHTML += chatStr;

		// scroll to bottom
		var boxEle = document.querySelector('#chatHistory');
		document.querySelector('#chatHistory').scrollTo({ 
			top: boxEle.scrollHeight, behavior: 'smooth' });
		document.querySelector('#chatInput').value = ''
	}
}

$(function(){
// document.addEventListener("DOMContentLoaded", function() {
	
	function loadData(chats){
		for(var i=0; i<chats.length; i++) {
			var msg = chats[i].message,
				from = chats[i].from,
				datetime = chats[i].datetime;
			
			chat.loadDataManager(msg, from, datetime)
		}
		
	}

	// load the history of chat
	chat.getChatHistory(loadData);
	
	// bind click event when click on send button or enter
	var myButton = document.querySelector('#chatSubmit');
	myButton.addEventListener("click", sendingChat, false)
	
	// handle the chat while sending text...
	function sendingChat() {
		var chatInputVal = document.querySelector('#chatInput').value;
		if(chatInputVal) {
			chat.sendChat(chatInputVal);
		} else {
			alert("Please enter the question...")
		}
	}
	
	// code…
});