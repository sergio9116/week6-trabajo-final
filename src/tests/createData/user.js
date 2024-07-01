const User = require("../../models/User")

const user = async () => {
    const body = {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@gmail.com",
        password: "juan1234",
        phone: "314275328"
    }

    await User.create(body)
}

module.exports = user 