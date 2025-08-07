import { Dock, Dumbbell, File, Frown, Headset, LayoutDashboard, LayoutList, Mail, Ticket, User } from "lucide-react";

export const quickActions = [
    {
        icon: <LayoutDashboard size={20} color="var(--primary" />,
        label: 'Overview',
        href: '/incidents'
    },
    {
        icon: <Dumbbell size={20} color="var(--primary" />,
        label: 'Incident Tracking',
        href: '/incidents',
    },
    // {
    //     icon: <Frown size={20} color="var(--primary" />,
    //     label: 'Complaints',
    //     href: '/complaints',
    // },
    {
        icon: <LayoutList size={20} color="var(--primary" />,
        label: 'Tasks',
        href: '/tasks',
    },
    {
        icon: <User size={20} color="var(--primary" />,
        label: 'Profile',
        href: '/profile'
    },

]

export const HelplineActions = [
    {
        icon: <Headset size={20} color="var(--primary" />,
        label: 'Call Helpline',
        href: 'tel:+1234567890'
    },
    {
        icon: <Mail size={20} color="var(--primary" />,
        label: 'Email Support',
        href: 'mailto:support@example.com'
    },
    {
        icon: <Ticket size={20} color="var(--primary" />,
        label: 'Submit a Ticket',
        href: 'https://cohesivehealthcare.us.4me.com/login'
    },
    // {
    //     icon: <File size={20} color="var(--primary" />,
    //     label: 'How to use',
    //     href: '/docs'
    // }
]