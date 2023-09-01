import { Request, Response } from "express";
import { Op } from "sequelize";

import Contact, { ContactModel } from "../models/Contact";

const createSecondaryContact = async (
  requestData: ContactModel,
  primaryContact: Contact
) => {
  const { email, phoneNumber } = requestData;

  try {
    const newSecondaryContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: "secondary",
      linkedId: primaryContact.id,
    });

    return newSecondaryContact;
  } catch (error) {
    throw error;
  }
};

const createOrUpdateContact = async (requestData: ContactModel) => {
  const { email, phoneNumber } = requestData;

  try {
    const existingContact = await Contact.findOne({
      where: {
        [Op.or]: [{ phoneNumber }, { email }],
      },
    });

    if (existingContact) {
      if (
        (email && email !== existingContact.email) ||
        (phoneNumber && phoneNumber !== existingContact.phoneNumber)
      ) {
        await createSecondaryContact(requestData, existingContact);
      }

      await existingContact.update({
        email: email || existingContact.email,
        phoneNumber: phoneNumber || existingContact.phoneNumber,
      });

      return existingContact;
    } else {
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });

      return newContact;
    }
  } catch (error) {
    throw error;
  }
};

export const identifyContact = async (req: Request, res: Response) => {
  try {
    const requestData: ContactModel = req.body;
    const { email, phoneNumber } = requestData;

    if (!email && !phoneNumber) {
      return { message: "Email or phoneNumber is required." };
    }

    const primaryContact = await createOrUpdateContact(requestData);

    const secondaryContacts = await Contact.findAll({
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
      if (
        contact.phoneNumber &&
        !secondaryPhoneNumbers.includes(contact.phoneNumber)
      ) {
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
  } catch (error) {
    return { message: "Internal Server Error" };
  }
};
