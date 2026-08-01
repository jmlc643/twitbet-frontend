interface UserAvatarProps {
  avatarUrl?: string | null;
  username?: string;
  className?: string;
}

export const UserAvatar = ({ avatarUrl, username, className = '' }: UserAvatarProps) => {
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username || 'Avatar'}
        className={`object-cover bg-neutral-800 ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center font-bold text-white bg-gradient-to-br from-red-600 to-orange-500 ${className}`}>
      {initial}
    </div>
  );
};
