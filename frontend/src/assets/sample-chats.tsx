
/// ** There are the json data that return from the server when you fetch messages for a specific chat ** ///

export const messagesWithBessie = [
    {
        id: '1',
        text: "Hi, Michael. I'm facing some challenges in optimizing my code for performance. Can you help?",
        sender: 'other',
        timestamp: '10:45 AM',
        avatar: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random',
        name: 'Bessie',
    },
    {
        id: '2',
        text: "Hi, Bessie! 👋 I'd be glad to help you with optimizing your code for better performance. To get started, could you provide me with some more details about the specific challenges you're facing?",
        sender: 'user', // assuming 'user' is the current user
        timestamp: '10:53 AM',
    },
    {
        id: '3',
        text: "Sure! I'm working on a React app with a large dataset. The rendering is really slow when I update the state, especially with lists containing 1000+ items.",
        sender: 'other', //
        timestamp: '10:55 AM',
        avatar: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random',
        name: 'Bessie',
    },
    {
        id: '4',
        text: "Ah, I see. For large lists in React, you should definitely look into virtualization. Have you tried using react-window or react-virtualized?",
        sender: 'user',
        timestamp: '10:57 AM',
    },
    {
        id: '5',
        text: "I haven't heard of those before. How do they work?",
        sender: 'other',
        timestamp: '10:58 AM',
        avatar: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random',
        name: 'Bessie',
    },
    {
        id: '6',
        text: "They only render the items that are visible in the viewport, which dramatically reduces the number of DOM nodes. Instead of rendering 1000 items, you might only render 20-30 that are actually visible.",
        sender: 'user',
        timestamp: '11:00 AM',
    },
    {
        id: '7',
        text: "That sounds amazing! 🤩 Do you have any example code I could look at?",
        sender: 'other',
        timestamp: '11:02 AM',
        avatar: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random',
        name: 'Bessie',
    },
    {
        id: '8',
        text: "Of course! Let me share a simple example using react-window. Give me a moment to write it up for you.",
        sender: 'user',
        timestamp: '11:03 AM',
    },
    {
        id: '9',
        text: "Also, are you using React.memo() or useMemo() for your components? These can help prevent unnecessary re-renders.",
        sender: 'user',
        timestamp: '11:05 AM',
    },
    {
        id: '10',
        text: "I've used useMemo() a few times, but I'm not sure if I'm using it correctly. When should I use React.memo vs useMemo?",
        sender: 'other',
        timestamp: '11:07 AM',
        avatar: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random',
        name: 'Bessie',
    },
    {
        id: '11',
        text: "Great question! React.memo is for memoizing entire components to prevent re-renders when props haven't changed. useMemo is for memoizing expensive calculations within a component.",
        sender: 'user',
        timestamp: '11:09 AM',
    },
    {
        id: '12',
        text: "Hi, Michael. I am doing well, thanks for asking!",
        sender: 'other',
        timestamp: '11:15 AM',
        avatar: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random',
        name: 'Bessie',
    }
]


// Sample messages with Ethan
export const messagesWithEthan = [
    {
        "id": "1",
        "text": "Hey Ethan! How's your weekend going?",
        "sender": "user",
        "timestamp": "9:00 AM"
    },
    {
        "id": "2",
        "text": "Hey Michael! It's going great. Just catching up on some reading. How about you?",
        "sender": "other",
        "timestamp": "9:05 AM",
        "avatar": "https://ui-avatars.com/api/?name=Ethan+Martinez&background=random",
        "name": "Ethan"
    },
    {
        "id": "3",
        "text": "Nice! I'm working on a new side project. Building a chat application actually.",
        "sender": "user",
        "timestamp": "9:07 AM"
    },
    {
        "id": "4",
        "text": "That sounds interesting! What tech stack are you using?",
        "sender": "other",
        "timestamp": "9:10 AM",
        "avatar": "https://ui-avatars.com/api/?name=Ethan+Martinez&background=random",
        "name": "Ethan"
    },
    {
        "id": "5",
        "text": "Next.js with Supabase for the backend. Really enjoying the real-time features.",
        "sender": "user",
        "timestamp": "9:12 AM"
    },
    {
        "id": "6",
        "text": "Supabase is awesome! I used it for my last project. The authentication setup was so easy.",
        "sender": "other",
        "timestamp": "9:15 AM",
        "avatar": "https://ui-avatars.com/api/?name=Ethan+Martinez&background=random",
        "name": "Ethan"
    },
    {
        "id": "7",
        "text": "Totally agree! Any tips for handling real-time subscriptions efficiently?",
        "sender": "user",
        "timestamp": "9:18 AM"
    },
    {
        "id": "8",
        "text": "Make sure to clean up your subscriptions when components unmount. Memory leaks can be a pain.",
        "sender": "other",
        "timestamp": "9:20 AM",
        "avatar": "https://ui-avatars.com/api/?name=Ethan+Martinez&background=random",
        "name": "Ethan"
    },
    {
        "id": "9",
        "text": "Good point! I'll make sure to handle that properly. Thanks for the tip!",
        "sender": "user",
        "timestamp": "9:22 AM"
    },
    {
        "id": "10",
        "text": "No worries! Let me know if you need any code examples. I have some snippets saved.",
        "sender": "other",
        "timestamp": "9:24 AM",
        "avatar": "https://ui-avatars.com/api/?name=Ethan+Martinez&background=random",
        "name": "Ethan"
    },
    {
        "id": "11",
        "text": "That would be great! I'd appreciate it.",
        "sender": "user",
        "timestamp": "9:25 AM"
    },
    {
        "id": "12",
        "text": "Not much, just planning to relax...",
        "sender": "other",
        "timestamp": "9:25 AM",
        "avatar": "https://ui-avatars.com/api/?name=Ethan+Martinez&background=random",
        "name": "Ethan"
    }
]

