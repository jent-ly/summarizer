import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import React, { Component } from "react";

interface IListTabProps {
    whitelist: string[];
    addDomain: (domain: string, refresh?: boolean) => void;
    removeDomain: (domain: string, refresh?: boolean) => void;
}

export default class ListTab extends Component<IListTabProps, {}>  {
    public state = {
        newDomainValue: "",
    };

    public handleTextChange = (event: any) => {
        this.setState({
            newDomainValue: event.target.value,
        });
    }

    public handleEnter = (event: any) => {
        if (event.key === "Enter") {
            event.preventDefault();
            this.props.addDomain(this.state.newDomainValue);
            this.setState({
                newDomainValue: "",
            });
        }
    }

    public render() {
        const { whitelist, removeDomain } = this.props;
        return (
            <div className="whitelist-container">
                <div className="whitelist-scrollable">
                    <List dense disablePadding>
                        {whitelist.map((domain) => (
                            <ListItem>
                              <ListItemText
                                className="whitelist-domain-text"
                                secondary={domain}
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  className="whitelist-remove"
                                  size="small"
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => removeDomain(domain)}>
                                    <DeleteOutlinedIcon/>
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </div>
                <TextField
                    className="whitelist-add"
                    id="add-domain-input"
                    placeholder="http://example.com/article"
                    helperText="Add a domain!"
                    margin="dense"
                    onChange={this.handleTextChange}
                    onKeyPress={this.handleEnter}
                    value={this.state.newDomainValue}
                />
            </div>
        );
    }
}
