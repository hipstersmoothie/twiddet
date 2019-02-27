import * as React from 'react';

interface CountProps {
  count: number;
  icon: string;
  type: string;
}

const Count: React.FC<CountProps> = ({ count, icon, type }) => {
  return (
    <span className="icon">
      <i className={icon} />
      <span className="count">
        <span style={{ opacity: 0, position: 'absolute' }}>
          {count} {type}
        </span>
        <span aria-hidden>{count}</span>
      </span>

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
