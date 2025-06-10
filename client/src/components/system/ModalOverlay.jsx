import PropTypes from "prop-types"

const ModalOverlay = ({ show, onClose, children, className = "" }) => {
    if (!show) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${className}`}
            onClick={handleOverlayClick}
        >
            {children}
        </div>
    );
};

ModalOverlay.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}

export default ModalOverlay;