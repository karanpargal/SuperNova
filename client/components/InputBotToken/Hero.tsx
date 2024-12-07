import { InputForm } from "./InputForm";

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col px-28 mt-12">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl text-white">Dive into magic</h1>
        <p className="text-lg text-app-gray">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed
        </p>
      </div>
      <div>
        <InputForm />
      </div>
    </section>
  );
};
