var http = require('http');
var express = require('express');
const cheerio = require('cheerio');

var app = express();

app.set('port', (process.env.PORT || 5000)); //No idea what this does

app.use(express.static(__dirname + '/public')); //I think setting the root directory

// views is directory for all template HTML files, won't be needing this for our backend 
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) { //Use pages/index.ejs file when someone GETs "app.com/"
  response.render('pages/index');
});

//Meat of the app, triggers when someone GETs "app.com/wordnet" or realistically "app.com/wordnet?q=WORD"
//and calls the function(request,response)
//Use request variable to see details about the request.
//Use response variable to set details of the response that should be given out, when a user GETs "app.com/wordnet"
app.get('/wordnet', function(request,response){ 

  response.header('Access-Control-Allow-Origin','*');                             //Enable CORS by adding the Access-Control-Allow-Origin header to the response.
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  console.log('Request Parameter',request.query.q);                            //For Testing
  console.log('Encoded Request Parameter',encodeURIComponent(request.query.q));//For testing

  wordnetRequest(request.query.q,function(str){//Passes WORD from "app.com/wordnet?q=WORD" to wordnetRequest(q,mainCallback) function defined below, and after wordnetRequest is finished, it calls the function(str) defined in this line
    $ = cheerio.load(str); //str is the entire webpage from www.cfilt.iitb.ac.in/indowordnet/first?langno=9&queryword=WORD, then loaded Cheerio
    var json = { pos : "", synonyms : [], gloss : "", example_statement: "", glossenglish :""};

    $('#words').find('a').each(function(){
        synonyms = synonyms + $(this).text();
    });











    var stringified =  JSON.stringify(json);

    console.log('Json Stringified', stringified);//For Testing
    console.log('Json Parsed',JSON.parse(stringified));
    response.send(stringified);//Sends back the scraped html back to the user  
  }); 
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//HTTP Request to indowordnet:

function wordnetRequest(q, mainCallback) {
  var options = {
    host: 'www.cfilt.iitb.ac.in',
    path: '/indowordnet/first?langno=9&queryword=' + encodeURIComponent(q)
  };

  callback = function(response) {
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str.slice(0,50));
      mainCallback(str);
    });
  }
  http.request(options, callback).end();
}