
// Mock banking data based on the SQL schema

export interface Bank {
  bankId: number;
  bankName: string;
  bankMoney: number;
  noOfBranches: number;
}

export interface Branch {
  branchId: number;
  branchAdd: string;
  bankId: number;
  bankName?: string; // For joined data
}

export interface Account {
  accountNo: number;
  balance: number;
  userId: number;
  branchId: number;
  branchAddress?: string; // For joined data
}

export interface Loan {
  loanId: number;
  loanAmount: number;
  duration: number;
  interest: number;
  loanType: string;
  issueDate: string;
  userId: number;
  bankId: number;
  bankName?: string; // For joined data
}

export interface Transaction {
  transactionId: number;
  transactionAmount: number;
  transactionTime: string;
  branchId: number | null;
  accountNo1: number;
  accountNo2: number;
  branchAddress?: string; // For joined data
  fromAccount?: number;
  toAccount?: number;
}

export interface User {
  userId: number;
  name: string;
  address: string;
  mobileNumber: string;
}

export interface Employee {
  employeeId: number;
  name: string;
  branchId: number | null;
  branchAddress?: string; // For joined data
}

// Mock data
const banks: Bank[] = [
  { bankId: 1, bankName: 'RBI', bankMoney: 500000000.00, noOfBranches: 3 },
  { bankId: 2, bankName: 'Canera Bank', bankMoney: 75000000.00, noOfBranches: 2 },
  { bankId: 3, bankName: 'ICICI Bank', bankMoney: 60000000.00, noOfBranches: 1 },
  { bankId: 4, bankName: 'Axis Bank', bankMoney: 60000000.00, noOfBranches: 2 },
];

const branches: Branch[] = [
  { branchId: 1, branchAdd: 'Shahid Bhagat Singh Road, Mumbai, Maharashtra - 400001', bankId: 1 },
  { branchId: 2, branchAdd: '6, Sansad Marg, New Delhi, Delhi - 110001', bankId: 1 },
  { branchId: 3, branchAdd: '15, Netaji Subhas Road, Kolkata, West Bengal - 700001', bankId: 1 },
  { branchId: 4, branchAdd: 'No. 112, J.C. Road, Bengaluru, Karnataka - 560002', bankId: 2 },
  { branchId: 5, branchAdd: 'H-54, Connaught Circus, New Delhi, Delhi - 110001', bankId: 2 },
  { branchId: 6, branchAdd: 'E-7, Ground Floor, Nehru Place, New Delhi, Delhi - 110019', bankId: 3 },
  { branchId: 7, branchAdd: 'Shop No. 1, Ground Floor, Andheri West, Mumbai, Maharashtra - 400058', bankId: 4 },
  { branchId: 8, branchAdd: 'BD-20, Sector-1, Salt Lake City, Kolkata, West Bengal - 700064', bankId: 4 },
];

const users: User[] = [
  { userId: 1, name: 'Amit Sharma', address: '123 MG Road, Bengaluru, Karnataka - 560001', mobileNumber: '9876543210' },
  { userId: 2, name: 'Priya Singh', address: '456 Park Street, Kolkata, West Bengal - 700016', mobileNumber: '9123456789' },
  { userId: 3, name: 'Rahul Verma', address: '789 Nehru Place, New Delhi, Delhi - 110019', mobileNumber: '9988776655' },
  { userId: 4, name: 'Anjali Nair', address: '101 Marine Drive, Mumbai, Maharashtra - 400002', mobileNumber: '9765432109' },
  { userId: 5, name: 'Vikram Patel', address: '202 Anna Salai, Chennai, Tamil Nadu - 600002', mobileNumber: '9898989898' },
  { userId: 6, name: 'Sneha Gupta', address: '303 Banjara Hills, Hyderabad, Telangana - 500034', mobileNumber: '9876543211' },
  { userId: 7, name: 'Arjun Reddy', address: '404 Sector 17, Chandigarh - 160017', mobileNumber: '9123456790' },
  { userId: 8, name: 'Kavita Desai', address: '505 Connaught Place, New Delhi, Delhi - 110001', mobileNumber: '9988776656' },
  { userId: 9, name: 'Manish Kumar', address: '606 Juhu Beach, Mumbai, Maharashtra - 400049', mobileNumber: '9765432110' },
  { userId: 10, name: 'Pooja Joshi', address: '707 Salt Lake, Kolkata, West Bengal - 700091', mobileNumber: '9898989899' },
];

