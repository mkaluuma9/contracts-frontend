// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Contracts',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'All contracts',
      type: 'item',
      url: '/contracts',
      icon: icons.LoginOutlined,
    
    },
    {
      id: 'register1',
      title: 'Add new contract',
      type: 'item',
      url: '/add-contract',
      icon: icons.ProfileOutlined,
      
    }
  ]
};

export default pages;
