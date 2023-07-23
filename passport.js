const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('./db/models');
const bcrypt = require('bcrypt');

passport.use('local', new LocalStrategy(
  {
    usernameField: 'email'
  },
  async (email, password, done) => {
    try {
      const user = await models.User.findOne({ where: { 'email': email } });
      if (!user || ! await user.matchPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.log(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await models.User.findOne({ where: { 'id': id } });
    return user ? done(null, user) : done(new Error('Wrong user ID'));
  } catch (error) {
    console.log(error);
  }
});

module.exports = passport;