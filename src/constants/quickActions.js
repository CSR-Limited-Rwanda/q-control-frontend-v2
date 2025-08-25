import { useAuthentication } from "@/context/authContext";
import {
  Dock,
  Dumbbell,
  File,
  Frown,
  Headset,
  LayoutDashboard,
  LayoutList,
  Mail,
  Ticket,
  User,
} from "lucide-react";

export const quickActions = ({ user }) => {
  // Fallback if user or profileId is undefined
  const profileId = user?.profileId || "";

  return [
    {
      icon: <LayoutDashboard size={20} color="var(--primary)" />,
      label: "Overview",
      href: "/incidents",
    },
    {
      icon: <Dumbbell size={20} color="var(--primary)" />,
      label: "Incident Tracking",
      href: "/incidents",
    },
    // {
    //   icon: <Frown size={20} color="var(--primary)" />,
    //   label: "Complaints",
    //   href: "/complaints",
    // },
    {
      icon: <LayoutList size={20} color="var(--primary)" />,
      label: "Tasks",
      href: "/tasks",
    },
    {
      icon: <User size={20} color="var(--primary)" />,
      label: "Profile",
      href: profileId ? `/accounts/${profileId}` : "/accounts",
    },
  ];
};

export const helplineActions = [
  {
    icon: <Headset size={20} color="var(--primary)" />,
    label: "Call Helpline",
    href: "tel:+250788449976",
  },
  {
    icon: <Mail size={20} color="var(--primary)" />,
    label: "Email Support",
    href: "mailto:salphonse@compstaffing.com",
  },
  {
    icon: <Ticket size={20} color="var(--primary)" />,
    label: "Submit a Ticket",
    href: "/cohesivehealthcare.us.4me.com/login",
  },
  {
    icon: <File size={20} color="var(--primary)" />,
    label: "How to use",
    href: "/docs.cohesiveapps.com/q-control", // Fixed URL scheme
  },
];