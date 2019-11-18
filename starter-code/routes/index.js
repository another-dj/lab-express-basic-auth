"use strict";

const { Router } = require("express");
const router = Router();
const User = require("../models/user"); // the model
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

const routeGuard = require("../middleware/route-guard"); // route guards

router.get("/", (req, res, next) => {
  res.render("index", { title: "Hello World!" });
});

router.get("/signup", (req, res, next) => {
  // go to signup
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/signup", (req, res, next) => {
  // create a user
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    hashpassword: hashPass
  })
    .then(createdUser => {
      console.log(createdUser);
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
      res.render(error);
    });
});

// logging in
router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;
  let userId;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      error: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ username: theUsername })
    .then(user => {
      if (!user) {
        return Promise.reject(new Error("The username doesn't exist."));
      } else {
        userId = user._id;
        return bcrypt.compareSync(thePassword, user.hashpassword);
      }
    })
    .then(match => {
      if (match) {
        req.session.user = userId;
        res.redirect("/main");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

/* if (bcrypt.compareSync(thePassword, user.hashpassword)) {
        console.log(thePassword, user.hashpassword);
        // Save the login in the session!
        req.session.user = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      console.log("------------------------------------->", error);
      next(error);
    });
}); */

// Protected routes

/* router.get("/main", (req, res, next) => {
  
  res.render("main");
});

router.get("/private", (req, res, next) => {
  
  res.render("private");
}); */

// Private Page
// Set a controller for the private page,
// preceded by the middleware that prevents unauthenticated users to visit
router.get("/private", routeGuard, (req, res, next) => {
  res.render("private");
});

router.get("/main", routeGuard, (req, res, next) => {
  res.render("main");
});

router.get("/profile", routeGuard, (req, res, next) => {
  res.render("profile");
});

router.get("/edit", routeGuard, (req, res, next) => {
  res.render("edit");
});





module.exports = router;
