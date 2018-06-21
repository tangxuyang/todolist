var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var tags = require('./routes/tags');
var login = require('./routes/login');
var cors = require('cors');
var auth = require('./middlewares/authentication');

var app = express();

app.use(cors({
  exposedHeaders:['token'],
  //allowedHeaders:['token','X-Requested-With']
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req,res,next){
// 	if(req.headers["token"] === "txy"){
// 		next();
// 	}else{
// 		res.json({status:0,message:"无权操作！"});
// 	}
// });
//app.use(auth);

app.use('/todo', auth, index);
app.use('/users', auth, users);
app.use('/login', login);
app.use('/tags', auth, tags);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
