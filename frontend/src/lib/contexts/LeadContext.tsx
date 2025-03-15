'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lead, LeadFilter } from '../types/lead'

// Mock data for initial development
const mockLeads: Lead[] = [
  {
    id: '1',
    clientName: 'John Doe',
    companyName: 'Shipping Express',
    primaryContactPerson: 'John Doe',
    status: 'New',
    focusDomain: 'Container Shipping',
    potentialValue: 'High value client with global operations',
    email: 'john.doe@shippingexpress.com',
    contactPlatform: 'LinkedIn',
    location: 'Singapore',
    notes: 'Met at the Shipping Conference 2023',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    clientName: 'Jane Smith',
    companyName: 'Global Dropship',
    primaryContactPerson: 'Jane Smith',
    status: 'In Contact',
    focusDomain: 'Drop Shipping',
    potentialValue: 'Medium-sized operation looking to expand',
    email: 'jane.smith@globaldropship.com',
    contactPlatform: 'Email',
    location: 'United States',
    notes: 'Referred by existing client',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    clientName: 'Mike Johnson',
    companyName: 'E-Shop Solutions',
    primaryContactPerson: 'Mike Johnson',
    status: 'Interested',
    focusDomain: 'Ecommerce',
    potentialValue: 'Fast-growing startup with VC funding',
    email: 'mike.johnson@eshopsolutions.com',
    contactPlatform: 'Conference',
    location: 'Germany',
    notes: 'Interested in our logistics optimization solution',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-15'),
  },
]

interface LeadContextType {
  leads: Lead[]
  filteredLeads: Lead[]
  filter: LeadFilter
  setFilter: (filter: LeadFilter) => void
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateLead: (id: string, lead: Partial<Lead>) => void
  deleteLead: (id: string) => void
}

const LeadContext = createContext<LeadContextType | undefined>(undefined)

export const useLeads = () => {
  const context = useContext(LeadContext)
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider')
  }
  return context
}

interface LeadProviderProps {
  children: ReactNode
}

export const LeadProvider = ({ children }: LeadProviderProps) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [filter, setFilter] = useState<LeadFilter>({})
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads)

  // Apply filters whenever leads or filter changes
  useEffect(() => {
    let result = [...leads]

    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      result = result.filter(
        (lead) =>
          lead.clientName.toLowerCase().includes(searchLower) ||
          lead.companyName.toLowerCase().includes(searchLower) ||
          lead.primaryContactPerson.toLowerCase().includes(searchLower) ||
          lead.location.toLowerCase().includes(searchLower)
      )
    }

    if (filter.status && filter.status.length > 0) {
      result = result.filter((lead) => filter.status?.includes(lead.status))
    }

    if (filter.focusDomain && filter.focusDomain.length > 0) {
      result = result.filter((lead) => filter.focusDomain?.includes(lead.focusDomain))
    }

    if (filter.contactPlatform && filter.contactPlatform.length > 0) {
      result = result.filter((lead) => filter.contactPlatform?.includes(lead.contactPlatform))
    }

    if (filter.location) {
      const locationLower = filter.location.toLowerCase()
      result = result.filter((lead) => lead.location.toLowerCase().includes(locationLower))
    }

    setFilteredLeads(result)
  }, [leads, filter])

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(), // Simple ID generation for mock data
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLeads((prevLeads) => [...prevLeads, newLead])
  }

  const updateLead = (id: string, updatedFields: Partial<Lead>) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id
          ? { ...lead, ...updatedFields, updatedAt: new Date() }
          : lead
      )
    )
  }

  const deleteLead = (id: string) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id))
  }

  return (
    <LeadContext.Provider
      value={{
        leads,
        filteredLeads,
        filter,
        setFilter,
        addLead,
        updateLead,
        deleteLead,
      }}
    >
      {children}
    </LeadContext.Provider>
  )
} 