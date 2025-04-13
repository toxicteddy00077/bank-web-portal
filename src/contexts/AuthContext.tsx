
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";

// Defining user types and data structures
export type UserRole = 'customer' | 'employee' | null;

interface User {
  id: number;
  name: string;
  role: UserRole;
}

interface CustomerData {
  userId: number;
  name: string;
  address: string;
  mobileNumber: string;
}

interface EmployeeData {
  employeeId: number;
  name: string;
  branchId: number;
}

interface AuthContextType {
  user: User | null;
  customerData: CustomerData | null;
  employeeData: EmployeeData | null;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Mock data for customer users
const MOCK_CUSTOMERS = [
  { id: 1, username: 'amit', password: 'password', userId: 1, name: 'Amit Sharma', address: '123 MG Road, Bengaluru, Karnataka - 560001', mobileNumber: '9876543210' },
  { id: 2, username: 'priya', password: 'password', userId: 2, name: 'Priya Singh', address: '456 Park Street, Kolkata, West Bengal - 700016', mobileNumber: '9123456789' },
  { id: 3, username: 'rahul', password: 'password', userId: 3, name: 'Rahul Verma', address: '789 Nehru Place, New Delhi, Delhi - 110019', mobileNumber: '9988776655' },
];

// Mock data for employee users
const MOCK_EMPLOYEES = [
  { id: 1, username: 'rajesh', password: 'password', employeeId: 1, name: 'Rajesh Sharma', branchId: 1 },
  { id: 2, username: 'priya_e', password: 'password', employeeId: 2, name: 'Priya Singh', branchId: 1 },
  { id: 3, username: 'amit_e', password: 'password', employeeId: 3, name: 'Amit Kumar', branchId: 2 },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);

  // Simulate login - in a real app, this would call an API
  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (role === 'customer') {
        const customer = MOCK_CUSTOMERS.find(c => c.username === username && c.password === password);
        if (customer) {
          setUser({
            id: customer.id,
            name: customer.name,
            role: 'customer'
          });
          setCustomerData({
            userId: customer.userId,
            name: customer.name,
            address: customer.address,
            mobileNumber: customer.mobileNumber
          });
          toast.success("Login successful!");
          return true;
        }
      } else if (role === 'employee') {
        const employee = MOCK_EMPLOYEES.find(e => e.username === username && e.password === password);
        if (employee) {
          setUser({
            id: employee.id,
            name: employee.name,
            role: 'employee'
          });
          setEmployeeData({
            employeeId: employee.employeeId,
            name: employee.name,
            branchId: employee.branchId
          });
          toast.success("Login successful!");
          return true;
        }
      }
      
      toast.error("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCustomerData(null);
    setEmployeeData(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerData,
        employeeData,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
