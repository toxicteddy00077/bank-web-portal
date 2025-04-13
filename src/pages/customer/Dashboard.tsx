
import { useEffect, useState } from "react";
import CustomerLayout from "@/components/CustomerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDBService, Account, Loan, Transaction } from "@/services/mockDatabaseService";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Landmark, History, TrendingUp, User, Phone, MapPin } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const CustomerDashboard = () => {
  const { customerData } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (customerData?.userId) {
        setIsLoading(true);
        try {
          // Fetch account data
          const accountsData = await mockDBService.getAccountsByUserId(customerData.userId);
          setAccounts(accountsData);
          
          // Fetch loan data
          const loansData = await mockDBService.getLoansByUserId(customerData.userId);
          setLoans(loansData);
          
          // Fetch recent transactions for the first account
          if (accountsData.length > 0) {
            const txData = await mockDBService.getTransactionsByAccountNo(accountsData[0].accountNo);
            setRecentTransactions(txData.slice(0, 5)); // Get only the 5 most recent
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [customerData?.userId]);

  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate total loan amount
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.loanAmount, 0);

  return (
    <CustomerLayout currentTab="dashboard">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome, {customerData?.name}</h2>
          <p className="text-muted-foreground">Here's an overview of your accounts and recent activity</p>
        </div>

        {/* Customer information card */}
        <Card className="border-bank-blue/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={18} className="text-bank-blue" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="font-medium">{customerData?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Mobile:</span>
                <span className="font-medium">{customerData?.mobileNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Address:</span>
                <span className="font-medium truncate" title={customerData?.address}>
                  {customerData?.address}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Total Balance Card */}
          <Card className="bank-card text-white overflow-hidden relative">
            <div className="card-pattern"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard size={18} />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-32 bg-white/20" />
              ) : (
                <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
              )}
              <div className="text-sm opacity-80 mt-1">Across {accounts.length} accounts</div>
            </CardContent>
          </Card>

          {/* Total Loans Card */}
          <Card className="border-bank-blue/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Landmark size={18} className="text-bank-blue" />
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <div className="text-2xl font-bold">{formatCurrency(totalLoanAmount)}</div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                {loans.length} active {loans.length === 1 ? 'loan' : 'loans'}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="border-bank-blue/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <History size={18} className="text-bank-blue" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <div className="text-2xl font-bold">{recentTransactions.length}</div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                Recent transactions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-bank-blue" />
            Your Accounts
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : accounts.length > 0 ? (
            <div className="space-y-3">
              {accounts.map((account) => (
                <Card key={account.accountNo} className="border-bank-blue/20 hover:border-bank-blue/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Account #{account.accountNo}</div>
                        <div className="text-sm text-muted-foreground">{account.branchAddress}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(account.balance)}</div>
                        <div className="text-xs text-muted-foreground">Current Balance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-muted">
              <CardContent className="p-6 text-center text-muted-foreground">
                No accounts found for this user.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Transactions section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <History size={20} className="text-bank-blue" />
            Recent Transactions
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : recentTransactions.length > 0 ? (
            <Card className="border-bank-blue/20">
              <div className="divide-y">
                {recentTransactions.map((tx) => (
                  <div key={tx.transactionId} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        Transaction #{tx.transactionId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.transactionTime).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold">
                          {formatCurrency(tx.transactionAmount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tx.fromAccount === accounts[0]?.accountNo ? 'Sent' : 'Received'}
                        </div>
                      </div>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        tx.fromAccount === accounts[0]?.accountNo 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        <TrendingUp size={16} className={
                          tx.fromAccount === accounts[0]?.accountNo ? 'rotate-45' : 'rotate-[135deg]'
                        } />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="border-dashed border-muted">
              <CardContent className="p-6 text-center text-muted-foreground">
                No recent transactions found.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
