import React, { useState, ReactNode } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SxProps, Theme } from '@mui/system';
import { ListItemIcon, ListItemText, Divider } from '@mui/material';

interface Option {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

interface OptionGroup {
  groupLabel?: string;
  options: Option[];
}

interface DropdownButtonProps {
  children?: string;
  color?: string;
  startIcon?: ReactNode;
  optionGroups?: OptionGroup[];
  sx?: SxProps<Theme>; // Estilos gerais para texto e ícones
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  children = "Salvar",
  color = "green",
  startIcon,
  optionGroups = [],
  sx,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={startIcon}
        endIcon={
          <ArrowDropDownIcon
            sx={{
              '&:hover': {
                color: sx?.color || 'darkgreen'
              },
            }}
          />
        }
        sx={{
          backgroundColor: color,
          '&:hover': {
            backgroundColor: color,
          },
          color: sx?.color,
          ...sx,
        }}
        onClick={handleClick}
      >
        {children}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {optionGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.groupLabel && (
              <>
                {groupIndex > 0 && <Divider />}
                <MenuItem disabled>{group.groupLabel}</MenuItem>
              </>
            )}
            {group.options.map((option, optionIndex) => (
              <MenuItem
                key={optionIndex}
                onClick={() => {
                  handleClose();
                  option.onClick();
                }}
              >
                {option.icon && (
                  <ListItemIcon>
                    {option.icon}
                  </ListItemIcon>
                )}
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </>
  );
};

export default DropdownButton;
