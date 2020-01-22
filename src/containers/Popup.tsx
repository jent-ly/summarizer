/*global chrome*/
// Material UI
import AppBar from "@material-ui/core/AppBar";
import { createMuiTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { ThemeProvider } from "@material-ui/styles";
// @ts-ignore
import { UserInfo } from "chrome/identity/UserInfo";
// @ts-ignore
import { Tab as ChromeTab } from "chrome/tabs/Tab";
import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
// Style + Util
import ListTab from "../components/ListTab";
import MainTab from "../components/MainTab";
import OptionsTab from "../components/OptionsTab";
// Components
import TabPanel from "../components/TabPanel";
import "../css/popup.scss";
import logo from "../img/v1.5-1000x220.png";

export default class Popup extends Component {
    public state = {
        curTab: 0,
        domain: "",
        feedbackSent: false,
        hasDomain: false,
        highlightColor: {
            b: 0,
            g: 255,
            r: 255,
        },
        isEnabled: false,
        whitelist: [],
    };

    public theme = createMuiTheme({
        overrides: {
            MuiInputBase: {
                root: {
                    fontSize: "12px",
                },
            },
            MuiSlider: {
                root: {
                    padding: "0",
                    width: "75%",
                },
            },
            MuiTab: {
                selected: {
                    background: "#ffc814",
                },
            },
            MuiTabs: {
                root: {
                    background: "#ffec00",
                },
            },
        },
        palette: {
            primary: {
                main: "#ffec00",
            },
            secondary: {
                main: "#fa8d74",
            },
        },
    });

    public a11yProps = (index: number) => {
      return {
        "aria-controls": `nav-tabpanel-${index}`,
        "id": `nav-tab-${index}`,
      };
    }

    public handleChangeTab = (ev: any, newTab: number) => {
        this.setState({
            curTab: newTab,
        });
    }

    public handleChangeIndex = (newIndex: number) => {
        this.setState({
            curTab: newIndex,
        });
    }

    public refreshOrUpdate = (refresh?: boolean) => {
        if (refresh) {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
                chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
            });
        }
        this.updateState();
    }

    public toggleEnable = () => {
        const enabled = !this.state.isEnabled;
        this.setState({
            isEnabled: enabled,
        });
        chrome.storage.sync.set({
            isSummarizerEnabled: enabled,
        }, () => {
            if (this.state.hasDomain) {
                this.refreshOrUpdate(true);
            }
        });
    }

    public addDomain = (domain: string, refresh?: boolean) => {
        chrome.storage.sync.get({
            summaryDomainWhitelist: [],
        }, ({summaryDomainWhitelist}) => {
            const whitelist = new Set(summaryDomainWhitelist);
            whitelist.add(domain);
            chrome.storage.sync.set({
                // @ts-ignore - spread operator on Set
                summaryDomainWhitelist: [...whitelist],
            }, () => {
                this.refreshOrUpdate(refresh);
            });
        });
    }

    public removeDomain = (domain: string, refresh?: boolean) => {
        chrome.storage.sync.get({
            summaryDomainWhitelist: [],
        }, ({summaryDomainWhitelist}) => {
            const whitelist = new Set(summaryDomainWhitelist);
            whitelist.delete(domain);
            chrome.storage.sync.set({
                // @ts-ignore - spread operator on Set
                summaryDomainWhitelist: [...whitelist],
            }, () => {
                this.refreshOrUpdate(refresh);
            });
        });
    }

    public toggleDomain = () => {
        const hasDomain = !this.state.hasDomain;
        this.setState({
            hasDomain,
        });
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
            chrome.storage.sync.get({
              isSummarizerEnabled: false,
            }, ({isSummarizerEnabled}) => {
                const shouldReload = isSummarizerEnabled;
                const url = new URL(tabs[0].url!);
                if (this.state.hasDomain) {
                    this.addDomain(url.hostname, shouldReload);
                } else {
                    this.removeDomain(url.hostname, shouldReload);
                }
            });
        });
    }

    public applyHighlightColor = (newColor: object) => {
        chrome.storage.sync.set({
            color: newColor,
        }, () => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
                this.refreshOrUpdate(this.state.hasDomain);
            });
        });
    }

    public updateState = () => {
        chrome.storage.sync.get({
            color: {
                b: 0,
                g: 255,
                r: 255,
            },
            isSummarizerEnabled: false,
            summaryDomainWhitelist: [],
        }, (storage) => {
            const {summaryDomainWhitelist, isSummarizerEnabled: isEnabled, color: highlightColor} = storage;
            const whitelist = new Set (summaryDomainWhitelist);
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
                let hasDomain = false;
                const {hostname: domain} = new URL(tabs[0].url!);
                if (whitelist.has(domain)) {
                    hasDomain = true;
                }
                this.setState({
                    domain,
                    hasDomain,
                    highlightColor,
                    isEnabled,
                    whitelist: summaryDomainWhitelist,
                });
            });
        });
    }

    public componentDidMount() {
        this.updateState();
    }

    // userEmail and userId can be "" if the user is not logged in
    public submitFeedback = (score: number, description: string) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
            const url = tabs[0].url;
            this.setState({
                feedbackSent: true,
            });
            chrome.identity.getProfileUserInfo((userInfo: UserInfo) => {
                // TODO: let users opt-in to sending their email address
                // TODO: figure out why fetch times out when sending the email and gaia
                const email = "";               // TODO: userInfo.email;
                const gaia = "";                // TODO: userInfo.id;

                return fetch("https://api.jent.ly/v1/feedback/submit", {
                    body: JSON.stringify({url, score, description, email, gaia}),
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                });
            });
        });
      }

      public render() {
        const { domain, hasDomain, isEnabled, curTab, whitelist, highlightColor, feedbackSent } = this.state;
        return(
            <ThemeProvider theme={this.theme}>
                <div className="container">
                    <div className="logo-container">
                        <img className="logo" src={logo} alt="Logo"/>
                    </div>
                    <AppBar position="static" color="default">
                        <Tabs
                          value={curTab}
                          onChange={this.handleChangeTab}
                          indicatorColor="secondary"
                          textColor="secondary"
                          centered
                          aria-label="tab navigation"
                        >
                          <Tab className="tab-label" label="Apply" {...this.a11yProps(0)} />
                          <Tab className="tab-label" label="Site List" {...this.a11yProps(1)} />
                          <Tab className="tab-label" label="Options" {...this.a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        className="tab-panel"
                        index={curTab}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        <TabPanel value={curTab} index={0}>
                          <MainTab
                            isEnabled={isEnabled}
                            toggleDomain={this.toggleDomain}
                            toggleEnable={this.toggleEnable}
                            hasDomain={hasDomain}
                            domain={domain}
                            submitFeedback={this.submitFeedback}
                            feedbackSent={feedbackSent}
                          />
                        </TabPanel>
                        <TabPanel value={curTab} index={1}>
                          <ListTab
                            whitelist={whitelist}
                            addDomain={this.addDomain}
                            removeDomain={this.removeDomain}
                          />
                        </TabPanel>
                        <TabPanel value={curTab} index={2}>
                          <OptionsTab
                            highlightColor={highlightColor}
                            applyHighlightColor={this.applyHighlightColor}
                          />
                        </TabPanel>
                    </SwipeableViews>
                </div>
            </ThemeProvider>
        );
    }
}
