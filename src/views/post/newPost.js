import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import Api from '../../api'


import { Upload, Icon } from 'antd';

const Dragger = Upload.Dragger;

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
        width : "100%"
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

class NewPost extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expanded: false,
            title: this.props.title,
            subheader: Date(),
            topics :  [],
        };

    }
    componentDidMount(){
        this.getTopics();
    }

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };
    getTopics = () => {
        let topics = [];
        Api.find('topics')
            .then( response => {
                    topics = response.data.map(topic =>{
                            return {label: topic.name, value:topic.id};
                    })
                    this.setState({topics});
            })
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container spacing={24}>
                <Grid item xs={3}>
                    <Card className={classes.card}>
                <CardContent>


                    <TextField
                        id="standard-dense"
                        label="Title"
                        className={classes.textField}
                        style={{width : "100%"}}
                        margin="dense"
                        onChange={this.props.onTitle}
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
                        onChange={this.props.onDescription}
                    />

                    <br/>
                    <br/>

                    <Select
                        isMulti
                        name="colors"
                        options={this.state.topics}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.props.onTopics}
                    />

                    <br/>

                    <Dragger name="file" beforeUpload={this.props.onDragger}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    </Dragger>


                </CardContent>
            </Card>
                </Grid>
            </Grid>
        );
    }
}

NewPost.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewPost);