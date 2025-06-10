import { Link, useLocation } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { HeartHandshake, ShieldUser  } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    
    return (
        <div className="flex justify-end p-8 border-b">
            <ToggleGroup 
                type="single" 
                value={location.pathname}
                className="bg-muted rounded-lg p-1 border"
            >
                <ToggleGroupItem 
                    value="/caregiver" 
                    asChild
                    className="px-6 py-2 rounded-md font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border transition-all duration-200"
                >
                    <Link to="/caregiver">
                        <HeartHandshake />
                        Caregiver
                    </Link>
                </ToggleGroupItem>
                <ToggleGroupItem 
                    value="/patient" 
                    asChild
                    className="px-6 py-2 rounded-md font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border transition-all duration-200"
                >
                    <Link to="/patient">
                        <ShieldUser />
                        Patients
                    </Link>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}

export default Navbar;