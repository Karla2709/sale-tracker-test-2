'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lead, LeadFilter } from '../types/lead'
import api from '../api'

// Initial empty state before API data loads
const initialLeads: Lead[] = []

interface LeadContextType {
  leads: Lead[]
  filteredLeads: Lead[]
  filter: LeadFilter
  setFilter: (filter: LeadFilter) => void
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateLead: (id: string, lead: Partial<Lead>) => void
  deleteLead: (id: string) => void
  loading: boolean
  error: Error | null
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
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [filter, setFilter] = useState<LeadFilter>({})
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch leads from API on component mount
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true)
        const data = await api.getLeads() as any[]
        // Transform API data to match Lead type if necessary
        const formattedLeads = data.map((lead: any) => ({
          id: lead.id,
          clientName: lead.name,
          companyName: lead.company?.name || 'N/A',
          primaryContactPerson: lead.name,
          status: lead.status || 'New',
          focusDomain: lead.focus_domain || 'Ecommerce',
          potentialValue: lead.potential_value || '',
          email: lead.email || '',
          contactPlatform: lead.contact_platform || 'Email',
          location: lead.location || '',
          notes: lead.notes || '',
          createdAt: new Date(lead.created_at),
          updatedAt: new Date(lead.updated_at)
        }))
        setLeads(formattedLeads)
      } catch (err) {
        console.error('Error fetching leads:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch leads'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchLeads()
  }, [])

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

  const addLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Transform lead data to match API expectations
      const apiLead = {
        name: lead.clientName,
        email: lead.email,
        status: lead.status,
        focus_domain: lead.focusDomain,
        potential_value: lead.potentialValue,
        contact_platform: lead.contactPlatform,
        location: lead.location,
        notes: lead.notes,
      }
      
      const response = await api.createLead(apiLead) as any
      
      // Add the new lead to the local state with proper formatting
      const newLead: Lead = {
        ...lead,
        id: response.id,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      }
      
      setLeads((prevLeads) => [...prevLeads, newLead])
    } catch (err) {
      console.error('Error adding lead:', err)
      // You could set an error state here if needed
    }
  }

  const updateLead = async (id: string, updatedFields: Partial<Lead>) => {
    try {
      // Transform updated fields to match API expectations
      const apiLead: any = {}
      
      if (updatedFields.clientName) apiLead.name = updatedFields.clientName
      if (updatedFields.email) apiLead.email = updatedFields.email
      if (updatedFields.status) apiLead.status = updatedFields.status
      if (updatedFields.focusDomain) apiLead.focus_domain = updatedFields.focusDomain
      if (updatedFields.potentialValue) apiLead.potential_value = updatedFields.potentialValue
      if (updatedFields.contactPlatform) apiLead.contact_platform = updatedFields.contactPlatform
      if (updatedFields.location) apiLead.location = updatedFields.location
      if (updatedFields.notes) apiLead.notes = updatedFields.notes
      
      await api.updateLead(id, apiLead)
      
      // Update the lead in local state
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id
            ? { ...lead, ...updatedFields, updatedAt: new Date() }
            : lead
        )
      )
    } catch (err) {
      console.error('Error updating lead:', err)
    }
  }

  const deleteLead = async (id: string) => {
    try {
      await api.deleteLead(id)
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id))
    } catch (err) {
      console.error('Error deleting lead:', err)
    }
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
        loading,
        error
      }}
    >
      {children}
    </LeadContext.Provider>
  )
} 