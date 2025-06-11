import PropTypes from "prop-types";

const Spinner = ({ show = true, message = "Loading..." }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
                <div className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 h-12 w-12"></div>
                <p className="text-gray-700 font-medium">{message}</p>
            </div>
        </div>
    );
};

Spinner.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
}

export default Spinner;