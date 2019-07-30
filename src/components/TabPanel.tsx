import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

type TabPanelProps = {
    value: any,
    index: any
}

export default class TabPanel extends Component<TabPanelProps, {}>  {
    static propTypes = {
        children: PropTypes.node,
        value: PropTypes.any.isRequired,
        index: PropTypes.any.isRequired
    }

    render() {
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