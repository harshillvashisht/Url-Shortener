import Button from "../common/Button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="pagination">
            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </Button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </Button>
        </div>
    );
}
