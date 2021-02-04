import * as React from "react";
import {Color} from "./App";
import {makeStyles} from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import TableChartIcon from '@material-ui/icons/TableChart';
import CodeIcon from '@material-ui/icons/Code';
import {QueryStats} from "./query-history";
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: '20px',
        fontWeight: theme.typography.fontWeightBold,
    },
    headingAccordion: {
        fontSize: '12pt',
        fontWeight: theme.typography.fontWeightRegular,
        fontFamily: "Monaco"
    },
    navigation: {
        width: 200,
        backgroundColor: Color.DARKGRAY
    },
    table: {
        minWidth: 650,
    },
    tableHeadContent: {
        fontWeight: theme.typography.fontWeightBold
    },
    successInfo: {
        color: "green"
    },
    errorInfo: {
        color: "red"
    }
}));

export default ({ resultsText, queryStats, errorMsg }: { resultsText: string, queryStats: QueryStats, errorMsg: string }) => {
    const classes = useStyles();
    const [viewType, setViewType] = React.useState("ion");
    const queryResult = resultsText ? JSON.parse(resultsText) : []

    let resultView
    if (viewType == "table") {
        resultView = prepareTableView(queryResult)
    } else {
        resultView = prepareIonView(queryResult)
    }

    let statusView
    if (errorMsg == "") {
        statusView = queryStats ? <div className={classes.successInfo}><CheckCircleTwoToneIcon /> Read IOs: {queryStats.consumedIOs.readIOs} Time: {queryStats.timingInformation.processingTimeMilliseconds}</div> : <></>
    } else {
        statusView = <div className={classes.errorInfo}><CancelTwoToneIcon /> {errorMsg}</div>
    }
    return <Paper style={{backgroundColor: Color.DARKGRAY, flex: 1, width: "100%", height: "100%"}}>
        <div style={{backgroundColor: Color.LIGHTGRAY, display: "flex", flexDirection: "row-reverse"}}>
            <BottomNavigation
                value={viewType}
                onChange={(event, newValue) => {
                    setViewType(newValue);
                }}
                className={classes.navigation}
                style={{alignSelf: "flex-end"}}
            >
                <BottomNavigationAction value="ion" label="Ion" icon={<CodeIcon />} />
                <BottomNavigationAction value="table" label="Table" icon={<TableChartIcon />} />
            </BottomNavigation>
            <span style={{flex: 1}}>{statusView}</span>
        </div>
        { resultView }

    </Paper>
}

function prepareIonView(queryResult: []) {
    const classes = useStyles();
    const items = []
    for (const i in queryResult) {
        items.push(
            <Accordion key={"result-" + i}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={"result-panel-content-" + i} id={"result-panel-header-" + i}>
                    <div style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: "35em"}}>
                        <Typography className={classes.headingAccordion} noWrap>{JSON.stringify(queryResult[i], undefined)}</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <pre>
                        { JSON.stringify(queryResult[i], undefined, 2) }
                    </pre>
                </AccordionDetails>
            </Accordion>
        )
    }
    return <div style={{maxHeight: 300, overflow: "scroll"}}>
        { items }
    </div>
}

function prepareTableView(queryResult: []) {
    const classes = useStyles();
    const headers = findAllHeaders(queryResult)

    return <div style={{maxHeight: 300, overflow: "scroll"}}>
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="Results table">
                <TableHead>
                    <TableRow>
                        {headers.map((header) => <TableCell>
                            <Typography className={classes.tableHeadContent}>{header}</Typography>
                        </TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {queryResult.map((result) => prepareTableContentRow(result, headers))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>

}

function prepareTableContentRow(queryResult: {}, headers: []) {
    return <TableRow>
        {headers.map((header) => (
            <TableCell>{JSON.stringify(queryResult[header])}</TableCell>
        ))}
    </TableRow>
}

function findAllHeaders(queryResult: []): [] {
    const headers: Map<string, number> = new Map<string, number>()
    for (const i in queryResult) {
        const map: Map<string, string> = queryResult[i]
        for (const key in map) {
            const count = headers.get(key) ? headers.get(key) + 1 : 1
            headers.set(key, count)
        }
    }
    return Array.from(headers.entries()).sort((a, b) => b[1] - a[1]).map((e) => e[0]) as []
}
