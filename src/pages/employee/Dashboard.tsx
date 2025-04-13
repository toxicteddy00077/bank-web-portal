
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import EmployeeLayout from "@/components/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  CreditCard, 
  Landmark, 
  Building2,
  BarChart3
} from "lucide-react";
import { mockDBService, User, Account, Loan, Branch } from "@/services/mockDatabaseService";
import { formatCurrency } from "@/utils/formatters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const EmployeeDashboard = () => {
  const { employeeData } = useAuth();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [accountCount, setAccountCount] = useState<number | null>(null);
  const [loanCount, setLoanCount] = useState<number | null>(null);
  const [branchCount, setBranchCount] = useState<number | null>(null);
  const [loansByType, setLoansByType] = useState<any[]>([]);
  const [accountsByBranch, setAccountsByBranch] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all necessary data
        const [users, accounts, loans, branches] = await Promise.all([
          mockDBService.getAllUsers(),
          mockDBService.getAllAccounts(),
          mockDBService.getAllLoans(),
          mockDBService.getAllBranches(),
        ]);
        
        setUserCount(users.length);
        setAccountCount(accounts.length);
        setLoanCount(loans.length);
        setBranchCount(branches.length);
        
        // Process loan data for chart
        const loanTypeMap: Record<string, number> = {};
        loans.forEach(loan => {
          loanTypeMap[loan.loanType] = (loanTypeMap[loan.loanType] || 0) + 1;
        });
        
        const loanChartData = Object.keys(loanTypeMap).map(type => ({
          name: type,
          value: loanTypeMap[type]
        }));
        setLoansByType(loanChartData);
        
        // Process account data by branch
        const branchMap: Record<number, { name: string; accounts: number; totalBalance: number }> = {};
        
        branches.forEach(branch => {
          branchMap[branch.branchId] = {
            name: `Branch ${branch.branchId}`,
            accounts: 0,
            totalBalance: 0
          };
        });
        
        accounts.forEach(account => {
          if (branchMap[account.branchId]) {
            branchMap[account.branchId].accounts += 1;
            branchMap[account.branchId].totalBalance += account.balance;
          }
        });
        
        const accountChartData = Object.values(branchMap).map(item => ({
          name: item.name,
          accounts: item.accounts,
          balance: item.totalBalance
        }));
        
        setAccountsByBranch(accountChartData);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <EmployeeLayout currentTab="dashboard">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Overview of the banking system</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-bank-navy" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold">{userCount}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-bank-navy" />
                Total Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold">{accountCount}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-bank-navy" />
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold">{loanCount}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-bank-navy" />
                Branches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl font-bold">{branchCount}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Accounts by Branch Chart */}
          <Card className="border-bank-navy/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-bank-navy" />
                Accounts by Branch
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accountsByBranch}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === "balance" ? formatCurrency(value as number) : value, 
                        name === "balance" ? "Total Balance" : "Number of Accounts"
                      ]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="accounts" 
                      fill="#0A4B94" 
                      name="Number of Accounts"
                    />
                    <Bar 
                      dataKey="balance" 
                      fill="#3563E9" 
                      name="Total Balance"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Loans by Type Chart */}
          <Card className="border-bank-navy/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-bank-navy" />
                Loans by Type
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loansByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {loansByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} loans`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
