// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'Dashbord',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      // { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
      { title: 'Scraper', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics }
      // { title: 'Proyectos', path: PATH_DASHBOARD.general.proyectos, icon: ICONS.analytics }
      // { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
      // { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Manejo',
    items: [
      // MANAGEMENT : USER
      {
        title: 'Usuarios',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Lista de usuarios', path: PATH_DASHBOARD.user.list },
          { title: 'Crear nuevo', path: PATH_DASHBOARD.user.newUser },
          { title: 'Editar', path: PATH_DASHBOARD.user.editById },
          { title: 'Mi cuenta', path: PATH_DASHBOARD.user.account }
        ]
      }
    ]
  }
];

export default sidebarConfig;
