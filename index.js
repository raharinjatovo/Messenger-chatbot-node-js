'use strict'

const express = require('express')
const https = require('https');
const http = require('http');

const bodyParser = require('body-parser')
const request = require('request')

const FBMessenger = require('fb-messenger')
const messenger = new FBMessenger({token: 'token'}) // Will always use this page's token for request unless sent on each method



const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot oh! <b>ok</b>")
})

let token = "token"

// Facebook

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "blondiebytes") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	let messaging_events1 = req.body.entry[0].messaging[0]
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		let payload = event.postback;
		console.log(event.message);
		let data= [
                {
                    "type": "postback",
                    "title": "Talk to an agent",
                    "payload": "CARE_HELP"
                },
                {
                    "type": "postback",
                    "title": "Outfit suggestions",
                    "payload": "CURATION"
                },
                {
                    "type": "web_url",
                    "title": "Shop now",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "full"
                }
            ];
messenger.setPersistentMenu({pageId:'fbid', menuItems:data})



		//let payload = event.postback.payload


  if(payload==null)
	{
		if (event.message && event.message.text) {


			let text = event.message.text
			decideMessage(sender,text)

		}
	}
	else{
    //
	 let	payload1=event.postback.payload
	 switch (payload1) {
		 //payload of get started button
	 	case "MY_CUSTOM_PAYLOAD":
		sendTypingOn(sender)
		//get the user name
		let url = "https://graph.facebook.com/"+sender+"?fields=first_name,last_name,profile_pic&access_token=EAAHhwJo945kBAMjJ0IvMMJ7GL7jjehPoYsiZAOCrDzSKNJKM0ikZBlbZBPIZCaxZBrzBBv9LZBO46OxYRqMs89ba8zVxpUazJtydqCxOSsIWq1OvP2474taxAqmji5DUz8kucZBwGQHZAYYlS2OV7iG4ldI19w6zhooXMJXZA864PGQZDZD";

https.get(url,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);



	sendText(sender, "Faly miarahaba an'i "+json.first_name+" "+json.last_name+" welcome")
					sendTypingOff(sender)
					sendTypingOn(sender)
					sendGenericMessageMenu(sender)
					sendTypingOff(sender)
          //  console.log(json.first_name);
        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});


	 		break;
			case "Emission":
			messenger.setPersistentMenu({pageId:'fid', menuItems:data})
       sendGenericEmission_1(sender)
       sendGenericEmission_2(sender)
       sendGenericEmission_3(sender)
				break;
				case "Mediasion":
				sendText(sender,"Emission")

				break;
				case "Circulaire":
			  sendText(sender,"Circulaire")

					break;
	 	default:
		sendReadReceipt(sender)
		sendText(sender,"Azafady! Miandrasa kely ! ⏳")



	
	sendTypingOn(sender)



		 break;

	 }
	}

}
	res.sendStatus(200)
})
//functions
function decideMessage(sender,text1) {
	let text = text1.toLowerCase()
	if (text.includes("summer")) {
		let messageDt = [
                {
                  "title": "Blug",
                  "type": "web_url",
                  "url": "https://chatfuel.com/"
                }
              ];

				sendTypingOn(sender)
		messenger.sendButtonsMessage({id:sender, text:'bonjour', buttons:messageDt})
	//	messenger.sendFileMessage({id: sender, url:'https://assets-fr.imgfoot.com/media/cache/1200x675/lionel-messi-1920-3.jpg'})
  	 sendText(sender, "Good summer ")
		 sendGenericMessage(sender)
		// sendButtonMessage(sender)
		//	messenger.sendVideoMessage({id: sender, url:'http://lit-journey-76093.herokuapp.com/videoplayback.mp4'})
	//	messenger.sendGenericMessage({id:sender, elements:messageDt1})

	//	sendTypingOff(sender)


} else{
		sendTypingOn(sender)
			sendGenericMessageMenu(sender)	//	Image(sender)

	}
}
function sendButtonMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "This is test text",
          buttons:[{
            type: "web_url",
            url: "https://www.oculus.com/en-us/rift/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Trigger Postback",
            payload: "DEVELOPER_DEFINED_PAYLOAD"
          }, {
            type: "phone_number",
            title: "Call Phone Number",
            payload: "+8284092169"
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}
function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url:  "http://lit-journey-76093.herokuapp.com/oasis.jpg",
            buttons: [{
              type: "postback",
              title: "Call Postback",
              payload: "DEVELOPER_DEFINED_PAYLOAD",
            }]
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://lit-journey-76093.herokuapp.com/oasis.jpg",
            buttons: [ {
              type: "postback",
              title: "Call Postback",
              payload: "DEVELOPER_DEFINED_PAYLOAD",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}
function sendGenericMessageDynamic(recipientId,elmt) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elmt
        }
      }
    }
  };

  callSendAPI(messageData);
}
function sendQuickReply(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "What's your favorite meltag enntity?",
      quick_replies: [
        {
          "content_type":"text",
          "title":"MsGx",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        },
        {
          "content_type":"text",
          "title":"MintBack",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        },
        {
          "content_type":"text",
          "title":"CRM",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        }
      ]
    }
  };

  callSendAPI(messageData);
}
function sendTypingOff(recipientId) {
  console.log("Turning typing indicator off");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  callSendAPI(messageData);
}
function sendGenericMessageMenu(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Fandaharana",
            subtitle: "Ireo Fandaharana rehetra",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url:  "https://media.gettyimages.com/photos/couple-organize-camping-gear-at-sunrise-picture-id1191744557?s=2048x2048",
            buttons: [{
              type: "postback",
              title: "title",
              payload: "title",
            }]
          }, {
            title: "Mediasion",
            subtitle: "Misy ireo vokatry ny tarika",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "https://media.gettyimages.com/photos/couple-organize-camping-gear-at-sunrise-picture-id1191744557?s=2048x2048",
            buttons: [ {
              type: "postback",
              title: "title",
              payload: "title",
            }]
          },
					{
						title: "Circulaire",
						subtitle: "Fandefasana filazan-draharaha",
						item_url: "https://www.oculus.com/en-us/touch/",
						image_url: "https://media.gettyimages.com/photos/couple-organize-camping-gear-at-sunrise-picture-id1191744557?s=2048x2048",
						buttons: [ {
							type: "postback",
							title: "title 🗞️",
							payload: "title",
						}]
					}]
        }
      }
    }
  };

  callSendAPI(messageData);
}


