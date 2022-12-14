var createError = require('http-errors');
var express = require('express');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const hbs=require('express-handlebars')
// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin')
var db=require('./config/connection')
let fileupload= require('express-fileupload')
var app = express();
//Session
var session=require('express-session')





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload())
app.use(session({secret:"123",resave:true, saveUninitialized:true, cookie:{maxAge:6000000}}))
app.use((req,res,next)=>{
  res.set('Cache-Control','no-store')
  next()
})
  

// database connection
db.connect((err)=>{
  if(err)
  console.log("connection Error"+err)
  else
  console.log('Database connected');
})

// mongoose.connect('mongodb://127.0.0.1:27017/usersdb').then((response)=>{
//   console.log('database connected sucessfully');
// }).catch((err)=>{
//   console.log(err);
// });


//routes
app.use('/', usersRouter);
app.use('/admin', adminRouter);


//index starts at 1

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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