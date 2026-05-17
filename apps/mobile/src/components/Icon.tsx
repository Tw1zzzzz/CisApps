import Svg, { Circle, Path, Rect } from "react-native-svg";

export type IconName =
  | "cards"
  | "heart"
  | "chat"
  | "user"
  | "settings"
  | "close"
  | "x"
  | "back"
  | "forward"
  | "rewind"
  | "bolt"
  | "star"
  | "filter"
  | "shield"
  | "bell"
  | "share"
  | "pencil"
  | "check"
  | "pin"
  | "plus"
  | "search"
  | "chev_r"
  | "chev_d"
  | "chev_u"
  | "crown"
  | "fire"
  | "crosshair"
  | "mic"
  | "globe"
  | "chart"
  | "trash"
  | "info"
  | "flag"
  | "eye"
  | "eye_off";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
}

export function Icon({ name, size = 20, color = "#F0F2F5", stroke = 1.7 }: IconProps) {
  const p = {
    fill: "none" as const,
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderPath(name, p)}
    </Svg>
  );
}

function renderPath(
  name: IconName,
  p: { fill: "none"; stroke: string; strokeWidth: number; strokeLinecap: "round"; strokeLinejoin: "round" }
) {
  switch (name) {
    case "cards":
      return (
        <>
          <Rect x={3} y={6} width={14} height={16} rx={2} {...p} />
          <Rect x={7} y={2} width={14} height={16} rx={2} {...p} />
        </>
      );
    case "heart":
      return <Path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" {...p} />;
    case "chat":
      return <Path d="M4 19V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 3v-2z" {...p} />;
    case "user":
      return (
        <>
          <Circle cx={12} cy={8} r={4} {...p} />
          <Path d="M4 21c0-4 4-7 8-7s8 3 8 7" {...p} />
        </>
      );
    case "settings":
      return (
        <>
          <Circle cx={12} cy={12} r={3} {...p} />
          <Path
            d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
            {...p}
          />
        </>
      );
    case "close":
    case "x":
      return <Path d="M18 6 6 18M6 6l12 12" {...p} />;
    case "back":
      return <Path d="M15 18l-6-6 6-6" {...p} />;
    case "forward":
      return <Path d="M9 18l6-6-6-6" {...p} />;
    case "rewind":
      return <Path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" {...p} />;
    case "bolt":
      return <Path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" {...p} />;
    case "star":
      return <Path d="M12 2l3 7 7 .6-5.4 4.7L18 22l-6-3.7L6 22l1.4-7.7L2 9.6 9 9z" {...p} />;
    case "filter":
      return <Path d="M3 5h18M6 12h12M10 19h4" {...p} />;
    case "shield":
      return <Path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" {...p} />;
    case "bell":
      return (
        <>
          <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...p} />
          <Path d="M10 21a2 2 0 0 0 4 0" {...p} />
        </>
      );
    case "share":
      return (
        <>
          <Circle cx={18} cy={5} r={3} {...p} />
          <Circle cx={6} cy={12} r={3} {...p} />
          <Circle cx={18} cy={19} r={3} {...p} />
          <Path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" {...p} />
        </>
      );
    case "pencil":
      return <Path d="M14 4l6 6L10 20H4v-6L14 4z" {...p} />;
    case "check":
      return <Path d="M5 13l4 4L19 7" {...p} />;
    case "pin":
      return (
        <>
          <Path d="M12 22s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" {...p} />
          <Circle cx={12} cy={10} r={2.5} {...p} />
        </>
      );
    case "plus":
      return <Path d="M12 5v14M5 12h14" {...p} />;
    case "search":
      return (
        <>
          <Circle cx={11} cy={11} r={7} {...p} />
          <Path d="m20 20-3.5-3.5" {...p} />
        </>
      );
    case "chev_r":
      return <Path d="M9 6l6 6-6 6" {...p} />;
    case "chev_d":
      return <Path d="M6 9l6 6 6-6" {...p} />;
    case "chev_u":
      return <Path d="M6 15l6-6 6 6" {...p} />;
    case "crown":
      return <Path d="M3 7l4 4 5-6 5 6 4-4-2 12H5L3 7z" {...p} />;
    case "fire":
      return <Path d="M12 3s4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-3s-1 4 2 4 3-3 3-6c0-2-2-3-2-3z" {...p} />;
    case "crosshair":
      return (
        <>
          <Circle cx={12} cy={12} r={9} {...p} />
          <Path d="M12 3v4M12 17v4M3 12h4M17 12h4" {...p} />
        </>
      );
    case "mic":
      return (
        <>
          <Rect x={9} y={3} width={6} height={12} rx={3} {...p} />
          <Path d="M5 12a7 7 0 0 0 14 0M12 19v3" {...p} />
        </>
      );
    case "globe":
      return (
        <>
          <Circle cx={12} cy={12} r={9} {...p} />
          <Path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...p} />
        </>
      );
    case "chart":
      return <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...p} />;
    case "trash":
      return <Path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" {...p} />;
    case "info":
      return (
        <>
          <Circle cx={12} cy={12} r={9} {...p} />
          <Path d="M12 11v6M12 7.5v.01" {...p} />
        </>
      );
    case "flag":
      return <Path d="M5 21V4h13l-2 4 2 4H5" {...p} />;
    case "eye":
      return (
        <>
          <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" {...p} />
          <Circle cx={12} cy={12} r={3} {...p} />
        </>
      );
    case "eye_off":
      return <Path d="m3 3 18 18M10.5 6.2A10 10 0 0 1 22 12c-1 2-2.4 3.6-4 4.8M6 7c-2 1.4-3.4 3-4 5 0 0 4 7 10 7a9 9 0 0 0 5-1.5" {...p} />;
    default:
      return null;
  }
}
