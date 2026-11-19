import type { SVGProps } from 'react';

export type IconName =
  | 'alert'
  | 'arrow'
  | 'camera'
  | 'check'
  | 'check-circle'
  | 'chevron'
  | 'external'
  | 'file'
  | 'info'
  | 'reset'
  | 'search'
  | 'shield';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const content = (() => {
    switch (name) {
      case 'alert':
        return (
          <>
            <path d="M10.3 3.7 2.8 17a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4M12 17h.01" />
          </>
        );
      case 'arrow':
        return <path d="M5 12h14m-6-6 6 6-6 6" />;
      case 'camera':
        return (
          <>
            <path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" />
            <circle cx="12" cy="13" r="3.5" />
          </>
        );
      case 'check':
        return <path d="m5 12 4 4L19 6" />;
      case 'check-circle':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 2.5 2.5L16 9" />
          </>
        );
      case 'chevron':
        return <path d="m8 10 4 4 4-4" />;
      case 'external':
        return (
          <>
            <path d="M15 4h5v5M20 4l-9 9" />
            <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
          </>
        );
      case 'file':
        return (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M8 13h8M8 17h6" />
          </>
        );
      case 'info':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </>
        );
      case 'reset':
        return (
          <>
            <path d="M3 11a9 9 0 1 1 2.6 6.4" />
            <path d="M3 4v7h7" />
          </>
        );
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </>
        );
      case 'shield':
        return (
          <>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-5" />
          </>
        );
    }
  })();

  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      {...props}
    >
      {content}
    </svg>
  );
}
