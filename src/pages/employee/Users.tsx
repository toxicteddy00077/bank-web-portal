
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
import { Users, Search, Phone, MapPin } from "lucide-react";
import { mockDBService, User } from "@/services/mockDatabaseService";

const EmployeeUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await mockDBService.getAllUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(query) ||
          user.address.toLowerCase().includes(query) ||
          user.mobileNumber.includes(query) ||
          user.userId.toString().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  return (
    <EmployeeLayout currentTab="users">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">User Management</h2>
          <p className="text-muted-foreground">View and manage all bank customers</p>
        </div>

        {/* Search and filters */}
        <Card className="border-bank-navy/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-bank-navy" />
              Search Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Search by name, ID, phone or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* User count summary */}
        <div className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-bank-navy" />
          <span className="font-medium">Total Users:</span>
          {isLoading ? (
            <Skeleton className="h-6 w-12" />
          ) : (
            <span>{filteredUsers.length}</span>
          )}
          {searchQuery && (
            <span className="text-muted-foreground text-sm">
              (filtered from {users.length} total users)
            </span>
          )}
        </div>

        {/* Users Table */}
        <Card className="border-bank-navy/20">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : filteredUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">#{user.userId}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{user.mobileNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="truncate max-w-xs" title={user.address}>
                            {user.address}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No users found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeUsers;
