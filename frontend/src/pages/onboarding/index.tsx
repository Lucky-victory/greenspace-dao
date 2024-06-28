import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { RegisterComponent } from "src/components/RegisterForm";
import { SwiperRef } from "swiper/react";

export default function OnboardingPage() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>();

  return (
    <Box mx={"auto"} maxW={800} px={{ base: 4, md: 6 }} py={8}>
      <RegisterComponent
        titleText="Complete sign up"
        setActiveSlideIndex={setActiveSlideIndex}
        activeSlideIndex={activeSlideIndex}
        swiperRef={swiperRef}
      />
    </Box>
  );
}
