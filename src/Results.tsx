import * as React from "react";
import {Color} from "./App";
import {makeStyles} from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {BottomNavigation, BottomNavigationAction, Fab, Paper} from "@material-ui/core";
import TableChartIcon from '@material-ui/icons/TableChart';
import CodeIcon from '@material-ui/icons/Code';

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
    }
}));

export default ({ resultsText }: { resultsText: string }) => {
    const classes = useStyles();
    const [viewType, setViewType] = React.useState("ion");

    const queryResult = resultsText ? JSON.parse(resultsText) : []
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

    const ionView = <div style={{maxHeight: 300, overflow: "scroll"}}>
        { items }
    </div>

    const tableView = <div style={{maxHeight: 300, overflow: "scroll"}}>
        { resultsText }
    </div>

    var result
    if (viewType == "table") {
        result = tableView
    } else {
        result = ionView
    }

    return <Paper style={{backgroundColor: Color.DARKGRAY, flex: 1, width: "100%", height: "100%"}}>
        <div style={{backgroundColor: Color.LIGHTGRAY, display: "flex", flexDirection: "row-reverse"}}>
            <BottomNavigation
                value={viewType}
                onChange={(event, newValue) => {
                    setViewType(newValue);
                }}
                showLabels
                className={classes.navigation}
                style={{alignSelf: "flex-end"}}
            >
                <BottomNavigationAction value="table" label="Table" icon={<TableChartIcon />} />
                <BottomNavigationAction value="ion" label="Ion" icon={<CodeIcon />} />
            </BottomNavigation>
            <Typography className={classes.heading} style={{flex: 1}}>Results</Typography>
        </div>
        { result }

    </Paper>
}
