// dependencies
import PropTypes from "prop-types"

// components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Volume2 } from "lucide-react"
import ModalOverlay from '@/components/system/ModalOverlay';

const ItemModal = ({ item, onClose, onSendToCaretaker, onSpeak }) => {
    if (!item) return null;

    return (
        <ModalOverlay show={!!item} onClose={onClose}>
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {item.name}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* supports image and video */}
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

                    {/* patient actions */}
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => onSendToCaretaker(item)}
                            className="flex-1 h-12 text-lg"
                            variant="default"
                        >
                            <Send className="h-5 w-5 mr-2" />
                            Send to Caretaker
                        </Button>

                        <Button 
                            onClick={() => onSpeak(item)}
                            className="h-12 px-4"
                            variant="outline"
                        >
                            <Volume2 className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ModalOverlay>
    );
};

ItemModal.propTypes = {
    item: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    onSendToCaretaker: PropTypes.func.isRequired,
    onSpeak: PropTypes.func.isRequired,
}

export default ItemModal;