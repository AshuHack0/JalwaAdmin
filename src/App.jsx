import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Login';
import WinGoManager from './pages/WinGoManager';
import AddTelegram from './pages/AddTelegram';
import DepositUpdate from './pages/DepositUpdate';
import IFSCModification from './pages/IFSCModification';
import BonusManage from './pages/BonusManage';
import AdminPassword from './pages/AdminPassword';
import ModifyBank from './pages/ModifyBank';
import GiftCode from './pages/GiftCode';
import ManageUsers from './pages/ManageUsers';
import BannedUsers from './pages/BannedUsers';
import WithdrawApply from './pages/WithdrawApply';
import WithdrawSent from './pages/WithdrawSent';
import WithdrawReject from './pages/WithdrawReject';
import Placeholder from './pages/Placeholder';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/wingo/3min" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/wingo/3min" replace />} />
        <Route path="wingo/:variant" element={<WinGoManager />} />
        <Route path="finance" element={<Navigate to="/finance/deposit-update" replace />} />
        <Route path="finance/deposit-update" element={<DepositUpdate />} />
        <Route path="finance/withdraw-apply" element={<WithdrawApply />} />
        <Route path="finance/withdraw-sent" element={<WithdrawSent />} />
        <Route path="finance/withdraw-reject" element={<WithdrawReject />} />
        <Route path="support" element={<Navigate to="/support/ifsc-modification" replace />} />
        <Route path="support/deposit-problem" element={<Placeholder title="Deposite Problem" />} />
        <Route path="support/withdrawal-problem" element={<Placeholder title="Withdrawal Problem" />} />
        <Route path="support/ifsc-modification" element={<IFSCModification />} />
        <Route path="support/bank-modification" element={<Placeholder title="Bank Modification" />} />
        <Route path="support/game-problem" element={<Placeholder title="Game Problem" />} />
        <Route path="manage" element={<Navigate to="/manage/telegram" replace />} />
        <Route path="manage/telegram" element={<AddTelegram />} />
        <Route path="manage/bonus" element={<BonusManage />} />
        <Route path="manage/admin-password" element={<AdminPassword />} />
        <Route path="manage/modify-bank" element={<ModifyBank />} />
        <Route path="manage/check-ip" element={<Placeholder title="Check Same IP" />} />
        <Route path="manage/maintenance" element={<Placeholder title="Site Maintenance" />} />
        <Route path="manage/banned-users" element={<BannedUsers />} />
        <Route path="manage/users" element={<ManageUsers />} />
        <Route path="manage/gift-code" element={<GiftCode />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
