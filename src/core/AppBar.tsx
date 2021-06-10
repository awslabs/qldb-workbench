import * as React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from "@material-ui/core";
import { Brightness4, Brightness7, MoreVert } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { changeEditorTheme } from "./Composer";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { frontendEndpointValue, setFrontendEndpoint } from "./ledger";
import { sessionEndpointValue, setSessionEndpoint } from "./session";
import { useSnackbar } from "notistack";
import AWS = require("aws-sdk");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    select: {
      color: theme.palette.primary.light,
      "&:before": {
        borderColor: theme.palette.primary.light,
      },
      "&:after": {
        borderColor: theme.palette.primary.light,
      },
    },
    icon: {
      fill: theme.palette.primary.light,
    },
    menuItem: {
      color: theme.palette.text.secondary,
      width: "100%",
      justifyContent: "start",
    },
    column: {
      flexBasis: "33.33%",
    },
    twoThirdColumn: {
      flexBasis: "66.66%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
      flexBasis: "33.33%",
    },
  })
);

type Region = { name: string; region: string };

export const qldbRegions: Region[] = [
  { name: "US East (N. Virginia)", region: "us-east-1" },
  { name: "US East (Ohio)", region: "us-east-2" },
  { name: "US West (Oregon)", region: "us-west-2" },
  { name: "Asia Pacific (Seoul)", region: "ap-northeast-2" },
  { name: "Asia Pacific (Singapore)", region: "ap-southeast-1" },
  { name: "Asia Pacific (Sydney)", region: "ap-southeast-2" },
  { name: "Asia Pacific (Tokyo)", region: "ap-northeast-1" },
  { name: "Europe (Frankfurt)", region: "eu-central-1" },
  { name: "Europe (Ireland)", region: "eu-west-1" },
  { name: "Europe (London)", region: "eu-west-2" },
];