const employees: Employee[] = [
  { employeeId: 1, name: 'Rajesh Sharma', branchId: 1 },
  { employeeId: 2, name: 'Priya Singh', branchId: 1 },
  { employeeId: 3, name: 'Amit Kumar', branchId: 2 },
  { employeeId: 4, name: 'Neha Gupta', branchId: 2 },
  { employeeId: 5, name: 'Suresh Verma', branchId: 3 },
  { employeeId: 6, name: 'Anita Patel', branchId: 3 },
  { employeeId: 7, name: 'Vijay Reddy', branchId: 4 },
  { employeeId: 8, name: 'Sunita Rao', branchId: 4 },
  { employeeId: 9, name: 'Arun Joshi', branchId: 5 },
  { employeeId: 10, name: 'Kavita Nair', branchId: 5 },
  { employeeId: 11, name: 'Manoj Desai', branchId: 6 },
  { employeeId: 12, name: 'Rashmi Iyer', branchId: 6 },
  { employeeId: 13, name: 'Pankaj Mehta', branchId: 7 },
  { employeeId: 14, name: 'Sneha Chawla', branchId: 7 },
  { employeeId: 15, name: 'Rahul Bhatia', branchId: 8 },
  { employeeId: 16, name: 'Anjali Sinha', branchId: 8 },
];

const accounts: Account[] = [
  { accountNo: 1001, balance: 15000.00, userId: 1, branchId: 1 },
  { accountNo: 1002, balance: 25000.00, userId: 1, branchId: 2 },
  { accountNo: 1003, balance: 30000.00, userId: 2, branchId: 3 },
  { accountNo: 1004, balance: 20000.00, userId: 3, branchId: 4 },
  { accountNo: 1005, balance: 5000.00, userId: 3, branchId: 5 },
  { accountNo: 1006, balance: 12000.00, userId: 3, branchId: 6 },
  { accountNo: 1007, balance: 18000.00, userId: 4, branchId: 7 },
  { accountNo: 1008, balance: 22000.00, userId: 5, branchId: 8 },
  { accountNo: 1009, balance: 8000.00, userId: 5, branchId: 1 },
  { accountNo: 1010, balance: 16000.00, userId: 6, branchId: 2 },
  { accountNo: 1011, balance: 14000.00, userId: 7, branchId: 3 },
  { accountNo: 1012, balance: 9000.00, userId: 7, branchId: 4 },
  { accountNo: 1013, balance: 11000.00, userId: 7, branchId: 5 },
  { accountNo: 1014, balance: 13000.00, userId: 8, branchId: 6 },
];

const loans: Loan[] = [
  { loanId: 1, loanAmount: 500000.00, duration: 60, interest: 7.5, loanType: 'Home Loan', issueDate: '2024-01-15', userId: 1, bankId: 1 },
  { loanId: 2, loanAmount: 200000.00, duration: 36, interest: 8.0, loanType: 'Car Loan', issueDate: '2024-06-20', userId: 1, bankId: 1 },
  { loanId: 3, loanAmount: 150000.00, duration: 24, interest: 9.0, loanType: 'Personal Loan', issueDate: '2024-03-10', userId: 2, bankId: 2 },
  { loanId: 4, loanAmount: 300000.00, duration: 48, interest: 7.8, loanType: 'Education Loan', issueDate: '2023-09-05', userId: 3, bankId: 3 },
  { loanId: 5, loanAmount: 100000.00, duration: 12, interest: 10.0, loanType: 'Personal Loan', issueDate: '2024-02-14', userId: 3, bankId: 3 },
  { loanId: 6, loanAmount: 250000.00, duration: 36, interest: 8.5, loanType: 'Car Loan', issueDate: '2024-07-22', userId: 3, bankId: 3 },
  { loanId: 7, loanAmount: 400000.00, duration: 60, interest: 7.2, loanType: 'Home Loan', issueDate: '2023-11-30', userId: 4, bankId: 4 },
  { loanId: 8, loanAmount: 120000.00, duration: 24, interest: 9.5, loanType: 'Personal Loan', issueDate: '2024-05-18', userId: 5, bankId: 2 },
  { loanId: 9, loanAmount: 220000.00, duration: 36, interest: 8.3, loanType: 'Car Loan', issueDate: '2024-08-25', userId: 5, bankId: 2 },
];

