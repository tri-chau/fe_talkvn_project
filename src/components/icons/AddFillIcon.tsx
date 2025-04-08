import { IconProps } from "../../types/components.type";

export const AddFillIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_17_17904)">
        <path
          d="M3 6C2.45 6 2 6.45 2 7V20C2 21.1 2.9 22 4 22H17C17.55 22 18 21.55 18 21C18 20.45 17.55 20 17 20H5C4.45 20 4 19.55 4 19V7C4 6.45 3.55 6 3 6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM18 11H15V14C15 14.55 14.55 15 14 15C13.45 15 13 14.55 13 14V11H10C9.45 11 9 10.55 9 10C9 9.45 9.45 9 10 9H13V6C13 5.45 13.45 5 14 5C14.55 5 15 5.45 15 6V9H18C18.55 9 19 9.45 19 10C19 10.55 18.55 11 18 11Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_17_17904">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
