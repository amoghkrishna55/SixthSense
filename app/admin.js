import Button from "../components/button";

export const Admin = ({ setIsClient }) => {
  return (
    <>
      <Button text="Check" onPress={() => setIsClient(null)} />
    </>
  );
};