const transactions: Transaction[] = [
  { transactionId: 1, transactionAmount: 500.00, transactionTime: '2025-02-01 10:15:00', branchId: 1, accountNo1: 1001, accountNo2: 1002 },
  { transactionId: 2, transactionAmount: 1500.00, transactionTime: '2025-02-02 11:00:00', branchId: 2, accountNo1: 1002, accountNo2: 1003 },
  { transactionId: 3, transactionAmount: 2000.00, transactionTime: '2025-02-03 09:30:00', branchId: 3, accountNo1: 1003, accountNo2: 1004 },
  { transactionId: 4, transactionAmount: 750.00, transactionTime: '2025-02-04 14:45:00', branchId: 3, accountNo1: 1003, accountNo2: 1001 },
  { transactionId: 5, transactionAmount: 1200.00, transactionTime: '2025-02-05 16:20:00', branchId: 4, accountNo1: 1004, accountNo2: 1005 },
  { transactionId: 6, transactionAmount: 300.00, transactionTime: '2025-02-06 12:10:00', branchId: 5, accountNo1: 1005, accountNo2: 1006 },
  { transactionId: 7, transactionAmount: 450.00, transactionTime: '2025-02-07 13:50:00', branchId: 6, accountNo1: 1006, accountNo2: 1007 },
  { transactionId: 8, transactionAmount: 800.00, transactionTime: '2025-02-08 15:30:00', branchId: 7, accountNo1: 1007, accountNo2: 1008 },
  { transactionId: 9, transactionAmount: 950.00, transactionTime: '2025-02-09 10:05:00', branchId: 8, accountNo1: 1008, accountNo2: 1009 },
  { transactionId: 10, transactionAmount: 1100.00, transactionTime: '2025-02-10 11:25:00', branchId: 1, accountNo1: 1009, accountNo2: 1010 },
  { transactionId: 11, transactionAmount: 1300.00, transactionTime: '2025-02-11 14:15:00', branchId: 2, accountNo1: 1010, accountNo2: 1011 },
  { transactionId: 12, transactionAmount: 700.00, transactionTime: '2025-02-12 09:45:00', branchId: 3, accountNo1: 1011, accountNo2: 1012 },
  { transactionId: 13, transactionAmount: 400.00, transactionTime: '2025-02-13 16:35:00', branchId: 4, accountNo1: 1012, accountNo2: 1013 },
  { transactionId: 14, transactionAmount: 600.00, transactionTime: '2025-02-14 13:25:00', branchId: 5, accountNo1: 1013, accountNo2: 1014 },
  { transactionId: 15, transactionAmount: 550.00, transactionTime: '2025-02-15 12:00:00', branchId: 6, accountNo1: 1014, accountNo2: 1001 },
];

