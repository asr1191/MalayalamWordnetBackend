var http = require('http');
var express = require('express');
const cheerio = require('cheerio');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/wordnet', function(request,response){
  response.header('Access-Control-Allow-Origin','*');
  console.log('Request Parameter',request.param("q"));
  console.log('Encoded Request Parameter',encodeURIComponent(request.param('q')));
  wordnetRequest(request.param('q'),function(str){
    $ = cheerio.load(str);
    response.send(function(){
      //RESPONSE BODY HERE, USE CHEERIO
      var detail = $('#detail').html();
      console.log('Cheerio#detail',detail);
      return detail;
    });
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