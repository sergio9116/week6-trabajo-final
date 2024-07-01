const catchError = require('../utils/catchError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id
    const results = await Cart.findAll({
        where: { userId },
        include: [
            {
                model: Product,
                attributes:{exclude: ["createdAt", "updatedAt"]}, // excluye dichos caracteres
                //attributes: ['title', 'price'] incluye lo q seleccionamos
                include: [
                    {
                        model: Category,
                        attributes: ["name"]
                    }
                ]
            }
        ]
    });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { quantity, productId } = req.body
    const userId = req.user.id

    const body = { userId, quantity, productId}

    const result = await Cart.create(body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await Cart.findByPk(id, {
        where: { userId },
        include: [
            {
                model: Product,
                attributes:{exclude: ["createdAt", "updatedAt"]},

                include: [
                    {
                        model: Category,
                        attributes: ["name"]
                    }
                ]
            }
        ]
    });
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Cart.destroy({ 
        where: {
            id,
            userId: req.user.id
        } 
    });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const userId = req.user.id
    const { id } = req.params;
    const { quantity } = req.body
    const result = await Cart.update(
        { quantity }, 
        { where: { id, userId}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}