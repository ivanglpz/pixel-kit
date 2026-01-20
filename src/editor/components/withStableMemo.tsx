import { ComponentType, memo } from "react";

export function withStableMemo<T extends object>(Icon: ComponentType<T>) {
  return memo((props: T) => <Icon {...props} />);
}
