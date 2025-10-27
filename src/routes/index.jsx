import Login from '@pages/auth/Login';
import Dashboard from '@pages/private/Dashboard';
import { createBrowserRouter } from 'react-router-dom';
import RedirectRoute from '@routes/RedirectRoutes';
import PrivateRoutes from '@routes/PrivateRoutes';
import DashboardLayout from '@layouts/DashboardLayout';
import Expenses from '@pages/private/Expenses';
import Sales from '@pages/private/Sales';
import Employees from '@pages/private/Employees';
import Category from '@pages/private/Category';
import Items from '@pages/private/Items';
import StockAlert from '@pages/private/StockAlert';
import PayRoll from '@pages/private/PayRoll';
import Orders from '@pages/private/Orders'

export default createBrowserRouter([
  {
    path: '/signin',
    element: (
      <RedirectRoute>  
      <Login />
      </RedirectRoute>
    )
  },
  {
    path: '/',
    element: (
      <PrivateRoutes> 
      <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/expenses',
        element: <Expenses />
      },
      {
        path: '/sales',
        element: <Sales />
      },
      {
        path: '/employees',
        element: <Employees />
      },
      {
        path: '/pay-roll',
        element: <PayRoll />
      },
      {
        path: 'Category',
        element: <Category />
      },
      {
        path: '/items',
        element: <Items />
      },
      {
        path: '/stock-alert',
        element: <StockAlert/>
      },
      {
        path: '/orders',
        element: <Orders/>
      }
    ]
  }
]);
