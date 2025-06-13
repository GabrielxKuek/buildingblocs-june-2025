// // dependencies
// import PropTypes from "prop-types"

// // components
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Send, Volume2 } from "lucide-react"

// const ItemModal = ({ item, onClose, onSendToCaretaker, onSpeak }) => {
//     if (!item) return null;

//     return (
//         <Dialog open={!!item} onOpenChange={onClose}>
//             <DialogContent className="max-w-md">
//                 <DialogHeader>
//                     <DialogTitle className="text-2xl font-bold text-center">
//                         {item.name}
//                     </DialogTitle>
//                 </DialogHeader>

//                 <div className="space-y-6">
//                     {/* supports image and video */}
//                     <div className="aspect-square relative overflow-hidden rounded-lg">
//                         {item.type === 'video' ? (
//                             <video 
//                                 src={item.imageUrl} 
//                                 className="w-full h-full object-cover"
//                                 controls
//                                 autoPlay
//                                 muted
//                                 loop
//                             />
//                         ) : (
//                             <img 
//                                 src={item.imageUrl} 
//                                 alt={item.name}
//                                 className="w-full h-full object-cover"
//                             />
//                         )}
//                     </div>

//                     {/* patient actions */}
//                     <div className="flex gap-3">
//                         <Button 
//                             onClick={() => onSendToCaretaker(item)}
//                             className="flex-1 h-12 text-lg"
//                             variant="default"
//                         >
//                             <Send className="h-5 w-5 mr-2" />
//                             Send to Caretaker
//                         </Button>

//                         <Button 
//                             onClick={() => onSpeak(item.name)}
//                             className="h-12 px-4"
//                             variant="outline"
//                         >
//                             <Volume2 className="h-5 w-5" />
//                         </Button>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };

// ItemModal.propTypes = {
//     item: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         type: PropTypes.string.isRequired,
//         imageUrl: PropTypes.string.isRequired,
//     }),
//     onClose: PropTypes.func.isRequired,
//     onSendToCaretaker: PropTypes.func.isRequired,
//     onSpeak: PropTypes.func.isRequired,
// }

// export default ItemModal;

// dependencies
// dependencies
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom";

// components
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Volume2, Play } from "lucide-react"

const ItemModal = ({ 
    item, 
    onClose, 
    onSendToCaretaker, 
    onSpeak
}) => {
    const navigate = useNavigate();

    if (!item) return null;

    const handleViewActions = () => {
        onClose(); // Close modal first
        navigate(`/patient/actions/${item.media_id}`);
    };

    return (
        <Dialog open={!!item} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {item.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Main item media */}
                    <div className="aspect-square relative overflow-hidden rounded-lg">
                        {item.type === 'video' ? (
                            <video 
                                src={item.imageUrl} 
                                className="w-full h-full object-cover"
                                controls
                                autoPlay
                                muted
                                loop
                            />
                        ) : (
                            <img 
                                src={item.imageUrl} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* Patient actions */}
                    <div className="space-y-3">
                        {/* Primary actions row */}
                        <div className="flex gap-3">
                            <Button 
                                onClick={() => onSendToCaretaker(item)}
                                className="flex-1 h-12 text-lg"
                                variant="default"
                            >
                                <Send className="h-5 w-5 mr-2" />
                                Send to Caregiver
                            </Button>

                            <Button 
                                onClick={() => onSpeak(item.name)}
                                className="h-12 px-4"
                                variant="outline"
                            >
                                <Volume2 className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Actions button (only for images) */}
                        {item.type === 'image' && item.media_id && (
                            <Button 
                                onClick={handleViewActions}
                                className="w-full h-12 text-lg"
                                variant="secondary"
                            >
                                <Play className="h-5 w-5 mr-2" />
                                View Actions
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

ItemModal.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        media_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    onClose: PropTypes.func.isRequired,
    onSendToCaretaker: PropTypes.func.isRequired,
    onSpeak: PropTypes.func.isRequired,
}

export default ItemModal;