import { useState , useEffect } from "react";
import useLinks from "../hooks/useLinks";
import CreateLinkForm from "../components/links/CreateLinkForm";
import LinkList from "../components/links/LinkList";
import Pagination from "../components/links/Pagination";
import Navbar from "../components/common/Navbar";

export default function DashboardPage() {

    const [page, setPage] = useState(1);

    const { links, pagination, isLoading, createLink, deleteLink } = useLinks(page);

    useEffect(() => {
    const validPage = Math.max(1, pagination.totalPages);

    if (page > validPage) {
        setPage(validPage);
    }
}, [page, pagination.totalPages]);


    return (
        <>
        <Navbar />
        <div className="dashboard-page min-h-[calc(100vh-4.5rem)] bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <section className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Dashboard
                        </p>
                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                            Create and manage short links
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Turn long URLs into shareable links, then manage them in one focused workspace.
                        </p>
                    </div>

                    <div className="mt-6">
                        <CreateLinkForm createLink={createLink} isLoading={isLoading} />
                    </div>
                </section>

                <div className="space-y-6">
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
            </div>
        </div>
    </>
    );
}