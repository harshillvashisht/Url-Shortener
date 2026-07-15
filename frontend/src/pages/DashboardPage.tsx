import useAuth from "../hooks/useAuth";

export default function DashboardPage() {
    const { user, isInitializing } = useAuth();

console.log({
    user,
    isInitializing,
});

    return (
        <h1>Dashboard</h1>
    );
}