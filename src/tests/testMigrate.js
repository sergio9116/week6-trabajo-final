const sequelize = require("../utils/connection");
const user = require("./createData/user");

require('../models')

const testMigrate = async () => {

    try{
        await sequelize.sync({force:true})
        console.log('DB reset ✅');
        await user()
        process.exit()
    }catch(error){
        console.error(error);
    }
}


testMigrate()