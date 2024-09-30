import React from 'react';
import { Skeleton } from 'antd';

const ContentLoader: React.FC = () => <div style={{
    margin:"2rem"
}}><Skeleton active /></div>;

export default ContentLoader;