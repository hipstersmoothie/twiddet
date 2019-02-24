"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const Count = ({ count, icon }) => {
    return (<span className="icon">
      <i className={icon}/>
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
    </span>);
};
exports.default = Count;
//# sourceMappingURL=Count.jsx.map