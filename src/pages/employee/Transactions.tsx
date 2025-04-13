
import { useEffect, useState } from "react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  History, 
  Search, 
  Calendar, 
  Building2,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { mockDBService, Transaction } from "@/services/mockDatabaseService";
import { formatCurrency } from "@/utils/formatters";

const EmployeeTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const transactionsData = await mockDBService.getAllTransactions();
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on search query
    if (searchQuery.trim() === "") {
      setFilteredTransactions(transactions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = transactions.filter(
        tx => 
          tx.transactionId.toString().includes(query) ||
          tx.accountNo1.toString().includes(query) ||
          tx.accountNo2.toString().includes(query) ||
          tx.transactionAmount.toString().includes(query) ||
          (tx.branchAddress && tx.branchAddress.toLowerCase().includes(query))
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);

  // Calculate total transaction amount
  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.transactionAmount, 0);

  return (
    <EmployeeLayout currentTab="transactions">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Transaction History</h2>
          <p className="text-muted-foreground">Monitor and analyze all banking transactions</p>
        </div>

        {/* Search and filters */}
        <Card className="border-bank-navy/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-bank-navy" />
              Search Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Search by ID, amount, account number, or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transaction summary */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-bank-navy" />
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{filteredTransactions.length}</div>
              )}
              {searchQuery && (
                <div className="text-sm text-muted-foreground">
                  (filtered from {transactions.length} total transactions)
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-bank-navy" />
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              )}
              <div className="text-sm text-muted-foreground">Total transaction volume</div>
            </CardContent>
          </Card>

          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-bank-navy" />
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : transactions.length > 0 ? (
                <div className="text-lg font-medium">
                  {new Date(transactions[transactions.length - 1].transactionTime).toLocaleDateString()} - {new Date(transactions[0].transactionTime).toLocaleDateString()}
                </div>
              ) : (
                <div className="text-lg">No data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="border-bank-navy/20">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : filteredTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>From Account</TableHead>
                    <TableHead>To Account</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.transactionId}>
                      <TableCell className="font-medium">#{tx.transactionId}</TableCell>
                      <TableCell>
                        <div>{new Date(tx.transactionTime).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.transactionTime).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>#{tx.accountNo1}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>#{tx.accountNo2}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {tx.branchId ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>Branch #{tx.branchId}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Online</span>
                        )}
                        {tx.branchAddress && (
                          <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                            {tx.branchAddress}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(tx.transactionAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No transactions found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTransactions;
