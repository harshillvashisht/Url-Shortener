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
        <div className="pagination flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
            <Button
                className="w-auto! shrink-0 px-4 sm:px-5"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <span className="mr-1">&lt;</span> Previous
            </Button>
            <span className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-medium whitespace-nowrap text-slate-600">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                className="w-auto! shrink-0 px-4 sm:px-5"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next <span className="ml-1">&gt;</span>
            </Button>
        </div>
    );
}
