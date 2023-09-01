import { Model, DataTypes } from "sequelize";

import sequelize from "../database";

interface ContactModel {
  id: number;
  phoneNumber?: string;
  email?: string;
  linkedId?: number;
  linkPrecedence?: "primary" | "secondary";
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export { ContactModel };

class Contact extends Model {
  public id!: number;
  public phoneNumber?: string;
  public email?: string;
  public linkedId?: number;
  public linkPrecedence?: "primary" | "secondary";
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    linkedId: {
      type: DataTypes.INTEGER,
    },
    linkPrecedence: {
      type: DataTypes.ENUM("primary", "secondary"),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Contact",
    tableName: "Contact",
  }
);

export default Contact;
