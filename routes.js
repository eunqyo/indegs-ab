var users = require('./routes/users');

module.exports = function(app){
    app.use('/users', users);
};

