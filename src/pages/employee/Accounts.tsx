
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
import { CreditCard, Search, Building2, User } from "lucide-react";
import { mockDBService, Account, User as UserType, Branch } from "@/services/mockDatabaseService";
import { formatCurrency } from "@/utils/formatters";

// Enhanced account type with joined data
interface EnhancedAccount extends Account {
  userName: string;
  branchName: string;
}

const EmployeeAccounts = () => {
  const [accounts, setAccounts] = useState<EnhancedAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<EnhancedAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        // Fetch accounts, users, and branches
        const [accountsData, usersData, branchesData] = await Promise.all([
          mockDBService.getAllAccounts(),
          mockDBService.getAllUsers(),
          mockDBService.getAllBranches()
        ]);
        
        // Create a map for quick lookup
        const userMap = new Map<number, UserType>();
        usersData.forEach(user => userMap.set(user.userId, user));
        
        const branchMap = new Map<number, Branch>();
        branchesData.forEach(branch => branchMap.set(branch.branchId, branch));
        
        // Enhance accounts with user and branch data
        const enhancedAccounts = accountsData.map(account => {
          const user = userMap.get(account.userId);
          const branch = branchMap.get(account.branchId);
          
          return {
            ...account,
            userName: user ? user.name : 'Unknown User',
            branchName: branch ? `Branch #${branch.branchId}` : 'Unknown Branch'
          };
        });
        
        setAccounts(enhancedAccounts);
        setFilteredAccounts(enhancedAccounts);
        
        // Calculate total balance
        const total = enhancedAccounts.reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(total);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccounts();
  }, []);

  useEffect(() => {
    // Filter accounts based on search query
    if (searchQuery.trim() === "") {
      setFilteredAccounts(accounts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = accounts.filter(
        account => 
          account.accountNo.toString().includes(query) ||
          account.userName.toLowerCase().includes(query) ||
          account.branchAddress?.toLowerCase().includes(query) ||
          account.branchName.toLowerCase().includes(query) ||
          account.balance.toString().includes(query)
      );
      setFilteredAccounts(filtered);
    }
  }, [searchQuery, accounts]);

  return (
    <EmployeeLayout currentTab="accounts">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Account Management</h2>
          <p className="text-muted-foreground">View and manage all customer accounts</p>
        </div>

        {/* Search and filters */}
        <Card className="border-bank-navy/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-bank-navy" />
              Search Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Search by account number, customer, or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account summary */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-bank-navy" />
                Total Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{filteredAccounts.length}</div>
              )}
              {searchQuery && (
                <div className="text-sm text-muted-foreground">
                  (filtered from {accounts.length} total accounts)
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-bank-navy" />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
              )}
              <div className="text-sm text-muted-foreground">Across all accounts</div>
            </CardContent>
          </Card>

          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-bank-navy" />
                Average Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatCurrency(accounts.length > 0 ? totalBalance / accounts.length : 0)}
                </div>
              )}
              <div className="text-sm text-muted-foreground">Per account</div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts Table */}
        <Card className="border-bank-navy/20">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : filteredAccounts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.accountNo}>
                      <TableCell className="font-medium">#{account.accountNo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{account.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{account.branchName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {account.branchAddress}
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
              <div className="p-8 text-center text-muted-foreground">
                No accounts found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeAccounts;
