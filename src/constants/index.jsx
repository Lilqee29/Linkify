import { ListPlus } from "lucide-react";
import { Smartphone } from "lucide-react";
import { FileText } from "lucide-react";
import { Eye } from "lucide-react";
import { Users } from "lucide-react";
import { BarChart2 } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Help", href: "/help" },
];


export const testimonials = [
  {
    user: "Alex Thompson",
    company: "Freelancer",
    image: user1,
    text: "Linkly made sharing all my online profiles effortless. My followers love having one place to find everything!",
  },
  {
    user: "Sofia Martinez",
    company: "Content Creator",
    image: user2,
    text: "I love how easy it is to customize my Linkly page. It looks professional and works perfectly for my audience.",
  },
  {
    user: "Ryan Lee",
    company: "Startup Founder",
    image: user3,
    text: "The analytics feature is a game-changer. I can track clicks and understand my audience like never before.",
  },
  {
    user: "Maya Patel",
    company: "Blogger",
    image: user4,
    text: "Adding and organizing links is so simple. My readers can now access everything from one clean link!",
  },
  {
    user: "Ethan Brooks",
    company: "Digital Artist",
    image: user5,
    text: "Linkly helped me present all my work professionally. It's fast, intuitive, and my followers love it.",
  },
  {
    user: "Lily Nguyen",
    company: "Influencer",
    image: user6,
    text: "The free tier is amazing, and upgrading to Pro was worth every penny. I can now share multiple pages and track engagement easily.",
  },
];



export const features = [
  {
    icon: <ListPlus />,
    text: "Drag-and-Drop Interface",
    description:
      "Easily organize and arrange your links with a simple drag-and-drop interface.",
  },
  {
    icon: <Smartphone />,
    text: "Multi-Platform Compatibility",
    description:
      "Access and share your Linkly on any device—mobile, desktop, or tablet—without extra setup.",
  },
  {
    icon: <FileText />,
    text: "Built-in Templates",
    description:
      "Get started quickly with ready-to-use templates for portfolios, social profiles, or business links.",
  },
  {
    icon: <Eye />,
    text: "Real-Time Preview",
    description:
      "See your Linkly update instantly as you add or edit links, so you know exactly how it will look.",
  },
  {
    icon: <Users />,
    text: "Collaboration Tools",
    description:
      "Share editing access with friends or teammates to build your Linkly together in real time.",
  },
  {
    icon: <BarChart2 />,
    text: "Analytics Dashboard",
    description:
      "Track clicks, visits, and interactions on your Linkly to understand what works best.",
  },
];
export const checklistItems = [
  {
    title: "Organize links effortlessly",
    description:
      "Drag, arrange, and categorize all your links in one place for quick access.",
  },
  {
    title: "Preview links instantly",
    description:
      "See your changes in real-time as you add or edit links, so it always looks perfect.",
  },
  {
    title: "AI-powered suggestions",
    description:
      "Get smart recommendations to optimize your links and improve engagement.",
  },
  {
    title: "Share your Linkly in seconds",
    description:
      "Generate a single clean link to share across social media or with friends.",
  },
];


export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "1 Linkly page",
      "Basic click analytics",
      "Customizable profile theme",
      "Standard support",
    ],
  },
  {
    title: "Pro",
    price: "$5 / month",
    features: [
      "Up to 5 Linkly pages",
      "Advanced click analytics",
      "Custom domain support (e.g., yourname.linkly.app)",
      "Access to premium themes",
      "Priority email support",
    ],
  },
  {
    title: "Business",
    price: "$20 / month",
    features: [
      "Unlimited Linkly pages",
      "Detailed analytics with trends",
      "Team collaboration features",
      "Custom branding options",
      "24/7 priority support",
    ],
  },
];


export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Help Center" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "FAQs" },
  { href: "#", text: "Contact Support" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Pricing" },
  { href: "#", text: "Custom Links" },
  { href: "#", text: "Analytics" },
  { href: "#", text: "Pro Tools" },
];

export const communityLinks = [
  { href: "#", text: "Blog" },
  { href: "#", text: "Discord" },
  { href: "#", text: "Social Media" },
  { href: "#", text: "Events" },
  { href: "#", text: "Feedback" },
];
