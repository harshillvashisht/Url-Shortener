export  const EmptyState = ({ message }: { message: string }) => {
    return (
        <div className="empty-state">
            <p>{message}</p>
        </div>
    );
}