import Image from "next/image";
import RadioPlayer from "./components/RadioPlayer";
import MobileLayout from "./components/MobileLayout";

export default function Home() {
  return (
    <MobileLayout>
      <RadioPlayer />
    </MobileLayout>
  );
}
