
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  History, 
  LogOut, 
  ChevronRight,
  Building2,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmployeeLayoutProps {
  children: ReactNode;
  currentTab?: string;
}

const EmployeeLayout = ({ children, currentTab = "dashboard" }: EmployeeLayoutProps) => {
  const { employeeData, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/employee-dashboard" },
    { id: "users", label: "Users", icon: Users, path: "/employee/users" },
    { id: "accounts", label: "Accounts", icon: CreditCard, path: "/employee/accounts" },
    { id: "transactions", label: "Transactions", icon: History, path: "/employee/transactions" },
    { id: "sql", label: "SQL Queries", icon: Database, path: "/employee/sql" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bank-gray">
      {/* Top navigation */}
      <header className="bg-bank-navy text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6" />
            <h1 className="text-xl font-bold">Banking Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              <span>{employeeData?.name || "Employee"}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-white border-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar navigation */}
        <aside className="w-full md:w-64 bg-white shadow-md md:min-h-[calc(100vh-64px)]">
          <nav className="p-4">
            <div className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">Admin Navigation</div>
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <Button
                      variant={currentTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        currentTab === item.id 
                          ? "bg-bank-navy text-white hover:bg-bank-navy/90" 
                          : "text-bank-navy hover:bg-bank-gray"
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                      {currentTab === item.id && <ChevronRight className="ml-auto h-4 w-4" />}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
