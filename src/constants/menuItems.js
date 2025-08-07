import { Dumbbell, LayoutDashboard, LayoutList, Users } from "lucide-react";

export const menuItems = [
    {
        icon: <LayoutDashboard size={20} />,
        label: 'Dashboard',
        href: '/'
    },

    {
        icon: <Dumbbell size={24} />,
        label: "Incident Tracking",
        href: "/incidents",
        matchPaths: ["/incident", "/incidents"],
        // items: [
        //     { label: "Overview", href: "/incidents/" },
        //     { label: "General Incident", href: "/incidents/general" },
        //     { label: "Staff Incident", href: "/incidents/staff" },
        //     { label: "Lost and Found", href: "/incidents/lost-and-found" },
        //     { label: "Grievance", href: "/incidents/grievance" },
        //     { label: "Medication Error", href: "/incidents/medication-error" },
        //     { label: "Drug Reaction", href: "/incidents/drug-reaction" },
        //     { label: "Workplace Violence", href: "/incidents/workplace-violence" },
        // ]
    },
    {
        icon: <LayoutList size={24} />,
        label: "Tasks",
        href: "/tasks",
        matchPaths: ["/tasks"],
    },
    {
        icon: <Users size={24} />,
        label: "Account Management",
        href: "/accounts",
        // matchPaths: ["/accounts"],
        // items: [
        //     { label: "Users", href: "/accounts/users" },
        //     { label: "Roles", href: "/accounts/roles" },
        //     { label: "Permissions", href: "/accounts/permissions" },
        // ]
    },

];