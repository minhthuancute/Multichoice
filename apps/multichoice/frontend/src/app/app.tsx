// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './app.scss';

import DefaultLayout from '../layouts/DefaultLayout';

import PrivateRoute from '../components/Routes/PrivateRoute';
import PublicRoute from '../components/Routes/PublicRoute';
import Loading from '../components/Loading/Loading';

// Pages

import CreateTest from '../pages/Tests/Create/CreateTest';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Tests from '../pages/Tests/Index/Tests';
import EditTest from '../pages/Tests/Edit/EditTest';
import CreateQuestion from '../pages/Question/CreateQuestion';
import PageNotFound from '../pages/Notfound/Notfound';

import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import Intro from '../pages/Exam/Intro/Intro';
import CollectInfor from '../pages/Exam/CollectInfor/CollectInfor';
import DoExam from '../pages/Exam/DoExam/DoExam';
import Home from '../pages/Home/Home';
import Statistical from '../pages/Statistical/Statistical';
import { firePush, fireSet } from '../utils/firebase_utils';
import StatisticExam from '../pages/Exam/StatisticExam/StatisticExam';

export const App: React.FC = () => {
  return (
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

        <Route path="/" element={<PrivateRoute Component={DefaultLayout} />}>
          <Route index element={<Home />} />

          <Route path="statistical" element={<Statistical />} />

          <Route path="tests">
            <Route index element={<Tests />} />
            <Route path="create" element={<CreateTest />} />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<Loading />}>
                  <EditTest />
                </Suspense>
              }
            />
            <Route path=":id/statistic" element={<StatisticExam />} />
          </Route>

          <Route path="questions/create" element={<CreateQuestion />} />
        </Route>

        <Route path="exam">
          <Route path=":exam_id" element={<Intro />} />
          <Route path=":exam_id/login" element={<CollectInfor />} />
          <Route path=":exam_id/do-exam" element={<DoExam />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
