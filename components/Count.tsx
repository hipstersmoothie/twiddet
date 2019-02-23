import * as React from 'react';

interface CountProps {
  count: number;
  icon: string;
}

const Count: React.FC<CountProps> = ({ count, icon }) => {
  return (
    <span className="icon">
      <i className={icon} />
      <span className="count">{count}</span>

      <style jsx>{`
        .count {
          font-size: 14px;
          padding: 0 10px;
        }

        .icon {
          align-items: center;
          color: rgb(101, 119, 134);
          display: flex;
        }
      `}</style>
    </span>
  );
};

export default Count;
