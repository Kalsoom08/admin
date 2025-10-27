import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardCards from '../../maincomponents/Cards/DashboardCard';
import SmCard from '@maincomponents/Cards/SmCard';
import DashboardCardSkeleton from '@maincomponents/loaders/DashboardSkeleton';
import { fetchOrderStats } from "@redux/actions/orders";
import { fetchDashboard } from '@redux/slice/dashboardSlice';
import {
  ChartBarIncreasing,
  FileText,
  Users,
  HandCoins,
  Tag,
  ShoppingBasket,
  DollarSign,
  ShoppingCart,
  Timer,
  Plus,
  ChartLine,
  UserPlus,
  Settings,
  FolderPlus,
  FolderKanban
} from 'lucide-react';

const cardConfig = {
  expenses: {
    bgColor: 'bg-[#FEE2E2]',
    bgIcon: 'bg-[#EF4444]',
    textColor: 'text-[#DC2626] ',
    buttonClassName: 'bg-[#EF4444] hover:bg-[#DC2626] text-white',
    badge: '+12%',
    subTitle: 'Expenses This month',
    name: 'Expenses ',
    icon: <FileText size={20} />,
    btnIcon: <Plus size={15} />,
    btnText: 'Add Expense ',
    route: '/expenses'
  },
  revenue: {
    bgColor: 'bg-[#DCFCE7]',
    bgIcon: 'bg-[#22C55E]',
    textColor: 'text-[#16A34A]',
    buttonClassName: 'bg-[#22C55E] hover:bg-[#16A34A] text-white',
    badge: '+10%',
    subTitle: 'Revenue this month ',
    name: 'Revenue',
    icon: <ChartBarIncreasing size={20} />,
    btnIcon: <ChartLine size={15} />,
    btnText: 'View Reports',
    route: '/sales'
  },
  employee: {
    bgColor: 'bg-[#DBEAFE]',
    bgIcon: 'bg-[#3B82F6]',
    textColor: 'text-[#3B82F6]',
    buttonClassName: 'bg-[#3B82F6] hover:bg-[#0369A1] text-white',
    badge: 'Active',
    subTitle: 'Active Employees',
    name: 'Employee Management',
    icon: <Users size={20} />,
    btnIcon: <UserPlus size={15} />,
    btnText: 'Add Employee',
    route: '/employees'
  },
  payroll: {
    bgColor: 'bg-[#F3E8FF] ',
    bgIcon: 'bg-[#9333EA]',
    textColor: 'text-[#9333EA]',
    buttonClassName: 'bg-[#9333EA] hover:bg-[#A855F7] text-white',
    badge: 'Paid',
    subTitle: 'Total Payrolls',
    name: 'Payroll Management',
    icon: <HandCoins size={20} />,
    btnIcon: <Settings size={15} />,
    btnText: 'Manage Salary',
    route: '/pay-roll'
  },
  category: {
    bgColor: 'bg-[#FFEDD5]',
    bgIcon: 'bg-[#EA580C]',
    textColor: 'text-[#EA580C]',
    buttonClassName: 'bg-[#EA580C] hover:bg-[#F97316] text-white',
    badge: '+15%',
    subTitle: 'Active Categories',
    name: 'Categories',
    icon: <Tag size={20} />,
    btnIcon: <FolderPlus size={15} />,
    btnText: 'Manage Categories',
    route: '/category'
  },
  item: {
    bgColor: 'bg-[#CCFBF1]',
    bgIcon: 'bg-[#0D9488]',
    textColor: 'text-[#0D9488]',
    buttonClassName: 'bg-[#0D9488] hover:bg-[#14B8A6] text-white',
    badge: 'In Stock',
    subTitle: 'Total Items',
    name: 'Items',
    icon: <ShoppingBasket size={20} />,
    btnIcon: <FolderKanban size={15} />,
    btnText: 'Manage Items',
    route: '/items'
  }
};

const Dashboard = () => {
  let once = true
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, loading, error } = useSelector((state) => state.dashboard);
  const { stats, statsLoading, statsError } = useSelector((state) => state.order);

  useEffect(() => {
    if(once){
      once=false
    dispatch(fetchDashboard());
    dispatch(fetchOrderStats());
    }
  }, [dispatch]);

  const mainCardsData = [
    { type: 'expenses', price: `Rs. ${data?.totalExpense || 0}` },
    { type: 'revenue', price: `Rs. ${data?.totalSales || 0}` },
    { type: 'employee', price: data?.totalUsers || 0 },
    { type: 'payroll', price: `Rs. ${data?.employeeSalary || 0}` },
    { type: 'category', price: data?.totalCategories || 0 },
    { type: 'item', price: data?.totalItems || 0 }
  ];

  const smCardsData = [
    {
      iconColor: 'bg-[#FEE2E2]',
      textColor: 'text-[#16A34A]',
      name: 'Total Orders',
      totalPrice: stats?.totalOrders || 0,
      btnIcon: <DollarSign size={15} />
    },
    {
      iconColor: 'bg-[#0D9488]',
      textColor: 'text-[#0284C7]',
      name: 'Pending Orders',
      totalPrice: stats?.pendingOrders || 0,
      btnIcon: <ShoppingCart size={15} />
    },
    {
      iconColor: 'bg-[#E0F2FE]',
      textColor: 'text-[#0284C7]',
      name: 'Delivered Orders',
      totalPrice: stats?.deliveredOrders || 0,
      btnIcon: <Users size={15} />
    },
    {
      iconColor: 'bg-[#FDE68A]',
      textColor: 'text-[#B45309]',
      name: 'Cancelled Orders',
      totalPrice: stats?.cancelledOrders || 0,
      btnIcon: <Timer size={15} />
    }
  ];

  if (loading || statsLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <DashboardCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error || statsError) {
    return <p className="text-center text-red-500">Failed to load dashboard data.</p>;
  }

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome Ahmad!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>
      </div>

      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mainCardsData.map((card, index) => {
          const config = cardConfig[card.type];
          return config ? (
            <DashboardCards className='dark:bg-[#020618] ' key={index} {...config} totalPrice={card.price} />
          ) : null;
        })}
      </div>

      <div className="py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {smCardsData.map((card, index) => (
          <SmCard
            key={index}
            bgColor={card.iconColor}
            textColor={card.textColor}
            name={card.name}
            totalPrice={card.totalPrice}
            btnIcon={card.btnIcon}
          />
        ))}
      </div>

   
      <div className="fixed bottom-8 right-8 z-50">
        <div
          onClick={() => navigate('/orders')}
          className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-[#000000] dark:bg-white  hover:bg-[#4f804c] transition-all duration-200 cursor-pointer"
        >
          <ShoppingCart size={28} className="text-white dark:text-[#020800]" />
        
        </div>
      </div>
    </>
  );
};

export default Dashboard;
