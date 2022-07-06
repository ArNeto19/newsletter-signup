//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname));

//-- Mailchimp API
  // mailChimpKey = 'efe5b1fe723338414a66a7ffbaab3029-us12'
  // list ID: 5e6b1e7822
//-- Mailchimp API -//

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
  let firstName = req.body.fName;
  let lastName = req.body.lName;
  let email = req.body.email;

  let data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  let jsonData = JSON.stringify(data);

  let url = "https://us12.api.mailchimp.com/3.0/lists/5e6b1e7822";
  let options = {
    method: "POST",
    auth: "arneto19:" + mailChimpKey
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {

      let postData = JSON.parse(data);
      console.log(postData);

      if (postData.error_count === 0) {
        res.sendFile(__dirname + '/sucess.html');
      } else if (postData.error_count > 0) {
        let errorMessage = postData.errors[0].error;
        let errorCode = postData.errors[0].error_code;
        res.sendFile(__dirname + '/failure.html');
        console.log(errorCode, errorMessage);
      }

    });
  });

  request.write(jsonData);
  request.end();


});



app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on port 3000');
});
