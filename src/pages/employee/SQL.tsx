
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
  Info, 
  XCircle,
  CheckCircle2,
  History,
  Copy
} from "lucide-react";
import { mockDBService } from "@/services/mockDatabaseService";

// Component to render query results generically
const QueryResults = ({ data }: { data: any[] }) => {
  if (!data.length) return <div className="text-center py-4">No results returned</div>;
  
  // Extract keys from first result
  const keys = Object.keys(data[0]);
  
  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {keys.map((key) => (
              <th
                key={key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {keys.map((key) => (
                <td key={`${rowIndex}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* Format different types of data */}
                  {typeof row[key] === 'object' 
                    ? JSON.stringify(row[key])
                    : String(row[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Sample queries for users to try
const SAMPLE_QUERIES = [
  "SELECT * FROM BANK",
  "SELECT * FROM BRANCH WHERE BankID = 1",
  "SELECT * FROM EMPLOYEE",
  "SELECT * FROM USERS",
  "SELECT * FROM ACCOUNT",
  "SELECT * FROM LOAN WHERE LoanAmount > 200000",
  "SELECT * FROM TRANSACTION_HISTORY",
  "SELECT COUNT(*) FROM LOAN GROUP BY BankID",
  "SELECT AVG(Balance) FROM ACCOUNT",
  "SELECT SUM(Balance) FROM ACCOUNT",
  "SELECT * FROM USERS JOIN ACCOUNT ON USERS.UserID = ACCOUNT.UserID",
  "SELECT * FROM BANK JOIN BRANCH ON BANK.BankID = BRANCH.BankID"
];

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
      const results = await mockDBService.executeQuery(query);
      setQueryResults(results);
      
      // Add to history if not a duplicate of the most recent query
      if (queryHistory.length === 0 || queryHistory[0] !== query) {
        setQueryHistory([query, ...queryHistory.slice(0, 9)]);
      }
      
      toast({
        title: "Query Successful",
        description: `Executed query with ${results.length} results`,
        variant: "default",
      });
    } catch (err) {
      console.error("Query error:", err);
      setError("Error executing query. Please check your syntax.");
      setQueryResults(null);
      
      toast({
        title: "Query Error",
        description: "There was an error executing your query",
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

        {/* Sample Queries */}
        <Card className="border-bank-navy/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-bank-navy" />
              Sample Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
              {SAMPLE_QUERIES.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSampleQuery(sample)}
                  className="justify-start font-mono text-xs h-auto py-2"
                >
                  {sample}
                </Button>
              ))}
            </div>
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

        {/* Database Schema Info */}
        <Card className="border-bank-navy/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-bank-navy" />
              Database Schema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono">
              <p>BANK (BankID, BankName, BankMoney, NoOfBranches)</p>
              <p>BRANCH (BranchID, BranchAdd, BankID)</p>
              <p>EMPLOYEE (EmployeeID, Name, BranchID)</p>
              <p>USERS (UserID, Name, Address, MobileNumber)</p>
              <p>ACCOUNT (AccountNo, Balance, UserID, BranchID)</p>
              <p>LOAN (LoanID, LoanAmount, Duration, Interest, LoanType, IssueDate, UserID, BankID)</p>
              <p>TRANSACTION_HISTORY (TransactionID, TransactionAmount, TransactionTime, BranchID, AccountNo1, AccountNo2)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeSQLPage;
