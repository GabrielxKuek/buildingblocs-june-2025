import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Plus, Settings, Home, ChevronLeft, ChevronRight, PackageOpen, Warehouse, Users } from "lucide-react"
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    
    const getMenuItems = () => {
        if (location.pathname.startsWith('/caregiver')) {
            return [
                { href: "/caregiver/manage", label: "Manage Items", icon: Warehouse },
            ];
        } else if (location.pathname.startsWith('/patient')) {
            return [
                { href: "/patient/items", label: "My Items", icon: PackageOpen },
            ];
        } else {
            // Default menu items
            return [
                { href: "/dashboard", label: "Dashboard", icon: Home },
                { href: "/patients", label: "Patients", icon: Users },
                { href: "/settings", label: "Settings", icon: Settings },
            ];
        }
    };

    const getCreateButtonText = () => {
        if (location.pathname.startsWith('/caregiver')) {
            return "Create Item";
        } else if (location.pathname.startsWith('/patient')) {
            return "New Item";
        } else {
            return "Add New Item";
        }
    };

    const menuItems = getMenuItems();
    const createButtonText = getCreateButtonText();

    return (
        <div className={`${collapsed ? 'w-16' : 'w-56'} bg-muted/30 p-4 flex flex-col border-r transition-all duration-300`}>
            {/* Toggle Button */}
            <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4 self-end p-2 h-8 w-8"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? 
                    <ChevronRight className="h-4 w-4" /> : 
                    <ChevronLeft className="h-4 w-4" />
                }
            </Button>

            {/* Create Button */}
            <Button className={`mb-6 bg-foreground text-background hover:bg-foreground/90 ${collapsed ? 'px-0' : ''}`}>
                <Plus className="h-4 w-4" />
                {!collapsed && <span className="ml-2">{createButtonText}</span>}
            </Button>

            {/* Menu Items */}
            <nav className="space-y-1 flex-1">
                {menuItems.map((item) => (
                    <Button
                        key={item.href}
                        variant={location.pathname === item.href ? "secondary" : "ghost"}
                        className={`w-full font-medium ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
                        asChild
                    >
                        <Link to={item.href}>
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span className="ml-3">{item.label}</span>}
                        </Link>
                    </Button>
                ))}
            </nav>
        </div>
    )
}

export default Sidebar;