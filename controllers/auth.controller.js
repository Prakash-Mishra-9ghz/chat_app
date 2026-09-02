const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { use } = require('react');

const SALT_ROUNDS = 10;

async function register(req, res) {
  const {username, email, password} = req.body;

  if(!username || !email || !password) 
    return res.status(400).json({message: "invalid username or email or password"});

  try{
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      username, 
      email, 
      passwordHash
    });
    return res.status(201).json({
      newUser, 
      message: "user registered successfully"
    });
  }catch(err){
    if(err.code === 11000)
      return res.status(409).json({message: "user already exists"});
    return res.status(500).json({message: 'unexpected error occurred'});
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try{
    const userExist = await User.findOne({email}).select('+passwordHash');

    if(!userExist) 
      return res.status(404).json({ message: "Email or password is incorrect." });

    const passwordMatch = await bcrypt.compare(password, userExist.passwordHash)

    if(!passwordMatch) 
      return res.status(404).json({ message: 'email or password wrong' });
    
    const payload = userExist._id;

    const token = jwt.sign({ userId: payload }, process.env.JWT_SECRET, { expiresIn: '2h' });

    return res.status(200).json({ token, message: 'successful login' });
  }catch(err){
    return res.status(500).json({ message: 'unexpected error found' })
  }
}

module.exports = { register, login };
