import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from 'react-select';


import { Upload, Icon, message } from 'antd';

const Dragger = Upload.Dragger;

const dragger_antd = {
    name: 'file',
    multiple: true,
    action: '//jsonplaceholder.typicode.com/posts/',
    onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];


const styles = theme => ({
    card: {
        minWidth: 800
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    input: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    descriptionTextField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width : "90%"
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

class SinglePost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expanded: false,
            title: this.props.title,
            subheader: Date(),
            topics : [ "MySQL", "SQL", "Database" ]
        };

    }

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { classes } = this.props;

        return (
            <Grid container spacing={24}>
                <Grid item xs={3}>
                    <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Plus" className={classes.avatar}>
                            + {/* //TODO: USER AVATAR*/}
                        </Avatar>
                    }

                    title="New Post"
                />
                <CardContent>


                    <TextField
                        id="standard-dense"
                        label="Title"
                        className={classes.textField}
                        style={{width : "50%"}}
                        margin="dense"
                    />


                    <br/>

                    <TextField
                        id="outlined-multiline-flexible"
                        label="Description"
                        multiline
                        rows="2"
                        // value={this.state.multiline}
                        // onChange={this.handleChange('multiline')}
                        className={classes.descriptionTextField}
                        margin="normal"
                        variant="outlined"
                    />

                    <br/>
                    <br/>

                    <Select
                        defaultValue={[options[2], options[1]]}
                        isMulti
                        name="colors"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />

                    <br/>

                    <Dragger {...dragger_antd}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    </Dragger>


                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <Button variant="contained" color="primary" className={classes.button} style={{float: "right"}}>
                        Send
                        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
                        <Icon className={classes.rightIcon}>send</Icon>
                    </Button>
                </CardActions>
            </Card>
                </Grid>
            </Grid>
        );
    }
}

SinglePost.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SinglePost);