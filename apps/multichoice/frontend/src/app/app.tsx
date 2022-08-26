// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './app.scss';

// Pages
import Home from '../pages/Home/Home';
import Loading from '../components/Loading/Loading';
import CreateTest from '../pages/Tests/Create/CreateTest';
import PrivateRoute from '../components/Routes/PrivateRoute';
import PublicRoute from '../components/Routes/PublicRoute';
import DefaultLayout from '../layouts/DefaultLayout';

import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
// import lazy
const Login: React.FC = React.lazy(() => import('../pages/Login/Login'));
const Register: React.FC = React.lazy(
  () => import('../pages/Register/Register')
);
const Tests: React.FC = React.lazy(() => import('../pages/Tests/Index/Tests'));
const EditTest: React.FC = React.lazy(
  () => import('../pages/Tests/Edit/EditTest')
);

const CreateQuestion: React.FC = React.lazy(
  () => import('../pages/Question/CreateQuestion')
);

const PageNotFound: React.FC = React.lazy(
  () => import('../pages/Notfound/Notfound')
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ReactNotifications />
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loading />}>
              <PublicRoute Component={Login} restricted={true} />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<Loading />}>
              <PublicRoute Component={Register} restricted={true} />
            </Suspense>
          }
        />

        <Route index element={<PrivateRoute Component={Home} />} />

        <Route
          path="/tests"
          element={<PrivateRoute Component={DefaultLayout} />}
        >
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <Tests />
              </Suspense>
            }
          />
          <Route
            path="create"
            element={
              <Suspense fallback={<Loading />}>
                <CreateTest />
              </Suspense>
            }
          />
          <Route
            path="edit/:id"
            element={
              <Suspense fallback={<Loading />}>
                <EditTest />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="/questions/create"
          element={
            <Suspense fallback={<Loading />}>
              <CreateQuestion />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<Loading />}>
              <PageNotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
