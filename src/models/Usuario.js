import { DataTypes, Model } from "sequelize";
import bcrypt from 'bcrypt'

export class Usuario extends Model {
    static init (sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: () => crypto.randomUUID()
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            senha: {
                type: DataTypes.STRING,
                allowNull: false
            },
            maiorPontuacao: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            dataPontuacao: {
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            modelName: 'Usuario',
            timestamps: false,
            hooks: {
                beforeCreate: async (usuario) => {
                    usuario.senha = await bcrypt.hash(usuario.senha, 16)
                },
                beforeUpdate: (usuario) => {
                    usuario.dataPontuacao = Date.now()
                }
            }
        })
    }
}