// Helper functions for database operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
// These functions simulate API calls with a small delay to mimic network requests
export const mockDBService = {
  // User related queries
  getUserById: async (userId: number): Promise<User | undefined> => {
    await delay(300);
    return users.find(user => user.userId === userId);
  },
  
  getAllUsers: async (): Promise<User[]> => {
    await delay(500);
    return [...users];
  },
  
  // Account related queries
  getAccountsByUserId: async (userId: number): Promise<Account[]> => {
    await delay(400);
    return accounts
      .filter(account => account.userId === userId)
      .map(account => {
        const branch = branches.find(b => b.branchId === account.branchId);
        return {
          ...account,
          branchAddress: branch ? branch.branchAdd : 'Unknown Branch'
        };
      });
  },
  
  getAllAccounts: async (): Promise<Account[]> => {
    await delay(500);
    return accounts.map(account => {
      const branch = branches.find(b => b.branchId === account.branchId);
      return {
        ...account,
        branchAddress: branch ? branch.branchAdd : 'Unknown Branch'
      };
    });
  },
  
  // Transaction related queries
  getTransactionsByAccountNo: async (accountNo: number): Promise<Transaction[]> => {
    await delay(500);
    return transactions
      .filter(tx => tx.accountNo1 === accountNo || tx.accountNo2 === accountNo)
      .map(tx => {
        const branch = branches.find(b => b.branchId === tx.branchId);
        return {
          ...tx,
          branchAddress: branch ? branch.branchAdd : 'Unknown Branch',
          fromAccount: tx.accountNo1,
          toAccount: tx.accountNo2
        };
      })
      .sort((a, b) => new Date(b.transactionTime).getTime() - new Date(a.transactionTime).getTime());
  },
  
  getAllTransactions: async (): Promise<Transaction[]> => {
    await delay(600);
    return transactions.map(tx => {
      const branch = branches.find(b => b.branchId === tx.branchId);
      return {
        ...tx,
        branchAddress: branch ? branch.branchAdd : 'Unknown Branch',
        fromAccount: tx.accountNo1,
        toAccount: tx.accountNo2
      };
    }).sort((a, b) => new Date(b.transactionTime).getTime() - new Date(a.transactionTime).getTime());
  },
  
  // Loan related queries
  getLoansByUserId: async (userId: number): Promise<Loan[]> => {
    await delay(400);
    return loans
      .filter(loan => loan.userId === userId)
      .map(loan => {
        const bank = banks.find(b => b.bankId === loan.bankId);
        return {
          ...loan,
          bankName: bank ? bank.bankName : 'Unknown Bank'
        };
      });
  },
  
  getAllLoans: async (): Promise<Loan[]> => {
    await delay(500);
    return loans.map(loan => {
      const bank = banks.find(b => b.bankId === loan.bankId);
      return {
        ...loan,
        bankName: bank ? bank.bankName : 'Unknown Bank'
      };
    });
  },
  
  // Employee related queries
  getEmployeeById: async (employeeId: number): Promise<Employee | undefined> => {
    await delay(300);
    const employee = employees.find(emp => emp.employeeId === employeeId);
    if (employee && employee.branchId) {
      const branch = branches.find(b => b.branchId === employee.branchId);
      return {
        ...employee,
        branchAddress: branch ? branch.branchAdd : 'Unknown Branch'
      };
    }
    return employee;
  },
  
  getAllEmployees: async (): Promise<Employee[]> => {
    await delay(500);
    return employees.map(employee => {
      if (employee.branchId) {
        const branch = branches.find(b => b.branchId === employee.branchId);
        return {
          ...employee,
          branchAddress: branch ? branch.branchAdd : 'Unknown Branch'
        };
      }
      return employee;
    });
  },
  
  // Branch related queries
  getBranchById: async (branchId: number): Promise<Branch | undefined> => {
    await delay(300);
    const branch = branches.find(b => b.branchId === branchId);
    if (branch) {
      const bank = banks.find(b => b.bankId === branch.bankId);
      return {
        ...branch,
        bankName: bank ? bank.bankName : 'Unknown Bank'
      };
    }
    return branch;
  },
  
  getAllBranches: async (): Promise<Branch[]> => {
    await delay(400);
    return branches.map(branch => {
      const bank = banks.find(b => b.bankId === branch.bankId);
      return {
        ...branch,
        bankName: bank ? bank.bankName : 'Unknown Bank'
      };
    });
  },
  
  // Bank related queries
  getBankById: async (bankId: number): Promise<Bank | undefined> => {
    await delay(300);
    return banks.find(bank => bank.bankId === bankId);
  },
  
  getAllBanks: async (): Promise<Bank[]> => {
    await delay(400);
    return [...banks];
  },
  
  // SQL query executor - for employee dashboard
  executeQuery: async (query: string): Promise<any[]> => {
    await delay(800);
    
    const queryLower = query.toLowerCase();
    
    // Here we'll provide a few canned responses for common queries
    if (queryLower.includes('select * from bank')) {
      return banks;
    } 
    else if (queryLower.includes('select * from branch')) {
      return branches;
    }
    else if (queryLower.includes('select * from employee')) {
      return employees;
    }
    else if (queryLower.includes('select * from users')) {
      return users;
    }
    else if (queryLower.includes('select * from account')) {
      return accounts;
    }
    else if (queryLower.includes('select * from loan')) {
      return loans;
    }
    else if (queryLower.includes('select * from transaction_history')) {
      return transactions;
    }
    else if (queryLower.includes('count') && queryLower.includes('from loan')) {
      return [{ count: loans.length }];
    }
    else if (queryLower.includes('sum') && queryLower.includes('from account')) {
      return [{ total_balance: accounts.reduce((sum, acc) => sum + acc.balance, 0) }];
    }
    else if (queryLower.includes('join') && queryLower.includes('users') && queryLower.includes('account')) {
      // Simulate a join query between users and accounts
      return accounts.map(account => {
        const user = users.find(u => u.userId === account.userId);
        return {
          accountNo: account.accountNo,
          balance: account.balance,
          userId: account.userId,
          userName: user?.name || 'Unknown',
          address: user?.address || 'Unknown',
          mobileNumber: user?.mobileNumber || 'Unknown'
        };
      });
    }
    else if (queryLower.includes('avg') && queryLower.includes('balance')) {
      return [{ average_balance: accounts.reduce((sum, acc) => sum + acc.balance, 0) / accounts.length }];
    }
    else if (queryLower.includes('max') && queryLower.includes('loan')) {
      return [{ max_loan: Math.max(...loans.map(loan => loan.loanAmount)) }];
    }
    else if (queryLower.includes('count') && queryLower.includes('group by')) {
      // Simulate a count with group by
      if (queryLower.includes('branchid')) {
        const branchCounts: Record<number, number> = {};
        accounts.forEach(acc => {
          branchCounts[acc.branchId] = (branchCounts[acc.branchId] || 0) + 1;
        });
        return Object.entries(branchCounts).map(([branchId, count]) => ({
          branchId: parseInt(branchId),
          accountCount: count
        }));
      }
    }
    
    // Generic fallback for unrecognized queries
    return [{ message: "Query executed successfully. No specific result handler for this query type." }];
  }
};
