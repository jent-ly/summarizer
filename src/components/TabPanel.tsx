import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { Component } from "react";

interface ITabPanelProps {
    value: any;
    index: any;
}

export default class TabPanel extends Component<ITabPanelProps, {}>  {
    public static propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    public render() {
        const {children, value, index, ...other} = this.props;
        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`nav-tabpanel-${index}`}
                aria-labelledby={`nav-tab-${index}`}
                {...other}
            >
              <Box p={2}>{children}</Box>
            </Typography>
        );
    }
}
