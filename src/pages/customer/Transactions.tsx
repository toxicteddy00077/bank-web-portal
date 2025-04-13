
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { History, TrendingUp, ArrowUpDown } from "lucide-react";
import { mockDBService, Transaction, Account } from "@/services/mockDatabaseService";
import { formatCurrency } from "@/utils/formatters";

const CustomerTransactions = () => {
  const { customerData } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (customerData?.userId) {
        setIsLoading(true);
        try {
          const accountsData = await mockDBService.getAccountsByUserId(customerData.userId);
          setAccounts(accountsData);
          
          // Set the first account as default selected
          if (accountsData.length > 0 && !selectedAccount) {
            setSelectedAccount(accountsData[0].accountNo);
          }
        } catch (error) {
          console.error("Error fetching accounts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAccounts();
  }, [customerData?.userId, selectedAccount]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (selectedAccount) {
        setIsLoading(true);
        try {
          const txData = await mockDBService.getTransactionsByAccountNo(selectedAccount);
          setTransactions(txData);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchTransactions();
  }, [selectedAccount]);

  // Calculate total sent and received
  const totalSent = transactions
    .filter(tx => tx.accountNo1 === selectedAccount)
    .reduce((sum, tx) => sum + tx.transactionAmount, 0);
    
  const totalReceived = transactions
    .filter(tx => tx.accountNo2 === selectedAccount)
    .reduce((sum, tx) => sum + tx.transactionAmount, 0);

  return (
    <CustomerLayout currentTab="transactions">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Transaction History</h2>
          <p className="text-muted-foreground">View and track all your account transactions</p>
        </div>

        {/* Account Selector */}
        <Card className="border-bank-blue/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-bank-blue" />
              Select Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !selectedAccount ? (
              <Skeleton className="h-10 w-full" />
            ) : accounts.length > 0 ? (
              <Select
                value={selectedAccount?.toString() || ""}
                onValueChange={(value) => setSelectedAccount(parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem 
                      key={account.accountNo} 
                      value={account.accountNo.toString()}
                    >
                      Account #{account.accountNo} ({formatCurrency(account.balance)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-muted-foreground">No accounts found</div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        {selectedAccount && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card className="border-bank-blue/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-bank-blue" />
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-2xl font-bold">{transactions.length}</div>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  All transactions for this account
                </div>
              </CardContent>
            </Card>

            <Card className="border-bank-blue/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <TrendingUp className="h-5 w-5 rotate-45" />
                  Total Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-destructive">
                    {formatCurrency(totalSent)}
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  Outgoing transactions
                </div>
              </CardContent>
            </Card>

            <Card className="border-bank-blue/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5 rotate-[135deg]" />
                  Total Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalReceived)}
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  Incoming transactions
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions List */}
        {selectedAccount && (
          <Card className="border-bank-blue/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-bank-blue" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : transactions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => {
                        const isSending = tx.accountNo1 === selectedAccount;
                        return (
                          <TableRow key={tx.transactionId}>
                            <TableCell className="font-medium">#{tx.transactionId}</TableCell>
                            <TableCell>{new Date(tx.transactionTime).toLocaleString()}</TableCell>
                            <TableCell>
                              <div className={`flex items-center gap-1 ${
                                isSending ? 'text-destructive' : 'text-green-600'
                              }`}>
                                <TrendingUp className={`h-4 w-4 ${isSending ? 'rotate-45' : 'rotate-[135deg]'}`} />
                                <span>{isSending ? 'Sent' : 'Received'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {isSending 
                                  ? `To: Account #${tx.accountNo2}`
                                  : `From: Account #${tx.accountNo1}`}
                              </div>
                            </TableCell>
                            <TableCell 
                              className={`text-right font-bold ${
                                isSending ? 'text-destructive' : 'text-green-600'
                              }`}
                            >
                              {isSending ? '- ' : '+ '}
                              {formatCurrency(tx.transactionAmount)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  No transactions found for this account.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerTransactions;
