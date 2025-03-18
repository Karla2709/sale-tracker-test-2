'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lead, LeadFilter } from '../types/lead'

// Define API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface LeadContextType {
  leads: Lead[]
  filteredLeads: Lead[]
  filter: LeadFilter
  setFilter: (filter: LeadFilter) => void
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>
  deleteLead: (id: string) => Promise<void>
  loading: boolean
  error: string | null
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

// Helper function to format API data to match our Lead type
const formatApiLead = (apiLead: any): Lead => {
  return {
    id: apiLead.id,
    clientName: apiLead.name || '',
    companyName: apiLead.company ? apiLead.company.name || '' : '',
    primaryContactPerson: apiLead.name || '',
    status: apiLead.status || 'New',
    focusDomain: apiLead.company ? apiLead.company.industry || 'Ecommerce' : 'Ecommerce',
    potentialValue: apiLead.potential_value || '',
    email: apiLead.email || '',
    contactPlatform: apiLead.contact_platform || 'Email',
    location: apiLead.location || '',
    notes: apiLead.notes || '',
    createdAt: new Date(apiLead.created_at),
    updatedAt: new Date(apiLead.updated_at),
  }
}

// Helper function to convert our Lead type to API format
const convertToApiFormat = (lead: Partial<Lead>): any => {
  return {
    name: lead.clientName,
    email: lead.email,
    status: lead.status,
    notes: lead.notes,
    location: lead.location,
    potential_value: lead.potentialValue,
    contact_platform: lead.contactPlatform
  }
}

export const LeadProvider = ({ children }: LeadProviderProps) => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<LeadFilter>({})
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch leads from API on mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${API_URL}/api/leads`)
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const apiLeads = await response.json()
        const formattedLeads = apiLeads.map(formatApiLead)
        setLeads(formattedLeads)
      } catch (err) {
        console.error('Error fetching leads:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch leads')
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
          (lead.location && lead.location.toLowerCase().includes(searchLower))
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
      result = result.filter((lead) => lead.location && lead.location.toLowerCase().includes(locationLower))
    }

    setFilteredLeads(result)
  }, [leads, filter])

  const addLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      setError(null)
      
      const apiLead = convertToApiFormat(lead)
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiLead),
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const newApiLead = await response.json()
      const formattedLead = formatApiLead(newApiLead)
      
      // Update local state with the new lead from the API
      setLeads((prevLeads) => [...prevLeads, formattedLead])
    } catch (err) {
      console.error('Error adding lead:', err)
      setError(err instanceof Error ? err.message : 'Failed to add lead')
      throw err // Rethrow to allow handling in the UI
    } finally {
      setLoading(false)
    }
  }

  const updateLead = async (id: string, updatedFields: Partial<Lead>) => {
    try {
      setLoading(true)
      setError(null)
      
      const apiLead = convertToApiFormat(updatedFields)
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiLead),
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const updatedApiLead = await response.json()
      const formattedLead = formatApiLead(updatedApiLead)
      
      // Update the local state with the response from the API
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id ? { ...lead, ...formattedLead } : lead
        )
      )
    } catch (err) {
      console.error('Error updating lead:', err)
      setError(err instanceof Error ? err.message : 'Failed to update lead')
      throw err // Rethrow to allow handling in the UI
    } finally {
      setLoading(false)
    }
  }

  const deleteLead = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      // Remove the lead from local state after successful API call
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id))
    } catch (err) {
      console.error('Error deleting lead:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete lead')
      throw err // Rethrow to allow handling in the UI
    } finally {
      setLoading(false)
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