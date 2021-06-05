import { Transition } from "react-transition-group";

export default function Slide({
  defaultContent,
  alternativeContent,
  slide,
  frameWidth,
  frameHeight,
}) {
  const duration = 500;

  const defaultStyleA = {
    top: 0,
    left: 0,
    transition: `left ${duration}ms ease-in-out`,
    width: frameWidth,
  };

  const transitionStylesA = {
    entering: { position: "absolute", left: `-${frameWidth}` },
    entered: { position: "absolute", left: `-${frameWidth}` },
    exiting: { position: "absolute", left: "0" },
    exited: { position: "absolute", left: "0" },
  };

  const defaultStyleB = {
    position: "absolute",
    top: 0,
    left: frameWidth,
    transition: `left ${duration}ms ease-in-out`,
    width: frameWidth,
  };

  const transitionStylesB = {
    entering: { position: "relative", left: "0" },
    entered: { position: "relative", left: "0" },
    exiting: { position: "relative", left: frameWidth },
    exited: { position: "relative", left: frameWidth },
  };

  return (
    <div
      style={{
        width: frameWidth,
        minHeight: frameHeight,
        maxHeight: frameHeight,
        position: "relative",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      <Transition in={slide} timeout={duration}>
        {(state) => (
          <>
            <div
              style={{
                ...defaultStyleA,
                ...transitionStylesA[state],
              }}
            >
              {defaultContent}
            </div>
            <div
              style={{
                ...defaultStyleB,
                ...transitionStylesB[state],
              }}
            >
              {alternativeContent}
            </div>
          </>
        )}
      </Transition>
    </div>
  );
}
