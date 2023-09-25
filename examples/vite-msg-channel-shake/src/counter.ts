export function setupCounter(
  element: HTMLButtonElement,
  onClick?: (amount: number) => void
) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => {
    setCounter(counter + 1);
    onClick?.(counter + 1);
  });
  setCounter(0);
}
