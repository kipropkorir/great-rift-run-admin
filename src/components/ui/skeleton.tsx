import React from 'react';
import classNames from 'classnames';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, width, height, rounded }) => {
  const styles: React.CSSProperties = {
    width: width || '100%',
    height: height || '1rem',
  };

  return (
    <div
      className={classNames(
        'animate-pulse bg-gray-200',
        {
          'rounded-full': rounded,
          'rounded-md': !rounded,
        },
        className
      )}
      style={styles}
    />
  );
};

export default Skeleton;
