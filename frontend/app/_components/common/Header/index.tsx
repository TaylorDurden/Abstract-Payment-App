import { WalletButton } from "../Wallet/wallet-button";

const Header: React.FC = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="mx-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Abstract Payment App
          </h1>
        </div>
        <div className="ml-auto flex items-center space-x-4 mx-4">
          <WalletButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
