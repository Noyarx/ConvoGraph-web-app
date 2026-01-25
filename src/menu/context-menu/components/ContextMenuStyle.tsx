import {
  alpha,
  Menu,
  Popover,
  styled,
  type MenuProps,
  type PopoverProps,
} from "@mui/material";

// style classes for menu items
// function getItemColor(item: MenuActionItem): string {
//   return item.color ? `${item.color}` : `slate-200`;
// }

export function getMenuActionItemColors(item: any): string {
  return item?.variant === "critical"
    ? "!text-red-600 !text-opacity-85 hover:!bg-red-100"
    : `!text-slate-700 hover:!text-slate-800 hover:!bg-slate-200 hover:!bg-opacity-90`;
}

// const getKbdVariant = (item: any): string =>
//   item?.variant === "critical"
//     ? "border-red-200 group-hover:border-red-300"
//     : "border-slate-300 group-hover:border-slate-400";

// mui style for context menu
export const StyledMenu = styled((props: MenuProps) => (
  <Menu elevation={0} {...props} />
))(({ theme }: any) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    // color: "#374151",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 4px",
      //   color: "#374151",
    },
    "& .MuiMenuItem-root": {
      alignItems: "middle",
      paddingLeft: 8,
      marginTop: 0,
      marginBottom: 0,
      borderRadius: 5,
      //   color: "#374151",
      "&:hover": {
        // backgroundColor: "#ecf0f4",
      },
      "& .MuiSvgIcon-root": {
        // color: "#374151",
        fontSize: 20,
        // marginRight: theme.spacing(0),
        ...theme.applyStyles("dark", {
          //   color: "inherit",
        }),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

export const StyledPopover = styled((props: PopoverProps) => (
  <Popover elevation={0} {...props} />
))(({ theme }: any) => ({
  "& .MuiPaper-root": {
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 6,
    minWidth: 180,
    // color: "#374151",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 4px",
      //   color: "#374151",
    },
    "& .MuiMenuItem-root": {
      alignItems: "middle",
      margin: 4,
      marginTop: 1,
      marginBottom: 1,
      paddingLeft: 8,
      borderRadius: 5,
      //   color: "#374151",
      "&:hover": {
        // backgroundColor: "#ecf0f4",
      },
      "& .MuiSvgIcon-root": {
        // color: "#374151",
        fontSize: 22,
        // marginRight: theme.spacing(0),
        ...theme.applyStyles("dark", {
          //   color: "inherit",
        }),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));
