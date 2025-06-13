import { Card, CardContent } from "@/components/ui/card"
import PropTypes from "prop-types"

const ItemCard = ({ item, onClick }) => {
    return (
        <Card 
            className="w-full hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
            onClick={() => onClick(item)}
        >
            <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    {item.type === 'video' ? (
                        <video 
                            src={item.imageUrl} 
                            className="w-full h-full object-cover"
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
                
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-center line-clamp-2">
                        {item.name}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
};

ItemCard.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        media_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    onClick: PropTypes.func.isRequired
}

export default ItemCard;