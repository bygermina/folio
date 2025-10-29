import { ScreenSizeProvider } from "@/components/providers/screen-size-provider";
import CodeBackground from "./components/code-background";
import { Footer } from "./components/copyright-footer";
import { Section } from "./components/section";
import { Vignette } from "./components/vignette";
import { Particles } from "@/components/animations/particles";
import LightFollowCoursor from "@/components/animations/light/light-follow";

export const FirstScreen = () => {
  return (
    <>
      <CodeBackground />
      <ScreenSizeProvider>
        <LightFollowCoursor />
        <Section />
        <Footer />
      </ScreenSizeProvider>
      <Vignette />
      <Particles />
      {/* <RouteDrawer /> */}
    </>
  );
};
