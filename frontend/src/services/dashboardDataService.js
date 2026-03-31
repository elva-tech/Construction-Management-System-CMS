// Dashboard Data Service - Generates unique dashboard data for each project

const generateProjectDashboardData = (project) => {
  if (!project) return null;

  // Generate unique data based on project characteristics
  const projectId = project.id;
  const completion = project.completion;
  const budgetValue = parseFloat(project.budget.replace(/[₹\s,Cr]/g, '')) * 10000000; // Convert Cr to actual value
  
  // Use project ID and completion to generate realistic variations
  const seed = projectId * 1000 + completion;
  
  // Helper function to generate consistent random values based on seed
  const seededRandom = (min, max, offset = 0) => {
    const x = Math.sin((seed + offset) * 12.9898) * 43758.5453;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  // Generate installments based on project size and completion
  const totalInstallments = seededRandom(3, 8);
  const currentInstallments = Math.floor((completion / 100) * totalInstallments);

  // Generate payment data based on budget and completion
  const totalPayments = Math.floor(budgetValue / 1000000); // Convert to lakhs
  const currentPayments = Math.floor((completion / 100) * totalPayments);
  const paymentsDonePercentage = Math.floor((currentPayments / totalPayments) * 100);

  // Generate expected payments based on project status
  const expectedPayments = project.status === 'Completed' ? 100 : seededRandom(60, 90);

  // Generate budget spent data
  const budgetSpentAmount = Math.floor((completion / 100) * budgetValue);
  const budgetSpentPercentage = completion;

  // Generate balance data
  const balanceAmount = budgetSpentAmount - (currentPayments * 1000000);
  const balanceToBePaidPercentage = Math.floor((balanceAmount / budgetSpentAmount) * 100);

  // Generate existing balance
  const existingBalance = (totalPayments - currentPayments).toFixed(2);

  return {
    project: project,
    totalInstallments: { 
      current: currentInstallments, 
      total: totalInstallments 
    },
    paymentsDone: { 
      current: currentPayments, 
      total: totalPayments 
    },
    paymentsDonePercentage: paymentsDonePercentage,
    expectedPayments: expectedPayments,
    existingBalance: existingBalance,
    budgetSpent: { 
      current: budgetSpentAmount, 
      total: budgetValue 
    },
    balanceToBePaid: { 
      current: Math.abs(balanceAmount), 
      total: budgetSpentAmount 
    },
    budgetSpentPercentage: budgetSpentPercentage,
    balanceToBePaidPercentage: Math.abs(balanceToBePaidPercentage),
  };
};

const generateMonthlyData = (project) => {
  if (!project) return [];

  const projectId = project.id;
  const completion = project.completion;
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return months.map((month, index) => {
    // Generate data based on project progress and seasonality
    const seed = projectId * 100 + index;
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    const random = x - Math.floor(x);
    
    // Higher values for active projects, seasonal variations
    const baseReceived = project.status === 'Active' ? 40 : 20;
    const baseMade = project.status === 'Active' ? 25 : 15;
    
    // Add seasonal variation (higher in middle months)
    const seasonalMultiplier = 0.8 + 0.4 * Math.sin((index / 12) * 2 * Math.PI);
    
    const paymentsReceived = Math.floor((baseReceived + random * 60) * seasonalMultiplier);
    const paymentsMade = Math.floor((baseMade + random * 40) * seasonalMultiplier);
    
    return {
      month,
      paymentsReceived,
      paymentsMade
    };
  });
};

const generateStatisticsData = (project) => {
  if (!project) return [];

  const projectId = project.id;
  const completion = project.completion;
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return months.map((month, index) => {
    const seed = projectId * 200 + index;
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    const random = x - Math.floor(x);
    
    // Generate progressive data showing project evolution
    const progressFactor = (index + 1) / 12;
    const completionFactor = completion / 100;
    
    const paymentsMade = Math.floor(20 + random * 60 * progressFactor * completionFactor);
    const expectedPayments = Math.floor(30 + random * 50 * progressFactor);
    
    return {
      month,
      paymentsMade,
      expectedPayments
    };
  });
};

// Main function to get complete dashboard data for a project
export const getProjectDashboardData = (project) => {
  if (!project) {
    return {
      dashboardData: null,
      monthlyData: [],
      statisticsData: []
    };
  }

  return {
    dashboardData: generateProjectDashboardData(project),
    monthlyData: generateMonthlyData(project),
    statisticsData: generateStatisticsData(project)
  };
};

// Function to get project-specific insights
export const getProjectInsights = (project) => {
  if (!project) return [];

  const insights = [];
  
  if (project.completion < 30) {
    insights.push({
      type: 'warning',
      message: 'Project is in early stages. Monitor resource allocation closely.'
    });
  } else if (project.completion > 80) {
    insights.push({
      type: 'success',
      message: 'Project nearing completion. Prepare for final deliverables.'
    });
  }
  
  if (project.status === 'Active') {
    insights.push({
      type: 'info',
      message: 'Active project requiring regular monitoring and updates.'
    });
  }
  
  const budgetValue = parseFloat(project.budget.replace(/[₹\s,Cr]/g, ''));
  if (budgetValue > 10) {
    insights.push({
      type: 'info',
      message: 'High-value project. Ensure strict budget compliance.'
    });
  }
  
  return insights;
};

// Function to get project timeline data
export const getProjectTimeline = (project) => {
  if (!project) return [];

  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const now = new Date();
  
  const totalDuration = endDate - startDate;
  const elapsed = now - startDate;
  const timeProgress = Math.min((elapsed / totalDuration) * 100, 100);
  
  return {
    startDate: project.startDate,
    endDate: project.endDate,
    timeProgress: Math.floor(timeProgress),
    daysRemaining: Math.max(Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)), 0),
    isOverdue: now > endDate && project.status !== 'Completed'
  };
};

export default {
  getProjectDashboardData,
  getProjectInsights,
  getProjectTimeline
};
