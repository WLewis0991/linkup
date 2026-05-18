import { DEFAULT_AVATAR } from "../config/assets";

interface AvatarProps {
  avatarUrl?: string | null;
  name?: string;
  className?: string;
}

export function Avatar({ avatarUrl, name = "User", className }: AvatarProps) {
  return (
    <img
      src={avatarUrl ?? DEFAULT_AVATAR}
      alt={name}
      className={className}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = DEFAULT_AVATAR;
      }}
    />
  );
}
