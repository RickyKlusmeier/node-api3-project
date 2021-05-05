const Users = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`[${new Date().toISOString}] ${req.method} to ${req.url} from ${req.get('origin')}`)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const id = req.params.id;
  try{
    const user = await Users.getById(id)
    if(!user){
      res.status(404).json({message: 'user not found'})
    } else {
      req.user = user
      next()
    }
  } catch{next}
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.name || Object.keys(req.body.name).length === 0){
    res.status(400).json({message: `missing required name field`})
  }else{
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.text || Object.keys(req.body.text).length === 0){
    res.status(400).json({message: `missing required text field`})
  }else{
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}