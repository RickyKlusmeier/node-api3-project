const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model')
const middleware = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    res.status(500).json({message: 'No users found'})
  })

});

router.get('/:id', middleware.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', middleware.validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
  .then(user => {
    res.status(500).json(user);
  })
  .catch(err => {
    res.status(500).json({message: `error adding to users`})
  })
});


router.put('/:id', middleware.validateUserId, middleware.validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
     .then(user => {
       if (user) {
         res.status(201).json(user)
       }else{
         res.status(404).json({message: `The user could not be found`})
       }
     })
     .catch(err => {
       res.status(500).json({message:`Error updating the user`
       })
     })
});

router.delete('/:id', middleware.validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.remove(req.params.id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({message:`The user could not be deleted`})
  })
});

router.get('/:id/posts', middleware.validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Posts.get(req.params.id)
         .then(posts => {
           res.status(200).json(posts)
         })
         .catch(err => {
           res.status(500).json({message: `the posts could not be retrieved`})
         })
});

router.post('/:id/posts', middleware.validateUserId, middleware.validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Posts.insert(req.params.id, req.body)
         .then(post => {
           res.status(201).json({post})
         })
         .catch(err => {
           res.status(500).json({message: `Could not add post to user`})
         })
});

// do not forget to export the router
module.exports = router
