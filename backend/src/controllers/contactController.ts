import { Request, Response, NextFunction } from 'express';
import Contact from '../models/Contact';
import catchAsync from '../utils/catchAsync';

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    data: contact,
  });
});

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const contacts = await Contact.find().sort('-createdAt');

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});
