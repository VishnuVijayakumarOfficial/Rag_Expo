import React from 'react';
import {
  Home,
  Sparkles,
  Boxes,
  Network,
  Shuffle,
  Bot,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  CircleHelp,
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Home,
  Sparkles,
  Boxes,
  Network,
  Shuffle,
  Bot,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Image: ImageIcon,
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = '',
  size = 18,
  color,
  strokeWidth = 2,
}) => {
  const IconComponent = ICON_MAP[name] || CircleHelp;
  return (
    <IconComponent
      className={className}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
};
