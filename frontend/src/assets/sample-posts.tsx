const SAMPLE_POSTS = [
    {
        // Post 1
        postId: "post-001",
        author: {
            id: "user-1001",
            name: "John Doe",
            position: "Senior Developer",
            company: "IBM",
            avatarUrl: null,
        },
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
        imageUrl: "/assets/works-space-bg.jpg",
        createdAt: "2025-06-07T14:10:00Z",
        likesCount: 34,
        favoritesCount: 10,
        comments: [
            {
                commentId: "comment-001",
                author: {
                    id: "user-2001",
                    name: "Alice Johnson",
                    position: "Product Designer",
                    company: "Adobe",
                    avatarUrl: null,
                },
                content: "Wow, looks beautiful! How’s the noise level with the open plan?",
                createdAt: "2025-06-07T15:00:00Z",
                replies: [
                    {
                        replyId: "reply-001-01",
                        author: {
                            id: "user-3001",
                            name: "Mark Lee",
                            position: "Frontend Engineer",
                            company: "Meta",
                            avatarUrl: null,
                        },
                        content: "Noise-canceling headphones are a must 😅",
                        createdAt: "2025-06-07T15:20:00Z",
                    },
                    {
                        replyId: "reply-001-02",
                        author: {
                            id: "user-3002",
                            name: "Sofia Chen",
                            position: "UX Researcher",
                            company: "Shopify",
                            avatarUrl: null,
                        },
                        content: "Totally! Also depends on the team’s culture.",
                        createdAt: "2025-06-07T15:25:00Z",
                    },
                ],
            },
            {
                commentId: "comment-002",
                author: {
                    id: "user-2002",
                    name: "David Park",
                    position: "CTO",
                    company: "FinTechify",
                    avatarUrl: null,
                },
                content: "Love it. Do you have any quiet zones?",
                createdAt: "2025-06-07T15:05:00Z",
                replies: [
                    {
                        replyId: "reply-002-01",
                        author: {
                            id: "user-3003",
                            name: "Emily Wong",
                            position: "Operations Manager",
                            company: "IBM",
                            avatarUrl: null,
                        },
                        content: "Yes, we’ve set up a few soundproof pods.",
                        createdAt: "2025-06-07T15:30:00Z",
                    },
                    {
                        replyId: "reply-002-02",
                        author: {
                            id: "user-3004",
                            name: "Carlos Martínez",
                            position: "DevOps Engineer",
                            company: "Google Cloud",
                            avatarUrl: null,
                        },
                        content: "Pods are a lifesaver for focused work!",
                        createdAt: "2025-06-07T15:45:00Z",
                    },
                ],
            },
        ],
    },
    {
        // Post 2
        postId: "post-002",
        author: {
            id: "user-1002",
            name: "Linda Zhang",
            position: "Head of Marketing",
            company: "Slack",
            avatarUrl: null,
        },
        content:
            "Thrilled to announce our Q2 campaign launch! Huge shoutout to the team for executing a vision that blends creativity with results.",
        imageUrl: "/assets/marketing-campaign.jpg",
        createdAt: "2025-06-07T16:30:00Z",
        likesCount: 58,
        favoritesCount: 18,
        comments: [
            {
                commentId: "comment-003",
                author: {
                    id: "user-2003",
                    name: "Tom Nguyen",
                    position: "Growth Strategist",
                    company: "Canva",
                    avatarUrl: null,
                },
                content: "Super sharp visuals and message. Congrats to the team!",
                createdAt: "2025-06-07T16:45:00Z",
                replies: [
                    {
                        replyId: "reply-003-01",
                        author: {
                            id: "user-3005",
                            name: "Rina Kapoor",
                            position: "Creative Director",
                            company: "Behance",
                            avatarUrl: null,
                        },
                        content: "Completely agree! One of the cleanest launches this year.",
                        createdAt: "2025-06-07T17:00:00Z",
                    },
                ],
            },
        ],
    },
    {
        // Post 3
        postId: "post-003",
        author: {
            id: "user-1003",
            name: "Michael Chan",
            position: "AI Research Lead",
            company: "NVIDIA",
            avatarUrl: null,
        },
        content:
            "We just pushed our latest open-source ML library focused on optimizing large language model inference speed on edge devices 🚀",
        imageUrl: "/assets/ml-library-release.jpg",
        createdAt: "2025-06-07T17:30:00Z",
        likesCount: 89,
        favoritesCount: 42,
        comments: [
            {
                commentId: "comment-004",
                author: {
                    id: "user-2004",
                    name: "Haruto Sato",
                    position: "Embedded Systems Engineer",
                    company: "Sony",
                    avatarUrl: null,
                },
                content: "Incredible. Will definitely try this out on our prototypes.",
                createdAt: "2025-06-07T17:45:00Z",
                replies: [
                    {
                        replyId: "reply-004-01",
                        author: {
                            id: "user-3006",
                            name: "Ana Rodriguez",
                            position: "ML Engineer",
                            company: "Hugging Face",
                            avatarUrl: null,
                        },
                        content: "We’ve integrated it already and saw ~30% speed gains!",
                        createdAt: "2025-06-07T18:00:00Z",
                    },
                ],
            },
        ],
    },
];

export default SAMPLE_POSTS;