// import { Link } from "react-router-dom";

import { Link } from "react-router-dom";

// src/components/OverlappingCircles.tsx
const OverlappingCircles = () => {
  return (
    <svg
      width="600"
      height="400"
      viewBox="0 0 600 400"
      className="transform -translate-y-16"
    >
      <defs>
        <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5F9EA0" />
          <stop offset="33%" stopColor="#AF9F8D" />
          <stop offset="66%" stopColor="#FFA07A" />
          <stop offset="100%" stopColor="#FF08B5" />
        </linearGradient>
      </defs>

      {/* Career circle */}
      <g transform="translate(200, 150)">
        <Link to="/career">
          <circle
            r="100"
            fill="transparent"
            stroke="url(#pinkGradient)"
            strokeWidth="2.0"
            strokeDasharray="5 5"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl fill-current text-link hover:opacity-80"
          >
            career
          </text>
        </Link>
      </g>

      {/* Hacking circle */}
      <g transform="translate(400, 150)">
        <Link to="/hacking">
          <circle
            r="100"
            fill="transparent"
            stroke="url(#pinkGradient)"
            strokeWidth="2.0"
            strokeDasharray="5 5"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl fill-current text-link hover:opacity-80"
          >
            hacking
          </text>
        </Link>
      </g>

      {/* Me circle */}
      <g transform="translate(300, 250)">
        <Link to="/about">
          <circle
            r="100"
            fill="transparent"
            stroke="url(#pinkGradient)"
            strokeWidth="2.0"
            strokeDasharray="5 5"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl fill-current text-link hover:opacity-80"
          >
            me
          </text>
        </Link>
      </g>
    </svg>
  );
};

export default OverlappingCircles;
