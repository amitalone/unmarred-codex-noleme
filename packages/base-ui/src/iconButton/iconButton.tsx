type IconButtonProps = {
  reactIcon: React.ElementType;
  textColor: string;
  shadowClass: string;
  onClick?: (e: React.MouseEvent<Element>, props?: IconButtonProps) => void;
  "data-testid"?: string;
  payload?: any;
  size?: number;
};

export function IconButton({
  reactIcon: Icon,
  onClick,
  "data-testid": testId,
  payload,
  size = 36,
  ...rest
}: IconButtonProps) {
  return (
    <Icon
      size={size}
      className={`flex-none cursor-pointer text-white hover:text-blue-500 hover:bg-gray-400 rounded-full p-2 transition-colors duration-200 ease-in-out`}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
          onClick(e, {
            reactIcon: Icon,
            "data-testid": testId,
            payload,
            ...rest,
          });
        }
      }}
      data-testid={testId}
    />
  );
}
