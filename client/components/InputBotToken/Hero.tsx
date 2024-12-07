import { InputForm } from "./InputForm";

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col md:px-28 px-6 sm:mt-12 py-6 mx-auto justify-center">
      <div className="flex flex-col gap-y-2 justify-center mx-auto text-center">
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
