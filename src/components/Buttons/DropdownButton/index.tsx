import React, { useState, ReactNode } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SxProps, Theme } from '@mui/system';
import { ListItemIcon, ListItemText, Divider } from '@mui/material';
import { darken } from '@mui/system';

interface Option {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  subOptions?: Option[]; // Sub-options for the secondary menu
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
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [subOptions, setSubOptions] = useState<Option[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleSubMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    subOptions: Option[]
  ) => {
    setSubOptions(subOptions);
    setSubMenuAnchorEl(event.currentTarget); // Use the actual DOM element as the anchor
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={startIcon}
        endIcon={
          <ExpandMoreIcon
            sx={{
              '&:hover': {
                color: sx?.color || 'darkgreen',
              },
            }}
          />
        }
        sx={{
          backgroundColor: color,
          '&:hover': {
            backgroundColor: darken(color, 0.2),
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
                onClick={(event) => {
                  if (option.subOptions) {
                    handleSubMenuClick(event, option.subOptions);
                  } else {
                    handleClose();
                    option.onClick();
                  }
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

      {/* Submenu */}
      <Menu
        anchorEl={subMenuAnchorEl}
        open={Boolean(subMenuAnchorEl)}
        onClose={handleSubMenuClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        getContentAnchorEl={null} // Ensures submenu is aligned to center
      >
        {subOptions.map((subOption, subOptionIndex) => (
          <MenuItem
            key={subOptionIndex}
            onClick={() => {
              handleSubMenuClose();
              subOption.onClick();
            }}
          >
            {subOption.icon && (
              <ListItemIcon>
                {subOption.icon}
              </ListItemIcon>
            )}
            <ListItemText>{subOption.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownButton;