export const messagesWithAlex = [
    {
        "id": "1",
        "text": "Michael, do you have a moment to discuss the quarterly report?",
        "sender": "other",
        "timestamp": "2:00 PM",
        "avatar": "https://ui-avatars.com/api/?name=Alex+Carter&background=random",
        "name": "Alex"
    },
    {
        "id": "2",
        "text": "Sure, Alex. I'm free now. What specific aspects would you like to go over?",
        "sender": "user",
        "timestamp": "2:05 PM"
    },
    {
        "id": "3",
        "text": "I noticed some discrepancies in the revenue projections. Can you check the calculations on page 5?",
        "sender": "other",
        "timestamp": "2:08 PM",
        "avatar": "https://ui-avatars.com/api/?name=Alex+Carter&background=random",
        "name": "Alex"
    },
    {
        "id": "4",
        "text": "Let me pull up the report and take a look. Give me a few minutes.",
        "sender": "user",
        "timestamp": "2:10 PM"
    },
    {
        "id": "5",
        "text": "You're right. There's a formula error in cell D15. It's not including the Q3 data.",
        "sender": "user",
        "timestamp": "2:15 PM"
    },
    {
        "id": "6",
        "text": "I thought something looked off. Can you fix it and send me the updated version?",
        "sender": "other",
        "timestamp": "2:17 PM",
        "avatar": "https://ui-avatars.com/api/?name=Alex+Carter&background=random",
        "name": "Alex"
    },
    {
        "id": "7",
        "text": "Already on it. I'll have the corrected report to you within the hour.",
        "sender": "user",
        "timestamp": "2:20 PM"
    },
    {
        "id": "8",
        "text": "Perfect. Also, could you add a summary slide for the executive presentation?",
        "sender": "other",
        "timestamp": "2:22 PM",
        "avatar": "https://ui-avatars.com/api/?name=Alex+Carter&background=random",
        "name": "Alex"
    },
    {
        "id": "9",
        "text": "No problem. I'll include key metrics and year-over-year comparisons.",
        "sender": "user",
        "timestamp": "2:25 PM"
    },
    {
        "id": "10",
        "text": "Thanks Michael. You always deliver quality work.",
        "sender": "other",
        "timestamp": "2:27 PM",
        "avatar": "https://ui-avatars.com/api/?name=Alex+Carter&background=random",
        "name": "Alex"
    },
    {
        "id": "11",
        "text": "Happy to help! I'll send you the updated report shortly.",
        "sender": "user",
        "timestamp": "2:30 PM"
    },
    {
        "id": "12",
        "text": "Hey, did you finish the report?",
        "sender": "other",
        "timestamp": "3:30 PM",
        "avatar": "https://ui-avatars.com/api/?name=Alex+Carter&background=random",
        "name": "Alex"
    }
]


/// *** Sample data you store in the messages table for your reference *** ///
// Messages between current user(asdff - 5555 - 6666) and Bessie Cooper(0481d6cc - d641 - 4597)
// const messagesWithBessie = [
//     {
//         sender_id: '0481d6cc-d641-4597',
//         receiver_id: 'asdff-5555-6666',
//         content: "Hi, Michael. I'm facing some challenges in optimizing my code for performance. Can you help?",
//         sent_at: '2025-01-24 10:45:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-d641-4597',
//         content: "Hi, Bessie! 👋 I'd be glad to help you with optimizing your code for better performance. To get started, could you provide me with some more details about the specific challenges you're facing?",
//         sent_at: '2025-01-24 10:53:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-d641-4597',
//         receiver_id: 'asdff-5555-6666',
//         content: "Sure! I'm working on a React app with a large dataset. The rendering is really slow when I update the state, especially with lists containing 1000+ items.",
//         sent_at: '2025-01-24 10:55:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-d641-4597',
//         content: "Ah, I see. For large lists in React, you should definitely look into virtualization. Have you tried using react-window or react-virtualized?",
//         sent_at: '2025-01-24 10:57:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-d641-4597',
//         receiver_id: 'asdff-5555-6666',
//         content: "I haven't heard of those before. How do they work?",
//         sent_at: '2025-01-24 10:58:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-d641-4597',
//         content: "They only render the items that are visible in the viewport, which dramatically reduces the number of DOM nodes. Instead of rendering 1000 items, you might only render 20-30 that are actually visible.",
//         sent_at: '2025-01-24 11:00:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-d641-4597',
//         receiver_id: 'asdff-5555-6666',
//         content: "That sounds amazing! 🤩 Do you have any example code I could look at?",
//         sent_at: '2025-01-24 11:02:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-d641-4597',
//         content: "Of course! Let me share a simple example using react-window. Give me a moment to write it up for you.",
//         sent_at: '2025-01-24 11:03:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-d641-4597',
//         content: "Also, are you using React.memo() or useMemo() for your components? These can help prevent unnecessary re-renders.",
//         sent_at: '2025-01-24 11:05:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-d641-4597',
//         receiver_id: 'asdff-5555-6666',
//         content: "Hi, Michael. I am doing well, thanks for asking!",
//         sent_at: '2025-01-24 11:15:00.000+00'
//     }
// ];

