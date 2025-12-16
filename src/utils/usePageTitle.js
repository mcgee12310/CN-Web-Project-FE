// hooks/usePageTitle.js
import { useEffect } from 'react';

export const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Hikari Hotel`;

    // Cleanup: khôi phục title cũ khi component unmount
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

// Cách sử dụng trong component:
// import { usePageTitle } from '@/hooks/usePageTitle';
//
// const Dashboard = () => {
//   usePageTitle('Tổng quan');
//   return <div>Dashboard content...</div>;
// };