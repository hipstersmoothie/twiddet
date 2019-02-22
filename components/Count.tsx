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
          padding: 0 10px;
          font-size: 14px;
        }

        .icon {
          color: rgb(101, 119, 134);
          display: flex;
          align-items: center;
        }
      `}</style>
    </span>
  );
};

export default Count;
