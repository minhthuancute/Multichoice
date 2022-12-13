import { Navigate, Route, Routes } from 'react-router-dom';
import AuthenLayout from '../../layouts/AuthenLayout';
import DefaultLayout from '../../layouts/DefaultLayout';
import ExamLayout from '../../layouts/ExamLayout';
import CreateTest from '../../pages/CreateTest/CreateTest';
import DoExam from '../../pages/DoExam/DoExam';
import DoExamRealtime from '../../pages/DoexamRealtime/DoexamRealtime';
import EditTest from '../../pages/EditTest/EditTest';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';
import Login from '../../pages/Login/Login';
import PageNotfound from '../../pages/Notfound/Notfound';
import Register from '../../pages/Register/Register';
import Statistical from '../../pages/Statistical/Statistical';
import StatisticExam from '../../pages/StatisticExam/StatisticExam';
import StatisticUserExam from '../../pages/StatisticUserExam/StatisticUserExam';
import Tests from '../../pages/Tests/Tests';
import CreateQuestion from '../CreateQuestion/CreateQuestion';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import 'react-notifications-component/dist/theme.css';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<PublicRoute Component={AuthenLayout} restricted={true} />}
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="/" element={<PrivateRoute Component={DefaultLayout} />}>
        <Route index element={<Navigate to={'/tests'} />} />
        {/*<Route index element={<Home />} />*/}

        <Route path="statistical" element={<Statistical />} />

        <Route path="tests">
          <Route index element={<Tests />} />
          <Route path="create" element={<CreateTest />} />
          <Route path="edit/:id" element={<EditTest />} />
          <Route path=":id/statistic" element={<StatisticExam />} />
          <Route path=":id/statistic/detail" element={<StatisticUserExam />} />
        </Route>

        <Route path="questions/create" element={<CreateQuestion />} />
      </Route>

      <Route path="e" element={<ExamLayout />}>
        <Route path=":url/do-exam-realtime" element={<DoExamRealtime />} />
        <Route path=":url/do-exam" element={<DoExam />} />
      </Route>

      <Route path="*" element={<PageNotfound />} />
    </Routes>
  );
};

export default AppRoutes;
