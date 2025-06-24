type IconButtonProps = {
  reactIcon: React.ElementType;
  textColor: string;
  shadowClass: string;
  onClick?: (e: React.MouseEvent<Element>) => void;
  "data-testid"?: string;
};

export function IconButton({
  reactIcon: Icon,
  onClick,
  "data-testid": testId,
}: IconButtonProps) {
  return (
    <Icon
      size={36}
      className={`flex-none cursor-pointer text-white hover:text-blue-500 hover:bg-gray-400 rounded-full p-2 transition-colors duration-200 ease-in-out`}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      }}
      data-testid={testId}
    />
  );
}
