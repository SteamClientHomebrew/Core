/**
 * in complience with GNU license 
 * inherited from: https://github.com/SteamDeckHomebrew/decky-frontend-lib
 */
import { ReactNode, VFC } from 'react';

import { CommonUIModule } from './webpack';
import { ItemProps } from './item';

export interface SingleDropdownOption {
  data: any;
  label: ReactNode;

  options?: never;
}

export interface MultiDropdownOption {
  label: ReactNode;
  options: DropdownOption[];

  data?: never;
}

export type DropdownOption = SingleDropdownOption | MultiDropdownOption;

export interface DropdownProps {
  rgOptions: DropdownOption[];
  selectedOption: any;
  disabled?: boolean;
  onMenuWillOpen?(showMenu: () => void): void;
  onMenuOpened?(): void;
  onChange?(data: SingleDropdownOption): void;
  contextMenuPositionOptions?: any;
  menuLabel?: string;
  strDefaultLabel?: string;
  renderButtonValue?(element: ReactNode): ReactNode;
  focusable?: boolean;
}

export const Dropdown = Object.values(CommonUIModule).find(
  (mod: any) => mod?.prototype?.SetSelectedOption && mod?.prototype?.BuildMenu,
) as VFC<DropdownProps>;


export interface DropdownItemProps extends DropdownProps, ItemProps {}

Object.values(CommonUIModule).find((mod: any) =>
    console.log(mod?.toString()),
);

export const DropdownItem = Object.values(CommonUIModule).find((mod: any) =>
  mod?.toString()?.includes('"dropDownControlRef","description"'),
) as VFC<DropdownItemProps>;