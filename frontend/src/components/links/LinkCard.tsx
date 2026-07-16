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
        <div className="link-card">
            <p>Original URL: {link.originalUrl}</p>
            <p>Short Code: {link.shortCode}</p>
            <p>Short URL: {shortUrl}</p>
            <Button onClick={handleCopy} >{isCopied ? "Copied!" : "Copy"}</Button>
            <Button onClick={handleAnalytics}>Analytics</Button>
            <Button onClick={handleDelete}>Delete</Button>
        </div>
    );
}

export default LinkCard;