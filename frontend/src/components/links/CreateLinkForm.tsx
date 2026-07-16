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
        <form onSubmit={handleSubmit}>
            <Input 
                type="text"
                placeholder="Enter original URL"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Link"}
            </Button>
        </form>
    );
            
}
