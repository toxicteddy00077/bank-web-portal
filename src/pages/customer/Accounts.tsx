
import { useEffect, useState } from "react";
import CustomerLayout from "@/components/CustomerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Building2 } from "lucide-react";
import { mockDBService, Account } from "@/services/mockDatabaseService";
import { formatCurrency } from "@/utils/formatters";

const CustomerAccounts = () => {
  const { customerData } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (customerData?.userId) {
        setIsLoading(true);
        try {
          const accountsData = await mockDBService.getAccountsByUserId(customerData.userId);
          setAccounts(accountsData);
        } catch (error) {
          console.error("Error fetching accounts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAccounts();
  }, [customerData?.userId]);

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <CustomerLayout currentTab="accounts">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Accounts</h2>
          <p className="text-muted-foreground">Manage and view all your bank accounts</p>
        </div>

        {/* Summary Card */}
        <Card className="bank-card text-white overflow-hidden">
          <div className="card-pattern"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Accounts Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm opacity-80">Total Balance</div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
                )}
              </div>
              
              <div>
                <div className="text-sm opacity-80">Number of Accounts</div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">{accounts.length}</div>
                )}
              </div>

              <div>
                <div className="text-sm opacity-80">Average Balance</div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">
                    {formatCurrency(accounts.length > 0 ? totalBalance / accounts.length : 0)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accounts List */}
        <Card className="border-bank-blue/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-bank-blue" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : accounts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.accountNo}>
                      <TableCell className="font-medium">{account.accountNo}</TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{account.branchAddress}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(account.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                No accounts found. Please contact your branch to open an account.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Features */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-bank-blue/20">
            <CardHeader>
              <CardTitle className="text-lg">24/7 Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access your accounts anytime, anywhere through our secure online banking portal.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-bank-blue/20">
            <CardHeader>
              <CardTitle className="text-lg">Secure Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All your transactions are protected with advanced encryption and security measures.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-bank-blue/20">
            <CardHeader>
              <CardTitle className="text-lg">Account Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our customer support team is available to assist you with any account-related queries.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerAccounts;
