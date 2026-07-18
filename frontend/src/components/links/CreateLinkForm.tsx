import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

interface CreateLinkFormProps {
    createLink: (originalUrl: string) => Promise<void>;
    isLoading: boolean;
}
export default function CreateLinkForm({ createLink, isLoading }: CreateLinkFormProps) {

    const [originalUrl, setOriginalUrl] = useState("");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!originalUrl.trim()) return;
        try {
            await createLink(originalUrl);
            setOriginalUrl("");
        } catch (error) {
            console.error("Error creating link:", error);
        }
    }


    return (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:p-5 lg:p-6">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Original URL
                    </label>
                    <Input 
                        type="text"
                        placeholder="Paste a long URL to shorten"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        required
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="sm:!w-auto sm:min-w-36 sm:px-6"
                >
                    {isLoading ? "Creating..." : "Create Link"}
                </Button>
            </div>
        </form>
    );
            
}