// *** Messages between current user (asdff-5555-6666) and Ethan Martinez (0481d6cc-dasd-t12fs)
// const messagesWithEthan = [
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-dasd-t12fs',
//         content: "Hey Ethan! How's your weekend going?",
//         sent_at: '2025-01-24 09:00:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-dasd-t12fs',
//         receiver_id: 'asdff-5555-6666',
//         content: "Hey Michael! It's going great. Just catching up on some reading. How about you?",
//         sent_at: '2025-01-24 09:05:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-dasd-t12fs',
//         content: "Nice! I'm working on a new side project. Building a chat application actually.",
//         sent_at: '2025-01-24 09:07:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-dasd-t12fs',
//         receiver_id: 'asdff-5555-6666',
//         content: "That sounds interesting! What tech stack are you using?",
//         sent_at: '2025-01-24 09:10:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-dasd-t12fs',
//         content: "Next.js with Supabase for the backend. Really enjoying the real-time features.",
//         sent_at: '2025-01-24 09:12:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-dasd-t12fs',
//         receiver_id: 'asdff-5555-6666',
//         content: "Supabase is awesome! I used it for my last project. The authentication setup was so easy.",
//         sent_at: '2025-01-24 09:15:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-dasd-t12fs',
//         content: "Totally agree! Any tips for handling real-time subscriptions efficiently?",
//         sent_at: '2025-01-24 09:18:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-dasd-t12fs',
//         receiver_id: 'asdff-5555-6666',
//         content: "Make sure to clean up your subscriptions when components unmount. Memory leaks can be a pain.",
//         sent_at: '2025-01-24 09:20:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-dasd-t12fs',
//         content: "Good point! I'll make sure to handle that properly. Thanks for the tip!",
//         sent_at: '2025-01-24 09:22:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-dasd-t12fs',
//         receiver_id: 'asdff-5555-6666',
//         content: "Not much, just planning to relax...",
//         sent_at: '2025-01-24 09:25:00.000+00'
//     }
// ];

// *** Messages between current user (asdff-5555-6666) and Alex Carter (0481d6cc-asdt-14524)
// const messagesWithAlex = [
//     {
//         sender_id: '0481d6cc-asdt-14524',
//         receiver_id: 'asdff-5555-6666',
//         content: "Michael, do you have a moment to discuss the quarterly report?",
//         sent_at: '2025-01-24 14:00:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-asdt-14524',
//         content: "Sure, Alex. I'm free now. What specific aspects would you like to go over?",
//         sent_at: '2025-01-24 14:05:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-asdt-14524',
//         receiver_id: 'asdff-5555-6666',
//         content: "I noticed some discrepancies in the revenue projections. Can you check the calculations on page 5?",
//         sent_at: '2025-01-24 14:08:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-asdt-14524',
//         content: "Let me pull up the report and take a look. Give me a few minutes.",
//         sent_at: '2025-01-24 14:10:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-asdt-14524',
//         content: "You're right. There's a formula error in cell D15. It's not including the Q3 data.",
//         sent_at: '2025-01-24 14:15:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-asdt-14524',
//         receiver_id: 'asdff-5555-6666',
//         content: "I thought something looked off. Can you fix it and send me the updated version?",
//         sent_at: '2025-01-24 14:17:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-asdt-14524',
//         content: "Already on it. I'll have the corrected report to you within the hour.",
//         sent_at: '2025-01-24 14:20:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-asdt-14524',
//         receiver_id: 'asdff-5555-6666',
//         content: "Perfect. Also, could you add a summary slide for the executive presentation?",
//         sent_at: '2025-01-24 14:22:00.000+00'
//     },
//     {
//         sender_id: 'asdff-5555-6666',
//         receiver_id: '0481d6cc-asdt-14524',
//         content: "No problem. I'll include key metrics and year-over-year comparisons.",
//         sent_at: '2025-01-24 14:25:00.000+00'
//     },
//     {
//         sender_id: '0481d6cc-asdt-14524',
//         receiver_id: 'asdff-5555-6666',
//         content: "Hey, did you finish the report?",
//         sent_at: '2025-01-24 15:30:00.000+00'
//     }
// ];

// // Combined all messages (for database insertion)
// const allMessages = [
//     ...messagesWithBessie,
//     ...messagesWithEthan,
//     ...messagesWithAlex
// ];