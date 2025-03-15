export type LeadStatus = 'New' | 'In Contact' | 'Interested' | 'Closed' | 'Not Interested'

export type FocusDomain = 'Container Shipping' | 'Drop Shipping' | 'Ecommerce'

export type ContactPlatform = 'LinkedIn' | 'Email' | 'Referral' | 'Conference' | 'Other'

export interface Lead {
  id: string
  clientName: string
  companyName: string
  primaryContactPerson: string
  status: LeadStatus
  focusDomain: FocusDomain
  potentialValue: string
  email: string
  contactPlatform: ContactPlatform
  location: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface LeadFilter {
  search?: string
  status?: LeadStatus[]
  focusDomain?: FocusDomain[]
  contactPlatform?: ContactPlatform[]
  location?: string
} 