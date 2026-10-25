declare module 'lucide-react' {
  import * as React from 'react';
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const Mic: LucideIcon;
  export const Zap: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const FileText: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Layers: LucideIcon;
  export const Server: LucideIcon;
  export const Database: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Radio: LucideIcon;
  export const Terminal: LucideIcon;
  export const Shield: LucideIcon;
  export const Cpu: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const X: LucideIcon;
  export const Download: LucideIcon;
  export const FileCode: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const Clock: LucideIcon;
  export const Activity: LucideIcon;
  export const Code: LucideIcon;
  export const Sun: LucideIcon;
  export const Moon: LucideIcon;
}
