let currentStackOrder = 1;

export function getNextStackOrder() {
  currentStackOrder += 1;
  return currentStackOrder;
}
