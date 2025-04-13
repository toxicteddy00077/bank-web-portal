
import { useEffect, useState } from "react";
import CustomerLayout from "@/components/CustomerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Landmark, CalendarRange, DollarSign, BadgePercent } from "lucide-react";
import { mockDBService, Loan } from "@/services/mockDatabaseService";
import { formatCurrency } from "@/utils/formatters";

const CustomerLoans = () => {
  const { customerData } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      if (customerData?.userId) {
        setIsLoading(true);
        try {
          const loansData = await mockDBService.getLoansByUserId(customerData.userId);
          setLoans(loansData);
        } catch (error) {
          console.error("Error fetching loans:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchLoans();
  }, [customerData?.userId]);

  // Calculate total loan amount
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.loanAmount, 0);

  // Helper to calculate progress percentage for loan (for demo purposes)
  const calculateProgress = (loanIssueDate: string, loanDuration: number): number => {
    const issueDate = new Date(loanIssueDate);
    const today = new Date();
    
    // Convert duration from months to milliseconds
    const durationMs = loanDuration * 30 * 24 * 60 * 60 * 1000;
    const endDate = new Date(issueDate.getTime() + durationMs);
    
    if (today >= endDate) return 100;
    
    const totalDuration = endDate.getTime() - issueDate.getTime();
    const elapsed = today.getTime() - issueDate.getTime();
    
    return Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  };

  // Helper to get the end date of a loan
  const getLoanEndDate = (issueDate: string, durationMonths: number): string => {
    const startDate = new Date(issueDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return endDate.toISOString().split('T')[0];
  };

  return (
    <CustomerLayout currentTab="loans">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Loans</h2>
          <p className="text-muted-foreground">Manage and review your active loans</p>
        </div>

        {/* Summary Card */}
        <Card className="bank-card text-white overflow-hidden">
          <div className="card-pattern"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Loans Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm opacity-80">Total Loan Amount</div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">{formatCurrency(totalLoanAmount)}</div>
                )}
              </div>
              
              <div>
                <div className="text-sm opacity-80">Number of Loans</div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">{loans.length}</div>
                )}
              </div>

              <div>
                <div className="text-sm opacity-80">Average Interest Rate</div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20 mt-1" />
                ) : (
                  <div className="text-2xl font-bold">
                    {loans.length > 0 
                      ? (loans.reduce((sum, loan) => sum + loan.interest, 0) / loans.length).toFixed(2) + '%'
                      : '0%'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loans List */}
        <Card className="border-bank-blue/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-bank-blue" />
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : loans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => {
                    const progress = calculateProgress(loan.issueDate, loan.duration);
                    return (
                    <TableRow key={loan.loanId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{loan.loanType}</div>
                          <div className="text-sm text-muted-foreground">{loan.bankName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(loan.loanAmount)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BadgePercent className="h-4 w-4 text-bank-blue mr-1" />
                          <span>{loan.interest}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center">
                            <CalendarRange className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{loan.duration} months</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {loan.issueDate} to {getLoanEndDate(loan.issueDate, loan.duration)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-muted-foreground text-right">{progress}% complete</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                You don't have any active loans. Contact us to learn about our loan options.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loan Types */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-bank-blue" />
            Available Loan Types
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-bank-blue/20 hover:border-bank-blue/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Home Loan</CardTitle>
                <CardDescription>For purchasing or renovating a home</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="font-medium">7.2% - 8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">Up to 30 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Amount</span>
                    <span className="font-medium">{formatCurrency(10000000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-bank-blue/20 hover:border-bank-blue/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Car Loan</CardTitle>
                <CardDescription>For purchasing a new or used vehicle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="font-medium">8.0% - 9.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">Up to 7 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Amount</span>
                    <span className="font-medium">{formatCurrency(1500000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-bank-blue/20 hover:border-bank-blue/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Personal Loan</CardTitle>
                <CardDescription>For personal expenses or debt consolidation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="font-medium">9.0% - 12.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">Up to 5 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Amount</span>
                    <span className="font-medium">{formatCurrency(500000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-bank-blue/20 hover:border-bank-blue/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Education Loan</CardTitle>
                <CardDescription>For higher education and professional courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="font-medium">7.5% - 9.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">Up to 15 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Amount</span>
                    <span className="font-medium">{formatCurrency(2000000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerLoans;
