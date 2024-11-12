import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const Contracts = Loadable(lazy(() => import('pages/extra-pages/contracts')));
const AddContract = Loadable(lazy(() => import('pages/extra-pages/create-contract')));
const EditContract = Loadable(lazy(() => import('pages/extra-pages/edit-contract')));

const Cases = Loadable(lazy(() => import('pages/extra-pages/cases')));
const AddCase = Loadable(lazy(() => import('pages/extra-pages/create-case')));
const EditCase = Loadable(lazy(() => import('pages/extra-pages/edit-case')));

const Legislations = Loadable(lazy(() => import('pages/extra-pages/legislations')));
const AddLegislation = Loadable(lazy(() => import('pages/extra-pages/create-legislation')));
const EditLegislation = Loadable(lazy(() => import('pages/extra-pages/edit-legislation')));

const Files = Loadable(lazy(() => import('pages/extra-pages/files')));
const AddFile = Loadable(lazy(() => import('pages/extra-pages/create-file')));
const EditFile = Loadable(lazy(() => import('pages/extra-pages/edit-file')));



// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'contracts',
      element: <Contracts />
    },
    {
      path: 'add-contract',
      element: <AddContract />
    },
    {
      path: 'edit-contract/:id',
      element: <EditContract />
    },
    {
      path: 'cases',
      element: <Cases />
    },
    {
      path: 'add-case',
      element: <AddCase />
    },
    {
      path: 'edit-case/:id',
      element: <EditCase />
    },
    {
      path: 'legislations',
      element: <Legislations />
    },
    {
      path: 'add-legislation',
      element: <AddLegislation />
    },
    {
      path: 'edit-legislation/:id',
      element: <EditLegislation />
    },
    {
      path: 'files',
      element: <Files />
    },
    {
      path: 'add-file',
      element: <AddFile />
    },
    {
      path: 'edit-file/:id',
      element: <EditFile />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;
