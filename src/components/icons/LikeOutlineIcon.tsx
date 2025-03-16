import { twMerge } from "tailwind-merge";
import { IconProps } from "../../types/components.type";

export const LikeOutLineIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={twMerge(className)}
      width="24"
      height="22"
      viewBox="0 0 24 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0001 5.10027C11.1868 5.10027 10.4545 4.60777 10.1477 3.85451C10.1487 3.85678 10.1481 3.85567 10.1457 3.85138C10.1314 3.82537 10.0528 3.6824 9.86099 3.46363C9.65447 3.22814 9.36735 2.9636 9.00975 2.72609C8.30411 2.25741 7.37027 1.91996 6.22463 2.04433C4.55022 2.2261 3.51838 3.01881 2.8789 3.9842C2.19827 5.01172 1.93786 6.28644 2.01218 7.30345C2.09016 8.37041 2.21242 9.19543 2.77794 10.2577C3.37982 11.3882 4.54749 12.8978 6.95047 15.1109C9.22036 17.2013 10.808 18.5615 11.8194 19.3811C11.9049 19.4503 11.9674 19.4592 12.0001 19.4592C12.0328 19.4592 12.0953 19.4503 12.1808 19.3811C13.1922 18.5615 14.7798 17.2013 17.0497 15.1109C19.4527 12.8978 20.6203 11.3882 21.2222 10.2577C21.7877 9.19543 21.91 8.37041 21.988 7.30345C22.062 6.29071 21.7993 5.01595 21.1155 3.9861C20.4721 3.01731 19.4384 2.22559 17.7747 2.04423C16.8061 1.93865 15.8632 2.25228 15.0697 2.75809C14.6783 3.00756 14.3578 3.28311 14.1291 3.52453C13.9175 3.74792 13.8473 3.8749 13.845 3.87369C13.8446 3.87343 13.8473 3.86715 13.8524 3.85451C13.5457 4.60777 12.8134 5.10027 12.0001 5.10027ZM10.6535 1.45813C11.3698 2.0483 11.8323 2.6882 12.0001 3.10027C12.1647 2.69596 12.6599 2.07721 13.391 1.50034C14.495 0.629367 16.1369 -0.146139 17.9914 0.0560083C22.5703 0.555133 24.1893 4.62241 23.9827 7.44922C23.8084 9.8341 23.3629 12.0156 18.4046 16.582C16.1132 18.6923 14.4928 20.0818 13.4399 20.935C12.5773 21.6339 11.4229 21.6339 10.5603 20.935C9.50743 20.0818 7.88702 18.6923 5.59559 16.582C0.637289 12.0156 0.191793 9.8341 0.0175003 7.44922C-0.189091 4.62241 1.41107 0.555135 6.00878 0.0560083C8.01513 -0.1618 9.60586 0.594988 10.6535 1.45813Z"
        fill="currentColor"
      />
    </svg>
  );
};
