// Define routes and corresponding microservices

export const services = [
    {
        route: "/auth",
        target: "http://auth-service:8000",
    },
    {
        route: "/player",
        target: "http://player-service:5000",
    },
    {
        route: "/training",
        target: "http://training-service:8001",
    },
    {
        route: "/match",
        target: "http://match-service:8002",
    },
    {
        route: "/schedule",
        target: "http://schedule-service:5001",
    }
];
