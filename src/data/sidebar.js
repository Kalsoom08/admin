import {
  // ShieldBan,
  Monitor,
  // Bug,
  ListChecks,
  // XCircle,
  HelpCircle,
  LayoutDashboard,
  // Lock,
  // LockKeyhole,
  MessagesSquare,
  Bell,
  // Package,
  Palette,
  // ServerOff,
  Settings,
  Wrench,
  UserCog,
  // UserX,
TriangleAlert ,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  ChartBarIncreasing, FileText, Users, HandCoins, Tag, ShoppingBasket, DollarSign, ShoppingCart, Timer
} from 'lucide-react';

// import { ClerkLogo } from '@assets/clerk-logo';
import logo from "../assets/logo.png"
export const sidebarData = {
  user: {
    name: 'Ahmad Cafe',
    email: 'ahmadcafe@gmail.com',
 
  },
  teams: [
    {
      name: 'Ahmad Cafe',
      logo: Command,
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard
        },
        {
          title: 'Expenses',
          url: '/expenses',
          icon: FileText
        },
        {
          title: 'Sales',
          url: '/sales',
          icon: ChartBarIncreasing
        },
        {
          title: 'Employees',
          url: '/employees',
          icon: Users
        },
         {
          title: 'PayRoll',
          url: '/pay-roll',
          icon: HandCoins
        },
        {
          title: 'Category',
          url: '/category',
          icon: Tag
        },
        {
          title: 'Items',
          url: '/items',
          icon: ShoppingBasket
        },
       {
          title: 'Stock Alert',
          url: '/stock-alert',
          icon: TriangleAlert
        },
        {
          title: 'Orders',
          url: "/orders", 
          icon: ShoppingBasket
        }

      ]
    },
  
  ]
};
