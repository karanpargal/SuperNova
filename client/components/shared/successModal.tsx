import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Player from "lottie-react";
import animation from "@/public/animation/animation.json";
import { CircleX, SquareArrowOutUpRight } from "lucide-react";

export const SuccessModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tokenDetails: { name: string; symbol: string; txnHash: string };
}> = ({ isOpen, setIsOpen, tokenDetails }) => {
  const ListItems = [
    { label: "Name", value: tokenDetails.name },
    { label: "Symbol", value: tokenDetails.symbol },
    { label: "Transaction Hash", value: tokenDetails.txnHash },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white w-full w-2xl md:max-w-lg h-auto rounded-lg p-4 md:p-6 relative border-2 border-app-crimson">
        <DialogHeader>
          <DialogClose asChild>
            <CircleX
              className="absolute -right-2 -top-3 h-5 w-5 hover:text-red-500 cursor-pointer fill-app-secondary text-white"
              onClick={() => setIsOpen(false)}
            />
          </DialogClose>
          <DialogTitle className="text-center text-lg md:text-2xl">
            MINT SUCCESSFUL
            <p className="text-sm md:text-base text-app-secondary mt-2">
              Congratulations on Minting your token with SupraNova
            </p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col items-center gap-y-4 mt-4">
          <Player
            autoplay
            loop
            animationData={animation}
            className="h-32 w-32 md:h-48 md:w-48"
          />
          <ul className="w-full flex flex-col gap-y-2 border border-app-secondary bg-app-gunmetal/20 p-4 rounded-lg">
            {ListItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between text-sm md:text-base"
              >
                <p className="text-app-secondary">{item.label}</p>
                {item.label === "Transaction Hash" ? (
                  <div className="flex items-center gap-x-2 text-app-blue">
                    {item.value}

                    <SquareArrowOutUpRight className="h-4 w-4" />
                  </div>
                ) : (
                  <p className="text-app-blue">{item.value}</p>
                )}
              </li>
            ))}
          </ul>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
