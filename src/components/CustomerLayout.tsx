
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CreditCard, 
  Landmark, 
  History, 
  LogOut, 
  ChevronRight,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerLayoutProps {
  children: ReactNode;
  currentTab?: string;
}

const CustomerLayout = ({ children, currentTab = "dashboard" }: CustomerLayoutProps) => {
  const { customerData, logout } = useAuth();
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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "accounts", label: "Accounts", icon: CreditCard, path: "/accounts" },
    { id: "loans", label: "Loans", icon: Landmark, path: "/loans" },
    { id: "transactions", label: "Transactions", icon: History, path: "/transactions" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bank-gray">
      {/* Top navigation */}
      <header className="bg-bank-blue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Landmark className="h-6 w-6" />
            <h1 className="text-xl font-bold">Banking Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{customerData?.name || "Customer"}</span>
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
              <div className="text-sm font-medium text-muted-foreground mb-2">Navigation</div>
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <Button
                      variant={currentTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        currentTab === item.id 
                          ? "bg-bank-blue text-white hover:bg-bank-navy" 
                          : "text-bank-blue hover:bg-bank-gray"
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

export default CustomerLayout;
