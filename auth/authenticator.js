let userDB;
var expressApp;
var rp = require('request-promise');

module.exports = (injectedUserDB,app) => {
    userDB = injectedUserDB;
    expressApp = app;

    return {
        registerUser: registerUser,
        login: login,
        login2:login2
    };
};

function registerUser(req, res) {
    userDB.isValidUser(req.body.username, (error, isValidUser) => {
        if (error || !isValidUser) {
            const message = error
                ? "Something went wrong!"
                : "This user already exists!";

            sendResponse(res, message, error);

            return;
        }

        userDB.register(req.body.username, req.body.password, (response) => {
            sendResponse(
                res,
                response.error === undefined ? "Success!!" : "Something went wrong!",
                response.error
            );
        });
    });
}
function login2(req, res,next) {
   
    
}

function login(req, res,next){

    const data  = req.body;

    var options = {
        method: 'POST',
        uri: 'http://localhost:3000/auth/login2',
        form: {
            username:data['username'],
            password:data['password'],
            grant_type:"password",
            client_id:"null",
            client_secret:"null"
        },
        headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
            'Content-Type' : 'application/x-www-form-urlencoded' 
         },
    };
     
    rp(options)
        .then((body)=>{
            res.cookie('Authorization', `Bearer ${JSON.parse(body)['access_token']}`);
            // res.header("Authorization",`Bearer ${JSON.parse(body)['access_token']}`);
            return res.redirect('http://localhost:80/accounts/login');
        })
        .catch((err)=>{
            return res.status(403).send("Not Authorized");
        });   
}

function sendResponse(res, message, error) {
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}