export default ({
  region,
  setRegion,
  darkState,
  setDarkState,
  showInactive,
  setShowInactive,
  setForceRefresh,
}: {
  region: string;
  setRegion: (region: string) => void;
  darkState: boolean;
  setDarkState: (state: boolean) => void;
  showInactive: boolean;
  setShowInactive: (state: boolean) => void;
  setForceRefresh: (refresh: boolean) => void;
}) => {
  const classes = useStyles();
  const [useDarkThemeIcon, setUseDarkThemeIcon] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleShowInactive = () => setShowInactive(!showInactive);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const frontendEndpoint = React.createRef<HTMLInputElement>();
  const sessionEndpoint = React.createRef<HTMLInputElement>();
  const awsAccessKey = React.createRef<HTMLInputElement>();
  const awsSecretKey = React.createRef<HTMLInputElement>();
  const awsSessionToken = React.createRef<HTMLInputElement>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleThemeChange = () => {
    setUseDarkThemeIcon(!useDarkThemeIcon);
    changeEditorTheme(darkState);
    setDarkState(!darkState);
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleConfigUpdate = () => {
    if (frontendEndpoint.current) {
      setFrontendEndpoint(
        frontendEndpoint.current.value,
        setRegion,
        enqueueSnackbar
      );
    }
    if (sessionEndpoint.current) {
      setSessionEndpoint(sessionEndpoint.current.value);
    }
    awsAccessKey.current &&
      awsAccessKey.current.value &&
      awsSecretKey.current &&
      awsSecretKey.current.value &&
      awsSessionToken.current &&
      awsSessionToken.current.value &&
      AWS.config.update({
        accessKeyId: awsAccessKey.current.value,
        secretAccessKey: awsSecretKey.current.value,
        sessionToken: awsSessionToken.current.value,
      });
    setForceRefresh(true);
    setDialogOpen(false);
  };

  const RegionSelector = () => {
    return (
      <FormControl className={classes.formControl}>
        <Select
          labelId="Region"
          id="Region"
          value={region}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
            setRegion(event.target.value as string)
          }
          className={classes.select}
          inputProps={{ classes: { icon: classes.icon } }}
        >
          {qldbRegions.map((region) => (
            <MenuItem key={region.region} value={region.region}>
              {region.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const MenuActions = () => {
    const showInactiveIcon = showInactive ? (
      <VisibilityOffIcon />
    ) : (
      <VisibilityIcon />
    );
    const preferenceIcon = <SettingsIcon />;
    return (
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Button
            startIcon={showInactiveIcon}
            onClick={toggleShowInactive}
            className={classes.menuItem}
            disableElevation={true}
          >
            {showInactive ? "Hide inactive tables" : "Show inactive tables"}
          </Button>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Button
            startIcon={preferenceIcon}
            className={classes.menuItem}
            onClick={handleDialogOpen}
            disableFocusRipple={true}
            disableRipple={true}
          >
            Configuration
          </Button>
        </MenuItem>
      </Menu>
    );
  };

  const ConfigurationDialog = () => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    return (
      <Dialog
        fullScreen={fullScreen}
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby={"Form-dialog-title"}
      >
        <DialogTitle id={"Form-dialog-title"}>Configuration</DialogTitle>
        <DialogContent>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <div className={classes.twoThirdColumn}>
                <Typography className={classes.heading}>
                  AWS account credentials
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.twoThirdColumn}>
                <FormControl fullWidth>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="awsAccessKey"
                    label="AWS Access Key Id"
                    type="text"
                    fullWidth
                    style={{ paddingRight: "15px" }}
                    inputRef={awsAccessKey}
                  />
                  <TextField
                    margin="dense"
                    id="awsSecretKey"
                    label="AWS Secret Access Key"
                    type="password"
                    fullWidth
                    style={{ paddingRight: "15px" }}
                    inputRef={awsSecretKey}
                  />
                  <TextField
                    margin="dense"
                    id="awsSessionToken"
                    label="AWS Session Token"
                    type="password"
                    fullWidth
                    style={{ paddingRight: "15px" }}
                    inputRef={awsSessionToken}
                  />
                </FormControl>
              </div>
              <div className={classes.helper}>
                <Typography variant="caption">
                  Updates AWS credentials.
                  <br />
                  If blank [default] aws credentials is used.
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <div className={classes.twoThirdColumn}>
                <Typography className={classes.heading}>
                  Endpoint override
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.twoThirdColumn}>
                <FormControl fullWidth>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="frontendEndpoint"
                    label="Frontend Endpoint"
                    type="url"
                    fullWidth
                    style={{ paddingRight: "15px" }}
                    name="frontendEndpoint"
                    inputRef={frontendEndpoint}
                    helperText={
                      frontendEndpointValue
                        ? `Current value: ${frontendEndpointValue}`
                        : ``
                    }
                  />
                  <TextField
                    margin="dense"
                    id="sessionEndpoint"
                    label="Session Endpoint"
                    type="url"
                    fullWidth
                    style={{ paddingRight: "15px" }}
                    name="sessionEndpoint"
                    inputRef={sessionEndpoint}
                    helperText={
                      sessionEndpointValue
                        ? `Current value: ${sessionEndpointValue}`
                        : ``
                    }
                  />
                </FormControl>
              </div>
              <div className={classes.helper}>
                <Typography variant="caption">
                  Overrides endpoints to be used by qldb frontend and session
                  API.
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button size="small" color="primary" onClick={handleConfigUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar variant="dense">
        <img
          src="../../assets/amazon-qldb.png"
          alt="QLDB"
          height="50"
          width="50"
          style={{ paddingRight: "2px" }}
        />
        <Typography variant="h6" noWrap style={{ color: "#ffffff", flex: 1 }}>
          QLDB Workbench
        </Typography>
        <RegionSelector />
        <Tooltip
          title={
            useDarkThemeIcon ? "Switch to dark mode" : "Switch to light mode"
          }
          arrow
        >
          <IconButton
            aria-label={"Theme"}
            component={"span"}
            onClick={handleThemeChange}
          >
            {useDarkThemeIcon ? (
              <Brightness4 style={{ color: "#FFFFFF" }} />
            ) : (
              <Brightness7 style={{ color: "#FFFFFF" }} />
            )}
          </IconButton>
        </Tooltip>
        <IconButton
          aria-label={"Menu"}
          component={"span"}
          onClick={handleMenuClick}
        >
          <MoreVert style={{ color: "#FFFFFF" }} />
        </IconButton>
        <MenuActions />
      </Toolbar>
      <ConfigurationDialog />
    </AppBar>
  );
};
