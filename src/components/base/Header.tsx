import { cn } from "@/lib/utils/className";
import MemoriaLogo from "@/assets/images/MemoriaLogo.svg";
import BellIcon from "@/assets/images/BellIcon.svg";
import ProflieIcon from "@/assets/images/ProfileIcon.svg";

type Props = {
  className?: string;
};

const Header: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex justify-between items-center h-10", className)}>
      <img src={MemoriaLogo} alt="Memoria Logo" className={"w-24"} />
      <div className="flex gap-6">
        <img src={BellIcon} alt="Notification Bell" className={""} />
        <img src={ProflieIcon} alt="Profile Icon" className={""} />
      </div>
    </div>
  );
};

export default Header;
