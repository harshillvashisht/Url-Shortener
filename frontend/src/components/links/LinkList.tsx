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
        <div className="link-list">
            <Spinner />
        </div>
    );
}

if (links.length === 0) {
    return (
        <div className="link-list">
            <EmptyState
                message="No links available. Create a new link to get started!"
            />
        </div>
    );
}

return (
    <div className="link-list">
            {links.map(link => (
                <LinkCard
                    key={link.id}
                    link={link}
                    deleteLink={deleteLink}
                />
            ))}
    </div>
);

}

export default LinkList;