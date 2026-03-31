import React, { createContext, useContext, useState, useEffect } from 'react';
import clientService from '../services/Clientservice';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  // PRODUCTION: fetch from API — no hardcoded fallback
  const [clientList, setClientList] = useState([]);

  // Fetch clients from API on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await clientService.getAll();
        // apiService uses fetch wrapper — returns response.json() directly, so res = { success, data: [] }
        const rows = res?.data ?? [];
        const mapped = rows.map(row => ({
          id: row?.id,
          // DB columns: client_name, project_no, labour_contractor, address, total_budget
          clientName: row?.client_name ?? row?.clientName ?? '',
          projectNo: row?.project_no ?? row?.projectNo ?? '',
          labourContractor: row?.labour_contractor ?? row?.labourContractor ?? '',
          address: row?.address ?? '',
          totalBudget: row?.total_budget ?? row?.totalBudget ?? '',
          projects: row?.projects ?? []
        }));
        setClientList(mapped);
      } catch (e) {
        console.error("[ClientContext] fetchClients error:", e);
        // On error keep empty — no hardcoded fallback
        setClientList([]);
      }
    };
    fetchClients();
  }, []);

  // Add or update a client — saves to API and updates local state
  const addOrUpdateClient = async (client) => {
    try {
      // Check if client already exists locally
      const existingIndex = clientList.findIndex(
        (c) => c.clientName === client.clientName
      );

      if (existingIndex !== -1) {
        // Update existing — merge projects
        const existing = clientList[existingIndex];
        const existingProjects = existing.projects || [];
        const newProjects = client.projects || [];
        const mergedProjects = Array.from(new Set([...existingProjects, ...newProjects]));
        const updatedClient = { ...existing, ...client, projects: mergedProjects };

        // Save to API if id exists
        if (existing.id) {
          await clientService.update(existing.id, updatedClient);
        }

        setClientList(prev => {
          const updated = [...prev];
          updated[existingIndex] = updatedClient;
          return updated;
        });
      } else {
        // Create new client via API
        const res = await clientService.create({
          ...client,
          projects: client.projects || []
        });
        // apiService fetch wrapper — res = { success, data: {...} }
        const created = res?.data ?? client;
        setClientList(prev => [...prev, { ...client, id: created.id, projects: client.projects || [] }]);
      }
    } catch (e) {
      console.error("[ClientContext] addOrUpdateClient error:", e);
      // On error still update local state so UI doesn't break
      setClientList(prev => {
        const existingIndex = prev.findIndex(c => c.clientName === client.clientName);
        if (existingIndex !== -1) {
          const updated = [...prev];
          const existingProjects = updated[existingIndex].projects || [];
          const newProjects = client.projects || [];
          const mergedProjects = Array.from(new Set([...existingProjects, ...newProjects]));
          updated[existingIndex] = { ...updated[existingIndex], ...client, projects: mergedProjects };
          return updated;
        }
        return [...prev, { ...client, projects: client.projects || [] }];
      });
    }
  };

  return (
    <ClientContext.Provider value={{ clientList, setClientList, addOrUpdateClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};