import { links } from "../../types/links";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SHORT_BASE_URL } from "../../congif";

interface LinkCardProps {
    link: links;
    deleteLink: (id: string) => Promise<void>;
}

const LinkCard = ({ link, deleteLink }: LinkCardProps) => {
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const shortUrl = `${SHORT_BASE_URL}/${link.shortCode}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy text: ", error);
        }
    };


    const handleDelete = async () => {
        await deleteLink(link.id);
    };

    const handleAnalytics = () => {
        navigate(`/analytics/${link.id}`);
    }
        

    return (
        <div className="link-card group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.95fr)] lg:items-start">
                <div className="space-y-3">
                    <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Original URL
                    </div>
                    <p className="truncate text-sm leading-6 text-slate-800 sm:text-[0.95rem]" title={link.originalUrl}>
                        {link.originalUrl}
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Short Code
                        </p>
                        <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                            {link.shortCode}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Short URL
                        </p>
                        <p className="mt-1 truncate font-mono text-sm font-medium text-slate-800" title={shortUrl}>
                            {shortUrl}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap sm:justify-end">
                <Button className="w-auto! sm:min-w-24" onClick={handleCopy}>
                    {isCopied ? "Copied!" : "Copy"}
                </Button>
                <Button className="w-auto! sm:min-w-24" onClick={handleAnalytics}>
                    Analytics
                </Button>
                <Button className="w-auto! sm:min-w-24" onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
}

export default LinkCard;