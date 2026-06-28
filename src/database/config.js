import { Sequelize } from "sequelize";
import { Usuario } from "../models/Usuario.js";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './src/database/banco.db'
})

const models = { Usuario }
Object.values(models).forEach(model => {
    model.init(sequelize)
}) 

export { sequelize }