function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			//console.log("response body error")
		}
	})
}
function persistentMenu() {
    console.log("set Greeting Text");

    var messageData = {
        setting_type: "call_to_actions",
        thread_state : "existing_thread",
        call_to_actions:[
            {
                type:"postback",
                title:"FAQ",
                payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
            },
            {
                type:"postback",
                title:"I Prodotti in offerta",
                payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
            },
            {
                type:"web_url",
                title:"View Website",
                url:"https://google.com/"
            }
        ]
    };

    callSendAPI(messageData);
}
function sendAudioDynamic(recipientId,url) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "audio",
        payload: {
          url: url
        }
      }
    }
  };

  callSendAPI(messageData);
}
function sendTypingOn(recipientId) {
  console.log("Turning typing indicator on");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  callSendAPI(messageData);
}
function sendReadReceipt(recipientId) {
  console.log("Sending a read receipt to mark message as seen");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  callSendAPI(messageData);
}
function callSendAPI(messageData) {
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json:  messageData
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	});
}

function Image(sender,text) {
	let messageData = {
    "attachment":{
      "type":"image",
      "payload":{
        "url":"https://data.pixiz.com/output/user/frame/preview/400x400/2/6/4/5/1705462_416f4.jpg"
      }
    }}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
			console.log(error);
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})
