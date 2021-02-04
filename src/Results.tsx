import * as React from "react";
import {Color} from "./App";
import {makeStyles} from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Paper} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default ({ resultsText }: { resultsText: string }) => {
    const classes = useStyles();
    const queryResult = resultsText ? JSON.parse(resultsText) : []
    const items = []
    for (const i in queryResult) {
        items.push(
            <Accordion key={"result-" + i}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={"result-panel-content-" + i} id={"result-panel-header-" + i}>
                    <div style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: "35em"}}>
                        <Typography className={classes.heading} noWrap>{JSON.stringify(queryResult[i], undefined)}</Typography>
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
    return <Paper style={{backgroundColor: Color.LIGHTGRAY, flex: 1, width: "100%", height: "100%"}}>
        <div style={{maxHeight: 200, overflow: "scroll"}}>
            { items }
        </div>
    </Paper>
}
