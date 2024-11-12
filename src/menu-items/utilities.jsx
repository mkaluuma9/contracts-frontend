// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Litigation',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'All cases',
      type: 'item',
      url: '/cases',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'util-color',
      title: 'Add new case',
      type: 'item',
      url: '/add-case',
      icon: icons.BgColorsOutlined
    }
  ]
};

export default utilities;
