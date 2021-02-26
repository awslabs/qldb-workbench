import * as React from "react";
import {createMuiTheme, createStyles, makeStyles, Theme, ThemeProvider} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import DrawerItems from "./DrawerItems";
import AppBar from "./AppBar";
import * as ReactDOM from "react-dom";
import {deepOrange, deepPurple, lightBlue, orange} from "@material-ui/core/colors";
import {Composer} from "./Composer";
import {QueryHistoryEntry, QueryStats} from "./query-history";
import SplitPane from "react-split-pane";
import Results, {execute} from "./Results";
import Paper from '@material-ui/core/Paper';
import {SnackbarProvider} from 'notistack';
import {ConfirmProvider} from "material-ui-confirm";
import * as logplease from "logplease";
import AWS = require("aws-sdk");
import * as fs from "fs";

export const drawerWidth = "20%";
export const splitPaneWidth = "80%";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
            paddingTop: theme.spacing(1),
        },
    }),
);

const App = () => {
    const classes = useStyles();
    const [activeLedgerState, setActiveLedgerState] = React.useState("")
    const activeLedger = React.useRef("") // This is required to be passed as an argument of shortcut binding method of Ace Editor
    const setActiveLedger = (name: string) => { setActiveLedgerState(name); activeLedger.current = name}
    const [activeRegion, setActiveRegion] = React.useState("us-east-1")
    const [history, setHistory] = React.useState([] as QueryHistoryEntry[]);
    const [result, setResult] = React.useState("")
    const [showInactive, setShowInactive] = React.useState(false)
    const [error, setError] = React.useState("")
    const [queryStats, setQueryStats] = React.useState(undefined as unknown as QueryStats);
    const [forceRefresh, setForceRefresh] = React.useState(false)

    AWS.config.update({region: activeRegion});
    logplease.setLogLevel("DEBUG");
    AWS.config.logger = {
        log: (...messages: any[]) => {
            const data = `${new Date().toISOString()}: ${messages[0]}\n`;
            console.log(data);
            fs.appendFileSync(".qldb-quark.log",data);
        }
    };


    const [darkState, setDarkState] = React.useState(false);
    const palletType = darkState ? "dark" : "light";
    const mainPrimaryColor = darkState ? orange[500] : lightBlue[500];
    const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500];
    const darkTheme = createMuiTheme({
        spacing: 2,
        palette: {
            type: palletType,
            primary: {
                main: mainPrimaryColor,
                light: "#FFF",
                contrastText: "#FFF"
            },
            secondary: {
                main: mainSecondaryColor,
                light: "#FFF"
            },
        },
        overrides: {
            MuiTableCell: {
                root: {
                    fontFamily: "Courier"
                },
            },
            MuiListItemText: {
                primary: { fontFamily: "Courier" },
                secondary: { fontFamily: "Courier" }
            }
        }
    });

    return (
        <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={darkTheme}>
            <ConfirmProvider>
                <div className={classes.root}>
                <CssBaseline />
                <AppBar region={activeRegion} setRegion={setActiveRegion} darkState={darkState} setDarkState={setDarkState} showInactive={showInactive} setShowInactive={setShowInactive} setForceRefresh={setForceRefresh}/>
                <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <DrawerItems activeRegion={activeRegion} setActiveLedger={setActiveLedger} showInactive={showInactive} forceRefresh={forceRefresh} setForceRefresh={setForceRefresh} activeLedger={activeLedgerState}/>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                    <Paper>
                    <SplitPane split="horizontal" size="50%" style={{paddingTop: "73px", maxWidth: splitPaneWidth}} pane2Style={{overflow: "scroll"}}>
                        <Composer executeStatement={() => execute(activeLedger.current, setHistory, setResult, setError, setQueryStats)} />
                        <Results activeLedger={activeLedgerState} darkState={darkState} result={result} history={history}
                                 setHistory={setHistory} setResult={setResult} error={error} setError={setError}
                                 queryStats={queryStats} setQueryStats={setQueryStats}
                        />
                    </SplitPane>
                    </Paper>
                </main>
            </div>
            </ConfirmProvider>
        </ThemeProvider>
        </SnackbarProvider>
    );
};

ReactDOM.render(<App />, document.getElementById("main"));