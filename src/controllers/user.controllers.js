const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await User.create(req.body);
    return res.status(201).json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;

    const { firstName, lastName, phone } = req.body

    const result = await User.update(
        { firstName, lastName, phone },
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req, res) => {
    const { email, password} = req.body;
    
    const user = await User.findOne({where: {email}})
    if (!user) return res.status(401).json({ message: 'Invalid Credentials'})
        
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({message: 'Invalid Credentials'})

    const token = jwt.sign(
        {user}, 
        process.env.TOKEN_SECRET,
        { expiresIn: '3d' }
    )   
    return res.json({user, token})
});

const logged = catchError(async(req, res) => {
    const user = req.user
    return res.json(user)
})

module.exports = {
    getAll,
    create,
    remove,
    update,
    login,
    logged
}