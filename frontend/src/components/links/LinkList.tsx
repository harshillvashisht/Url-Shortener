import { links } from "../../types/links";
import { EmptyState } from "../common/EmptyState";
import Spinner from "../common/Spinner";
import LinkCard from "./LinkCard";


interface LinkListProps {
    links: links[];
    isLoading: boolean;
    deleteLink: (id: string) => Promise<void>;
}

const LinkList = ({ links, isLoading, deleteLink }: LinkListProps) => {
    if (isLoading) {
        return (
            <section className="link-list rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div className="h-4 w-32 rounded-full bg-slate-200" />
                </div>
                <div className="flex min-h-72 items-center justify-center px-5 py-10 sm:px-6">
                    <Spinner />
                </div>
            </section>
        );
    }

    if (links.length === 0) {
        return (
            <section className="link-list rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                    <p className="text-sm font-semibold text-slate-900">Links</p>
                </div>
                <div className="px-5 py-8 sm:px-6 sm:py-10">
                    <EmptyState
                        message="No links available. Create a new link to get started!"
                    />
                </div>
            </section>
        );
    }

    return (
        <section className="link-list rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                <div>
                    <p className="text-sm font-semibold text-slate-900">Links</p>
                    <p className="mt-1 text-sm text-slate-500">Manage your latest shortened URLs</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                    {links.length} items
                </span>
            </div>
            <div className="grid gap-4 p-5 sm:p-6">
                {links.map(link => (
                    <LinkCard
                        key={link.id}
                        link={link}
                        deleteLink={deleteLink}
                    />
                ))}
            </div>
        </section>
    );

}

export default LinkList;