// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Legislation',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'All Laws',
      type: 'item',
      url: '/legislations',
      icon: icons.ChromeOutlined
    },
    {
      id: 'documentation',
      title: 'Add new law',
      type: 'item',
      url: '/add-legislation',
      icon: icons.QuestionOutlined,
    }
  ]
};

export default support;
