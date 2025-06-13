import { Link, useLocation } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { HeartHandshake, ShieldUser  } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    
    const getCurrentValue = () => {
        if (location.pathname.startsWith('/caregiver')) {
            return '/caregiver';
        } else if (location.pathname.startsWith('/patient')) {
            return '/patient';
        }
        return '';
    };
    
    return (
        <div className="flex justify-end px-4 py-2 border-b">
            <div className="flex items-center flex-1">
                <img 
                    src="/SpeakEasy.jpg"  
                    alt="Logo" 
                    className="h-8 w-auto"
                />
            </div>

            <ToggleGroup 
                type="single" 
                value={getCurrentValue()}
                className="bg-muted rounded-lg p-1 border"
            >
                <ToggleGroupItem 
                    value="/caregiver" 
                    asChild
                    className="px-6 py-2 rounded-md font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border transition-all duration-200"
                >
                    <Link to="/caregiver" className="flex items-center gap-2">
                        <HeartHandshake size={16} />
                        Caregiver
                    </Link>
                </ToggleGroupItem>
                <ToggleGroupItem 
                    value="/patient" 
                    asChild
                    className="px-6 py-2 rounded-md font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border transition-all duration-200"
                >
                    <Link to="/patient" className="flex items-center gap-2">
                        <ShieldUser size={16} />
                        Patients
                    </Link>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}

export default Navbar;