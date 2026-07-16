import { useState } from "react";
import useLinks from "../hooks/useLinks";
import CreateLinkForm from "../components/links/CreateLinkForm";
import LinkList from "../components/links/LinkList";
import Pagination from "../components/links/Pagination";

export default function DashboardPage() {

    const [page, setPage] = useState(1);

    const { links, pagination, isLoading, createLink, deleteLink } = useLinks(page);


    return (
        <div className="dashboard-page">
            <CreateLinkForm createLink={createLink} isLoading={isLoading} />
            <LinkList
                links={links}
                isLoading={isLoading}
                deleteLink={deleteLink}
            />
            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>

    );
}