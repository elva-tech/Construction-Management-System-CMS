import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import dailyReportService from '../services/dailyReportService';
import { useProject } from './ProjectContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { selectedProject } = useProject();

  const [appData, setAppData] = useState({
    dailyReport: {
      existingBalance: 15.25,
      budgetSpent: {
        amount: 302500,
        total: 1500000,
        percentage: 20.17
      },
      balanceToBePaid: {
        amount: 18000,
        total: 302500,
        percentage: 5.95
      },
      entries: []
    },
    dashboard: {
      totalBudget: 1500000,
      totalSpent: 302500,
      totalBalance: 1197500,
      recentTransactions: [],
      aggregatedItems: {}
    }
  });

  // Fetch daily report entries from API on mount — filtered by selectedProject
  useEffect(() => {
    const fetchDailyReportEntries = async () => {
      try {
        const data = await dailyReportService.getAll(selectedProject?.id);
        // dailyReportService uses fetch wrapper — returns response.json() directly
        // backend returns array directly (not wrapped in { data: [] })
        const rows = Array.isArray(data) ? data : [];

        const mapped = rows.map((row, idx) => ({
          id: row?.id,
          no: String(idx + 1).padStart(2, '0'),
          drNo: row?.material_dr_number ?? '-',
          particulars: row?.particulars ?? '',
          date: row?.date ? String(row.date).split('T')[0] : '',
          amount: Number(row?.amount ?? 0),
          paid: Number(row?.paid ?? 0),
          balance: Number(row?.balance ?? 0),
          unit: row?.units ?? row?.unit ?? '',
          quantity: Number(row?.quantity ?? 0),
          received: Number(row?.received_quantity ?? 0),
          consumed: Number(row?.consumed_quantity ?? 0),
          remarks: row?.remarks ?? ''
        }));

        // Recalculate budgetSpent and balanceToBePaid from real data
        const totalAmount = mapped.reduce((sum, e) => sum + e.amount, 0);
        const totalBalance = mapped.reduce((sum, e) => sum + e.balance, 0);
        const budgetTotal = 1500000; // keep existing total budget

        setAppData(prev => ({
          ...prev,
          dailyReport: {
            ...prev.dailyReport,
            entries: mapped,
            budgetSpent: {
              amount: totalAmount,
              total: budgetTotal,
              percentage: Number(((totalAmount / budgetTotal) * 100).toFixed(2))
            },
            balanceToBePaid: {
              amount: totalBalance,
              total: totalAmount,
              percentage: totalAmount > 0 ? Number(((totalBalance / totalAmount) * 100).toFixed(2)) : 0
            }
          }
        }));
      } catch (e) {
        console.error("[AppContext] fetchDailyReportEntries error:", e);
        // On error keep entries as empty — no mock fallback
        setAppData(prev => ({
          ...prev,
          dailyReport: {
            ...prev.dailyReport,
            entries: []
          }
        }));
      }
    };

    fetchDailyReportEntries();
  }, [selectedProject?.id]);

  // Memoize aggregateTransactions function
  const aggregateTransactions = useCallback((entries) => {
    const aggregated = entries.reduce((acc, entry) => {
      const key = entry.particulars.toLowerCase();
      
      if (!acc[key]) {
        acc[key] = {
          particulars: entry.particulars,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          totalQuantity: 0,
          unit: entry.unit,
          lastUpdated: entry.date,
          transactions: []
        };
      }

      acc[key].totalAmount += entry.amount;
      acc[key].totalPaid += entry.paid;
      acc[key].totalBalance += entry.balance;
      acc[key].totalQuantity += entry.quantity;
      acc[key].lastUpdated = entry.date;
      acc[key].transactions.push({
        date: entry.date,
        amount: entry.amount,
        paid: entry.paid,
        balance: entry.balance,
        quantity: entry.quantity
      });

      return acc;
    }, {});

    return Object.values(aggregated)
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 5);
  }, []);

  // Memoize updateDailyReport function
  const updateDailyReport = useCallback((newEntry) => {
    setAppData(prevData => {
      const updatedEntries = [...prevData.dailyReport.entries];
      
      if (newEntry.isNew) {
        const nextNo = (updatedEntries.length + 1).toString().padStart(2, '0');
        updatedEntries.push({
          ...newEntry,
          no: nextNo,
          date: new Date(newEntry.date).toLocaleDateString('en-GB')
        });
      }
      
      const totalAmount = updatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const totalBalance = updatedEntries.reduce((sum, entry) => sum + entry.balance, 0);
      
      const aggregatedTransactions = aggregateTransactions(updatedEntries);
      
      return {
        ...prevData,
        dailyReport: {
          ...prevData.dailyReport,
          entries: updatedEntries,
          budgetSpent: {
            amount: totalAmount,
            total: prevData.dailyReport.budgetSpent.total,
            percentage: ((totalAmount / prevData.dailyReport.budgetSpent.total) * 100).toFixed(2)
          },
          balanceToBePaid: {
            amount: totalBalance,
            total: totalAmount,
            percentage: totalAmount > 0 ? ((totalBalance / totalAmount) * 100).toFixed(2) : 0
          }
        },
        dashboard: {
          ...prevData.dashboard,
          totalSpent: totalAmount,
          totalBalance: prevData.dashboard.totalBudget - totalAmount,
          recentTransactions: aggregatedTransactions,
          aggregatedItems: aggregatedTransactions.reduce((acc, item) => {
            acc[item.particulars.toLowerCase()] = item;
            return acc;
          }, {})
        }
      };
    });
  }, [aggregateTransactions]);

  // Memoize updateDashboard function
  const updateDashboard = useCallback((newData) => {
    setAppData(prevData => ({
      ...prevData,
      dashboard: {
        ...prevData.dashboard,
        ...newData
      }
    }));
  }, []);

  // Memoize initial data processing
  useEffect(() => {
    const aggregatedTransactions = aggregateTransactions(appData.dailyReport.entries);
    const aggregatedItems = aggregatedTransactions.reduce((acc, item) => {
      acc[item.particulars.toLowerCase()] = item;
      return acc;
    }, {});
    
    updateDashboard({
      recentTransactions: aggregatedTransactions,
      aggregatedItems
    });
  }, [appData.dailyReport.entries, aggregateTransactions]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    appData,
    updateDailyReport,
    updateDashboard
  }), [appData, updateDailyReport, updateDashboard]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};