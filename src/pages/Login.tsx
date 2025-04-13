
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, useAuth } from "@/contexts/AuthContext";
import { KeyRound, User, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [customerUsername, setCustomerUsername] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (role: UserRole) => {
    if (!role) return;
    
    const username = role === "customer" ? customerUsername : employeeUsername;
    const password = role === "customer" ? customerPassword : employeePassword;
    
    if (!username || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await login(username, password, role);
      if (success) {
        navigate(role === "customer" ? "/dashboard" : "/employee-dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-bank-gray to-white p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-bank-blue mb-2">
          Banking Portal
        </h1>
        <p className="text-muted-foreground">
          Secure access to your banking services
        </p>
      </div>

      <Tabs defaultValue="customer" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="customer" className="flex items-center gap-2">
            <User size={16} />
            <span>Customer</span>
          </TabsTrigger>
          <TabsTrigger value="employee" className="flex items-center gap-2">
            <Building2 size={16} />
            <span>Employee</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer">
          <Card className="border-bank-blue/20 shadow-lg">
            <CardHeader>
              <CardTitle>Customer Login</CardTitle>
              <CardDescription>
                Access your accounts, transactions, and loans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-username">Username</Label>
                  <Input
                    id="customer-username"
                    placeholder="Enter your username"
                    value={customerUsername}
                    onChange={(e) => setCustomerUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-password">Password</Label>
                  <Input
                    id="customer-password"
                    type="password"
                    placeholder="Enter your password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-bank-blue hover:bg-bank-navy"
                onClick={() => handleLogin("customer")}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
            <div className="px-6 pb-4 text-sm text-muted-foreground">
              <p>Demo user: amit / password</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="employee">
          <Card className="border-bank-blue/20 shadow-lg">
            <CardHeader>
              <CardTitle>Employee Login</CardTitle>
              <CardDescription>
                Access employee dashboards and tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-username">Username</Label>
                  <Input
                    id="employee-username"
                    placeholder="Enter your employee username"
                    value={employeeUsername}
                    onChange={(e) => setEmployeeUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-password">Password</Label>
                  <Input
                    id="employee-password"
                    type="password"
                    placeholder="Enter your password"
                    value={employeePassword}
                    onChange={(e) => setEmployeePassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-bank-blue hover:bg-bank-navy"
                onClick={() => handleLogin("employee")}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
            <div className="px-6 pb-4 text-sm text-muted-foreground">
              <p>Demo user: rajesh / password</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex items-center">
        <KeyRound size={16} className="text-bank-blue mr-2" />
        <span className="text-sm text-muted-foreground">Secure 256-bit encrypted connection</span>
      </div>
    </div>
  );
};

export default Login;
