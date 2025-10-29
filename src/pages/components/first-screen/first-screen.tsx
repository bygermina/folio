import CodeBackground from "./components/code-background";
import { Section } from "./components/section";
import { Vignette } from "./components/vignette";
import { Particles } from "@/components/animations/particles";

export const FirstScreen = () => {
  return (
    <>
      <CodeBackground />
      <Section />
      <Vignette />
      <Particles />
      {/* <RouteDrawer /> */}
    </>
  );
};
