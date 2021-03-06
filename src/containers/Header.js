import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import CastForEducationSharp from "@material-ui/icons/CastForEducationSharp";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Subscriptions from "@material-ui/icons/Subscriptions";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { withRouter } from "react-router-dom";
import Api from "../api";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ClientSession from "../api/client-session";

const styles = theme => ({
  list: {
    width: 250
  },
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    fontFamily: "IBM 3270"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.1),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.05)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: false,
      anchorEl: null,
      mobileMoreAnchorEl: null,
      drawerIsOpen: false,
      subscribedTopics: [],
      search:"",
      user: ""
    };
    // this.sidebar = React.createRef();
  }
  componentDidMount(){
    this.getSubscriptions();
    ClientSession.getAuth((err, value) => {
      this.setState({user:value.user});
    })
  }

  getSubscriptions = () => {
    ClientSession.getAuth((err, value) => {
      Api.findRelated('users','subscriptions',value.user.id)
          .then( response => {
            console.log(response);
            this.setState({subscribedTopics: response.data})
          })
    })
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleLogout = () => {
    this.handleMenuClose();
    Api.logout();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };
  handleDrawer = () => {
    // this.setState({});
    console.log("this.sidebar.current.toggleDrawer");
    this.sidebar.me();
  };
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };
  search = (e) => {
    console.log(e.target.value);
  }
  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>{this.state.user? this.state.user.username: "Profile"}</MenuItem>
        <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        {/* <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem> */}
        <MenuItem>
          <IconButton color="inherit">
            {/* <Badge badgeContent={11} color="secondary"> */}
            <NotificationsIcon />
            {/* </Badge> */}
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>{this.state.user? this.state.user.username: "Profile"}</p>
        </MenuItem>
      </Menu>
    );
    const sideList = (
      <div className={classes.list}>
        <Divider />
        <List>
          <ListItemIcon style={{ padding: "10px" }}>
            <div>
              <Subscriptions /> &nbsp;&nbsp;&nbsp;&nbsp; Subscriptions
            </div>
          </ListItemIcon>
          {this.state.subscribedTopics.map(topic => (
          // {["ToPIC 1", "ToPIC 2"].map(topicTitle => (
            <ListItem button key={topic.id} onClick={(e)=> {this.props.changeTitle(topic.name);this.props.history.push("/"+topic.name);}}>
              <ListItemText primary={topic.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
    return (
      <div className={classes.root}>
        <Drawer open={this.state.left} onClose={this.toggleDrawer("left", false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer("left", false)}
            onKeyDown={this.toggleDrawer("left", false)}
          >
            {sideList}
          </div>
        </Drawer>
        <AppBar position="fixed" color="default">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
              <MenuIcon onClick={this.toggleDrawer("left", true)} />
            </IconButton>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
              onClick={e => this.props.history.push("/")}
              style={{ cursor: "pointer" }}
            >
              <CastForEducationSharp style={{ marginTop: "5px", marginRight: "5px" }} />
              myEdu
            </Typography>
            <span style={{ marginLeft: "50px" }} />
            <Typography className={classes.title} variant="subtitle1" color="secondary" noWrap>
              {this.props.title}
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                onChange={this.search}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {/* <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                  </Badge>
                </IconButton> */}
              <IconButton color="inherit">
                {/* <Badge badgeContent={17} color="secondary"> */}
                <NotificationsIcon />
                {/* </Badge> */}
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? "material-appbar" : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Header));
