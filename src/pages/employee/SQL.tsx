
import { useState } from "react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Play, 
  XCircle,
  CheckCircle2,
  History,
  Copy,
  User
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Component to render query results generically
const QueryResults = ({ data }: { data: any[] }) => {
  if (!data || !data.length) return <div className="text-center py-4">No results returned</div>;
  
  // Extract keys from first result
  const keys = Object.keys(data[0]);
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {keys.map((key) => (
              <TableHead key={key}>
                {key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {keys.map((key) => (
                <TableCell key={`${rowIndex}-${key}`}>
                  {/* Format different types of data */}
                  {typeof row[key] === 'object' 
                    ? JSON.stringify(row[key])
                    : String(row[key] !== null ? row[key] : 'NULL')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Organized queries by contributor
const CONTRIBUTOR_QUERIES = {
  chirag: [
    {
      name: "Bank with Max Loan Amount",
      query: `SELECT BankName, TotalLoan
FROM (
    SELECT b.BankName, SUM(l.LoanAmount) AS TotalLoan
    FROM BANK b
    JOIN LOAN l ON b.BankID = l.BankID
    GROUP BY b.BankName
) 
WHERE TotalLoan = (
    SELECT MAX(total) 
    FROM (
         SELECT SUM(LoanAmount) AS total
         FROM LOAN
         GROUP BY BankID
    ) 
);`
    },
    {
      name: "Transaction Details with Users",
      query: `SELECT th.TransactionID, 
       t1.UserID AS SenderUserID, u1.Name AS SenderName, 
       t2.UserID AS ReceiverUserID, u2.Name AS ReceiverName, 
       th.TransactionAmount, th.TransactionTime
FROM TRANSACTION_HISTORY th
JOIN ACCOUNT t1 ON th.AccountNo1 = t1.AccountNo
JOIN USERS u1 ON t1.UserID = u1.UserID
JOIN ACCOUNT t2 ON th.AccountNo2 = t2.AccountNo
JOIN USERS u2 ON t2.UserID = u2.UserID;`
    },
    {
      name: "Branches with Max Accounts",
      query: `SELECT a.BranchID, COUNT(*) AS NumAccounts, bk.BankName
FROM ACCOUNT a
JOIN BRANCH b ON a.BranchID = b.BranchID
JOIN BANK bk ON b.BankID = bk.BankID
GROUP BY a.BranchID, bk.BankName
HAVING COUNT(*) = (
    SELECT MAX(accCount)
    FROM (
        SELECT COUNT(*) AS accCount
        FROM ACCOUNT
        GROUP BY BranchID
    )
);`
    },
    {
      name: "Total Loan Per User",
      query: `SELECT u.Name, SUM(l.LoanAmount) AS TotalLoan
FROM USERS u
JOIN LOAN l ON u.UserID = l.UserID
GROUP BY u.Name;`
    }
  ],
  aryamaan: [
    {
      name: "Users with Multiple Accounts",
      query: `SELECT U.UserID, U.Name, COUNT(A.AccountNo) AS TotalAccs
FROM USERS U
JOIN ACCOUNT A ON U.UserID = A.UserID
GROUP BY U.UserID, U.Name
HAVING COUNT(A.AccountNo)>1;`
    },
    {
      name: "Account Status by Balance",
      query: `SELECT A.AccountNo,
       U.Name AS UserName,
       A.Balance,
       CASE WHEN A.Balance < 10000 THEN 'EWS' ELSE 'Normal' END AS Status
FROM ACCOUNT A
JOIN USERS U ON A.UserID = U.UserID;`
    },
    {
      name: "Top 10 High Interest Loans",
      query: `SELECT LoanID, UserID, BankID, LoanAmount, Interest, Duration, LoanType, IssueDate
FROM LOAN
ORDER BY Interest DESC
LIMIT 10;`
    },
    {
      name: "Loan Summary by Branch",
      query: `SELECT BR.BranchID, BR.BranchAdd AS BranchAddr, B.BankName,
       L.LoanType,
       COUNT(L.LoanID) AS TotalLoans,
       SUM(L.LoanAmount) AS TotalLoanAmt,
       ROUND(AVG(L.Interest), 2) AS AverageInterestRate
FROM LOAN L
JOIN BANK B ON L.BankID = B.BankID
JOIN BRANCH BR ON B.BankID = BR.BankID
GROUP BY BR.BranchID, BR.BranchAdd, B.BankName, L.LoanType
ORDER BY BR.BranchAdd, L.LoanType;`
    }
  ],
  abhishek: [
    {
      name: "Banks Above Average Money",
      query: `SELECT bank.BankName, bank.BankMoney
FROM bank
WHERE bank.BankMoney>(SELECT AVG(BankMoney)
                       FROM bank);`
    },
    {
      name: "Transactions by Amount Desc",
      query: `SELECT *
FROM TRANSACTION_HISTORY
JOIN BRANCH ON TRANSACTION_HISTORY.BranchID=BRANCH.BranchID
ORDER BY TRANSACTION_HISTORY.TransactionAmount DESC;`
    },
    {
      name: "Employees with Bank Info",
      query: `SELECT EMPLOYEE.Name, Bank.BankName
FROM EMPLOYEE
JOIN branch ON EMPLOYEE.BranchID=branch.BranchID
JOIN bank ON bank.BankID=branch.BankID;`
    },
    {
      name: "Branch Total Balance",
      query: `SELECT account.branchid, SUM(account.Balance)
FROM users
JOIN account 
ON users.UserID = account.UserID
GROUP BY account.branchid;`
    }
  ],
  aryan: [
    {
      name: "User Account Details",
      query: `SELECT U.UserID, U.Name AS UserName, A.AccountNo, A.Balance
FROM USERS U
JOIN ACCOUNT A ON U.UserID = A.UserID;`
    },
    {
      name: "Avg Loan Per Bank & Type",
      query: `SELECT b.BankID, b.BankName, l.LoanType, AVG(l.LoanAmount) AS AvgLoanAmount
FROM LOAN l
JOIN BANK b ON l.BankID = b.BankID
GROUP BY b.BankID, b.BankName, l.LoanType
ORDER BY b.BankID, l.LoanType;`
    },
    {
      name: "Highest Transaction Per Branch",
      query: `SELECT t.BranchID, t.TransactionID, t.AccountNo1 AS From_Account, t.AccountNo2 AS To_Account, t.TransactionAmount
FROM TRANSACTION_HISTORY t
WHERE t.TransactionAmount = (
    SELECT MAX(TransactionAmount) 
    FROM TRANSACTION_HISTORY 
    WHERE BranchID = t.BranchID
)
ORDER BY t.BranchID;`
    },
    {
      name: "Users with No Loans & High Balance",
      query: `SELECT a.UserID 
FROM ACCOUNT a
WHERE NOT EXISTS (
    SELECT 1 
    FROM LOAN l
    WHERE a.UserID = l.UserID
)
EXCEPT
SELECT b.UserID
FROM ACCOUNT b
WHERE b.Balance <= (SELECT AVG(Balance) FROM ACCOUNT);`
    }
  ]
};

const EmployeeSQLPage = () => {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter an SQL query to execute",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the query using Supabase's rpc call
      const { data, error: supabaseError } = await supabase.rpc('execute_sql', { 
        sql_query: query 
      });
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      setQueryResults(data || []);
      
      // Add to history if not a duplicate of the most recent query
      if (queryHistory.length === 0 || queryHistory[0] !== query) {
        setQueryHistory([query, ...queryHistory.slice(0, 9)]);
      }
      
      toast({
        title: "Query Successful",
        description: `Executed query with ${data?.length || 0} results`,
        variant: "default",
      });
    } catch (err: any) {
      console.error("Query error:", err);
      setError(err.message || "Error executing query. Please check your syntax.");
      setQueryResults(null);
      
      toast({
        title: "Query Error",
        description: err.message || "There was an error executing your query",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
    toast({
      title: "Copied to clipboard",
      description: "Query copied to clipboard",
    });
  };

  return (
    <EmployeeLayout currentTab="sql">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">SQL Query Tool</h2>
          <p className="text-muted-foreground">Execute SQL queries against the banking database</p>
        </div>

        {/* SQL Editor */}
        <Card className="border-bank-navy/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-bank-navy" />
              SQL Query Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your SQL query here..."
                className="font-mono min-h-[150px]"
              />
              
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  onClick={handleQuery} 
                  disabled={isLoading} 
                  className="bg-bank-navy hover:bg-bank-navy/90"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Execute Query
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyQuery}
                  className="border-bank-navy/20 text-bank-navy"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuery("")}
                  className="border-bank-navy/20 text-bank-navy"
                >
                  Clear
                </Button>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Queries by Contributors */}
        <Card className="border-bank-navy/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-bank-navy" />
              Advanced SQL Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chirag" className="w-full">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-4">
                <TabsTrigger value="chirag">Chirag Yadav</TabsTrigger>
                <TabsTrigger value="aryamaan">Aryamaan Singh</TabsTrigger>
                <TabsTrigger value="abhishek">Abhishek Rao</TabsTrigger>
                <TabsTrigger value="aryan">Aryan Dahiya</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chirag" className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Queries by Chirag Yadav
                </h3>
                <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                  {CONTRIBUTOR_QUERIES.chirag.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSampleQuery(item.query)}
                      className="justify-start h-auto py-2 text-left"
                    >
                      <span className="truncate">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="aryamaan" className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Queries by Aryamaan Singh
                </h3>
                <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                  {CONTRIBUTOR_QUERIES.aryamaan.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSampleQuery(item.query)}
                      className="justify-start h-auto py-2 text-left"
                    >
                      <span className="truncate">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="abhishek" className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Queries by Abhishek Rao
                </h3>
                <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                  {CONTRIBUTOR_QUERIES.abhishek.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSampleQuery(item.query)}
                      className="justify-start h-auto py-2 text-left"
                    >
                      <span className="truncate">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="aryan" className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Queries by Aryan Dahiya
                </h3>
                <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                  {CONTRIBUTOR_QUERIES.aryan.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSampleQuery(item.query)}
                      className="justify-start h-auto py-2 text-left"
                    >
                      <span className="truncate">{item.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Query History */}
        {queryHistory.length > 0 && (
          <Card className="border-bank-navy/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-bank-navy" />
                Query History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {queryHistory.map((historyItem, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHistoryClick(historyItem)}
                    className="w-full justify-start font-mono text-xs"
                  >
                    {historyItem}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Query Results */}
        <Card className="border-bank-navy/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-bank-navy" />
              Query Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : queryResults ? (
              <QueryResults data={queryResults} />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Execute a query to see results here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeSQLPage;
