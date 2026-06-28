import { Sequelize } from "sequelize";
import { Usuario } from "../models/Usuario.js";
import sqlite3 from "sqlite3";

console.log("SQLite:", sqlite3.VERSION);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './src/database/banco.db'
})

const models = { Usuario }
Object.values(models).forEach(model => {
    model.init(sequelize)
}) 

export { sequelize }
