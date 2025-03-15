import { Request, Response } from 'express';
import { PrismaClient, LeadStatus, FocusDomain, ContactPlatform } from '@prisma/client';

const prisma = new PrismaClient();

// Get all leads
export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

// Get lead by ID
export const getLeadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.status(200).json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
};

// Create new lead
export const createLead = async (req: Request, res: Response) => {
  try {
    const {
      clientName,
      companyName,
      primaryContactPerson,
      status,
      focusDomain,
      potentialValue,
      email,
      contactPlatform,
      location,
      notes,
    } = req.body;

    const lead = await prisma.lead.create({
      data: {
        clientName,
        companyName,
        primaryContactPerson,
        status: status as LeadStatus,
        focusDomain: focusDomain as FocusDomain,
        potentialValue,
        email,
        contactPlatform: contactPlatform as ContactPlatform,
        location,
        notes,
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

// Update lead
export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      companyName,
      primaryContactPerson,
      status,
      focusDomain,
      potentialValue,
      email,
      contactPlatform,
      location,
      notes,
    } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        clientName,
        companyName,
        primaryContactPerson,
        status: status as LeadStatus,
        focusDomain: focusDomain as FocusDomain,
        potentialValue,
        email,
        contactPlatform: contactPlatform as ContactPlatform,
        location,
        notes,
      },
    });

    res.status(200).json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

// Delete lead
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
};

// Filter leads
export const filterLeads = async (req: Request, res: Response) => {
  try {
    const { search, status, focusDomain, contactPlatform, location } = req.body;

    // Build the where clause based on filter criteria
    const where: any = {};

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { primaryContactPerson: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status.length > 0) {
      where.status = { in: status };
    }

    if (focusDomain && focusDomain.length > 0) {
      where.focusDomain = { in: focusDomain };
    }

    if (contactPlatform && contactPlatform.length > 0) {
      where.contactPlatform = { in: contactPlatform };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.status(200).json(leads);
  } catch (error) {
    console.error('Error filtering leads:', error);
    res.status(500).json({ error: 'Failed to filter leads' });
  }
}; 