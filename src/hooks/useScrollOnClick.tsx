import { RefObject } from 'react';

type ScrollOptions = {
  behavior?: 'auto' | 'smooth' | 'instant';
  block?:
    | 'start'
    | 'end'
    | 'center'
    | 'nearest'
    | 'start end'
    | 'end start'
    | 'center start'
    | 'center end';
  inline?:
    | 'start'
    | 'end'
    | 'center'
    | 'nearest'
    | 'start end'
    | 'end start'
    | 'center start'
    | 'center end';
  scrollMargin?: string;
  predicate?: boolean | (() => boolean);
};

function unRef(target: RefObject<HTMLElement | null> | HTMLElement | null) {
  // @ts-expect-error - target can be a ref or an element
  const element = isRef(target) ? target.current : target;
  return element;
}
const isFunction = (val: unknown) => typeof val === 'function';

const isRef = (obj: unknown) =>
  obj !== null &&
  typeof obj === 'object' &&
  Object.prototype.hasOwnProperty.call(obj, 'current');

export function useScrollOnClick(
  target: RefObject<HTMLElement | null>,
  options: ScrollOptions = {},
) {
  const {
    behavior = 'auto',
    block = 'start',
    inline = 'nearest',
    scrollMargin = '0px',
    predicate = true,
  } = options;
  // useMount(() => {
  const el = unRef(target);
  if (!(el && (isFunction(predicate) ? predicate() : predicate))) {
    return;
  }
  el.style.scrollMargin = scrollMargin;
  el.scrollIntoView({
    behavior,
    block,
    inline,
  });
  // });
}
