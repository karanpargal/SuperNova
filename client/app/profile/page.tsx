"use client";

import { BalanceDetails } from "@/components/Profile/BalanceDetails";
import { ProfileHead } from "@/components/Profile/ProfileHead";
import { useWalletContext } from "@/utils/context/WalletContext";

const ProfilePage: React.FC = () => {
  const { walletConnected } = useWalletContext();

  return (
    <section
      className={`flex flex-col mx-auto ${
        walletConnected ? "bg-white" : "bg-app-night "
      }h-screen`}
    >
      <ProfileHead />
      <BalanceDetails />
    </section>
  );
};

export default ProfilePage;
