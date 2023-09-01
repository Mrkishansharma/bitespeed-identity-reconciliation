"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyContact = void 0;
const sequelize_1 = require("sequelize");
const Contact_1 = __importDefault(require("../models/Contact"));
const createSecondaryContact = async (requestData, primaryContact) => {
    const { email, phoneNumber } = requestData;
    try {
        const newSecondaryContact = await Contact_1.default.create({
            email,
            phoneNumber,
            linkPrecedence: "secondary",
            linkedId: primaryContact.id,
        });
        return newSecondaryContact;
    }
    catch (error) {
        throw error;
    }
};
const createOrUpdateContact = async (requestData) => {
    const { email, phoneNumber } = requestData;
    try {
        const existingContact = await Contact_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ phoneNumber }, { email }],
            },
        });
        if (existingContact) {
            if ((email && email !== existingContact.email) ||
                (phoneNumber && phoneNumber !== existingContact.phoneNumber)) {
                await createSecondaryContact(requestData, existingContact);
            }
            await existingContact.update({
                email: email || existingContact.email,
                phoneNumber: phoneNumber || existingContact.phoneNumber,
            });
            return existingContact;
        }
        else {
            const newContact = await Contact_1.default.create({
                email,
                phoneNumber,
                linkPrecedence: "primary",
            });
            return newContact;
        }
    }
    catch (error) {
        throw error;
    }
};
const identifyContact = async (req, res) => {
    try {
        const requestData = req.body;
        const { email, phoneNumber } = requestData;
        if (!email && !phoneNumber) {
            return { message: "Email or phoneNumber is required." };
        }
        const primaryContact = await createOrUpdateContact(requestData);
        const secondaryContacts = await Contact_1.default.findAll({
            where: {
                linkedId: primaryContact.id,
                linkPrecedence: "secondary",
            },
        });
        const emails = [primaryContact.email];
        const secondaryPhoneNumbers = [primaryContact.phoneNumber];
        const secondaryContactIds = secondaryContacts.map((contact) => contact.id);
        secondaryContacts.forEach((contact) => {
            if (contact.email && !emails.includes(contact.email))
                emails.push(contact.email);
            if (contact.phoneNumber &&
                !secondaryPhoneNumbers.includes(contact.phoneNumber)) {
                secondaryPhoneNumbers.push(contact.phoneNumber);
            }
        });
        return {
            contact: {
                primaryContactId: primaryContact.id,
                emails,
                phoneNumbers: secondaryPhoneNumbers,
                secondaryContactIds,
            },
        };
    }
    catch (error) {
        return { message: "Internal Server Error" };
    }
};
exports.identifyContact = identifyContact;
