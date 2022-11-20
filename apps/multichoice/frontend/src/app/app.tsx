// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import DefaultLayout from '../layouts/DefaultLayout';
import PrivateRoute from '../components/Routes/PrivateRoute';
import PublicRoute from '../components/Routes/PublicRoute';

// Pages
import CreateTest from '../pages/Tests/Create/CreateTest';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Tests from '../pages/Tests/Index/Tests';
import EditTest from '../pages/Tests/Edit/EditTest';
import CreateQuestion from '../pages/Question/CreateQuestion';
import PageNotFound from '../pages/Notfound/Notfound';

import { ReactNotifications } from 'react-notifications-component';
import CollectInfor from '../pages/Exam/CollectInfor/CollectInfor';
import DoExam from '../pages/Exam/DoExam/DoExam';
import Home from '../pages/Home/Home';
import Statistical from '../pages/Statistical/Statistical';
import StatisticExam from '../pages/Exam/StatisticExam/StatisticExam';
import StatisticUserExam from '../pages/Exam/StatisticExam/StatisticUserExam';
import ExamLayout from '../layouts/ExamLayout';
import DoExamRealtime from '../pages/Exam/DoExam/DoexamRealtime';
import FirstLoad from '../components/FirstLoad/FirstLoad';
import 'react-notifications-component/dist/theme.css';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';

export const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return loading ? (
    <FirstLoad />
  ) : (
    <BrowserRouter>
      <ReactNotifications />
      <Routes>
        <Route
          path="/login"
          element={<PublicRoute Component={Login} restricted={true} />}
        />
        <Route
          path="/register"
          element={<PublicRoute Component={Register} restricted={true} />}
        />
        <Route
          path="/forgot-password"
          element={<PublicRoute Component={ForgotPassword} restricted={true} />}
        />

        <Route path="/" element={<PrivateRoute Component={DefaultLayout} />}>
          <Route index element={<Home />} />

          <Route path="statistical" element={<Statistical />} />

          <Route path="tests">
            <Route index element={<Tests />} />
            <Route path="create" element={<CreateTest />} />
            <Route path="edit/:id" element={<EditTest />} />
            <Route path=":id/statistic" element={<StatisticExam />} />
            <Route
              path=":id/statistic/detail"
              element={<StatisticUserExam />}
            />
          </Route>

          <Route path="questions/create" element={<CreateQuestion />} />
        </Route>

        <Route path="e" element={<ExamLayout />}>
          <Route
            path=":exam_id/do-exam-realtime"
            element={<DoExamRealtime />}
          />
          <Route path=":exam_id" element={<CollectInfor />} />
          <Route path=":exam_id/do-exam" element={<DoExam />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
