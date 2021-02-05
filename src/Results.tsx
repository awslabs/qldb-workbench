import * as React from "react";
import {Color, RESULT_BOX_STYLE, RESULT_INTERNAL_CONTAINER_STYLE} from "./App";
import {makeStyles} from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import {
    BottomNavigation,
    BottomNavigationAction,
    Grid,
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
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    headingAccordion: {
        fontFamily: "Courier New",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "35em",
        whiteSpace: "nowrap"
    },
    navigation: {
        backgroundColor: Color.DARKGRAY,
        alignSelf: "flex-end",
    },
    table: {
        minWidth: 650,
    },
    tableHeadContent: {
        fontWeight: theme.typography.fontWeightBold
    },
    successInfo: {
        color: Color.GREEN,
        width: '100%',
        height: '100%',
        padding: '20px',
    },
    errorInfo: {
        color: Color.RED,
        width: '100%',
        height: '100%',
        padding: '20px',
    }
}));

export default ({ resultsText, queryStats, errorMsg }: { resultsText: string, queryStats: QueryStats, errorMsg: string }) => {
    const classes = useStyles();
    const [viewType, setViewType] = React.useState("ion");
    const queryResult = resultsText ? JSON.parse(resultsText) : []

    const resultView = (viewType == "table") ? prepareTableView(queryResult) : prepareIonView(queryResult)

    let statusView
    if (errorMsg == "") {
        statusView = queryStats
            ? <Grid
                className={classes.successInfo}
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
            >
                <Grid><CheckCircleTwoToneIcon /></Grid>
                <Grid style={{paddingLeft: '10px'}}>
                    <Typography variant={"body2"}>
                        <b>Read IOs:</b> {queryStats.consumedIOs.readIOs} <b>Time:</b> {queryStats.timingInformation.processingTimeMilliseconds} ms
                    </Typography>
                </Grid>
            </Grid>
            : <></>
    } else {
        statusView = <Grid
            className={classes.errorInfo}
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={1}
        >
            <Grid item><CancelTwoToneIcon /></Grid>
            <Grid item style={{paddingLeft: '10px'}} xs={11}>
                <Typography variant={"body2"}>
                    {errorMsg}
                </Typography>
            </Grid>
        </Grid>
    }

    return <div style={RESULT_BOX_STYLE}>
        <div style={{backgroundColor: Color.DARKGRAY, display: "flex", flexDirection: "row-reverse"}}>
            <BottomNavigation
                value={viewType}
                onChange={(event, newValue) => {
                    setViewType(newValue);
                }}
                showLabels
                className={classes.navigation}
            >
                <BottomNavigationAction value="ion" label="" icon={<CodeIcon />} />
                <BottomNavigationAction value="table" label="" icon={<TableChartIcon />} />
            </BottomNavigation>
            <span style={{flex: 1}}>{statusView}</span>
        </div>
        <div style={RESULT_INTERNAL_CONTAINER_STYLE}>
            { resultView }
        </div>
    </div>
}

function prepareIonView(queryResult: []) {
    const classes = useStyles();
    const items = []
    for (const i in queryResult) {
        items.push(
            <Accordion key={"result-" + i}>
                <AccordionSummary
                    expandIcon={<AddCircleTwoToneIcon />}
                    aria-controls={"result-panel-content-" + i}
                    id={"result-panel-header-" + i}
                    IconButtonProps={{size: "small"}}
                >
                    <div className={classes.headingAccordion}>
                        {JSON.stringify(queryResult[i], undefined)}
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
    return <div>{ items }</div>
}

function prepareTableView(queryResult: []) {
    const classes = useStyles();
    const headers = findAllHeaders(queryResult)

    return <TableContainer component={Paper}>
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
