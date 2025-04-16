import { cn } from "@/lib/utils";

const CommentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      viewBox={"0 0 7 7"}
      className={cn("fill-none size-2.5", props.className)}
      xmlns={"http://www.w3.org/2000/svg"}
    >
      <g clip-path={"url(#clip0_221_551)"}>
        <path
          d={
            "M6.25761 6.90854C6.22602 6.93901 6.15652 6.96644 6.11546 6.96339L4.4697 6.5977C1.94578 7.2529 -0.429668 5.15625 0.119971 2.66343C0.66961 0.170617 3.90427 -0.828947 5.86275 0.929433C7.33477 2.25203 7.31582 4.52543 5.84696 5.83583L6.29235 6.71959C6.31131 6.78359 6.30815 6.85978 6.25761 6.90854ZM5.69217 1.26161C4.10327 -0.274311 1.36771 0.304705 0.600115 2.33431C-0.293838 4.68999 1.99632 6.9512 4.45075 6.22895L5.79326 6.52761L5.43631 5.84193C5.39208 5.68041 5.65743 5.53414 5.76483 5.42138C6.89885 4.25116 6.87042 2.39526 5.69533 1.26161H5.69217Z"
          }
          fill={"#202020"}
          stroke={"#202020"}
          stroke-width={"0.25"}
        />
      </g>
      <defs>
        <clipPath id={"clip0_221_551"}>
          <rect width={"10"} height={"10"} fill={"white"} />
        </clipPath>
      </defs>
    </svg>
  );
};
export default CommentIcon;
