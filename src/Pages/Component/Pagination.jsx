import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <button onClick={onPrevious} disabled={currentPage === 1}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button onClick={onNext} disabled={currentPage === totalPages}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3H8.25m12.75 0a9 9 0 1 0-18 0 9 9 0 0 0 18 0Z" />
                </svg>
            </button>
        </div>
    );
};

export default Pagination;

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};