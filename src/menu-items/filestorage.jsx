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
  
  // ==============================|| MENU ITEMS - FILE STORAGE ||============================== //
  
  const utilities = {
    id: 'utilities',
    title: 'File Storage',
    type: 'group',
    children: [
      {
        id: 'util-',
        title: 'Files',
        type: 'item',
        url: '/files',
        icon: icons.FontSizeOutlined
      }
    ]
  };
  
  export default utilities;
  