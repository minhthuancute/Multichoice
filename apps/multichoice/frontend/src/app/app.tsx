// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './app.scss';

// Pages
import Home from '../pages/Home/Home';
import Loading from '../components/Loading/Loading';
import CreateTest from '../pages/Tests/Create/CreateTest';
// import lazy
const Login: React.FC = React.lazy(() => import('../pages/Login/Login'));
const Register: React.FC = React.lazy(
  () => import('../pages/Register/Register')
);
const Tests: React.FC = React.lazy(() => import('../pages/Tests/Index/Tests'));
const EditTest: React.FC = React.lazy(
  () => import('../pages/Tests/Edit/EditTest')
);

const PageNotFound: React.FC = React.lazy(
  () => import('../pages/Notfound/Notfound')
);

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route
          path="/tests"
          element={
            <Suspense fallback={<Loading />}>
              <Tests />
            </Suspense>
          }
        />
        <Route
          path="/tests/create"
          element={
            <Suspense fallback={<Loading />}>
              <CreateTest />
            </Suspense>
          }
        />
        <Route
          path="/tests/edit/:id"
          element={
            <Suspense fallback={<Loading />}>
              <EditTest />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<Loading />}>
              <Register />
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
