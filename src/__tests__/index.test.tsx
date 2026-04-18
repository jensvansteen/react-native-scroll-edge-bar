import * as React from 'react';

import { ScrollEdgeBar } from '../index';

type ElementProps = {
  children?: React.ReactNode;
  [key: string]: unknown;
};

type ForwardRefRender = (
  props: ElementProps,
  ref: React.ForwardedRef<unknown>
) => React.ReactNode;

function renderForwardRef(component: unknown, props: ElementProps) {
  return (component as { render: ForwardRefRender }).render(props, null);
}

function expectNativeElement(
  element: React.ReactNode,
  nativeName: string,
  props: ElementProps
) {
  expect(React.isValidElement(element)).toBe(true);

  const reactElement = element as React.ReactElement & {
    type: { displayName?: string };
  };

  expect(reactElement.type.displayName).toBe(nativeName);
  expect(reactElement.props).toEqual(props);
}

jest.mock('react-native', () => {
  const mockReact = require('react');

  return {
    codegenNativeComponent: (name: string) => {
      const NativeComponent = ({ children, ...props }: ElementProps) =>
        mockReact.createElement(name, props, children);
      NativeComponent.displayName = name;
      return NativeComponent;
    },
  };
});

describe('ScrollEdgeBar', () => {
  it('exports a named compound component', () => {
    expect(ScrollEdgeBar.displayName).toBe('ScrollEdgeBar');
    expect(ScrollEdgeBar.TopBar.displayName).toBe('ScrollEdgeBar.TopBar');
    expect(ScrollEdgeBar.BottomBar.displayName).toBe('ScrollEdgeBar.BottomBar');
  });

  it('forwards props to the native container component', () => {
    const element = renderForwardRef(ScrollEdgeBar, {
      estimatedTopBarHeight: 44,
      prefersGlassEffect: false,
      testID: 'scroll-edge-bar',
    });

    expectNativeElement(element, 'RNScrollEdgeBar', {
      estimatedTopBarHeight: 44,
      prefersGlassEffect: false,
      testID: 'scroll-edge-bar',
      ref: null,
    });
  });

  it('forwards props to top and bottom bar native components', () => {
    expectNativeElement(
      renderForwardRef(ScrollEdgeBar.TopBar, {
        children: 'Top',
        testID: 'top',
      }),
      'RNScrollEdgeBarTopBar',
      { children: 'Top', testID: 'top', ref: null }
    );

    expectNativeElement(
      renderForwardRef(ScrollEdgeBar.BottomBar, {
        children: 'Bottom',
        testID: 'bottom',
      }),
      'RNScrollEdgeBarBottomBar',
      { children: 'Bottom', testID: 'bottom', ref: null }
    );
  });
});
